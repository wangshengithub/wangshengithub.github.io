dojo.declare("classes.managers.Achievements", com.nuclearunicorn.core.TabManager, {
    game: null,
    badgesUnlocked: false,

    achievements: [
        {
            name: "theElderLegacy",
            title: $I("achievements.theElderLegacy.title"),
            description: $I("achievements.theElderLegacy.desc"),
            condition: function () {
                var date = new Date();
                return (date.getMonth() == 0 && date.getFullYear() == 2017);
            },
            hidden: true
        },
        {
            name: "unicornConspiracy",
            title: $I("achievements.unicornConspiracy.title"),
            description: $I("achievements.unicornConspiracy.desc"),
            condition: function () {
                return ( this.game.resPool.get("unicorns").value > 0 );
            }
        }, {
            name: "uniception",
            title: $I("achievements.uniception.title"),
            description: $I("achievements.uniception.desc"),
            condition: function () {
                return ( this.game.resPool.get("tears").value > 0 );
            }
        }, {
            name: "sinsOfEmpire",
            title: $I("achievements.sinsOfEmpire.title"),
            description: $I("achievements.sinsOfEmpire.desc"),
            condition: function () {
                return ( this.game.resPool.get("alicorn").value > 0 );
            }
        }, {
            name: "anachronox",
            title: $I("achievements.anachronox.title"),
            description: $I("achievements.anachronox.desc"),
            condition: function () {
                return ( this.game.resPool.get("timeCrystal").value > 0 );
            }
        }, {
            name: "deadSpace",
            title: $I("achievements.deadSpace.title"),
            description: $I("achievements.deadSpace.desc"),
            condition: function () {
                return ( this.game.resPool.get("necrocorn").value > 0 );
            }
        }, {
            name: "ironWill",
            title: $I("achievements.ironWill.title"),
            description: $I("achievements.ironWill.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("mine").val > 0 );
            }
        }, {
            name: "uberkatzhen",
            title: $I("achievements.uberkatzhen.title"),
            description: $I("achievements.uberkatzhen.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("warehouse").val > 0 );
            }
        }, {
            name: "hundredYearsSolitude",
            title: $I("achievements.hundredYearsSolitude.title"),
            description: $I("achievements.hundredYearsSolitude.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("steamworks").val > 0 );
            }
        }, {
            name: "soilUptuned",
            title: $I("achievements.soilUptuned.title"),
            description: $I("achievements.soilUptuned.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("pasture").val >= 45 );
            }
        }, {
            name: "atlasUnmeowed",
            title: $I("achievements.atlasUnmeowed.title"),
            description: $I("achievements.atlasUnmeowed.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("magneto").val > 0 );
            }
        }, {
            name: "meowMeowRevolution",
            title: $I("achievements.meowMeowRevolution.title"),
            description: $I("achievements.meowMeowRevolution.desc"),
            condition: function () {
                return ( this.game.ironWill && !this.game.resPool.get("kittens").value && this.game.bld.get("factory").val > 0 );
            }
        }, {
            name: "spaceOddity",
            title: $I("achievements.spaceOddity.title"),
            description: $I("achievements.spaceOddity.desc"),
            starDescription: $I("achievements.spaceOddity.starDesc"),
            condition: function () {
                return ( this.game.ironWill && this.game.space.getProgram("moonMission").on );
            },
            starCondition: function () {
                return ( this.game.ironWill && this.game.space.getProgram("moonMission").on && this.game.resPool.get("paragon").value < 10);
            },
        }, {
            name: "jupiterAscending",
            title: $I("achievements.jupiterAscending.title"),
            description: $I("achievements.jupiterAscending.desc"),
            condition: function () {
                return ( this.game.space.getProgram("orbitalLaunch").on && this.game.calendar.year <= 1);
            }
        }, {
            name: "shadowOfTheColossus",
            title: $I("achievements.shadowOfTheColossus.title"),
            description: $I("achievements.shadowOfTheColossus.desc"),
            condition: function () {
                return ( this.game.bld.get("ziggurat").val > 0 && this.game.village.maxKittens == 1);
            }
        }, {
            name: "sunGod",
            title: $I("achievements.sunGod.title"),
            description: $I("achievements.sunGod.desc"),
            condition: function () {
                return ( this.game.religion.faith >= 696342 );
            }
        }, {
            name: "heartOfDarkness",
            title: $I("achievements.heartOfDarkness.title"),
            description: $I("achievements.heartOfDarkness.desc"),
            condition: function () {
                return (this.game.resPool.get("zebras").value > 1);
            }
        }, {
            name: "winterIsComing",
            title: $I("achievements.winterIsComing.title"),
            description: $I("achievements.winterIsComing.desc"),
            unethical: true,
            condition: function () {
                return (this.game.deadKittens >= 10);
            }
        }, {
            name: "youMonster",
            title: $I("achievements.youMonster.title"),
            unethical: true,
            description: $I("achievements.youMonster.desc"),
            condition: function () {
                return (this.game.deadKittens >= 100);
            },
            starCondition: function () {
                return (this.game.deadKittens >= 666666);
            }
        }, {
            name: "superUnethicalClimax",
            title: $I("achievements.superUnethicalClimax.title"),
            unethical: true,
            description: $I("achievements.superUnethicalClimax.desc"),
            condition: function () {
                return (this.game.cheatMode);
            }
        }, {
            name: "systemShock",
            title: $I("achievements.systemShock.title"),
            unethical: true,
            description: $I("achievements.systemShock.desc"),
            condition: function () {
                return (this.game.systemShockMode);
            }
        },
        {
            name: "lotusMachine",
            title: $I("achievements.lotusMachine.title"),
            description: $I("achievements.lotusMachine.desc"),
            condition: function () {
                return (this.game.resPool.get("karma").value >= 1);
            }
        }, {
            name: "serenity",
            title: $I("achievements.serenity.title"),
            description: $I("achievements.serenity.desc"),
            condition: function () {
                return (this.game.village.getKittens() >= 50 && this.game.deadKittens == 0);
            }
        },
        {
            name: "utopiaProject",
            title: $I("achievements.utopiaProject.title"),
            description: $I("achievements.utopiaProject.desc"),
            starDescription: $I("achievements.utopiaProject.starDesc"),
            condition: function () {
                return (this.game.village.happiness >= 1.5 && this.game.resPool.get("kittens").value > 35);
            },
            starCondition: function () {
                return (this.game.village.happiness >= 5 && this.game.resPool.get("kittens").value > 35);
            }
        }, {
            name: "deathStranding",
            title: $I("achievements.deathStranding.title"),
            description: $I("achievements.deathStranding.desc"),
            condition: function () {
                return this.game.space.getPlanet("furthestRing").reached;
            }
        }, {
            name: "cathammer",
            title: $I("achievements.cathammer.title"),
            description: $I("achievements.cathammer.desc"),
            starDescription: $I("achievements.cathammer.starDesc"),
            condition: function () {
                return this.game.stats.getStat("totalYears").val >= this.game.calendar.darkFutureBeginning;
            },
            starCondition: function () {
                return (this.game.calendar.trueYear() >= this.game.calendar.darkFutureBeginning);
            }
    }],

    badges: [
        {
            name: "lotus",
            title: "醉生梦死",
            description: "周目数大于50",
            difficulty: "A",
            condition: function(){
                return this.game.stats.getStat("totalResets").val >= 50;
            }
        },
        {
            name: "ivoryTower",
            title: "白色巨塔",
            description: "钢铁无神论中重置",
            difficulty: "S+"
        },
        {
            name: "useless",
            title: "管理有方",
            description: "使用无特质的领袖",
            difficulty: "F",
            condition: function(){
                var leader = this.game.village.leader;
                return leader != null && leader.trait.name == "none";
            }
        },
        {
            name: "beta",
            title: "β测试猿",
            description: "参加过测试模式",
            difficulty: "B",
            condition: function(){
                if (window && window.location && window.location.href){
                    return window.location.href.indexOf("beta") >= 0;
                }
                return false;
            }
        },{
            name: "silentHill",
            title: "静寂岭",
            description: "获取不到服务器信息",
            difficulty: "S",
            condition: function(){
                return (this.game.server.motdContent == "");
            }
        },{
            name: "evergreen",
            title: "木质奖章",
            description: "我想你制作了出一块木材？",
            difficulty: "F"
        },{
            name: "deadSpace",
            title: "死亡空间",
            description: "猫咪在虚空中游荡",
            difficulty: "S",
            condition: function(){
                var kittens = this.game.resPool.get("kittens");
                return (kittens.value >= 1000 && kittens.maxValue == 0);
            }
        },{
            name: "reginaNoctis",
            title: "夜之女王",
            description: "拥有500只猫咪且没有天角兽",
            difficulty: "S",
            condition: function(){
                return (this.game.resPool.get("kittens").value > 500 && this.game.resPool.get("alicorn").value == 0);
            }
        },{
            name: "ghostInTheMachine",
            title: "遇到了BUG",
            description: "♋︎⬧︎⧫︎♏︎❒︎🕯︎⬧︎ ●︎♋︎■︎♑︎◆︎♋︎♑︎♏︎ 🖳︎✆",
            difficulty: "S"
        },{
            name: "abOwo",
            title: "Ab Owo",
            description: "Ab Owo",
            difficulty: "A"
        },{
            name: "cleanPaws",
            title: "粉嫩喵爪",
			//title: "Clean Paws",
            description: "不通过喵喵和平贸易",
			//description: "Peaceful trading without cat-power",
            difficulty: "C"
        },{
            name: "sequenceBreak",
            title: "序列断点",
            description: "在空间标签跳过红月",
            difficulty: "D",
            condition: function(){
                return (!this.game.space.getPlanet("moon").reached && this.game.space.getPlanet("dune").reached);
            }
        }
    ],

    constructor: function (game) {
        this.game = game;
    },

    get: function (name) {
        return this.getMeta(name, this.achievements);
    },

    getBadge: function(name){
        return this.getMeta(name, this.badges);
    },

    unlockBadge: function(name){
        var badge = this.getBadge(name);
        badge.unlocked = true;
        this.game.achievements.badgesUnlocked = true;
    },

    hasUnlocked: function () {
        for (var i = 0; i < this.achievements.length; i++) {
            if (this.achievements[i].unlocked) {
                return true;
            }
        }
        return false;
    },

    update: function () {
        for (var i in this.achievements) {
            var ach = this.achievements[i];
            if (!ach.unlocked && ach.condition && ach.condition.call(this)) {
                ach.unlocked = true;
                this.game.msg($I("achievements.msg.unlock", [ach.title]));
                this.game.achievementTab.visible = true;

            }
            if (!ach.starUnlocked && ach.starCondition && ach.starCondition.call(this)) {
                ach.starUnlocked = true;
                this.game.msg($I("achievements.msg.starUnlock", [ach.title]));
                this.game.achievementTab.visible = true;

            }
        }

        for (var i in this.badges) {
            var badge = this.badges[i];
            if (!badge.unlocked && badge.condition && badge.condition.call(this)) {
                badge.unlocked = true;
                this.badgesUnlocked = true;
            }
        }
    },

	resetState: function(){
		for (var i = 0; i < this.achievements.length; i++){
			var ach = this.achievements[i];
			ach.unlocked = false;
			ach.starUnlocked = false;
		}

        this.badgesUnlocked = false;
        for (var i = 0; i < this.badges.length; i++){
            var badge = this.badges[i];
            badge.unlocked = false;
        }
	},

    save: function (saveData) {
        saveData.achievements = this.filterMetadata(this.achievements, ["name", "unlocked", "starUnlocked"]);
        saveData.ach = {
            badgesUnlocked : this.badgesUnlocked,
            badges: this.filterMetadata(this.badges, ["name", "unlocked"])
        };
    },

    load: function (saveData) {
		this.loadMetadata(this.achievements, saveData.achievements);

        var ach = saveData.ach || {};
        this.badgesUnlocked = ach.badgesUnlocked || false;
        if (ach.badges){
            this.loadMetadata(this.badges, ach.badges);
        }
    },

    unlockAll: function(){
        for (var i in this.achievements){
            this.achievements[i].unlocked = true;
        }
        this.game.msg("All achievements are unlocked");
    }
});

dojo.declare("classes.ui.AchievementsPanel", com.nuclearunicorn.game.ui.Panel, {

	game: null,

	constructor: function(){
	},

    render: function(container){
        var content = this.inherited(arguments);

		var div = dojo.create("div", {}, content);

		div.innerHTML = "";
        var divHeader = dojo.create("div", {className: "achievement-header"}, div);
        var totalAchievements = 0;
        var completedAchievements = 0;
        var completedStars = 0;
        var uncompletedStars = 0;
		for (var i in this.game.achievements.achievements){
			var ach = this.game.achievements.achievements[i];
            if (!ach.unlocked && ach.hidden){
                continue;
            }

            if (!ach.unethical){
                totalAchievements++;
            }

            if (ach.unlocked && !ach.unethical) { completedAchievements++; }
            var className = "achievement";
            if (ach.unlocked && ach.unethical) {className += " unethical";}
            if (ach.unlocked) {className += " unlocked";}
            if (ach.starUnlocked) {className += " starUnlocked";}
			var span = dojo.create("span", {
				className: className,
				title: ach.unlocked ? ach.description : "???",
				innerHTML : ach.unlocked ? ach.title : "???"
			}, div);

			if (ach.starCondition == undefined) {
				continue;
			}

			if (ach.starUnlocked) {
				completedStars++;
			} else {
				uncompletedStars++;
			}
			dojo.create("div", {
				className: "star",
				innerHTML: ach.starUnlocked ? "&#9733;" : "&#9734;",
				title: ach.starUnlocked ? ach.starDescription : "???"
			}, span);
		}
		divHeader.innerHTML = $I("achievements.header", [completedAchievements, totalAchievements]);
		var stars = "";
		for (var i = completedStars; i > 0; --i) {
			stars += "&#9733;";
		}
		for (var i = uncompletedStars; i > 0; --i) {
			stars += "&#9734;";
		}
		dojo.create("span", {
			className: "star",
			innerHTML: stars
		}, divHeader);
	}

});

dojo.declare("classes.ui.BadgesPanel", com.nuclearunicorn.game.ui.Panel, {

	game: null,

	constructor: function(){
	},

    render: function(container){
        var content = this.inherited(arguments);

		var div = dojo.create("div", {}, content);
		div.innerHTML = "";
        var divHeader = dojo.create("div", {className: "achievement-header"}, div);
        var totalBadges = 0;
        var completedBadges = 0;
		for (var i in this.game.achievements.badges){
			var badge = this.game.achievements.badges[i];

            totalBadges++;

            if (badge.unlocked) { completedBadges++; }
            var className = "achievement badge";
            if (badge.unlocked) {className += " unlocked";}
			dojo.create("span", {
				className: className,
				title: badge.unlocked ? badge.description : "???",
				innerHTML : badge.unlocked ? badge.title : "???"
			}, div);
		}
        divHeader.innerHTML = $I("badges.header", [completedBadges, totalBadges]);
	}

});

dojo.declare("com.nuclearunicorn.game.ui.tab.AchTab", com.nuclearunicorn.game.ui.tab, {

    constructor: function(){
    },

	render: function(container){

        this.achievementsPanel = new classes.ui.AchievementsPanel($I("achievements.panel.label"), this.game.achievements);
		this.achievementsPanel.game = this.game;
        this.achievementsPanel.render(container);

        //basges typo intentional cause I keep mistyping it
        this.badgesPanel = new classes.ui.BadgesPanel($I("badges.panel.label"), this.game.achievements);
		this.badgesPanel.game = this.game;
		this.badgesPanel.render(container);

        //---------------------------
        //         Blah
        //---------------------------
        this.container = container;

        this.inherited(arguments);
        this.update();
        //--------------------------
	},

    update: function() {
        this.inherited(arguments);
    }
});
