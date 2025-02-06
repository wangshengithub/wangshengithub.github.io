class Ore {
    constructor(name, tier, amount, isDiscovered, isAlloy) {
        this.name = name;
        this.tier = tier;
        this.amount = amount;
        this.isDiscovered = isDiscovered;
        this.isAlloy = isAlloy;
    }
}

const drillNames = ["Basic drill", "Power drill", "Sky drill", "Heat drill", "Abyssal drill", "Star drill", "Unstable drill", "Void drill"]
const oreTierColours = ["#00aaff", "#22cc22", "#cc7700", "#dd2244", "#bb00cc", "#00dddd", "#ff0000", "#000000"]
const oreTierColoursDark = ["#005588", "#006600", "#884400", "#880022", "#770088", "#008888", "#aa0000", "#000000"]
const drillColours = ["#88ccff", "#99dd99", "#ddbb88", "#dd8899", "#cc77dd", "#88ffff", "#ff8888", "#000000"];
const drillSpeeds = [5, 4, 3.5, 3, 2.5, 2, 1.6, 1.3, 1, 0.8]
const stoneBreakerNames = ["Basic stone breaker", "Power stone breaker", "Sky stone breaker", "Heat stone breaker", "Abyssal stone breaker", "Star stone breaker", "Unstable stone breaker", "Void stone breaker"]
const stoneBreakerSizes = ["Small", "Medium", "Large"]
const illions = ["thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion", "tredecillion", "quattuordecillion", "quindecillion", "sexdecillion", "septendecillion", "octodecillion", "novemdecillion", "vigintillion"]
const illionsShort = ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg"]
const romanNumerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

const ores = [
    ["Stone", 1],
    ["Coal", 1],
    ["Copper", 1],
    ["Tin", 1],
    ["Zinc", 1],
    ["Aluminium", 1],
    ["Iron", 2],
    ["Nickel", 2],
    ["Silver", 2],
    ["Lead", 2],
    ["Pyrite", 2],
    ["Anthracite", 2],
    ["Cobalt", 3],
    ["Gold", 3],
    ["Bismuth", 3],
    ["Cinnabar", 3],
    ["Chromium", 3],
    ["Platinum", 4],
    ["Osmium", 4],
    ["Titanium", 4],
    ["Manganese", 4],
    ["Tungsten", 5],
    ["Iridium", 5],
    ["Palladium", 5],
    ["Uranium", 5],
    ["Plutonium", 5],
    ["Mithril", 6],
    ["Adamantium", 6],
    ["Neptunium", 6],
    ["Promethium", 6],
    ["Vibranium", 6],
    ["Unobtanium", 7],
    ["Naquadah", 7],
    ["Dilithium", 7],
    ["Dark matter", 7],
    ["Neutronium", 8],
    ["Protomatter", 8],
    ["Red matter", 8],
    ["Unavailablium", Infinity],
]
//Maybe: Eighth metal, Nth metal, Element X

const gems = [
    ["Quartz", 1],
    ["Fluorite", 1],
    ["Amber", 1],
    ["Smoky quartz", 2],
    ["Amethyst", 2],
    ["Aquamarine", 2],
    ["Jade", 2],
    ["Topaz", 3],
    ["Onyx", 3],
    ["Opal", 3],
    ["Turquoise", 3],
    ["Garnet", 3],
    ["Emerald", 4],
    ["Sapphire", 4],
    ["Ruby", 4],
    ["Diamond", 5],
    ["Alexandrite", 5],
    ["Moissanite", 5],
    ["Benitoite", 5],
    ["Painite", 6],
]

const alloys = [
    ["Bronze", 1],
    ["Brass", 1],
    ["Steel", 2],
    ["Rose gold", 3],
    ["Electrum", 3],
    ["Titanide", 4],
    ["Carbide", 5],
    ["Trilithium", 7],
    ["Naquadria", 8], //Naquadah + neutronium
]

const alloyCosts = [
    [//Bronze
        ["Coal", 2],
        ["Copper", 4],
        ["Tin", 1],
    ],
    [//Brass
        ["Coal", 3],
        ["Copper", 4],
        ["Zinc", 2],
    ],
    [//Steel
        ["Coal", 10],
        ["Iron", 6],
        ["Anthracite", 1],
    ],
    [//Rose gold
        ["Coal", 5],
        ["Copper", 8],
        ["Gold", 2],
    ],
    [//Electrum
        ["Coal", 5],
        ["Silver", 8],
        ["Gold", 4],
    ],
    [//Titanide
        ["Anthracite", 12],
        ["Titanium", 8],
    ],
    [//Carbide
        ["Anthracite", 10],
        ["Tungsten", 5],
    ]
]

const miningProbabilities = [
    [//Basic drill
        ["Stone", 0.5],
        ["Tin", 0.2],
        ["Copper", 0.15],
        ["Coal", 0.08],
        ["Zinc", 0.05],
        ["Aluminium", 0.02],       
    ],
    [//Power drill
        ["Stone", 0.3],
        ["Iron", 0.15], 
        ["Nickel", 0.12],  
        ["Zinc", 0.1], 
        ["Silver", 0.1],  
        ["Coal", 0.08],  
        ["Aluminium", 0.05],  
        ["Lead", 0.04],  
        ["Anthracite", 0.03],  
        ["Copper", 0.02],  
        ["Pyrite", 0.01], 
    ],
    [//Sky drill
        ["Stone", 0.3],
        ["Cinnabar", 0.15], 
        ["Chromium", 0.12],  
        ["Lead", 0.1], 
        ["Cobalt", 0.08],  
        ["Coal", 0.05],  
        ["Bismuth", 0.05],
        ["Nickel", 0.04],
        ["Silver", 0.04],  
        ["Anthracite", 0.03],  
        ["Pyrite", 0.02],  
        ["Gold", 0.02], 
    ],
    [//Heat drill
        ["Stone", 0.3],
        ["Manganese", 0.15], 
        ["Bismuth", 0.15], 
        ["Titanium", 0.1], 
        ["Silver", 0.08], 
        ["Gold", 0.06], 
        ["Osmium", 0.05], 
        ["Chromium", 0.04], 
        ["Cobalt", 0.03], 
        ["Anthracite", 0.02], 
        ["Platinum", 0.02], 
    ],
    [//Abyssal drill
        ["Stone", 0.3],
        ["Palladium", 0.15], 
        ["Titanium", 0.12], 
        ["Tungsten", 0.1], 
        ["Gold", 0.08], 
        ["Uranium", 0.06], 
        ["Platinum", 0.05], 
        ["Iridium", 0.05], 
        ["Osmium", 0.04], 
        ["Bismuth", 0.03], 
        ["Plutonium", 0.02], 
    ]
]

const drillCosts = [
    [//Basic drill (stand-in)
        ["Tin", 1],
    ],
    [//Power drill
        ["Tin", 100],
        ["Copper", 50],
        ["Bronze", 8],
        ["Brass", 4],
    ],
    [//Sky drill
        ["Copper", 250],
        ["Nickel", 80],
        ["Silver", 50],
        ["Anthracite", 12],
        ["Steel", 6],
    ],
    [//Heat drill
        ["Tin", 7500],
        ["Silver", 500],
        ["Cinnabar", 300],
        ["Bismuth", 75],
        ["Fluorite", 10, 1],
        ["Electrum", 5],
    ],
    [//Abyssal drill
        ["Aluminium", 15000],
        ["Silver", 6000],
        ["Smoky quartz", 75, 1],
        ["Platinum", 60],
        ["Amber", 50, 1],
        ["Electrum", 30],
        ["Mana", 1, 2],
    ],
    [//Star drill
        ["Unavailablium", 1],
    ]
]

const drillPowerCosts = [
    [//Basic drill
        [
            ["Stone", 10],
            ["Zinc", 2],
        ],
        [
            ["Stone", 30],
            ["Copper", 8],
            ["Zinc", 3],
        ],
        [
            ["Stone", 100],
            ["Zinc", 6],
            ["Bronze", 4],
        ],
        [
            ["Zinc", 80],
            ["Nickel", 30],
            ["Bronze", 20],
        ],
        [
            ["Zinc", 200],
            ["Nickel", 60],
            ["Bronze", 60],
            ["Chromium", 10],
        ],
        [
            ["Zinc", 1200],
            ["Bronze", 600],
            ["Nickel", 300],
            ["Chromium", 60],
            ["Electrum", 3],
        ],
        [
            ["Zinc", 4000],
            ["Bronze", 2000],
            ["Nickel", 800],
            ["Chromium", 150],
            ["Electrum", 6],
        ],
        [
            ["Zinc", 8500],
            ["Bronze", 4000],
            ["Nickel", 2500],
            ["Chromium", 400],
            ["Electrum", 15],
        ],
        [
            ["Zinc", 25000],
            ["Bronze", 15000],
            ["Nickel", 5000],
            ["Electrum", 45],
            ["Tungsten", 30],
        ],
        [
            ["Bronze", 30000],
            ["Zinc", 25000],
            ["Nickel", 8000],
            ["Palladium", 100],
            ["Electrum", 60],
            ["Opal", 20, 1],
        ],
        [
            ["Zinc", 150000],
            ["Bronze", 100000],
            ["Nickel", 35000],
            ["Palladium", 180],
            ["Electrum", 180],
            ["Opal", 70, 1],
        ],
        [
            ["Unavailablium", 1],
        ]
    ],
    [//Power drill  
        [
            ["Iron", 10],
            ["Brass", 10],
        ],
        [
            ["Brass", 15],
            ["Steel", 3],
            ["Pyrite", 2],
        ],
        [
            ["Brass", 30],
            ["Cinnabar", 15],
            ["Steel", 8],
            ["Pyrite", 8],
            ["Gold", 1],
        ],
        [
            ["Brass", 200],
            ["Cinnabar", 80],
            ["Pyrite", 40],
            ["Steel", 30],
            ["Rose gold", 4],
        ],
        [
            ["Brass", 1000],
            ["Cinnabar", 220],
            ["Steel", 120],
            ["Pyrite", 100],
            ["Rose gold", 15],
        ],
        [
            ["Brass", 3000],
            ["Cinnabar", 700],
            ["Steel", 350],
            ["Pyrite", 300],
            ["Aquamarine", 15, 1],
        ],
        [
            ["Brass", 30000],
            ["Cinnabar", 1200],
            ["Pyrite", 1000],
            ["Aquamarine", 50, 1],
            ["Turquoise", 20, 1],
        ],
        [
            ["Brass", 80000],
            ["Cinnabar", 3500],
            ["Pyrite", 3000],
            ["Aquamarine", 150, 1],
            ["Turquoise", 60, 1],
        ],
        [
            ["Unavailablium", 1],
        ],
    ],
    [//Sky drill
        [
            ["Nickel", 100],
            ["Cobalt", 20],
            ["Bismuth", 10],
            ["Fluorite", 2, 1],
        ],
        [
            ["Nickel", 300],
            ["Cobalt", 60],
            ["Bismuth", 25],
            ["Fluorite", 10, 1],
        ],
        [
            ["Nickel", 800],
            ["Cobalt", 120],
            ["Bismuth", 100],
            ["Fluorite", 15, 1],
            ["Titanide", 10],
        ],
        [
            ["Nickel", 1800],
            ["Bismuth", 300],
            ["Smoky quartz", 50, 1],
            ["Fluorite", 40, 1],
            ["Titanide", 20],
        ],
        [
            ["Nickel", 7500],
            ["Bismuth", 550],
            ["Smoky quartz", 85, 1],
            ["Garnet", 50, 1],
            ["Plutonium", 15],
        ],
        [
            ["Nickel", 22000],
            ["Bismuth", 1600],
            ["Smoky quartz", 250, 1],
            ["Garnet", 150, 1],
            ["Plutonium", 25],
        ],
        [
            ["Unavailablium", 1],
        ],
    ],
    [//Heat drill
        [
            ["Cobalt", 180],
            ["Steel", 100],
            ["Manganese", 30],
            ["Quartz", 5, 1],
        ],
        [
            ["Steel", 400],
            ["Cobalt", 350],
            ["Manganese", 175],
            ["Quartz", 30, 1],
            ["Jade", 15, 1],
        ],
        [
            ["Steel", 1000],
            ["Cobalt", 600],
            ["Manganese", 220],
            ["Iridium", 25],
            ["Jade", 25, 1],
        ],
        [
            ["Steel", 3000],
            ["Cobalt", 1800],
            ["Manganese", 600],
            ["Iridium", 90],
            ["Jade", 70, 1],
        ],
        [
            ["Unavailablium", 1],
        ],
    ],
    [//Abyssal drill
        [
            ["Osmium", 120],
            ["Palladium", 60],
            ["Aquamarine", 50, 1],
            ["Carbide", 4],
        ],
        [
            ["Osmium", 300],
            ["Aquamarine", 150, 1],
            ["Palladium", 80],
            ["Carbide", 10],
        ],
        [
            ["Unavailablium", 1],
        ],
    ]
]

const drillSpeedCosts = [
    [//Basic drill
        [
            ["Tin", 3],
            ["Copper", 2],
        ],
        [
            ["Tin", 20],
            ["Copper", 15],
            ["Aluminium", 1],
        ],
        [
            ["Tin", 60],
            ["Copper", 10],
            ["Aluminium", 5],
            ["Brass", 2],
        ],
        [
            ["Tin", 350],
            ["Aluminium", 40],
            ["Lead", 12],
            ["Brass", 15],
        ],
        [
            ["Tin", 2000],
            ["Aluminium", 200],
            ["Lead", 50],
            ["Brass", 40],
            ["Chromium", 25],
        ],
        [
            ["Tin", 4000],
            ["Aluminium", 400],
            ["Silver", 250],
            ["Brass", 80],
            ["Bismuth", 30],
        ],
        [
            ["Tin", 10000],
            ["Aluminium", 2000],
            ["Silver", 800],
            ["Brass", 750],
            ["Bismuth", 150],
        ],
        [
            ["Tin", 35000],
            ["Aluminium", 4000],
            ["Silver", 2500],
            ["Brass", 2500],
            ["Bismuth", 400],
        ],
        [
            ["Tin", 200000],
            ["Aluminium", 15000],
            ["Silver", 7500],
            ["Anthracite", 2500],
            ["Topaz", 45, 1],
        ],
        [
            ["Tin", 600000],
            ["Aluminium", 45000],
            ["Silver", 22000],
            ["Anthracite", 8000],
            ["Topaz", 100, 1],
        ],
        [
            ["Unavailablium", 1],
        ]
    ],
    [//Power drill  
        [
            ["Aluminium", 30],
            ["Lead", 4],
        ],
        [
            ["Aluminium", 45],
            ["Lead", 6],
            ["Steel", 5],
        ],
        [
            ["Aluminium", 100],
            ["Lead", 40],
            ["Cobalt", 25],
            ["Steel", 12],
            ["Amber", 2, 1],
        ],
        [
            ["Aluminium", 300],
            ["Lead", 150],
            ["Cobalt", 50],
            ["Steel", 30],
            ["Amber", 12, 1],
        ],
        [
            ["Aluminium", 2000],
            ["Lead", 300],
            ["Cobalt", 150],
            ["Steel", 200],
            ["Amber", 25, 1],
        ],
        [
            ["Aluminium", 4000],
            ["Lead", 800],
            ["Cobalt", 300],
            ["Amber", 40, 1],
            ["Aquamarine", 30, 1],
        ],
        [
            ["Aluminium", 25000],
            ["Lead", 3500],
            ["Cobalt", 1000],
            ["Onyx", 40, 1],
            ["Amber", 35, 1],
        ],
        [
            ["Aluminium", 75000],
            ["Lead", 10000],
            ["Cobalt", 3000],
            ["Onyx", 120, 1],
            ["Amber", 100, 1],
        ],
        [
            ["Unavailablium", 1],
        ],
    ],
    [//Sky drill
        [
            ["Iron", 80],
            ["Chromium", 20],
            ["Rose gold", 3],
            ["Quartz", 1, 1],
        ],
        [
            ["Steel", 75],
            ["Chromium", 75],
            ["Rose gold", 5],
            ["Quartz", 5, 1],
        ],
        [
            ["Chromium", 300],
            ["Manganese", 75],
            ["Osmium", 30],
            ["Rose gold", 10],
            ["Quartz", 4, 1],
        ],
        [
            ["Chromium", 500],
            ["Manganese", 150],
            ["Osmium", 80],
            ["Rose gold", 30],
            ["Amethyst", 15, 1],
        ],
        [
            ["Chromium", 1800],
            ["Osmium", 120],
            ["Rose gold", 100],
            ["Amethyst", 20, 1],
            ["Opal", 20, 1],
        ],
        [
            ["Chromium", 5500],
            ["Osmium", 350],
            ["Rose gold", 300],
            ["Amethyst", 60, 1],
            ["Opal", 60, 1],
        ],
        [
            ["Unavailablium", 1],
        ],
    ],
    [//Heat drill
        [
            ["Cinnabar", 150],
            ["Titanium", 15],
            ["Amber", 15, 1],
            ["Rose gold", 10],
            ["Osmium", 8],
        ],
        [
            ["Cinnabar", 500],
            ["Rose gold", 30],
            ["Amber", 25, 1],
            ["Osmium", 25],
            ["Titanide", 20],
        ],
        [
            ["Cinnabar", 1500],
            ["Rose gold", 75],
            ["Osmium", 60],
            ["Topaz", 45, 1],
            ["Uranium", 30],
        ],
        [
            ["Cinnabar", 4500],
            ["Rose gold", 200],
            ["Osmium", 160],
            ["Topaz", 150, 1],
            ["Uranium", 60],
        ],
        [
            ["Unavailablium", 1],
        ],
    ],
    [//Abyssal drill
        [
            ["Quartz", 40, 1],
            ["Uranium", 30],
            ["Titanide", 20],
            ["Plutonium", 10],
        ],
        [
            ["Quartz", 120, 1],
            ["Uranium", 60],
            ["Titanide", 50],
            ["Plutonium", 15],
        ],
        [
            ["Unavailablium", 1],
        ],
    ]
]

const smelteryUpgradeCosts = [
    [
        ["Stone", 500],
        ["Coal", 50],
        ["Bronze", 15],
        ["Silver", 15],
    ],
    [
        ["Stone", 1500],
        ["Coal", 300],
        ["Silver", 80],
        ["Cinnabar", 35],
        ["Amber", 2, 1],
    ],
    [
        ["Stone", 8000],
        ["Coal", 5000],
        ["Pyrite", 85],
        ["Manganese", 50],
        ["Platinum", 8],
        ["Electrum", 5],
    ],
    [
        ["Stone", 75000],
        ["Coal", 50000],
        ["Iron", 6000],
        ["Anthracite", 1000],
        ["Manganese", 200],
        ["Iridium", 15],
    ],
    [
        ["Stone", 350000],
        ["Coal", 50000],
        ["Iron", 25000],
        ["Manganese", 1000],
        ["Carbide", 20],
    ],
    [
        ["Unavailablium", 1],
    ]
]

const maxSmeltingAmounts = [
    [1, 1, 1, 1, 1, 1, 1], //Tier 1
    [3, 3, 1, 1, 1, 1, 1], //Tier 2
    [25, 25, 3, 1, 1, 1, 1], //Tier 3
    [200, 200, 25, 3, 3, 1, 1], //Tier 4
    [10000, 10000, 200, 25, 25, 3, 1], //Tier 5
    [50000, 50000, 10000, 200, 200, 25, 3], //Tier 6
]

const gemFindingProbabilities = [
    [//Basic stone breaker
        ["Amber", 0.3],
        ["Fluorite", 0.2],
        ["Quartz", 0.12],
    ],
    [//Power stone breaker
        ["Amber", 0.1],
        ["Fluorite", 0.08],
        ["Quartz", 0.06],
        ["Smoky quartz", 0.4],
        ["Aquamarine", 0.25],
        ["Amethyst", 0.15],
        ["Jade", 0.08],
    ],
    [//Sky stone breaker
        ["Smoky quartz", 0.12],
        ["Aquamarine", 0.09],
        ["Amethyst", 0.06],
        ["Jade", 0.04],
        ["Topaz", 0.45],
        ["Garnet", 0.3],
        ["Onyx", 0.16],
        ["Opal", 0.12],
        ["Turquoise", 0.08],
    ]
]

const stoneBreakerCosts = [
    [//Basic stone breaker (stand-in)
        ["Tin", 1],
    ],
    [//Power stone breaker
        ["Copper", 12000],
        ["Lead", 1200],
        ["Chromium", 120],
        ["Platinum", 12],
    ],
    [//Sky stone breaker
        ["Tin", 250000],
        ["Lead", 3000],
        ["Bismuth", 750],
        ["Amethyst", 35, 1],
        ["Carbide", 12],
    ],
    [//Heat stone breaker
        ["Unavailablium", 1],
    ]
]