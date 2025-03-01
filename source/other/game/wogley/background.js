const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

const vertexShaderSource = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;

const fragmentShaderSource = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;

    float hash3(vec3 p) {
        return fract(sin(1e3*dot(p,vec3(1.0,57.0,-13.7)))*4375.5453);
    }

    float noise3(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f*f*(3.0-2.0*f);

        return mix(
            mix(mix(hash3(p+vec3(0,0,0)), hash3(p+vec3(1,0,0)),f.x),
                mix(hash3(p+vec3(0,1,0)), hash3(p+vec3(1,1,0)),f.x),f.y),
            mix(mix(hash3(p+vec3(0,0,1)), hash3(p+vec3(1,0,1)),f.x),
                mix(hash3(p+vec3(0,1,1)), hash3(p+vec3(1,1,1)),f.x),f.y),
            f.z
        );
    }

    float noise(vec3 x) {
        return (noise3(x) + noise3(x+11.5)) / 4.0;
    }

    void main() {
        vec2 U = gl_FragCoord.xy;
        vec2 R = resolution;
        float n = noise(vec3(U*8.0/R.y, mod(0.05*time, 200.0)));
        float v = sin(6.28*10.0*n);
        
        // Replace fwidth with a simple constant
        float edgeWidth = 0.2;
        v = smoothstep(edgeWidth, 0.0, abs(v));
        
        vec4 color = 0.3 + 0.5*sin(6.0*n + vec4(2.1,-2.1,0,0));
        gl_FragColor = mix(vec4(0.0), color, v);
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        console.error('Shader source:', source);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

const vertices = new Float32Array([
  -1, -1,
  1, -1,
  -1, 1,
  1, 1
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const a_position = gl.getAttribLocation(shaderProgram, 'a_position');
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'resolution');
const timeUniformLocation = gl.getUniformLocation(shaderProgram, 'time');

let backgroundDisabled = false;
function render(timestamp) {
    if (backgroundDisabled) {requestAnimationFrame(render); return;}
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    gl.uniform1f(timeUniformLocation, timestamp / 1000.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0,0, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);

function enableDisableBackground() {
    backgroundDisabled = !backgroundDisabled;
    if (backgroundDisabled) {canvas.style.display = 'none';}
    else {canvas.style.display = 'block';}
    if (backgroundDisabled) {breakStone(); document.getElementById("enableDisableBackgroundButton").innerText = "Enable background";}
    else {document.getElementById("enableDisableBackgroundButton").innerText = "Disable background";}
}