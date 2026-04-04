// 游戏配置
const CONFIG = {
    // 木鱼升级配置
    muyuLevels: [
        { level: 1, name: '初始木鱼', limit: 100, cost: 0, icon: '🐟' },
        { level: 2, name: '霓虹木鱼', limit: 10000, cost: 100, icon: '🔮' },
        { level: 3, name: '数据流木鱼', limit: 1000000, cost: 10000, icon: '💾' },
        { level: 4, name: '量子木鱼', limit: 100000000, cost: 1000000, icon: '🌌' },
        { level: 5, name: '奇点木鱼', limit: 10000000000, cost: 100000000, icon: '🕳️' },
        { level: 6, name: '功德无量Pro', limit: 1000000000000, cost: 10000000000, icon: '♾️' }
    ],
    
    // 装备配置
    equipment: [
        { id: 'robe', slot: '身体', name: '数据流袈裟', bonus: 3, cost: 30000, icon: '👘' },
        { id: 'beads', slot: '配饰', name: '能量佛珠', bonus: 5, cost: 80000, icon: '📿' },
        { id: 'platform', slot: '底座', name: '悬浮磁力蒲团', bonus: 6, cost: 100000, icon: '🪑' },
        { id: 'vajra', slot: '手持', name: '赛博金刚杵', bonus: 7, cost: 500000, icon: '⚡' },
        { id: 'incense', slot: '环境', name: '离子熏香', bonus: 15, cost: 1500000, icon: '🌫️' },
        { id: 'rune', slot: '护符', name: '业力符文', bonus: 20, cost: 10000000, icon: '🔮' },
        { id: 'lotus', slot: '鞋子', name: '莲花步履', bonus: 9, cost: 200000, icon: '🪷' },
        { id: 'engine', slot: '引擎', name: '禅定引擎', bonus: 20, cost: 40000000, icon: '⚙️' }
    ],
    
    // 成就配置
    achievements: [
        { id: 'merit_10k', type: 'merit', target: 10000, name: '初入佛门', desc: '累计获得10,000功德', icon: '🌱' },
        { id: 'merit_1m', type: 'merit', target: 1000000, name: '小有成就', desc: '累计获得1,000,000功德', icon: '🌿' },
        { id: 'merit_100m', type: 'merit', target: 100000000, name: '功德无量', desc: '累计获得100,000,000功德', icon: '🌳' },
        { id: 'merit_10b', type: 'merit', target: 10000000000, name: '功德圆满', desc: '累计获得10,000,000,000功德', icon: '🌲' },
        { id: 'merit_1t', type: 'merit', target: 1000000000000, name: '功德无量Pro', desc: '累计获得1,000,000,000,000功德', icon: '✨' },
        { id: 'max_muyu', type: 'collection', target: 6, name: '木鱼大师', desc: '将木鱼升级到最高等级', icon: '🏆' },
        { id: 'all_equipment', type: 'collection', target: 8, name: '装备齐全', desc: '收集所有装备', icon: '🎒' }
    ],
    
    // 赛博锦鲤配置
    koi: {
        earlyInterval: 1000, // LV3以前每1秒检查一次
        earlyChance: 0.01, // LV3以前1%概率出现
        earlyMinReward: 100, // LV3以前最小奖励
        earlyMaxReward: 1000, // LV3以前最大奖励
        lateInterval: 60000, // LV3及以后每60秒检查一次
        lateChance: 0.01, // LV3及以后1%概率出现
        lateMinReward: 10000, // LV3及以后最小奖励
        lateMaxReward: 1000000 // LV3及以后最大奖励
    }
};

// 游戏状态
let gameState = {
    merit: 0, // 当前功德
    totalMerit: 0, // 累计功德
    muyuLevel: 1, // 木鱼等级
    purchasedEquipment: [], // 已购买的装备ID
    achievements: [], // 已解锁的成就ID
    rebirthCount: 0, // 飞升次数
    settings: {
        effects: true,
        sound: true
    },
    engineProgress: 0, // 禅定引擎进度
    lastSaveTime: Date.now() // 上次保存时间
};

// 音效系统
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (!gameState.settings.sound) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'click':
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'upgrade':
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'achievement':
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.15);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.3);
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.45);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.6);
            break;
        case 'koi':
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
    }
}

// 初始化游戏
function initGame() {
    loadGame();
    createParticles();
    updateUI();
    setupEventListeners();
    startAutoCultivation();
    startKoiSpawner();
    startEngineLoop();
}

// 创建背景粒子
function createParticles() {
    const container = document.querySelector('.particle-container');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (5 + Math.random() * 5) + 's';
        container.appendChild(particle);
    }
}

// 计算点击加成
function calculateClickBonus() {
    let bonus = 1;
    
    // 装备加成
    gameState.purchasedEquipment.forEach(equipId => {
        const equip = CONFIG.equipment.find(e => e.id === equipId);
        if (equip) {
            bonus *= (1 + equip.bonus / 100);
        }
    });
    
    // 飞升加成
    bonus *= (1 + gameState.rebirthCount * 0.03);
    
    return bonus;
}

// 计算每次点击获得的功德
function calculateMeritPerClick() {
    const baseMerit = 1;
    const bonus = calculateClickBonus();
    return baseMerit * bonus;
}

// 点击木鱼
function clickMuyu(event) {
    const currentLimit = CONFIG.muyuLevels[gameState.muyuLevel - 1].limit;
    
    if (gameState.merit >= currentLimit) {
        showFloatingText(event.clientX, event.clientY, '功德已满！', '#ff0000');
        return;
    }
    
    const meritGain = calculateMeritPerClick();
    gameState.merit = Math.min(gameState.merit + meritGain, currentLimit);
    gameState.totalMerit += meritGain;
    
    // 视觉效果
    if (gameState.settings.effects) {
        createClickRing(event);
        showFloatingText(event.clientX, event.clientY, `+${meritGain.toFixed(2)} 功德`);
        triggerMuyuClickEffect();
        
        // 莲花步履效果
        if (gameState.purchasedEquipment.includes('lotus')) {
            createLotusEffect(event);
        }
        
        // 禅定引擎效果
        if (gameState.purchasedEquipment.includes('engine')) {
            gameState.engineProgress = Math.min(gameState.engineProgress + 5, 100);
            updateEngineBar();
        }
    }
    
    playSound('click');
    updateUI();
    checkAchievements();
    saveGame();
}

// 创建点击光环
function createClickRing(event) {
    // 使用实际点击位置
    const x = event.clientX;
    const y = event.clientY;

    const ring = document.createElement('div');
    ring.className = 'click-ring';
    ring.style.left = (x - 140) + 'px'; // 140是光环半径
    ring.style.top = (y - 140) + 'px';
    document.body.appendChild(ring);

    setTimeout(() => ring.remove(), 800);
}

// 显示飘字效果
function showFloatingText(x, y, text, color = '#00ffff') {
    const container = document.getElementById('floating-text-container');
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = text;
    floatingText.style.left = x + 'px';
    floatingText.style.top = y + 'px';
    floatingText.style.color = color;
    container.appendChild(floatingText);
    
    setTimeout(() => floatingText.remove(), 1000);
}

// 触发木鱼点击效果
function triggerMuyuClickEffect() {
    const muyu = document.getElementById('muyu');
    muyu.classList.add('clicked');
    setTimeout(() => muyu.classList.remove('clicked'), 300);
}

// 创建莲花效果
function createLotusEffect(event) {
    const lotus = document.createElement('div');
    lotus.className = 'lotus-effect';
    lotus.textContent = '🪷';
    lotus.style.left = event.clientX + 'px';
    lotus.style.top = event.clientY + 'px';
    document.body.appendChild(lotus);
    
    setTimeout(() => lotus.remove(), 1000);
}

// 更新禅定引擎进度条
function updateEngineBar() {
    const engineBar = document.querySelector('.engine-bar');
    if (engineBar) {
        engineBar.style.width = gameState.engineProgress + '%';
    }
}

// 禅定引擎循环
function startEngineLoop() {
    setInterval(() => {
        if (gameState.purchasedEquipment.includes('engine') && gameState.engineProgress >= 100) {
            if (gameState.settings.effects) {
                const burst = document.createElement('div');
                burst.className = 'engine-burst';
                document.body.appendChild(burst);
                setTimeout(() => burst.remove(), 500);
            }
            
            // 爆发奖励
            const currentLimit = CONFIG.muyuLevels[gameState.muyuLevel - 1].limit;
            const bonus = calculateClickBonus() * 10;
            gameState.merit = Math.min(gameState.merit + bonus, currentLimit);
            gameState.totalMerit += bonus;
            gameState.engineProgress = 0;
            updateEngineBar();
            updateUI();
            saveGame();
        }
    }, 100);
}

// 自动修行
function startAutoCultivation() {
    setInterval(() => {
        if (gameState.muyuLevel >= 3) {
            const currentLimit = CONFIG.muyuLevels[gameState.muyuLevel - 1].limit;
            const baseMerit = calculateMeritPerClick();
            // 自动获取速度为当前等级的立方倍
            const speedMultiplier = Math.pow(gameState.muyuLevel, 3);
            const meritGain = baseMerit * speedMultiplier;
            gameState.merit = Math.min(gameState.merit + meritGain, currentLimit);
            gameState.totalMerit += meritGain;
            updateUI();
            saveGame();
        }
    }, 1000);
}

// 赛博锦鲤生成器
function startKoiSpawner() {
    let koiTimer = null;
    
    function checkAndSpawn() {
        // 根据木鱼等级选择配置
        const isEarly = gameState.muyuLevel < 3;
        const config = isEarly ? {
            interval: CONFIG.koi.earlyInterval,
            chance: CONFIG.koi.earlyChance,
            minReward: CONFIG.koi.earlyMinReward,
            maxReward: CONFIG.koi.earlyMaxReward
        } : {
            interval: CONFIG.koi.lateInterval,
            chance: CONFIG.koi.lateChance,
            minReward: CONFIG.koi.lateMinReward,
            maxReward: CONFIG.koi.lateMaxReward
        };
        
        if (Math.random() < config.chance) {
            spawnKoi(config.minReward, config.maxReward);
        }
        
        // 重新设置定时器
        if (koiTimer) clearTimeout(koiTimer);
        koiTimer = setTimeout(checkAndSpawn, config.interval);
    }
    
    // 启动定时器
    checkAndSpawn();
}

// 生成赛博锦鲤
function spawnKoi(minReward, maxReward) {
    const koi = document.getElementById('koi-fish');
    const reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;
    
    koi.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    koi.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    koi.classList.remove('hidden');
    
    koi.onclick = function() {
        const currentLimit = CONFIG.muyuLevels[gameState.muyuLevel - 1].limit;
        gameState.merit = Math.min(gameState.merit + reward, currentLimit);
        gameState.totalMerit += reward;
        
        showFloatingText(
            parseInt(koi.style.left) + 30,
            parseInt(koi.style.top) + 30,
            `+${reward} 功德`,
            '#ffff00'
        );
        
        playSound('koi');
        updateUI();
        saveGame();
        
        koi.classList.add('hidden');
        koi.onclick = null;
    };
    
    // 5秒后自动消失
    setTimeout(() => {
        koi.classList.add('hidden');
        koi.onclick = null;
    }, 5000);
}

// 更新UI
function updateUI() {
    // 更新功德显示（纯数字格式）
    const meritDisplay = document.getElementById('merit-display');
    meritDisplay.textContent = formatPureNumber(gameState.merit);
    meritDisplay.classList.add('updated');
    setTimeout(() => meritDisplay.classList.remove('updated'), 300);
    
    // 更新木鱼等级
    const muyuLevel = document.getElementById('muyu-level');
    const currentMuyu = CONFIG.muyuLevels[gameState.muyuLevel - 1];
    muyuLevel.textContent = `LV${currentMuyu.level} ${currentMuyu.name}`;
    
    // 更新功德上限
    const meritLimit = document.getElementById('merit-limit');
    meritLimit.textContent = `功德上限: ${formatNumber(currentMuyu.limit)}`;
    
    // 更新木鱼样式
    const muyu = document.getElementById('muyu');
    muyu.className = 'muyu';
    if (gameState.muyuLevel >= 2) muyu.classList.add(`lv${gameState.muyuLevel}`);
    
    // 更新木鱼图标
    const muyuBody = document.querySelector('.muyu-body');
    muyuBody.textContent = currentMuyu.icon;
    
    // 更新装备效果
    updateEquipmentEffects();
    
    // 更新商店按钮状态
    updateShopButtons();
    
    // 更新升级按钮状态
    updateUpgradeButtons();
    
    // 更新飞升信息
    updateAscensionInfo();
}

// 格式化数字
function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + '万亿';
    if (num >= 1e8) return (num / 1e8).toFixed(2) + '亿';
    if (num >= 1e4) return (num / 1e4).toFixed(2) + '万';
    return num.toFixed(2);
}

// 格式化纯数字（不使用单位）
function formatPureNumber(num) {
    return num.toFixed(2);
}

// 更新装备视觉效果
function updateEquipmentEffects() {
    const effectsContainer = document.querySelector('.equipment-effects');
    if (!effectsContainer) return;
    
    effectsContainer.innerHTML = '';
    
    if (gameState.purchasedEquipment.includes('robe')) {
        const robe = document.createElement('div');
        robe.className = 'robe-effect';
        effectsContainer.appendChild(robe);
    }
    
    if (gameState.purchasedEquipment.includes('beads')) {
        const beads = document.createElement('div');
        beads.className = 'beads-effect';
        for (let i = 0; i < 8; i++) {
            const bead = document.createElement('div');
            bead.className = 'bead';
            bead.style.animationDelay = (i * 1.25) + 's';
            beads.appendChild(bead);
        }
        effectsContainer.appendChild(beads);
    }
    
    if (gameState.purchasedEquipment.includes('platform')) {
        const platform = document.createElement('div');
        platform.className = 'platform-effect';
        effectsContainer.appendChild(platform);
    }
    
    if (gameState.purchasedEquipment.includes('incense')) {
        const incense = document.createElement('div');
        incense.className = 'incense-effect';
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'incense-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            incense.appendChild(particle);
        }
        effectsContainer.appendChild(incense);
    }
    
    if (gameState.purchasedEquipment.includes('rune')) {
        const runes = ['卍', '☸', '☯', '✧'];
        runes.forEach((rune, i) => {
            const runeEl = document.createElement('div');
            runeEl.className = 'rune-effect';
            runeEl.textContent = rune;
            runeEl.style.left = (20 + i * 20) + '%';
            runeEl.style.top = (20 + (i % 2) * 40) + '%';
            runeEl.style.animationDelay = (i * 0.5) + 's';
            effectsContainer.appendChild(runeEl);
        });
    }
    
    if (gameState.purchasedEquipment.includes('engine')) {
        const engine = document.createElement('div');
        engine.className = 'engine-effect';
        const bar = document.createElement('div');
        bar.className = 'engine-bar';
        bar.style.width = gameState.engineProgress + '%';
        engine.appendChild(bar);
        effectsContainer.appendChild(engine);
    }
}

// 更新商店按钮状态
function updateShopButtons() {
    CONFIG.equipment.forEach(equip => {
        const btn = document.getElementById(`shop-btn-${equip.id}`);
        if (btn) {
            const isPurchased = gameState.purchasedEquipment.includes(equip.id);
            if (isPurchased) {
                btn.textContent = '已购买';
                btn.classList.add('purchased');
                btn.disabled = true;
            } else if (gameState.merit < equip.cost) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }
    });
}

// 更新升级按钮状态
function updateUpgradeButtons() {
    CONFIG.muyuLevels.forEach((level, index) => {
        const btn = document.getElementById(`upgrade-btn-${level.level}`);
        if (btn) {
            const isCurrent = gameState.muyuLevel === level.level;
            const isAlreadyUpgraded = gameState.muyuLevel > level.level;
            const isNextLevel = gameState.muyuLevel + 1 === level.level;
            const canUpgrade = isNextLevel && gameState.merit >= level.cost;
            
            if (isCurrent) {
                btn.textContent = '当前等级';
                btn.disabled = true;
            } else if (isAlreadyUpgraded) {
                btn.textContent = '已升级';
                btn.disabled = true;
            } else if (isNextLevel && canUpgrade) {
                btn.textContent = `升级 (${formatNumber(level.cost)} 功德)`;
                btn.disabled = false;
            } else if (isNextLevel) {
                btn.textContent = `功德不足 (${formatNumber(level.cost)})`;
                btn.disabled = true;
            } else {
                btn.textContent = '未解锁';
                btn.disabled = true;
            }
        }
    });
}

// 更新飞升信息
function updateAscensionInfo() {
    const rebirthCount = document.getElementById('rebirth-count');
    const rebirthBonus = document.getElementById('rebirth-bonus');
    
    if (rebirthCount) rebirthCount.textContent = gameState.rebirthCount;
    if (rebirthBonus) rebirthBonus.textContent = (gameState.rebirthCount * 3) + '%';
}

// 检查成就
function checkAchievements() {
    CONFIG.achievements.forEach(achievement => {
        if (gameState.achievements.includes(achievement.id)) return;
        
        let unlocked = false;
        
        if (achievement.type === 'merit') {
            unlocked = gameState.totalMerit >= achievement.target;
        } else if (achievement.type === 'collection') {
            if (achievement.id === 'max_muyu') {
                unlocked = gameState.muyuLevel >= 6;
            } else if (achievement.id === 'all_equipment') {
                unlocked = gameState.purchasedEquipment.length >= 8;
            }
        }
        
        if (unlocked) {
            gameState.achievements.push(achievement.id);
            playSound('achievement');
            showAchievementNotification(achievement);
            saveGame();
        }
    });
}

// 显示成就通知
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 255, 0, 0.2);
        border: 2px solid #00ff00;
        border-radius: 10px;
        padding: 15px 20px;
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
    `;
    notification.innerHTML = `
        <div style="font-size: 30px; margin-bottom: 10px;">${achievement.icon}</div>
        <div style="font-size: 16px; color: #00ff00; font-weight: bold;">${achievement.name}</div>
        <div style="font-size: 12px; color: #aaa;">${achievement.desc}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// 设置事件监听器
function setupEventListeners() {
    // 木鱼点击
    const muyu = document.getElementById('muyu');
    muyu.addEventListener('click', clickMuyu);
    
    // 设置按钮
    document.getElementById('settings-btn').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.remove('hidden');
    });
    
    document.getElementById('settings-close').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.add('hidden');
    });
    
    // 成就按钮
    document.getElementById('achievements-btn').addEventListener('click', () => {
        document.getElementById('achievements-page').classList.remove('hidden');
        renderAchievements();
    });
    
    document.getElementById('achievements-back').addEventListener('click', () => {
        document.getElementById('achievements-page').classList.add('hidden');
    });
    
    // 木鱼工坊按钮
    document.getElementById('workshop-btn').addEventListener('click', () => {
        document.getElementById('workshop-page').classList.remove('hidden');
        renderMuyuUpgrades();
    });
    
    document.getElementById('workshop-back').addEventListener('click', () => {
        document.getElementById('workshop-page').classList.add('hidden');
    });
    
    // 功德商店按钮
    document.getElementById('shop-btn').addEventListener('click', () => {
        document.getElementById('shop-page').classList.remove('hidden');
        renderShop();
    });
    
    document.getElementById('shop-back').addEventListener('click', () => {
        document.getElementById('shop-page').classList.add('hidden');
    });
    
    // 设置选项
    document.getElementById('effects-toggle').addEventListener('change', (e) => {
        gameState.settings.effects = e.target.checked;
        saveGame();
    });
    
    document.getElementById('sound-toggle').addEventListener('change', (e) => {
        gameState.settings.sound = e.target.checked;
        saveGame();
    });
    
    // 数据管理
    document.getElementById('export-btn').addEventListener('click', exportSave);
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-modal').classList.remove('hidden');
    });
    document.getElementById('import-confirm').addEventListener('click', importSave);
    document.getElementById('import-cancel').addEventListener('click', () => {
        document.getElementById('import-modal').classList.add('hidden');
    });
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    
    // 飞升按钮
    document.getElementById('ascend-btn').addEventListener('click', ascend);
}

// 渲染木鱼升级界面
function renderMuyuUpgrades() {
    const container = document.getElementById('muyu-upgrades');
    container.innerHTML = '';
    
    CONFIG.muyuLevels.forEach(level => {
        const isCurrent = gameState.muyuLevel === level.level;
        const isAlreadyUpgraded = gameState.muyuLevel > level.level;
        const isNextLevel = gameState.muyuLevel + 1 === level.level;
        const canUpgrade = isNextLevel && gameState.merit >= level.cost;
        
        const card = document.createElement('div');
        card.className = `upgrade-card ${isCurrent ? 'active' : ''} ${!isNextLevel && !isCurrent ? 'locked' : ''}`;
        card.innerHTML = `
            <div class="upgrade-name">${level.icon} LV${level.level} ${level.name}</div>
            <div class="upgrade-info">
                功德上限: ${formatNumber(level.limit)}<br>
                ${level.cost > 0 ? `升级消耗: ${formatNumber(level.cost)} 功德` : '初始等级'}
            </div>
            <div class="upgrade-cost">${level.cost > 0 ? formatNumber(level.cost) + ' 功德' : '免费'}</div>
            <button class="upgrade-btn" id="upgrade-btn-${level.level}" ${canUpgrade ? '' : 'disabled'}>
                ${isCurrent ? '当前等级' : isAlreadyUpgraded ? '已升级' : isNextLevel ? (gameState.merit >= level.cost ? `升级 (${formatNumber(level.cost)} 功德)` : `功德不足 (${formatNumber(level.cost)})`) : '未解锁'}
            </button>
        `;
        container.appendChild(card);
        
        if (canUpgrade) {
            document.getElementById(`upgrade-btn-${level.level}`).addEventListener('click', () => {
                upgradeMuyu(level.level);
            });
        }
    });
}

// 升级木鱼
function upgradeMuyu(targetLevel) {
    const levelConfig = CONFIG.muyuLevels[targetLevel - 1];
    if (gameState.merit < levelConfig.cost) return;
    
    gameState.merit -= levelConfig.cost;
    gameState.muyuLevel = targetLevel;
    
    playSound('upgrade');
    updateUI();
    renderMuyuUpgrades();
    checkAchievements();
    saveGame();
}

// 渲染商店界面
function renderShop() {
    const container = document.getElementById('shop-items');
    container.innerHTML = '';
    
    CONFIG.equipment.forEach(equip => {
        const isPurchased = gameState.purchasedEquipment.includes(equip.id);
        const canBuy = !isPurchased && gameState.merit >= equip.cost;
        
        const card = document.createElement('div');
        card.className = `shop-card ${isPurchased ? 'purchased' : ''}`;
        card.innerHTML = `
            <div class="shop-slot">${equip.slot}</div>
            <div class="shop-name">${equip.icon} ${equip.name}</div>
            <div class="shop-bonus">+${equip.bonus}% 点击加成</div>
            <div class="shop-cost">${isPurchased ? '已购买' : formatNumber(equip.cost) + ' 功德'}</div>
            <button class="shop-btn ${isPurchased ? 'purchased' : ''}" id="shop-btn-${equip.id}" ${canBuy ? '' : 'disabled'}>
                ${isPurchased ? '已购买' : '购买'}
            </button>
        `;
        container.appendChild(card);
        
        if (canBuy) {
            document.getElementById(`shop-btn-${equip.id}`).addEventListener('click', () => {
                buyEquipment(equip.id);
            });
        }
    });
}

// 购买装备
function buyEquipment(equipId) {
    const equip = CONFIG.equipment.find(e => e.id === equipId);
    if (!equip || gameState.merit < equip.cost) return;
    if (gameState.purchasedEquipment.includes(equipId)) return;
    
    gameState.merit -= equip.cost;
    gameState.purchasedEquipment.push(equipId);
    
    playSound('upgrade');
    updateUI();
    renderShop();
    checkAchievements();
    saveGame();
}

// 渲染成就界面
function renderAchievements() {
    const container = document.getElementById('achievements-list');
    container.innerHTML = '';
    
    CONFIG.achievements.forEach(achievement => {
        const isUnlocked = gameState.achievements.includes(achievement.id);
        
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.desc}</div>
        `;
        container.appendChild(card);
    });
}

// 导出存档
function exportSave() {
    const saveData = btoa(JSON.stringify(gameState));
    navigator.clipboard.writeText(saveData).then(() => {
        alert('存档已复制到剪贴板！');
    }).catch(() => {
        prompt('请复制以下存档数据：', saveData);
    });
}

// 导入存档
function importSave() {
    const importData = document.getElementById('import-data').value.trim();
    if (!importData) {
        alert('请输入存档数据！');
        return;
    }
    
    try {
        const saveData = JSON.parse(atob(importData));
        gameState = { ...gameState, ...saveData };
        document.getElementById('import-modal').classList.add('hidden');
        document.getElementById('import-data').value = '';
        updateUI();
        alert('存档导入成功！');
        saveGame();
    } catch (e) {
        alert('存档数据无效！');
    }
}

// 重置游戏
function resetGame() {
    if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
        localStorage.removeItem('cyberMuyuSave');
        location.reload();
    }
}

// 飞升
function ascend() {
    if (gameState.muyuLevel < 6) {
        alert('需要将木鱼升级到最高等级才能飞升！');
        return;
    }
    
    if (confirm('确定要飞升吗？所有进度将重置，但您将获得永久加成！')) {
        gameState.rebirthCount++;
        gameState.merit = 0;
        gameState.totalMerit = 0;
        gameState.muyuLevel = 1;
        gameState.purchasedEquipment = [];
        gameState.engineProgress = 0;
        
        playSound('achievement');
        updateUI();
        saveGame();
        alert(`飞升成功！当前轮回加成: +${gameState.rebirthCount * 3}%`);
    }
}

// 保存游戏
function saveGame() {
    gameState.lastSaveTime = Date.now();
    localStorage.setItem('cyberMuyuSave', JSON.stringify(gameState));
}

// 加载游戏
function loadGame() {
    const saveData = localStorage.getItem('cyberMuyuSave');
    if (saveData) {
        try {
            const savedState = JSON.parse(saveData);
            gameState = { ...gameState, ...savedState };
        } catch (e) {
            console.error('加载存档失败:', e);
        }
    }
    
    // 恢复设置
    document.getElementById('effects-toggle').checked = gameState.settings.effects;
    document.getElementById('sound-toggle').checked = gameState.settings.sound;
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 启动游戏
document.addEventListener('DOMContentLoaded', initGame);
