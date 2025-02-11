function round_to(number, digits) {
  return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
}

function prettify_integer(num, delimiter="'") {
  if (num < 1000) return num.toString();
  let last_res = (num % 1000).toString();
  while (last_res.length < 3) last_res = '0' + last_res;
  return prettify_integer(Math.floor(num / 1000), delimiter) + delimiter + last_res;
}

function format_number(num, fixed=false, rounded=false, integer=false) {
  if (!(num instanceof Decimal)) num = big(num);
  if (integer) return prettify_integer(Math.round(num.toNumber()), ' ');
  let num_lg = num.log10();
  let sign = num.sign();
  if (rounded) {
    num_lg = num.round().log10();
    sign = num.round().sign();
  }
  
  let result = "";
  if (!sign && num_lg > -400) result += '-';
  
  if (isNaN(num_lg)) return "NaN";
  if (num_lg > 1e100) {
    result += "Infinity";
    return result;
  }
  
  // non-exponential
  if (num_lg < 6) {
    let extra_digits = 3;
    if (num_lg >= 1) extra_digits = 2;
    if (num_lg >= 3) extra_digits = 1;
    if (num_lg >= 5 || rounded) extra_digits = 0;
    if (!fixed && !rounded) result += round_to(Math.pow(10, num_lg), extra_digits);
    else result += Math.pow(10, num_lg).toFixed(extra_digits);
  }
  // exponential
  else if (num_lg < 1e12) {
    let mantissa = round_to(Math.pow(10, num_lg - Math.floor(num_lg)), 2);
    let exponent = Math.floor(num_lg);
    if (mantissa == 10) {
      mantissa = 1;
      exponent += 1;
    }
    if (!fixed) result += mantissa;
    else result += mantissa.toFixed(2);
    result += 'e';
    result += prettify_integer(exponent);
  }
  // double exponential
  else {
    result += 'ee';
    result += format_number(Math.log10(num_lg), fixed);
  }
  
  return result;
  // TODO: better formatting
  if (!fixed) return num.toString();
  else return num.toFixed(3);
}