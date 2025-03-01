window.isDevVersion = false
if (isDevVersion) {
      //FPS stuff
    window.times = []
    window.fps = 0
    
    function refreshLoop() {
      window.requestAnimationFrame(() => {
        const now = Date.now()
        while (times.length > 0 && times[0] <= now - 1000) times.shift()
        times.push(now)
        fps = times.length
        refreshLoop()
      });
    }
    refreshLoop()
  
    setInterval(function() {document.getElementById("fps").textContent = fps + " fps"}, 200);
  }
//Sets all variables to their base values
function reset() {
	game = {
		//Create ore objects from the ores array
        ores: ores.map(ore => new Ore(ore[0], ore[1], 0, false, false)),
        //Create gem objects from the gems array
        gems: gems.map(gem => new Ore(gem[0], gem[1], 0, false, false)),
        items: [{name: "Mana", amount: 0, isDiscovered: false}],
        drills: [{unlocked: true, power: 1, speed: 1},{unlocked: false, power: 1, speed: 1},{unlocked: false, power: 1, speed: 1},{unlocked: false, power: 1, speed: 1},{unlocked: false, power: 1, speed: 1},{unlocked: false, power: 1, speed: 1},{unlocked: false, power: 1, speed: 1}],
        selectedDrill: 0,
        pinnedDrillUpgrades: -1,
        unlocks: [false, false, false],
        miningTime: 5,
        miningTimeLeft: 5,
        smelteryTier: 1,
        smeltingAmounts: [1, 1, 1, 1, 1, 1, 1],
        smeltingTimes: [0, 0, 0, 0, 0, 0, 0],
        smeltingAutoEnabled: [false, false, false, false, false, false, false],
        smeltingAutoLimits: [0, 0, 0, 0, 0, 0, 0],
        stoneBreakers: [{unlocked: true, speed: 1},{unlocked: false, speed: 1},{unlocked: false, speed: 1},{unlocked: false, speed: 1},{unlocked: false, speed: 1},{unlocked: false, speed: 1},{unlocked: false, speed: 1}],
        selectedStoneBreaker: 0,
        breakingSize: 0,
        breakingTime: 30,
        breakingTimeLeft: 0,
        breakingAutoEnabled: false,
        manaResets: 0,
        mysticalRockLevels: [0, 0, 0, 0, 0, 0],
        mysticalRockCustomInputs: [1, 1, 1, 1, 1, 1],
        graniteMax: 10,
        andesiteMax: 10,
        numberFormat: "standard",
        tabsMinimized: [false, false],
        tierDisplay: "text",
        timePlayed: 0,
	}
    timeOfLastUpdate = Date.now();
    //Add alloys to the ores array
    game.ores = game.ores.concat(alloys.map(alloy => new Ore(alloy[0], alloy[1], 0, false, true)));
    drillSpeedup = 1;
    shiftKeyHeld = false;
}
reset()

//If the user confirms the hard reset, resets all variables, saves and refreshes the page
function hardReset() {
    if (confirm("你确定要重置吗？你会失去一切的！")) {
        reset()
        save()
        location.reload()
    }
}

function save() {
    //console.log("saving")
    game.lastSave = Date.now();
    localStorage.setItem("wogleySave", JSON.stringify(game));
}
  
function setAutoSave() {
    setInterval(save, 5000);
    autosaveStarted = true;
}
//setInterval(save(), 5000)
  
function exportGame() {
    save()
    navigator.clipboard.writeText(btoa(JSON.stringify(game))).then(function() {
        alert("已复制到剪贴板!")
    }, function() {
        alert("复制到剪贴板时出错，请重试...")
    });
}
  
function importGame() {
    loadgame = JSON.parse(atob(prompt("Input your save here:")))
    if (loadgame && loadgame != null && loadgame != "") {
        reset()
        loadGame(loadgame)
        save()
        location.reload()
    }
    else {
        alert("无效的输入.")
    }
}
  
function load() {
    reset()
    let loadgame = JSON.parse(localStorage.getItem("wogleySave"))
    if (loadgame != null) {loadGame(loadgame)}
    else {updateVisuals()}
}

function loadGame(loadgame) {
    //Sets each variable in 'game' to the equivalent variable in 'loadgame' (the saved file)
    let loadKeys = Object.keys(loadgame);
    for (let i=0; i<loadKeys.length; i++) {
        if (loadgame[loadKeys[i]] != "undefined") {
            let thisKey = loadKeys[i];
            if (game[thisKey] == undefined) {continue} //Skip if the variable in the save file doesn't exist in the game
            if (Array.isArray(loadgame[thisKey]) && thisKey != "ores") { //Check if the current variable is an array
                //Check if the array in the save file is shorter than the array in the game
                if (loadgame[thisKey].length < game[thisKey].length) {
                    game[loadKeys[i]] = game[thisKey].map((x, index) => {
                        return loadgame[thisKey][index] !== undefined ? loadgame[thisKey][index] : x;
                    });
                } else {
                    game[loadKeys[i]] = loadgame[thisKey].map((x) => {
                        return x;
                    });
                }
            }
            //else {game[Object.keys(game)[i]] = loadgame[loadKeys[i]]}
            else {game[loadKeys[i]] = loadgame[loadKeys[i]]}
        }
    }

    //Show/hide minimized tabs
    if (game.tabsMinimized[0]) {document.getElementById("settingsTab").style.display = "none"; document.getElementById("settingsTabMinimize").innerHTML = "<p style='text-align: center; line-height: 25px; margin: 0'><b>+</b></p>"}
    else {document.getElementById("settingsTab").style.display = "block"; document.getElementById("settingsTabMinimize").innerHTML = "<p style='text-align: center; line-height: 25px; margin: 0'><b>-</b></p>"}
    if (game.tabsMinimized[1]) {document.getElementById("oresTab").style.display = "none"; document.getElementById("oresTabMinimize").innerHTML = "<p style='text-align: center; line-height: 25px; margin: 0'><b>+</b></p>"}
    else {document.getElementById("oresTab").style.display = "block"; document.getElementById("oresTabMinimize").innerHTML = "<p style='text-align: center; line-height: 25px; margin: 0'><b>-</b></p>"}

    //Check if the save file ores is missing ores or alloys from the constant list
    //if (game.ores.length < ores.length + alloys.length) {
    if (true) {
        for (let i = 0; i < ores.length; i++) {
            if (!game.ores.find(ore => ore.name === ores[i][0])) {
                //Find point of ore in the constant list
                let index = ores.findIndex(ore => ore[0] === ores[i][0]);
                //Slot the ore into the save file ores array at that index
                game.ores.splice(index, 0, new Ore(ores[i][0], ores[i][1], 0, false, false));
                
            }
        }
        for (let i = 0; i < alloys.length; i++) {
            if (!game.ores.find(ore => ore.name === alloys[i][0])) {
                game.ores.push(new Ore(alloys[i][0], alloys[i][1], 0, false, true))
            }
        }
    }

    //Fixing ore name mistakes
    if (game.ores[20].name == "Chromium") game.ores[20].name = "Manganese"
    //if (game.ores[22].name == "Wolfram") game.ores[22].name = "Iridium"
    
    updateOreList()
    updateVisuals()
    updateProbabilityList()
    if (game.unlocks[1]) {
        updateGemProbabilityList()
        document.getElementById("stoneBreakerInfo").style.color = drillColours[game.selectedStoneBreaker];
    }
    updateAllCosts()
    updateDrillSelection()
    document.getElementById('drillSelection').value = `drill${game.selectedDrill+1}`;
    document.getElementById("drillInfo").style.color = drillColours[game.selectedDrill];
    updateDrillUnlock()
    updateDrillPower()
    updateDrillSpeed()
    updateSmeltingCosts()
    updateSmelteryUpgrade()

    //Ore tier display style
    if (game.tierDisplay == "background") {
        document.getElementById("tierDisplayButton").innerText = "Ore tier display style: Background";
    }
    else {
        document.getElementById("tierDisplayButton").innerText = "Ore tier display style: Text";
    }
    
    //Upgrade pin checkbox
    if (getDrillsUnlocked() >= 2) {
        document.getElementById("pinUpgradeCheckbox").style.display = "inline-block";
        document.getElementById("pinUpgradeLabel").style.display = "inline-block";
        document.getElementById("pinUpgradeCheckbox").checked = game.pinnedDrillUpgrades == -1 ? false : true;
        const pinned = document.getElementById("pinUpgradeCheckbox").checked;
        if (pinned) {
            document.getElementById("pinUpgradeLabel").innerHTML = `<span style="color: ${drillColours[game.pinnedDrillUpgrades]}">${drillNames[game.pinnedDrillUpgrades]} upgrades pinned</span>`
        }
        else {
            document.getElementById("pinUpgradeLabel").innerHTML = "Pin this drill's upgrades"
        }
    }
    if (game.unlocks[0]) { //Smelting tab
        document.getElementById("unlockSmelteryButton").style.display = "none";
        document.getElementById("smelteryTab").style.display = "inline-block";
        for (let i = 0; i < 7; i++) {
            if (game.smeltingAutoEnabled[i]) {document.getElementsByClassName("autoSmeltingButton")[i].innerText = "Disable auto-smelting";}
            else {document.getElementsByClassName("autoSmeltingButton")[i].innerText = "Enable auto-smelting";}
            document.getElementsByClassName("smeltingAmountInput")[i].disabled = (game.smeltingTimes[i] > 0);
            document.getElementsByClassName("smeltingAmountInput")[i].value = game.smeltingAmounts[i];
            document.getElementsByClassName("autoSmeltingLimitInput")[i].value = game.smeltingAutoLimits[i];
        }
        //Smelting maxes
        for (let i = 0; i < document.getElementsByClassName("smeltingAmountInput").length; i++) {
            document.getElementsByClassName("smeltingAmountMax")[i].innerText = format(maxSmeltingAmounts[game.smelteryTier-1][i]);
            document.getElementsByClassName("smeltingAmountInput")[i].max = maxSmeltingAmounts[game.smelteryTier-1][i];
            setSmeltingAmount(i)
        }
        if (game.smelteryTier >= 2) {
            document.getElementsByClassName("smelteryItem")[2].style.display = 'inline-block'
        }
        if (game.smelteryTier >= 3) {
            document.getElementsByClassName("smelteryItem")[3].style.display = 'inline-block'
            document.getElementsByClassName("smelteryItem")[4].style.display = 'inline-block'
        }
        if (game.smelteryTier >= 4) {
            document.getElementsByClassName("smelteryItem")[5].style.display = 'inline-block'
        }
        if (game.smelteryTier >= 5) {
            document.getElementsByClassName("smelteryItem")[6].style.display = 'inline-block'
        }
        if (game.smelteryTier >= 6) {
            document.getElementById("smelteryUpgradeButton").style.display = 'none'
        }
        else {
            document.getElementById("smelteryUpgradeButton").style.display = 'inline-block'
        }
    }
    else {
        document.getElementById("unlockSmelteryButton").style.display = "inline-block";
        document.getElementById("smelteryTab").style.display = "none";
    }
    
    if (getDrillsUnlocked() >= 3 && !game.unlocks[1]) {
        document.getElementById("unlockGemsButton").style.display = "inline-block";
        updateGemsUnlock()
    }
    else if (game.unlocks[1]) { //Gems tab
        document.getElementById("unlockGemsButton").style.display = "none";
        document.getElementById("gemsTab").style.display = "inline-block";
        document.getElementById("gemListTitle").style.display = "block";
        document.getElementById("gemList").style.display = "block";
        document.getElementById("breakStoneButton").innerHTML = `Break stone - Costs ${format(1000*20**game.breakingSize)} <img src='img/oreStone.png' style='vertical-align: middle'>stone`;
        if (game.breakingAutoEnabled) {document.getElementById("autoBreakingButton").innerText = "Disable auto-breaking";}
        else {document.getElementById("autoBreakingButton").innerText = "Enable auto-breaking";}
        document.getElementById("stoneBreakerSelection").disabled = (game.breakingTimeLeft > 0);
        document.getElementById("stoneBreakerSizeSelection").disabled = (game.breakingTimeLeft > 0);
        updateStoneBreakerSelection()
        document.getElementById('stoneBreakerSizeSelection').value = `stoneBreakerSize${game.breakingSize+1}`;
    }
    
    if (getDrillsUnlocked() >= 4 && !game.unlocks[2]) {
        document.getElementById("unlockManaButton").style.display = "inline-block";
        updateManaUnlock()
    }
    else if (game.unlocks[2]) { //Mana tab
        document.getElementById("unlockManaButton").style.display = "none";
        document.getElementById("manaTab").style.display = "inline-block";
        document.getElementById("itemListTitle").style.display = "block";
        document.getElementById("itemList").style.display = "block";
        document.getElementById("mana").innerText = format(game.items.find(item => item.name === "Mana").amount);
        updateManaResetButton()
        updateMysticalRocks()
        game.breakingTime = 30 / (game.mysticalRockLevels[5]/5+1);
        for (let i = 0; i < 6; i++) {
            document.getElementsByClassName("mysticalRockCustomInput")[i].value = game.mysticalRockCustomInputs[i];
        }
    }
}

function format(x,forceLargeFormat=false) {
	if (x==Infinity) {return "Infinity"}
	else if (game.numberFormat == "standard" && (forceLargeFormat || x>=1e9)) {
		let exponent = Math.floor(Math.log10(x) / 3)
		return (x/(1000**exponent)).toFixed(2) + illionsShort[exponent-1]
	}
	else if (game.numberFormat == "standardLong" && (forceLargeFormat || x>=1e9)) {
		let exponent = Math.floor(Math.log10(x) / 3)
		return (x/(1000**exponent)).toFixed(2) + " " + illions[exponent-1]
	}
	else if (game.numberFormat == "scientific" && (forceLargeFormat || x>=1e9)) {
		let exponent = Math.floor(Math.log10(x))
		return (Math.floor(x/(10**exponent)*100)/100).toFixed(2) + "e" + exponent
	}
	else {return Math.floor(x).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
}

//Increasing the time played
lastTimePlayedUp = Date.now();
function timePlayedUp() {
	timePlayedDiff = (Date.now() - lastTimePlayedUp) / 1000;
	game.timePlayed += timePlayedDiff;
	timePlayedFloor = Math.floor(game.timePlayed);
	timePlayedHours = Math.floor(timePlayedFloor / 3600);
	timePlayedMinutes = Math.floor(timePlayedFloor / 60) % 60;
	timePlayedSeconds = timePlayedFloor % 60;
	timeString = (timePlayedHours + ":" + ((timePlayedMinutes < 10 ? '0' : '') + timePlayedMinutes) + ":" + ((timePlayedSeconds < 10 ? '0' : '') + timePlayedSeconds));
	document.getElementById("timePlayed").innerText = timeString;
	lastTimePlayedUp = Date.now();
}
setInterval(timePlayedUp, 100)

function changeNumberFormat() {
	if (game.numberFormat == "standard") {
		game.numberFormat = "standardLong"
		document.getElementById("numberFormat").innerHTML = "Standard long"
	}
	else if (game.numberFormat == "standardLong") {
		game.numberFormat = "scientific"
		document.getElementById("numberFormat").innerHTML = "Scientific"
	}
	else {
		game.numberFormat = "standard"
		document.getElementById("numberFormat").innerHTML = "Standard"
	}
    updateVisuals()
}

function changeTierDisplay() {
    game.tierDisplay = game.tierDisplay == "background" ? "text" : "background";
    updateProbabilityList()
    if (game.tierDisplay == "background") {
        document.getElementById("tierDisplayButton").innerText = "Ore tier display style: Background";
    }
    else {
        document.getElementById("tierDisplayButton").innerText = "Ore tier display style: Text";
    }
}

function minimizeSettingsTab() {
    game.tabsMinimized[0] = !game.tabsMinimized[0]
    if (game.tabsMinimized[0]) {document.getElementById("settingsTab").style.display = "none"; document.getElementById("settingsTabMinimize").innerHTML = "<p style='text-align: center; line-height: 25px; margin: 0'><b>+</b></p>"}
    else {document.getElementById("settingsTab").style.display = "block"; document.getElementById("settingsTabMinimize").innerHTML = "<p style='text-align: center; line-height: 25px; margin: 0'><b>-</b></p>"}
}

function minimizeOresTab() {
    game.tabsMinimized[1] = !game.tabsMinimized[1]
    if (game.tabsMinimized[1]) {document.getElementById("oresTab").style.display = "none"; document.getElementById("oresTabMinimize").innerHTML = "<p style='text-align: center; line-height: 25px; margin: 0'><b>+</b></p>"}
    else {document.getElementById("oresTab").style.display = "block"; document.getElementById("oresTabMinimize").innerHTML = "<p style='text-align: center; line-height: 25px; margin: 0'><b>-</b></p>"}
}

//Shift key keydown and keyup events
/*document.addEventListener('keydown', function(event) {
    if (event.key == "Shift") {
        shiftKeyHeld = true;
        updateProbabilityList()
    }
});
document.addEventListener('keyup', function(event) {
    if (event.key == "Shift") {
        shiftKeyHeld = false;
        updateProbabilityList()
    }
});*/

function updateVariables() {
    const time = Date.now();
    const dt = (time - timeOfLastUpdate) / 1000;
    timeOfLastUpdate = time;

    game.miningTimeLeft -= dt * drillSpeedup;
    if (game.miningTimeLeft <= 0) {
        game.miningTime = drillSpeeds[game.drills[game.selectedDrill].speed-1];
        game.miningTimeLeft = game.miningTime;
        mine()
    }
    //Smelting
    for (let i = 0; i < 7; i++) {
        if (game.smeltingTimes[i] > 0) {
            game.smeltingTimes[i] -= dt;
            if (game.smeltingTimes[i] <= 0) {
                addOreAmount(alloys[i][0], game.smeltingAmounts[i])
                document.getElementsByClassName("smeltingAmountInput")[i].disabled = false;
                if (game.smeltingAutoEnabled[i] && (game.smeltingAutoLimits[i] == 0 || getOreAmount(alloys[i][0]) < game.smeltingAutoLimits[i])) {smeltAlloy(i)}
                else if (game.smeltingAutoEnabled[i]) {game.smeltingAutoEnabled[i] = false; document.getElementsByClassName("autoSmeltingButton")[i].innerText = "Enable auto-smelting";}
            }
        }
    }
    //Stone breaking
    if (game.unlocks[1] && game.breakingTimeLeft > 0) {
        game.breakingTimeLeft -= dt;
        if (game.breakingTimeLeft <= 0) {
            game.breakingTimeLeft = 0;
            finishStoneBreaking()
        }
    }
}

setInterval(updateVariables, 1000 / 60);

function updateVisuals() {
    document.getElementById("miningTimeLeft").innerText = game.miningTimeLeft.toFixed(2);
    document.getElementById("miningProgressBarInner").style.width = Math.min((1-(game.miningTimeLeft/game.miningTime)) * 100, 100) + "%";
    //Smelting progress bars
    for (let i = 0; i < 7; i++) {
        if (game.smeltingTimes[i] > 0) {
            document.getElementsByClassName(`smeltingProgressBarInner`)[i].style.width = Math.min((1-(game.smeltingTimes[i]/20)) * 100, 100) + "%";
        }
        else {
            document.getElementsByClassName(`smeltingProgressBarInner`)[i].style.width = "0%";
        }
    }
    //Stone breaking progress bar
    if (game.unlocks[1]) {
        document.getElementById("breakingTimeLeft").innerText = game.breakingTimeLeft.toFixed(2);
        if (game.breakingTimeLeft == 0) {document.getElementById("breakingProgressBarInner").style.width = "0%";}
        else {document.getElementById("breakingProgressBarInner").style.width = Math.min((1-(game.breakingTimeLeft/game.breakingTime)) * 100, 100) + "%";}
    }
    requestAnimationFrame(updateVisuals);
}
requestAnimationFrame(updateVisuals);

function updateProbabilityList() {
    const probabilities = miningProbabilities[game.selectedDrill];
    let probabilityList = "";
    let mysticalRockMultiplier = getMysticalRockMultiplier(game.selectedDrill);
    for (const [oreName, probability] of probabilities) {
        const tier = game.ores.find(ore => ore.name === oreName).tier;
        if (game.tierDisplay == "background") {
            probabilityList += `<tr><td style="background-color: ${oreTierColoursDark[tier-1]}"><img src='img/ore${oreName}.png'>${oreName}</td>`
        }
        else {
            probabilityList += `<tr><td><img src='img/ore${oreName}.png'>${oreName} <span style="color: ${oreTierColours[tier-1]}">(tier ${tier})</span></td>`
        }
        probabilityList += `<td> ${Math.floor(probability * 100)}%</td>`;
        let drillPower = game.drills[game.selectedDrill].power;
        let averageOrePerMine = (2**drillPower/4 * mysticalRockMultiplier)+0.5;
        let minesPerMinute = 60 / drillSpeeds[game.drills[game.selectedDrill].speed-1];
        let orePerMinute = averageOrePerMine * minesPerMinute * probability * drillSpeedup;
        probabilityList += `<td><span style='color: ${drillSpeedup > 1 ? "#a96" : "#888"}'>(${orePerMinute > 100 ? format(orePerMinute) : orePerMinute.toFixed(1)}/min)</span></td></tr>`;
    }
    document.getElementById("probabilityList").innerHTML = probabilityList;
}

/*function updateProbabilityList() {
    const probabilities = miningProbabilities[game.selectedDrill];
    let probabilityList = "";
    for (const [oreName, probability] of probabilities) {
        const tier = game.ores.find(ore => ore.name === oreName).tier;
        probabilityList += `<img src='img/ore${oreName}.png'>${oreName}`
        probabilityList += ` <span style="color: ${oreTierColours[tier-1]}">(tier ${tier})</span>:`
        probabilityList += ` ${Math.floor(probability * 100)}%`;
        let drillPower = game.drills[game.selectedDrill].power;
        let averageOrePerMine = 2**drillPower/2+0.5;
        let minesPerMinute = 60 / drillSpeeds[game.drills[game.selectedDrill].speed-1];
        let orePerMinute = averageOrePerMine * minesPerMinute * probability * drillSpeedup;
        probabilityList += ` <span style='color: ${drillSpeedup > 1 ? "#a96" : "#888"}'>(${orePerMinute > 100 ? format(orePerMinute) : orePerMinute.toFixed(1)}/min)</span><br>`;
    }
    document.getElementById("probabilityList").innerHTML = probabilityList;
}*/
updateProbabilityList()

function updateOreList() {
    //Ores
    let list = "";
    for (const oreName of game.ores) {
        const tier = game.ores.find(ore => ore.name === oreName.name).tier;
        if (oreName.name == "Bronze" && game.unlocks[0]) list += "<hr>"
        if (oreName.isDiscovered) list += `<img src='img/ore${oreName.name}.png'>${oreName.name} <span style='color: ${oreTierColours[tier-1]}'>(tier ${tier})</span>: ${format(oreName.amount)}<br>`;
    }
    //Gems
    let list2 = "";
    for (const gemName of game.gems) {
        const tier = game.gems.find(gem => gem.name === gemName.name).tier;
        if (gemName.isDiscovered) list2 += `<img src='img/gem${gemName.name}.png'>${gemName.name} <span style='color: ${oreTierColours[tier-1]}'>(tier ${romanNumerals[tier]})</span>: ${format(gemName.amount)}<br>`;
    }
    //Items
    let list3 = "";
    for (const itemName of game.items) {
        const tier = game.items.find(item => item.name === itemName.name).tier;
        if (itemName.isDiscovered) list3 += `<img src='img/item${itemName.name}.png'>${itemName.name}: ${format(itemName.amount)}<br>`;
    }
    document.getElementById("oreList").innerHTML = list;
    document.getElementById("gemList").innerHTML = list2;
    document.getElementById("itemList").innerHTML = list3;
}
updateOreList()

function mine() {
    const probabilities = miningProbabilities[game.selectedDrill];
    //Pick random ore by summing the probabilities until sum is greater than the random number
    const r = Math.random();
    let sum = 0;
    for (const [oreName, probability] of probabilities) {
        sum += probability;
        if (r < sum) {
            const ore = game.ores.find(ore => ore.name === oreName);
            let mysticalRockMultiplier = getMysticalRockMultiplier(game.selectedDrill);
            let oreAmountMin = Math.floor(mysticalRockMultiplier);
            let oreAmountMax = Math.floor(2 ** (game.drills[game.selectedDrill].power-1) * mysticalRockMultiplier);
            let oreAmount = Math.floor(Math.random() * (oreAmountMax - oreAmountMin + 1) + oreAmountMin);
            ore.amount += oreAmount;
            ore.isDiscovered = true;
            document.getElementById("lastOreMine").innerHTML = `Mined ${format(oreAmount)} <img src='img/ore${oreName}.png' style='vertical-align: middle'>${oreName}`;
            if (getOreAmount("Stone") >= 1000 && game.breakingAutoEnabled && game.breakingTimeLeft == 0) breakStone()
            updateOreList()
            updateAllCosts()
            break;
        }
    }
}

function getOreAmount(x,y=0) {
    if (y==2) {return game.items.find(item => item.name === x).amount;}
    else if (y==1) {return game.gems.find(gem => gem.name === x).amount;}
    else {return game.ores.find(ore => ore.name === x).amount;}
}

function addOreAmount(x,y) {
    game.ores.find(ore => ore.name === x).isDiscovered = true;
    game.ores.find(ore => ore.name === x).amount += y;
    updateOreList()
    updateAllCosts()
}

function subtractOreAmount(x,y) {
    game.ores.find(ore => ore.name === x).amount -= y;
    updateOreList()
    updateAllCosts()
}

function addGemAmount(x,y) {
    game.gems.find(gem => gem.name === x).isDiscovered = true;
    game.gems.find(gem => gem.name === x).amount += y;
    updateOreList()
    updateAllCosts()
}

function subtractGemAmount(x,y) {
    game.gems.find(gem => gem.name === x).amount -= y;
    updateOreList()
    updateAllCosts()
}

function makeOreCostTable(costs, p = 4) { //Ore cost table code by ducdat0507
    if (costs[0][0] == "Unavailablium") return `<div class="oreCost" style="margin-inline: -${p}px; padding: 2px ${p}px 1px ${p}px; display: flex; background-color: #222; align-items: center">
        <span>Available next update!</span>
        </div>`;
    let ans = "";
    for (const ore of costs) {
        let itemType;
        if (ore[2] == 2) {itemType = "item";}
        else if (ore[2] == 1) {itemType = "gem";}
        else {itemType = "ore";}
        let amount = getOreAmount(ore[0],ore[2])
        let progress = amount / ore[1];
        let bg = progress >= 1 ? "linear-gradient(90deg, #474, #474)" : "linear-gradient(90deg, #666, #666)";
                ans += `
        <div class="oreCost" style="margin-inline: -${p}px; padding: 2px ${p}px 1px ${p}px; display: flex; background: #222 ${bg} no-repeat top left / ${Math.min(progress, 1) * 100}% 100%; align-items: center">
        <img src='img/${itemType}${ore[0]}.png' style='flex: 0'>
        <span>${ore[0]}</span>
        <span style="flex: 1 0 20px; width: 20px"></span>
        <span style="color: ${progress >= 1 ? "white" : "#f99"}">${format(amount)} / ${format(ore[1])}</span>
        </div>
                `;
    }
    return ans;
}

//Prevent context menu from appearing when holding the speedup button on mobile
document.getElementById('drillSpeedupButton').oncontextmenu = function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return false;
};

function updateAllCosts() {
    updateDrillUnlock()
    updateDrillPower()
    updateDrillSpeed()
    updateSmeltingCosts()
    updateSmelteryUpgrade()
    if (!game.unlocks[0]) updateSmelteryUnlock()
    if (getDrillsUnlocked() >= 3 && !game.unlocks[1]) updateGemsUnlock()
    else if (game.unlocks[1]) updateStoneBreakerUnlock()
    if (getDrillsUnlocked() >= 4 && !game.unlocks[2]) updateManaUnlock()
    else if (game.unlocks[2]) {
        document.getElementById("mana").innerText = format(getOreAmount("Mana",2));
        updateManaResetButton() 
    }
}

function drillSpeedupOn() {
    drillSpeedup = 2.5;
    document.getElementById('drillSpeedupButton').style.backgroundColor = "#066";
    updateProbabilityList()
}

function drillSpeedupOff() {
    drillSpeedup = 1;
    document.getElementById('drillSpeedupButton').style.backgroundColor = "#036";
    updateProbabilityList()
}

function getDrillsUnlocked() {
    let drillsUnlocked = 0;
    while (game.drills[drillsUnlocked].unlocked) {drillsUnlocked++}
    return drillsUnlocked;
}

function updateDrillUnlock() {
    //Find the earliest locked drill
    let drillsUnlocked = getDrillsUnlocked();
    document.getElementById("drillUnlockButton").innerHTML = `Unlock the <b>${drillNames[drillsUnlocked]}</b> (can mine <span style='color: ${oreTierColours[drillsUnlocked]}'>tier ${drillsUnlocked+1}</span> ores)<br>` + makeOreCostTable(drillCosts[drillsUnlocked]);
}
updateDrillUnlock()

function unlockDrill() {
    //Find the earliest locked drill
    let drillsUnlocked = getDrillsUnlocked();
    const costs = drillCosts[drillsUnlocked];
    //Return if the player doesn't have enough ore
    for (const [ore, amount, itemType] of costs) {
        if (getOreAmount(ore, itemType) < amount) return;
    }
    //Subtract ore amounts
    for (const [ore, amount, itemType] of costs) {
        if (itemType == 2) {game.items.find(o => o.name === ore).amount -= amount;}
        else if (itemType == 1) {game.gems.find(o => o.name === ore).amount -= amount;}
        else {game.ores.find(o => o.name === ore).amount -= amount;}
    }
    updateOreList()
    updateAllCosts()
    game.drills[drillsUnlocked].unlocked = true;
    selectDrill(drillsUnlocked)
    updateDrillSelection()
    if (drillsUnlocked == 1) {
        document.getElementById("pinUpgradeCheckbox").style.display = "inline-block";
        document.getElementById("pinUpgradeLabel").style.display = "inline-block";
    }
    else if (drillsUnlocked == 2 && !game.unlocks[1]) {
        document.getElementById("unlockGemsButton").style.display = "inline-block";
        updateGemsUnlock()
    }
    else if (drillsUnlocked == 3 && !game.unlocks[2]) {
        document.getElementById("unlockManaButton").style.display = "inline-block";
        updateManaUnlock()
    }
}

function selectDrill(x) {
    if (typeof(x) == "string") {x = parseInt(x[5])-1}
    if (!game.drills[x].unlocked) return;
    game.selectedDrill = x;
    game.miningTime = drillSpeeds[game.drills[game.selectedDrill].speed-1];
    game.miningTimeLeft = game.miningTime;
    document.getElementById("drillInfo").style.color = drillColours[game.selectedDrill];
    document.getElementById('drillSelection').value = `drill${game.selectedDrill+1}`;
    updateProbabilityList()
    updateDrillUnlock()
    updateDrillPower()
    updateDrillSpeed()
}
document.getElementById("drillInfo").style.color = drillColours[game.selectedDrill];

function upgradeDrillPower() {
    let pinnedDrill = (game.pinnedDrillUpgrades == -1) ? game.selectedDrill : game.pinnedDrillUpgrades;
    const costs = drillPowerCosts[pinnedDrill][game.drills[pinnedDrill].power-1];
    //Return if the player doesn't have enough ore
    for (const [ore, amount, itemType] of costs) {
        if (getOreAmount(ore, itemType) < amount) return;
    }
    //Subtract ore amounts
    for (const [ore, amount, itemType] of costs) {
        if (itemType == 2) {game.items.find(o => o.name === ore).amount -= amount;}
        else if (itemType == 1) {game.gems.find(o => o.name === ore).amount -= amount;}
        else {game.ores.find(o => o.name === ore).amount -= amount;}
    }
    updateOreList()
    updateAllCosts()
    game.drills[pinnedDrill].power++;
    updateDrillPower()
    updateProbabilityList()
}

function updateDrillPower() {
    let pinnedDrill = (game.pinnedDrillUpgrades == -1) ? game.selectedDrill : game.pinnedDrillUpgrades;
    let mysticalRockMultiplier = getMysticalRockMultiplier(pinnedDrill);
    document.getElementById("drillInfo").innerText = `${drillNames[game.selectedDrill]} (power ${game.drills[game.selectedDrill].power}, speed ${game.drills[game.selectedDrill].speed})`
    document.getElementById("drillPower").innerHTML = `<b>Drill power: ${game.drills[pinnedDrill].power}</b><br>(${format(mysticalRockMultiplier)}-${format(2 ** (game.drills[pinnedDrill].power-1) * mysticalRockMultiplier)} ore/mine)`;
    document.getElementById("drillPowerButton").innerHTML = `Upgrade drill power<br>Next: ${format(mysticalRockMultiplier)}-${format(2 ** game.drills[pinnedDrill].power * mysticalRockMultiplier)} ore/mine<br>` + makeOreCostTable(drillPowerCosts[pinnedDrill][game.drills[pinnedDrill].power-1]);
}
updateDrillPower()

function upgradeDrillSpeed() {
    if (game.drills[game.selectedDrill].speed == 10) return;
    let pinnedDrill = (game.pinnedDrillUpgrades == -1) ? game.selectedDrill : game.pinnedDrillUpgrades;
    const costs = drillSpeedCosts[pinnedDrill][game.drills[pinnedDrill].speed-1];
    //Return if the player doesn't have enough ore
    for (const [ore, amount, itemType] of costs) {
        if (getOreAmount(ore, itemType) < amount) return;
    }
    //Subtract ore amounts
    for (const [ore, amount, itemType] of costs) {
        if (itemType == 2) {game.items.find(o => o.name === ore).amount -= amount;}
        else if (itemType == 1) {game.gems.find(o => o.name === ore).amount -= amount;}
        else {game.ores.find(o => o.name === ore).amount -= amount;}
    }
    updateOreList()
    updateAllCosts()
    game.drills[pinnedDrill].speed++;
    updateDrillSpeed()
    updateProbabilityList()
}

function updateDrillSpeed() {
    let pinnedDrill = (game.pinnedDrillUpgrades == -1) ? game.selectedDrill : game.pinnedDrillUpgrades;
    document.getElementById("drillInfo").innerText = `${drillNames[game.selectedDrill]} (power ${game.drills[game.selectedDrill].power}, speed ${game.drills[game.selectedDrill].speed})`
    document.getElementById("drillSpeed").innerHTML = `<b>Drill speed: ${game.drills[pinnedDrill].speed}</b><br>(${drillSpeeds[game.drills[pinnedDrill].speed-1].toFixed(2)}s)`;
    if (game.drills[pinnedDrill].speed < 10) {document.getElementById("drillSpeedButton").innerHTML = `Upgrade drill speed<br>Next: ${drillSpeeds[game.drills[pinnedDrill].speed].toFixed(2)}s<br>` + makeOreCostTable(drillSpeedCosts[pinnedDrill][game.drills[pinnedDrill].speed-1])}
    else {document.getElementById("drillSpeedButton").innerText = `Max drill speed!`}
}
updateDrillSpeed()

function updateDrillSelection() {
    document.getElementById(`drillSelection`).innerHTML = "";
    for (let i = 0; i < game.drills.length; i++) {
        if (game.drills[i].unlocked) {
            document.getElementById(`drillSelection`).innerHTML += `<option value="drill${i+1}" style="color: ` + drillColours[i] + `">${drillNames[i]}</option>`;
        }
    }
    document.getElementById(`drillSelection`).value = `drill${game.selectedDrill+1}`;
}

function pinUnpinDrillUpgrades() {
    const pinned = document.getElementById("pinUpgradeCheckbox").checked;
    if (pinned) {
        game.pinnedDrillUpgrades = game.selectedDrill;
        document.getElementById("pinUpgradeLabel").innerHTML = `<span style="color: ${drillColours[game.pinnedDrillUpgrades]}">${drillNames[game.pinnedDrillUpgrades]} upgrades pinned</span>`
    }
    else {
        game.pinnedDrillUpgrades = -1;
        document.getElementById("pinUpgradeLabel").innerHTML = "Pin this drill's upgrades"
        updateDrillPower()
        updateDrillSpeed()
    }
}

function unlockSmeltery() {
    if (getOreAmount("Stone") >= 25 && getOreAmount("Coal") >= 8 && !game.unlocks[0]) {
        game.ores.find(ore => ore.name === "Stone").amount -= 25;
        game.ores.find(ore => ore.name === "Coal").amount -= 8;
        game.unlocks[0] = true;
        updateOreList()
        updateAllCosts()
        document.getElementById("unlockSmelteryButton").style.display = "none";
        document.getElementById("smelteryTab").style.display = "inline-block";
        updateSmeltingCosts()
        updateSmelteryUpgrade()
    }
}

function updateSmelteryUnlock() {
    document.getElementById("unlockSmelteryButton").innerHTML = `Unlock smeltery<br>` + makeOreCostTable([['Stone', 25], ['Coal', 8]]);
}
if (!game.unlocks[0]) updateSmelteryUnlock()

function smeltAlloy(x) {
    const costs = alloyCosts[x];
    if (game.smeltingTimes[x] > 0) return;
    //Return if the player doesn't have enough ore
    for (const [ore, amount, itemType] of costs) {
        if (getOreAmount(ore, itemType) < amount * game.smeltingAmounts[x]) {
            if (game.smeltingAutoEnabled[x]) enableDisableAutoSmelting(x)
            return;
        }
    }
    //Subtract ore amounts
    for (const [ore, amount, itemType] of costs) {
        game.ores.find(o => o.name === ore).amount -= amount * game.smeltingAmounts[x];
    }
    updateOreList()
    updateAllCosts()
    game.smeltingTimes[x] = 20;
    document.getElementsByClassName("smeltingAmountInput")[x].disabled = true;
}

function setSmeltingAmount(x) {
    game.smeltingAmounts[x] = Math.max(Math.min(parseInt(document.getElementsByClassName("smeltingAmountInput")[x].value), maxSmeltingAmounts[game.smelteryTier-1][x]), 1);
    document.getElementsByClassName("smeltingAmountInput")[x].value = game.smeltingAmounts[x];
    updateSmeltingCosts()
}

function enableDisableAutoSmelting(x) {
    game.smeltingAutoEnabled[x] = !game.smeltingAutoEnabled[x];
    if (game.smeltingAutoEnabled[x]) {document.getElementsByClassName("autoSmeltingButton")[x].innerText = "Disable auto-smelting"; smeltAlloy(x);}
    else {document.getElementsByClassName("autoSmeltingButton")[x].innerText = "Enable auto-smelting";}
}

function setAutoSmeltingLimit(x) {
    game.smeltingAutoLimits[x] = Math.max(parseInt(document.getElementsByClassName("autoSmeltingLimitInput")[x].value), 0);
    document.getElementsByClassName("autoSmeltingLimitInput")[x].value = game.smeltingAutoLimits[x];
}

function updateSmeltingCosts() {
    const elements = document.getElementsByClassName("smeltingCosts");
    let costs = [];
    for (let i = 0; i < 7; i++) {
        costs.push(alloyCosts[i]);
        //Multiply costs by the smelting amount
        costs[i] = costs[i].map(cost => [cost[0], cost[1] * game.smeltingAmounts[i]]);
    }
    for (let i = 0; i < 7; i++) {
        elements[i].innerHTML = makeOreCostTable(costs[i], 5);
        //Smelting maxes
        document.getElementsByClassName("smeltingAmountMax")[i].innerText = format(maxSmeltingAmounts[game.smelteryTier-1][i]);
        document.getElementsByClassName("smeltingAmountInput")[i].max = maxSmeltingAmounts[game.smelteryTier-1][i];
    }
}

function updateSmelteryUpgrade() {
    document.getElementById("smelteryTitle").innerText = `Smeltery (tier ${game.smelteryTier})`;
    document.getElementById("smelteryUpgradeButton").innerHTML = `Upgrade smeltery to tier ${game.smelteryTier+1}<br>` + makeOreCostTable(smelteryUpgradeCosts[game.smelteryTier-1]);
}

function upgradeSmeltery() {
    const costs = smelteryUpgradeCosts[game.smelteryTier-1];
    //Return if the player doesn't have enough ore
    for (const [ore, amount, itemType] of costs) {
        if (getOreAmount(ore, itemType) < amount) return;
    }
    //Substract ore amounts
    for (const [ore, amount, itemType] of costs) {
        if (itemType) {game.gems.find(o => o.name === ore).amount -= amount;}
        else {game.ores.find(o => o.name === ore).amount -= amount;}
    }
    updateOreList()
    updateAllCosts()
    game.smelteryTier++;
    updateSmelteryUpgrade()
    updateSmeltingCosts()
    if (game.smelteryTier == 2) {
        document.getElementsByClassName("smelteryItem")[2].style.display = 'inline-block'
    }
    else if (game.smelteryTier == 3) {
        document.getElementsByClassName("smelteryItem")[3].style.display = 'inline-block'
        document.getElementsByClassName("smelteryItem")[4].style.display = 'inline-block'
    }
    else if (game.smelteryTier == 4) {
        document.getElementsByClassName("smelteryItem")[5].style.display = 'inline-block'
    }
    else if (game.smelteryTier == 5) {
        document.getElementsByClassName("smelteryItem")[6].style.display = 'inline-block'
    }
    else if (game.smelteryTier == 6) {
        document.getElementById("smelteryUpgradeButton").style.display = 'none'
    }
}

function updateGemsUnlock() {
    document.getElementById("unlockGemsButton").innerHTML = `Unlock gems<br>` + makeOreCostTable([['Stone', 2000], ['Zinc', 200], ['Lead', 20], ['Bismuth', 2]]);
}

function unlockGems() {
    if (getOreAmount("Stone") >= 2000 && getOreAmount("Zinc") >= 200 && getOreAmount("Lead") >= 20 && getOreAmount("Bismuth") >= 2 && !game.unlocks[1]) {
        game.ores.find(ore => ore.name === "Stone").amount -= 2000;
        game.ores.find(ore => ore.name === "Zinc").amount -= 200;
        game.ores.find(ore => ore.name === "Lead").amount -= 20;
        game.ores.find(ore => ore.name === "Bismuth").amount -= 2;
        game.unlocks[1] = true;
        updateGemProbabilityList()
        document.getElementById("stoneBreakerInfo").style.color = drillColours[game.selectedStoneBreaker]
        updateOreList()
        updateAllCosts()
        document.getElementById("unlockGemsButton").style.display = "none";
        document.getElementById("gemsTab").style.display = "inline-block";
        document.getElementById("gemListTitle").style.display = "block";
        document.getElementById("gemList").style.display = "block";
    }
}

function updateGemProbabilityList() {
    const probabilities = gemFindingProbabilities[game.selectedStoneBreaker];
    const probabilityList = document.getElementById("gemProbabilityList");
    probabilityList.innerHTML = "";
    for (const [gemName, probability] of probabilities) {
        const tier = game.gems.find(gem => gem.name === gemName).tier;
        probabilityList.innerHTML += `<img src='img/gem${gemName}.png'>${gemName} <span style='color: ${oreTierColours[tier-1]}'>(tier ${romanNumerals[tier]})</span>: ${Math.floor(probability * 100)}%<br>`;
    }
}

function breakStone() {
    if (game.unlocks[1] && getOreAmount("Stone") >= 1000*20**game.breakingSize && game.breakingTimeLeft == 0) {
        game.ores.find(ore => ore.name === "Stone").amount -= 1000*20**game.breakingSize;
        game.breakingTimeLeft = game.breakingTime;
        updateOreList()
        updateAllCosts()
        //Prevent changing stone breaker or stone size during breaking
        document.getElementById("stoneBreakerSelection").disabled = true;
        document.getElementById("stoneBreakerSizeSelection").disabled = true;
    }
}

function enableDisableAutoBreaking() {
    game.breakingAutoEnabled = !game.breakingAutoEnabled;
    if (game.breakingAutoEnabled) {breakStone(); document.getElementById("autoBreakingButton").innerText = "Disable auto-breaking";}
    else {document.getElementById("autoBreakingButton").innerText = "Enable auto-breaking";}
}

function finishStoneBreaking() {
    document.getElementById("stoneBreakerSelection").disabled = false;
    document.getElementById("stoneBreakerSizeSelection").disabled = false;
    let mysticalRockMultiplier = game.mysticalRockLevels[4]/3+1;
    const probabilities = gemFindingProbabilities[game.selectedStoneBreaker];
    let gemFinds = [];
    if (!game.gems.find(o => o.name === "Amber").isDiscovered && !game.gems.find(o => o.name === "Fluorite").isDiscovered && !game.gems.find(o => o.name === "Quartz").isDiscovered) {gemFinds = [["Fluorite", 2],["Amber", 1]]}
    else {
        for (const [gemName, probability] of probabilities) {
            if (Math.random() < probability) {
                let gemAmountMin = Math.floor(5**game.breakingSize*mysticalRockMultiplier);
                let gemAmountMax = Math.floor(3*5**game.breakingSize*mysticalRockMultiplier);
                let gemAmount = Math.floor(Math.random() * (gemAmountMax - gemAmountMin + 1) + gemAmountMin);
                gemFinds.push([gemName, gemAmount]);
            }
        }
    }
    if (gemFinds.length == 0) {
        document.getElementById("lastGemFinds").innerHTML = `No gems found...`;
    }
    else {
        document.getElementById("lastGemFinds").innerHTML = "Found: "
        for (let i=0; i<gemFinds.length; i++) {
            const gemName = gemFinds[i][0];
            const amount = gemFinds[i][1];
            const gem = game.gems.find(gem => gem.name === gemName);
            gem.amount += amount;
            gem.isDiscovered = true;
            updateOreList()
            updateAllCosts()
            document.getElementById("lastGemFinds").innerHTML += `${format(amount)} <img src='img/gem${gemName}.png' style='vertical-align: middle'>${gemName}${i == gemFinds.length-1 ? "" : ", "}`;
        }
    }
    //Extra coal
    addOreAmount("Coal", Math.floor(Math.random() * 50 + 50));
    //Auto stone breaking
    if (game.breakingAutoEnabled && getOreAmount("Stone") >= 1000*20**game.breakingSize) breakStone()
}

function getStoneBreakersUnlocked() {
    let stoneBreakersUnlocked = 0;
    while (game.stoneBreakers[stoneBreakersUnlocked].unlocked) {stoneBreakersUnlocked++}
    return stoneBreakersUnlocked;
}

function updateStoneBreakerUnlock() {
    //Find the earliest locked stone breaker
    let stoneBreakersUnlocked = getStoneBreakersUnlocked();
    document.getElementById("stoneBreakerUnlockButton").innerHTML = `Unlock the <b>${stoneBreakerNames[stoneBreakersUnlocked]}</b> (can find <span style='color: ${oreTierColours[stoneBreakersUnlocked]}'>tier ${romanNumerals[stoneBreakersUnlocked+1]}</span> gems)<br>` + makeOreCostTable(stoneBreakerCosts[stoneBreakersUnlocked]);
}

function unlockStoneBreaker() {
    //Find the earliest locked drill
    let stoneBreakersUnlocked = getStoneBreakersUnlocked();
    const costs = stoneBreakerCosts[stoneBreakersUnlocked];
    //Return if the player doesn't have enough ore
    for (const [ore, amount, itemType] of costs) {
        if (getOreAmount(ore, itemType) < amount) return;
    }
    //Subtract ore amounts
    for (const [ore, amount, itemType] of costs) {
        if (itemType) {game.gems.find(o => o.name === ore).amount -= amount;}
        else {game.ores.find(o => o.name === ore).amount -= amount;}
    }
    updateOreList()
    updateAllCosts()
    game.stoneBreakers[stoneBreakersUnlocked].unlocked = true;
    selectStoneBreaker(stoneBreakersUnlocked)
    updateStoneBreakerSelection()
}

function selectStoneBreaker(x) {
    if (typeof(x) == "string") {x = parseInt(x[12])-1}
    game.selectedStoneBreaker = x;
    let mysticalRockMultiplier = game.mysticalRockLevels[4]/3+1;
    document.getElementById('stoneBreakerSelection').value = `stoneBreaker${x+1}`;
    document.getElementById("stoneBreakerInfo").style.color = drillColours[x];
    document.getElementById("stoneBreakerInfo").innerText = stoneBreakerNames[x]
    document.getElementById("stoneBreakerInfo2").innerText = `${stoneBreakerSizes[game.breakingSize]} stone breaking - ${format(5**game.breakingSize*mysticalRockMultiplier)}-${format(3*5**game.breakingSize*mysticalRockMultiplier)} gems per find`;
    updateGemProbabilityList()
    updateStoneBreakerUnlock()
}

function updateStoneBreakerSelection() {
    let mysticalRockMultiplier = game.mysticalRockLevels[4]/3+1;
    document.getElementById(`stoneBreakerSelection`).innerHTML = "";
    for (let i = 0; i < game.stoneBreakers.length; i++) {
        if (game.stoneBreakers[i].unlocked) {
            document.getElementById(`stoneBreakerSelection`).innerHTML += `<option value="stoneBreaker${i+1}" style="color: ` + drillColours[i] + `">${stoneBreakerNames[i]}</option>`;
        }
    }
    document.getElementById('stoneBreakerSelection').value = `stoneBreaker${game.selectedStoneBreaker+1}`;
    document.getElementById("stoneBreakerInfo").style.color = drillColours[game.selectedStoneBreaker];
    document.getElementById("stoneBreakerInfo").innerText = stoneBreakerNames[game.selectedStoneBreaker]
    document.getElementById("stoneBreakerInfo2").innerText = `${stoneBreakerSizes[game.breakingSize]} stone breaking - ${format(5**game.breakingSize*mysticalRockMultiplier)}-${format(3*5**game.breakingSize*mysticalRockMultiplier)} gems per find`;
}

function selectStoneBreakerSize(x) {
    if (typeof(x) == "string") {x = parseInt(x[16])-1}
    game.breakingSize = x;
    let mysticalRockMultiplier = game.mysticalRockLevels[4]/3+1;
    document.getElementById("stoneBreakerInfo2").innerText = `${stoneBreakerSizes[x]} stone breaking - ${format(5**x*mysticalRockMultiplier)}-${format(3*5**x*mysticalRockMultiplier)} gems per find`;
    document.getElementById("breakStoneButton").innerHTML = `Break stone - Costs ${format(1000*20**x)} <img src='img/oreStone.png' style='vertical-align: middle'>stone`;
    document.getElementById('stoneBreakerSizeSelection').value = `stoneBreakerSize${x+1}`;
}

function updateManaUnlock() {
    document.getElementById("unlockManaButton").innerHTML = `Unlock <span style="color: #8ff">mana</span><br>` + makeOreCostTable([['Tin', 65000], ['Silver', 3000], ['Bismuth', 300], ['Osmium', 75], ['Rose gold', 65], ['Platinum', 25]]);
}

function unlockMana() {
    if (getOreAmount("Tin") >= 65000 && getOreAmount("Silver") >= 3000 && getOreAmount("Bismuth") >= 300 && getOreAmount("Osmium") >= 75 && getOreAmount("Rose gold") >= 65 && getOreAmount("Platinum") >= 25 && !game.unlocks[2]) {
        game.ores.find(ore => ore.name === "Tin").amount -= 65000;
        game.ores.find(ore => ore.name === "Silver").amount -= 3000;
        game.ores.find(ore => ore.name === "Bismuth").amount -= 300;
        game.ores.find(ore => ore.name === "Osmium").amount -= 75;
        game.ores.find(ore => ore.name === "Rose gold").amount -= 65;
        game.ores.find(ore => ore.name === "Platinum").amount -= 25;
        game.unlocks[2] = true;
        document.getElementById("unlockManaButton").style.display = "none";
        document.getElementById("manaTab").style.display = "inline-block";
        document.getElementById("itemListTitle").style.display = "block";
        document.getElementById("itemList").style.display = "block";
        game.items.find(item => item.name === "Mana").isDiscovered = true;
        updateOreList()
        updateAllCosts()
        updateManaResetButton()
        updateMysticalRocks()
    }
}

function manaReset() {
    if (getDrillsUnlocked() >= 4 && confirm("Are you sure you want to reset?")) {
        //Add mana
        if (!game.manaResets) {game.items.find(item => item.name === "Mana").amount += 4}
        else {
            let manaToGet = Math.floor(getOreAmount("Stone") ** 0.2 / 2);
            game.items.find(item => item.name === "Mana").amount += manaToGet;
            if (game.items.find(item => item.name === "Mana").amount > 25) game.items.find(item => item.name === "Mana").amount = 25; //Temporary cap
        }
        game.manaResets++;
        document.getElementById("mana").innerText = format(getOreAmount("Mana",2));
        //Set all ores to 0
        for (const ore of game.ores) {
            if (ore.isDiscovered) ore.amount = 0;
        }
        //Set all gems to 0
        for (const gem of game.gems) {
            if (gem.isDiscovered) gem.amount = 0;
        }
        selectDrill(0)
        //De-unlock all drills past the first and remove drill upgrades
        for (let i = 0; i < game.drills.length; i++) {
            game.drills[i].speed = 1;
            game.drills[i].power = 1;
            if (i>0) game.drills[i].unlocked = false;
        }
        game.miningTime = drillSpeeds[game.drills[game.selectedDrill].speed-1];
        game.miningTimeLeft = game.miningTime;
        game.pinnedDrillUpgrades = -1;
        document.getElementById("pinUpgradeLabel").innerHTML = "Pin this drill's upgrades";
        document.getElementById("pinUpgradeCheckbox").checked = false;
        updateDrillSelection()
        for (let i = 0; i < game.smeltingTimes.length; i++) game.smeltingTimes[i] = 0; //Reset smelting times
        selectStoneBreaker(0)
        //De-unlock all stone breakers past the first
        for (let i = 0; i < game.stoneBreakers.length; i++) {
            if (i>0) game.stoneBreakers[i].unlocked = false;
        }
        selectStoneBreakerSize(0)
        updateStoneBreakerSelection()
        updateOreList()
        updateAllCosts()
        updateProbabilityList()
        updateManaResetButton()
    }
}

/*function upgradeMysticalRock(x) {
    game.mysticalRockLevels[x-1]++;
    if (x == 5) game.breakingTime = 30 / (game.mysticalRockLevels[4]/5+1);
    updateMysticalRocks()
}*/

function updateManaResetButton() {
    if (getDrillsUnlocked() < 4) {
        document.getElementById("manaResetButton").innerText = "Unlock the heat drill to reset!"
        document.getElementById("manaResetInfo").innerText = ""
    }
    else if (game.manaResets == 0) {
        document.getElementById("manaResetButton").innerHTML = "Reset for 4 mana"
        document.getElementById("manaResetInfo").innerText = "First reset always gives 4 mana. Spend it wisely!"
    }
    else {
        let manaToGet = Math.floor(getOreAmount("Stone") ** 0.2 / 2);
        document.getElementById("manaResetButton").innerHTML = `Reset for ${manaToGet} mana`
        let nextManaPoint = ((manaToGet+1) * 2) ** 5;
        document.getElementById("manaResetInfo").innerHTML = "Next mana at " + format(nextManaPoint) + " <img src='img/oreStone.png' style='vertical-align: middle'>stone"
    }
}

function updateMysticalRocks() {
    for (let i=1; i<5; i++) {
        document.getElementsByClassName("mysticalRockLevel")[i].innerText = format(game.mysticalRockLevels[i]);
    }
    document.getElementsByClassName("mysticalRockLevel")[0].innerText = format(game.mysticalRockLevels[0]) + "/" + format(game.graniteMax);
    document.getElementsByClassName("mysticalRockLevel")[5].innerText = format(game.mysticalRockLevels[5]) + "/" + format(game.andesiteMax);
    for (let i=0; i<4; i++) {
        document.getElementsByClassName("mysticalRockEffect")[i].innerText = "Effect: x" + (game.mysticalRockLevels[i]/2+1).toFixed(2) + "\nNext:" + " x" + ((game.mysticalRockLevels[i]+1)/2+1).toFixed(2);
    }
    document.getElementsByClassName("mysticalRockEffect")[4].innerText = "Effect: x" + (game.mysticalRockLevels[4]/3+1).toFixed(2) + "\nNext:" + " x" + ((game.mysticalRockLevels[4]+1)/3+1).toFixed(2);
    document.getElementsByClassName("mysticalRockEffect")[5].innerText = "Current: " +  (30 / (game.mysticalRockLevels[5]/5+1)).toFixed(1) + "s\nNext: " + (30 / ((game.mysticalRockLevels[5]+1)/5+1)).toFixed(1) + "s";
}

function addMysticalRockMana(x,y) {
    if (getOreAmount("Mana",2) == 0) return;
    if (x==1 && game.mysticalRockLevels[0] >= game.graniteMax) return;
    if (x==6 && game.mysticalRockLevels[5] >= game.andesiteMax) return;
    if (y==1) { //Add 1 mana to the mystical rock
        if (x==1) {
            if (game.mysticalRockLevels[0] >= game.graniteMax) return;
            game.mysticalRockLevels[0]++;
            game.items.find(item => item.name === "Mana").amount--;
        }
        else if (x==6) {
            if (game.mysticalRockLevels[5] >= game.andesiteMax) return;
            game.mysticalRockLevels[5]++;
            game.items.find(item => item.name === "Mana").amount--;
        }
        else {
            if (game.mysticalRockLevels[x-1] >= 15) return;
            game.mysticalRockLevels[x-1]++;
            game.items.find(item => item.name === "Mana").amount--;
        }
    }
    else if (y==2) { //Add max mana to the mystical rock
        if (x==1) { //Cap at granite max level
            let levelsLeft = game.graniteMax - game.mysticalRockLevels[0];
            game.mysticalRockLevels[0] += Math.min(levelsLeft, game.items.find(item => item.name === "Mana").amount);
            game.items.find(item => item.name === "Mana").amount -= Math.min(levelsLeft, game.items.find(item => item.name === "Mana").amount);
        }
        else if (x==6) { //Cap at andesite max level
            let levelsLeft = game.andesiteMax - game.mysticalRockLevels[5];
            game.mysticalRockLevels[5] += Math.min(levelsLeft, game.items.find(item => item.name === "Mana").amount);
            game.items.find(item => item.name === "Mana").amount -= Math.min(levelsLeft, game.items.find(item => item.name === "Mana").amount);
        }
        else {
            let levelsLeft = 15 - game.mysticalRockLevels[x-1];
            game.mysticalRockLevels[x-1] += Math.min(levelsLeft, game.items.find(item => item.name === "Mana").amount);
            game.items.find(item => item.name === "Mana").amount -= Math.min(levelsLeft, game.items.find(item => item.name === "Mana").amount);
        }
        //else {
        //    game.mysticalRockLevels[x-1] += game.items.find(item => item.name === "Mana").amount;
        //    game.items.find(item => item.name === "Mana").amount = 0;
        //}
    }
    else if (y==3) { //Add custom amount to the mystical rock
        if (x==1) { //Cap at granite max level
            let customAmount = game.mysticalRockCustomInputs[x-1];
            let levelsLeft = game.graniteMax - game.mysticalRockLevels[0];
            game.mysticalRockLevels[0] += Math.min(levelsLeft, customAmount);
            game.items.find(item => item.name === "Mana").amount -= Math.min(levelsLeft, customAmount);
        }
        else if (x==6) { //Cap at andesite max level
            let customAmount = game.mysticalRockCustomInputs[5];
            let levelsLeft = game.andesiteMax - game.mysticalRockLevels[5];
            game.mysticalRockLevels[5] += Math.min(levelsLeft, customAmount);
            game.items.find(item => item.name === "Mana").amount -= Math.min(levelsLeft, customAmount);
        }
        else {
            let customAmount = game.mysticalRockCustomInputs[x-1];
            let levelsLeft = 15 - game.mysticalRockLevels[x-1];
            game.mysticalRockLevels[x-1] += Math.min(levelsLeft, customAmount);
            game.items.find(item => item.name === "Mana").amount -= Math.min(levelsLeft, customAmount);
        }  
    }
    document.getElementById("mana").innerText = format(getOreAmount("Mana",2));
    updateMysticalRocks()
    updateOreList()
    if (x<=4) {
        updateDrillPower()
        updateProbabilityList() 
    }
    else if (x==6) {
        game.breakingTime = 30 / (game.mysticalRockLevels[5]/5+1);
        updateStoneBreakerSelection()
    }
}

function getMysticalRockMultiplier(x) {
    if (x <= 3) {return game.mysticalRockLevels[x]/2+1;}
    else {return 1;}
    // else {return game.mysticalRockLevels[x+2]/2+1;}
}

function setMysticalRockCustomInput(x) {
    game.mysticalRockCustomInputs[x-1] = Math.max(parseInt(document.getElementsByClassName("mysticalRockCustomInput")[x-1].value), 0);
    document.getElementsByClassName("mysticalRockCustomInput")[x-1].value = game.mysticalRockCustomInputs[x-1];
}