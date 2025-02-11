
function big(n) { return new Decimal(n); }

const TICK_INTERVAL = 50;
const LOCAL_SAVE_INTERVAL = 1000;
const MARKET_TICK_INTERVAL = 5000;
const CITY_GROWTH_PER_TICK = 1.0005;

const ASCENSION_REQS = {
  "metal": big(1e9),
  "coal": big(1.69e8),
  "oil": big(6.9e7),
  "electronics": big(1.2e8),
  "uranium": big(4.2e6),
  "energy": big(1.21e8),
  "population": big(1e6)
};

class Player {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.last_ts = Date.now();
    this.last_market_ts = Date.now();
    this.progression = {};
    this.energy = big(0);
    this.money = big(0);
    this.crank_progress = 0;
    this.crank_active = false;
    this.energy_for_sell = "0";
    this.resources_for_buy = "0";
    this.energy_for_send = "0";
    this.selected_resource = "metal";
    this.city_energy = big(0);
    this.pollution = big(0);
    
    this.metal = big(0);
    this.coal = big(0);
    this.oil = big(0);
    this.electronics = big(0);
    this.uranium = big(0);
    
    this.metal_price = big(10);
    this.coal_price = big(12);
    this.oil_price = big(8);
    this.electronics_price = big(600);
    this.uranium_price = big(10000);
    
    this.research = big(0);
    
    this.wind_category = 0;
    this.water = big(0);
    this.water_works = false;
    this.cloud_category = 0;
    this.earth_temperature = 120;
    this.earth_trend = 0;
    
    this.plants_working = {
      "coal": true,
      "oil": true,
      "nuclear": true,
    };
    
    this.bought = {
      "metal": big(0),
      "coal": big(0),
      "oil": big(0),
      "electronics": big(0),
      "uranium": big(0),
    };
    
    this.market_history = {
      "metal": [],
      "coal": [],
      "oil": [],
      "electronics": [],
      "uranium": []
    };
    
    this.population = 0;
    this.polution = 0;
    
    this.engineers = {
      "free": 0,
      "coal": 0,
      "oil": 0,
      "uranium": 0,
      "energy": 0,
      "laboratory": 0,
      "coal_plant": 0,
      "oil_plant": 0,
      "nuclear_plant": 0,
      "battery": 0,
      "accumulator": 0,
      "substation": 0,
      "wind_turbine": 0,
      "water_dam": 0,
      "solar_panel": 0,
      "geothermal": 0
    };
    
    this.smart_autobuy = false;
    
    this.upgrades = {
      "upg-crank1": new Upgrade("upg-crank1", -1, (amt)=>{return big(2).pow(amt).mul(5).round()}, "money", ()=>{return player.progression[1] === true}, (amt)=>{return big(amt+1)}),
      "upg-crank2": new Upgrade("upg-crank2", -1, (amt)=>{return big(2).pow(amt).mul(5).round()}, "money", ()=>{return player.progression[1] === true}, (amt)=>{return big(0.8).pow(amt).mul(5000)}),
      
      "upg-u1": new Upgrade("upg-u1", 1, (amt)=>{return big(25)}, "money", ()=>{return player.progression[3] === true}, (amt)=>{return big(1)}),
      "upg-u2": new Upgrade("upg-u2", 1, (amt)=>{return big(50)}, "money", ()=>{return player.progression[3] === true}, (amt)=>{return big(40)}),
      "upg-u3": new Upgrade("upg-u3", 1, (amt)=>{return big(150)}, "money", ()=>{return player.progression[3] === true}, (amt)=>{return big(1)}),
      "upg-u4": new Upgrade("upg-u4", 1, (amt)=>{return big(500)}, "money", ()=>{return player.progression[3] === true}, (amt)=>{return big(2)}),
      "upg-u5": new Upgrade("upg-u5", 1, (amt)=>{return big(1500)}, "money", ()=>{return player.progression[4] === true}, (amt)=>{return big(1)}),
      "upg-u6": new Upgrade("upg-u6", 1, (amt)=>{return big(4000)}, "money", ()=>{return player.progression[4] === true}, (amt)=>{return big(1450)}),
      "upg-u7": new Upgrade("upg-u7", 1, (amt)=>{return big(10000)}, "money", ()=>{return player.progression[5] === true}, (amt)=>{return big(1)}),
      "upg-u8": new Upgrade("upg-u8", 1, (amt)=>{return big(15000)}, "money", ()=>{return player.progression[5] === true}, energy_overflow_selling_percent),
      "upg-u9": new Upgrade("upg-u9", 1, (amt)=>{return big(30000)}, "money", ()=>{return player.progression[6] === true}, (amt)=>{return big(1)}),
      "upg-u10": new Upgrade("upg-u10", 1, (amt)=>{return big(50000)}, "money", ()=>{return player.progression[6] === true}, (amt)=>{return big(1)}),
      
      "battery": new Upgrade("battery", -1, (amt)=>{return big(1.35).pow(amt).mul(100).round()}, "money", ()=>{return player.progression[4] === true}, battery_storage),
      "accumulator": new Upgrade("accumulator", -1, (amt)=>{return big(1.3).pow(amt).mul(100).round()}, "metal", ()=>{return player.progression[5] === true}, accumulator_storage),
      "substation": new Upgrade("substation", -1, (amt)=>{return big(1.25).pow(amt).mul(200).round()}, "electronics", ()=>{return player.upgrades['res-storage4'].is_active()}, substation_storage),
      
      "coal_plant": new Upgrade("coal_plant", -1, (amt)=>{return big(1.35).pow(amt).mul(100).round()}, "metal", ()=>{return player.progression[5] === true}, coal_pp_power),
      "oil_plant": new Upgrade("oil_plant", -1, (amt)=>{return big(1.3).pow(amt).mul(1000).round()}, "metal", ()=>{return player.progression[9] === true}, oil_pp_power), // also, i'll do market decay ok? Ok, but it shouldn't be too fast (/2 in an hour, maybe?) i'll make it /3 to /4 in an hour ( prices get lower)
      "nuclear_plant": new Upgrade("nuclear_plant", -1, (amt)=>{return big(1.25).pow(amt).mul(2000).round()}, "electronics", ()=>{return player.progression[14] === true}, nuclear_pp_power), // did not copy effect upgrades
      
      "wind_turbine": new Upgrade("wind_turbine", -1, (amt)=>{return big(1.2).pow(amt).mul(15000).round()}, "metal", ()=>{return player.progression[16] === true}, (amt)=>{return wind_limit_min().add(wind_limit_max().sub(wind_limit_min()).mul(wind_classification(player.wind_category)[0]));}),
      "water_dam": new Upgrade("water_dam", -1, (amt)=>{return big(1.2).pow(amt).mul(100000).round()}, "metal", ()=>{return player.upgrades['res-alternate2'].is_active()}, water_power),
      "solar_panel": new Upgrade("solar_panel", -1, (amt)=>{return big(1.2).pow(amt).mul(100000).round()}, "electronics", ()=>{return player.upgrades['res-alternate4'].is_active()}, (amt)=>{return solar_limit().mul(solar_time_capped_coefficient(player.cloud_category))}),
      "geothermal": new Upgrade("geothermal", -1, (amt)=>{return big(1.2).pow(amt).mul(400000).round()}, "electronics", ()=>{return player.upgrades['res-alternate5'].is_active()}, earth_power),
      
      "engineer": new Upgrade("engineer", -1, engineer_price, "money", ()=>{return player.progression[6] === true}, (amt)=>{return big(1)}, ()=>{return true;}, (amt)=>{player.engineers['free'] += 1}),
      
      "laboratory": new Upgrade("laboratory", -1, (amt)=>{return big(4).pow(amt).mul(1000).round()}, "metal", ()=>{return player.progression[8] === true}, lab_effectiveness),
    
      "res-1": new Upgrade("res-1", 1, (amt)=>{return big(25)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(30)}),
      "res-2": new Upgrade("res-2", 1, (amt)=>{return big(50)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(0.1)}),
      "res-3": new Upgrade("res-3", 1, (amt)=>{return big(100)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(10)}),
      "res-smart": new Upgrade("res-smart", 1, (amt)=>{return big(150)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(1)}),
      "res-4": new Upgrade("res-4", 1, (amt)=>{return big(200)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(1)}),
      "res-5": new Upgrade("res-5", 1, (amt)=>{return big(250)}, "research", ()=>{return player.upgrades['upg-u8'].is_active() && player.progression[8] === true}, (amt)=>{return big(30)}),
      "res-6": new Upgrade("res-6", 1, (amt)=>{return big(300)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(50)}),
      "res-7": new Upgrade("res-7", 1, (amt)=>{return big(350)}, "research", ()=>{return player.progression[9] === true && player.progression[10] === true}, (amt)=>{return big(50)}),
      "res-8": new Upgrade("res-8", 1, (amt)=>{return big(400)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(10)}),
      "res-9": new Upgrade("res-9", 1, (amt)=>{return big(500)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(100)}),
      "res-17": new Upgrade("res-17", 1, (amt)=>{return big(600)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(1)}),
      "res-10": new Upgrade("res-10", 1, (amt)=>{return big(750)}, "research", ()=>{return player.upgrades['res-5'].is_active() && player.progression[8] === true}, (amt)=>{return big(50)}),
      "res-11": new Upgrade("res-11", 1, (amt)=>{return big(1000)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(1)}),
      "res-12": new Upgrade("res-12", 1, (amt)=>{return big(1500)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(20)}),
      "res-lab3": new Upgrade("res-lab3", 1, (amt)=>{return big(2500)}, "research", ()=>{return player.progression[13] === true}, (amt)=>{return big(1)}),
      "res-14": new Upgrade("res-14", 1, (amt)=>{return big(4000)}, "research", ()=>{return player.progression[13] === true}, (amt)=>{return big(1)}),
      "res-storage3": new Upgrade("res-storage3", 1, (amt)=>{return big(5000)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(10)}),
      "res-16": new Upgrade("res-16", 1, (amt)=>{return big(8000)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(10)}),
      "res-autosell3": new Upgrade("res-autosell3", 1, (amt)=>{return big(10000)}, "research", ()=>{return player.upgrades['res-10'].is_active() && player.progression[8] === true}, (amt)=>{return big(70)}),
      "res-savings2": new Upgrade("res-savings2", 1, (amt)=>{return big(12000)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(25)}),
      "res-15": new Upgrade("res-15", 1, (amt)=>{return big(15000)}, "research", ()=>{return player.progression[14] === true}, (amt)=>{return big(375)}),
      "res-lab4": new Upgrade("res-lab4", 1, (amt)=>{return big(20000)}, "research", ()=>{return player.progression[13] === true}, (amt)=>{return big(50)}),
      "res-scale2": new Upgrade("res-scale2", 1, (amt)=>{return big(25000)}, "research", ()=>{return player.progression[9] === true}, (amt)=>{return big(10)}),
      "res-autosell4": new Upgrade("res-autosell4", 1, (amt)=>{return big(35000)}, "research", ()=>{return player.upgrades['res-autosell3'].is_active() && player.progression[13] === true}, (amt)=>{return big(90)}),
      "res-18": new Upgrade("res-18", 1, (amt)=>{return big(40000)}, "research", ()=>{return player.upgrades['res-15'].amt > 0}, (amt)=>{return big(725)}),
      "res-13": new Upgrade("res-13", 1, (amt)=>{return big(45000)}, "research", ()=>{return player.progression[9] === true && player.progression[12] === true && player.upgrades['res-7'].amt > 0}, (amt)=>{return big(50)}),
      "res-storage4": new Upgrade("res-storage4", 1, (amt)=>{return big(50000)}, "research", ()=>{return player.progression[13] === true}, (amt)=>{return big(10)}),
      "res-lab5": new Upgrade("res-lab5", 1, (amt)=>{return big(75000)}, "research", ()=>{return player.progression[13] === true}, (amt)=>{return big(1.5)}),
      "res-savings3": new Upgrade("res-savings3", 1, (amt)=>{return big(200000)}, "research", ()=>{return player.progression[13] === true}, (amt)=>{return big(30)}),
      "res-scale3": new Upgrade("res-scale3", 1, (amt)=>{return big(400000)}, "research", ()=>{return player.progression[14] === true}, (amt)=>{return big(10)}),
      "res-storage5": new Upgrade("res-storage5", 1, (amt)=>{return big(600000)}, "research", ()=>{return player.upgrades['res-storage4'].is_active() && player.progression[13] === true}, (amt)=>{return big(10)}),
      "res-savings4": new Upgrade("res-savings4", 1, (amt)=>{return big(800000)}, "research", ()=>{return player.progression[13] === true}, (amt)=>{return big(50)}),
      "res-alternate1": new Upgrade("res-alternate1", 1, (amt)=>{return big(1e6)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(1)}),
      "res-alternate2": new Upgrade("res-alternate2", 1, (amt)=>{return big(3e6)}, "research", ()=>{return player.progression[8] === true}, (amt)=>{return big(1)}),
      "res-lab6": new Upgrade("res-lab6", 1, (amt)=>{return big(4.5e6)}, "research", ()=>{return player.progression[13] === true}, (amt)=>{return big(30)}),
      "res-wind1": new Upgrade("res-wind1", 1, (amt)=>{return big(6e6)}, "research", ()=>{return player.upgrades['res-alternate1'].is_active()}, (amt)=>{return big(10)}),
      "res-alternate3": new Upgrade("res-alternate3", 1, (amt)=>{return big(1e7)}, "research", ()=>{return player.progression[16] === true}, (amt)=>{return big(1)}),
      "res-water1": new Upgrade("res-water1", 1, (amt)=>{return big(1.5e7)}, "research", ()=>{return player.upgrades['res-alternate2'].is_active()}, (amt)=>{return big(50)}),
      "res-storage6": new Upgrade("res-storage6", 1, (amt)=>{return big(2.5e7)}, "research", ()=>{return player.progression[13] === true}, (amt)=>{return big(9)}),
      "res-wind2": new Upgrade("res-wind2", 1, (amt)=>{return big(3.2e7)}, "research", ()=>{return player.upgrades['res-alternate1'].is_active()}, (amt)=>{return big(1)}),
      "res-water2": new Upgrade("res-water2", 1, (amt)=>{return big(4e7)}, "research", ()=>{return player.upgrades['res-alternate3'].is_active()}, (amt)=>{return big(1)}),
      "res-alternate4": new Upgrade("res-alternate4", 1, (amt)=>{return big(6e7)}, "research", ()=>{return player.progression[13] === true}, (amt)=>{return big(1)}),
      "res-wind3": new Upgrade("res-wind3", 1, (amt)=>{return big(9e7)}, "research", ()=>{return player.upgrades['res-alternate1'].is_active()}, (amt)=>{return big(3)}),
      "res-alternate5": new Upgrade("res-alternate5", 1, (amt)=>{return big(1e8)}, "research", ()=>{return player.progression[13] === true}, (amt)=>{return big(1)}),
      "res-water3": new Upgrade("res-water3", 1, (amt)=>{return big(1.2e8)}, "research", ()=>{return player.upgrades['res-alternate2'].is_active()}, (amt)=>{return big(40)}),
      "res-wind4": new Upgrade("res-wind4", 1, (amt)=>{return big(1.5e8)}, "research", ()=>{return player.upgrades['res-alternate1'].is_active()}, (amt)=>{return big(10)}),
      "res-solar1": new Upgrade("res-solar1", 1, (amt)=>{return big(1.8e8)}, "research", ()=>{return player.upgrades['res-alternate4'].is_active()}, (amt)=>{return big(150)}),
      "res-alternate6": new Upgrade("res-alternate6", 1, (amt)=>{return big(2e8)}, "research", ()=>{return player.upgrades['res-alternate2'].is_active()}, (amt)=>{return big(1)}),
      "res-geo1": new Upgrade("res-geo1", 1, (amt)=>{return big(2.5e8)}, "research", ()=>{return player.upgrades['res-alternate5'].is_active()}, (amt)=>{return big(90)}),
      "res-water4": new Upgrade("res-water4", 1, (amt)=>{return big(3e8)}, "research", ()=>{return player.upgrades['res-alternate2'].is_active()}, (amt)=>{return big(10)}),
      "res-solar2": new Upgrade("res-solar2", 1, (amt)=>{return big(4.5e8)}, "research", ()=>{return player.upgrades['res-alternate4'].is_active()}, (amt)=>{return big(20)}),
      "res-geo2": new Upgrade("res-geo2", 1, (amt)=>{return big(6e8)}, "research", ()=>{return player.upgrades['res-alternate5'].is_active()}, (amt)=>{return big(20)}),
      "res-ascend": new Upgrade("res-ascend", 1, (amt)=>{return big(1e10)}, "research", ()=>{return player.progression[8] === true && player.progression[9] === true && player.progression[13] === true && player.progression[14] === true}, (amt)=>{return big(1)}),
    };
  }
}

var player = new Player();

var last_local_save = -1;

function loop() {
  let current_ts = Date.now();
  
  // allow fixing fields
  player.energy_for_sell = document.getElementById("selling_stack").value;
  player.resources_for_buy = document.getElementById("buying_stack").value;
  player.energy_for_send = document.getElementById("sending_stack").value;
  
  if (last_local_save < current_ts - LOCAL_SAVE_INTERVAL) {
    if (last_local_save == -1) load_local();
    save_local();
    last_local_save = current_ts;
  }
  
  if (player.last_market_ts < current_ts - MARKET_TICK_INTERVAL) {
    for (let key of Object.keys(player.bought)) {
      market_tick(key);
    }
    player.last_market_ts = current_ts;
  }
  
  let delta = Math.max(0, current_ts - player.last_ts);
  player.last_ts = current_ts;
  
  // crank
  let crank_interval = player.upgrades["upg-crank2"].get_effect().toNumber();
  let energy_per_crank = crank_power();
  if (player.crank_active) {
    // fast track to reduce jittering
    if (crank_interval <= 100 && player.upgrades['upg-u1'].is_active()) {
      player.energy = player.energy.add(energy_per_crank.mul(delta / crank_interval));
    }
    else {
      player.crank_progress += delta / crank_interval;
      if (player.crank_progress >= 1) {
        if (!player.upgrades['upg-u1'].is_active()) {
          player.crank_progress = 0;
          player.crank_active = false;
          player.energy = player.energy.add(energy_per_crank);
        }
        else {
          player.energy = player.energy.add(energy_per_crank.mul(Math.floor(player.crank_progress)));
          player.crank_progress -= Math.floor(player.crank_progress);
        }
      }
    }
  }
  if (crank_interval > 100) document.getElementById("crank_progress").style.right = ((1 - player.crank_progress) * 100) + "%";
  else document.getElementById("crank_progress").style.right = "0%";
  
  document.getElementById("crank_income").textContent = format_number(energy_per_crank);
  if (crank_interval > 100) document.getElementById("crank_progress_left").textContent = format_number((1 - player.crank_progress) * crank_interval / 1000, true) + " s";
  else document.getElementById("crank_progress_left").textContent = format_number(1000 / crank_interval) + "/s";
  
  // resources
  let elements = document.getElementsByClassName("resource-data");
  for (let i = 0; i < elements.length; i++) {
    elements.item(i).disabled = false;
  }
  if (document.getElementById("resource_" + player.selected_resource) !== null) document.getElementById("resource_" + player.selected_resource).disabled = true;
  
  document.getElementById("current_resource_price").textContent = format_number(player[player.selected_resource + "_price"], true);
  
  // market candles
  if (player.market_history[player.selected_resource].length >= 30) {
    let min_price = Infinity;
    let max_price = 0;
    for (let i = 0; i < 30; i++) {
      min_price = Math.min(min_price, 0.9 * player.market_history[player.selected_resource][i]);
      max_price = Math.max(max_price, 1.1 * player.market_history[player.selected_resource][i]);
    }
    for (let i = 0; i < 29; i++) {
      document.getElementById("candle_" + i).style.height = Math.abs(player.market_history[player.selected_resource][i + 1] - player.market_history[player.selected_resource][i]) * 100 / (max_price - min_price) + "%";
      document.getElementById("candle_" + i).style.top = (max_price - Math.max(player.market_history[player.selected_resource][i + 1], player.market_history[player.selected_resource][i])) * 100 / (max_price - min_price) + "%";
      if (player.market_history[player.selected_resource][i + 1] > player.market_history[player.selected_resource][i]) document.getElementById("candle_" + i).style.backgroundColor = "var(--color-stonks)";
      else document.getElementById("candle_" + i).style.backgroundColor = "var(--color-shorts)";
    }
  }
  
  // resource buying
  let buying_resources = resources_for_buy();
  document.getElementById("money_from_buying_stack").textContent = format_number(buying_resources.mul(player[player.selected_resource + "_price"]));
  
  // plants
  document.getElementById("coal_pp_consumption").textContent = format_number(coal_pp_requirements());
  if (player.plants_working['coal']) {
    if (player.engineers['coal'] > 0) {
      let profitability = player.upgrades['coal_plant'].get_effect().mul(energy_cost()).sub(coal_pp_requirements().mul(player["coal_price"]));
      if (!player.smart_autobuy || profitability.gt(0)) {
        let required = coal_pp_requirements().mul(delta / 1000 * player.upgrades['coal_plant'].amt);
        if (required.gt(player.coal)) {
          let can_buy = player.money.div(player["coal_price"]).min(required.sub(player.coal));
          buy_resource("coal", can_buy);
        }
      }
    }
    let productive_delta = player.coal.div(coal_pp_requirements()).min(delta / 1000 * player.upgrades['coal_plant'].amt).toNumber();
    player.coal = player.coal.sub(coal_pp_requirements().mul(productive_delta)).max(0);
    player.energy = player.energy.add(player.upgrades['coal_plant'].get_effect().mul(productive_delta));
  }
  
  document.getElementById("oil_pp_consumption").textContent = format_number(oil_pp_requirements());
  if (player.plants_working['oil']) {
    if (player.engineers['oil'] > 0) {
      let profitability = player.upgrades['oil_plant'].get_effect().mul(energy_cost()).sub(oil_pp_requirements().mul(player["oil_price"]));
      if (!player.smart_autobuy || profitability.gt(0)) {
        let required = oil_pp_requirements().mul(delta / 1000 * player.upgrades['oil_plant'].amt);
        if (required.gt(player.oil)) {
          let can_buy = player.money.div(player["oil_price"]).min(required.sub(player.oil));
          buy_resource("oil", can_buy);
        }
      }
    }
    let productive_delta = player.oil.div(oil_pp_requirements()).min(delta / 1000 * player.upgrades['oil_plant'].amt).toNumber();
    player.oil = player.oil.sub(oil_pp_requirements().mul(productive_delta)).max(0);
    player.energy = player.energy.add(player.upgrades['oil_plant'].get_effect().mul(productive_delta));
  }
  
  document.getElementById("nuclear_pp_consumption").textContent = format_number(nuclear_pp_requirements());
  if (player.plants_working['nuclear']) {
    if (player.engineers['uranium'] > 0) {
      let profitability = player.upgrades['nuclear_plant'].get_effect().mul(energy_cost()).sub(nuclear_pp_requirements().mul(player["uranium_price"]));
      if (!player.smart_autobuy || profitability.gt(0)) {
        let required = nuclear_pp_requirements().mul(delta / 1000 * player.upgrades['nuclear_plant'].amt);
        if (required.gt(player.uranium)) {
          let can_buy = player.money.div(player["uranium_price"]).min(required.sub(player.uranium));
          buy_resource("uranium", can_buy);
        }
      }
    }
    let productive_delta = player.uranium.div(nuclear_pp_requirements()).min(delta / 1000 * player.upgrades['nuclear_plant'].amt).toNumber();
    player.uranium = player.uranium.sub(nuclear_pp_requirements().mul(productive_delta)).max(0);
    player.energy = player.energy.add(player.upgrades['nuclear_plant'].get_effect().mul(productive_delta));
  }
  
  // alternate plants and their quirks
  
  // -- wind
  // one change in ~minute = 60k ms
  if (Math.random() < delta / 60000) {
    if (player.wind_category == 0) player.wind_category = 1;
    else if (player.wind_category == 5) player.wind_category = 4;
    else if (Math.random() < 0.5) player.wind_category -= 1;
    else player.wind_category += 1;
  }
  document.getElementById("wind_status").textContent = wind_classification(player.wind_category)[1];
  document.getElementById("wind_status").style.color = wind_classification(player.wind_category)[2];
  document.getElementById("wind_strength").textContent = format_number(wind_limit_min()) + "-" + format_number(wind_limit_max());
  document.getElementById("wind_average").textContent = format_number(wind_limit_avg());
  
  player.energy = player.energy.add(player.upgrades['wind_turbine'].get_effect().mul(delta / 1000 * player.upgrades['wind_turbine'].amt));
  
  // water
  document.getElementById("water_strength").textContent = format_number(water_limit());
  document.getElementById("water_consumption").textContent = format_number(water_consumption());
  document.getElementById("water_production").textContent = format_number(water_production());
  document.getElementById("water_average").textContent = format_number(water_limit_avg());
  
  if (player.water_works) {
    let productive_delta = player.water.div(water_consumption()).min(delta / 1000 * player.upgrades['water_dam'].amt).toNumber();
    player.water = player.water.sub(water_consumption().mul(productive_delta));
    player.energy = player.energy.add(water_limit().mul(productive_delta));
    if (player.upgrades['res-water2'].is_active() && player.engineers['water_dam'] > 0) {
      player.energy = player.energy.add(water_limit_avg().mul(delta / 1000 * player.upgrades['water_dam'].amt - productive_delta));
    }
  }
  else {
    player.water = player.water.add(water_production().mul(delta / 1000 * player.upgrades['water_dam'].amt));
  }
  
  // -- solar
  // one change in ~5 minutes = 300k ms
  if (Math.random() < delta / 300000) {
    player.cloud_category = Math.floor(Math.random() * 3);
  }
  solar_update_icon(player.cloud_category);
  document.getElementById("solar_status").textContent = solar_text(player.cloud_category)[0];
  document.getElementById("solar_status").style.color = solar_text(player.cloud_category)[1];
  document.getElementById("solar_strength").textContent = "0-" + format_number(solar_limit());
  document.getElementById("solar_average").textContent = format_number(solar_limit_avg());
  
  player.energy = player.energy.add(player.upgrades['solar_panel'].get_effect().mul(delta / 1000 * player.upgrades['solar_panel'].amt));
  
  // -- geothermal
  // the temperature changes somehow
  // one change of trend in ~2 minutes = 120k ms
  if (Math.random() < delta / 120000) {
    player.earth_trend = Math.random() * 2 - 1;
  }
  player.earth_temperature += 0.3 * (sigmoid((120 - player.earth_temperature) / 50) + Math.random() - 1 + 0.2 * player.earth_trend);
  
  if (player.upgrades['geothermal'].get_effect().gt(0)) document.getElementById("earth_status").style.color = "#de5842";
  else document.getElementById("earth_status").style.color = "#a2d7d8";
  document.getElementById("earth_increment").textContent = format_number(earth_limit());
  document.getElementById("earth_min_temp").textContent = format_number(earth_min_temp());
  document.getElementById("earth_average").textContent = format_number(earth_limit_avg());
  
  player.energy = player.energy.add(player.upgrades['geothermal'].get_effect().mul(delta / 1000 * player.upgrades['geothermal'].amt));
  
  // labs
  document.getElementById("lab_consumption").textContent = format_number(lab_requirements());
  
  let working_labs = Math.min(player.upgrades['laboratory'].amt, player.engineers['laboratory']);
  let lab_productive_delta = player.energy.div(lab_requirements()).min(delta / 1000 * working_labs).toNumber();
  player.research = player.research.add(player.upgrades['laboratory'].get_effect().mul(lab_productive_delta));
  player.energy = player.energy.sub(lab_requirements().mul(lab_productive_delta));
  
  // city
  if (player.upgrades['upg-u7'].is_active()) player.population = Math.max(player.population, 1);
  document.getElementById("town_demand").textContent = format_number(get_town_energy_requirements(), true, true);
  
  // energy sending
  let energy_sent = energy_for_send().min(get_town_energy_requirements()).mul(delta / 1000).min(player.energy);
  let consumer_satisfaction = energy_sent.div(get_town_energy_requirements().mul(delta / 1000)).max(0).min(1).mul(100).toNumber();
  
  player.energy = player.energy.sub(energy_sent);
  document.getElementById("consumer_satisfaction").style.setProperty("--percentage", consumer_satisfaction);
  document.getElementById("consumer_satisfaction_percentage").textContent = format_number(consumer_satisfaction, true) + "%";
  
  // city growth
  let happiness_up = consumer_satisfaction / 20;
  let happiness_down = big(player.population).add(999).log(10)-3;
  document.getElementById("happiness_up").textContent = "+" + format_number(happiness_up, true);
  document.getElementById("happiness_down").textContent = "-" + format_number(happiness_down, true);
  if (happiness_up >= happiness_down) {
    document.getElementById("happiness_total").style.color = "#00ff00";
    document.getElementById("happiness_total").textContent = "+" + format_number(happiness_up - happiness_down, true);
  }
  else {
    document.getElementById("happiness_total").style.color = "#ff0000";
    document.getElementById("happiness_total").textContent = "-" + format_number(happiness_down - happiness_up, true);
  }
  player.population = player.population * (1 + (CITY_GROWTH_PER_TICK - 1) * (happiness_up - happiness_down));
  
  
  let energy_limit = energy_storage();
  
  // autosell manager
  if (player.engineers['energy'] > 0 && player.energy.gt(energy_limit)) {
    let sold_energy = player.energy.sub(energy_limit);
    player.money = player.money.add(sold_energy.mul(energy_cost()));
    player.energy = player.energy.sub(sold_energy);
  }
  
  // energy limit
  if (player.energy.gt(energy_limit) && player.upgrades['upg-u8'].is_active()) {
    let autosold_energy = player.energy.sub(energy_limit).mul(player.upgrades['upg-u8'].get_effect().div(100));
    player.money = player.money.add(autosold_energy.mul(energy_cost()));
  }
  player.energy = player.energy.min(energy_limit);
  document.getElementById("energy_limit").textContent = format_number(energy_limit, true, true);
  
  // energy selling
  let selling_energy = energy_for_sell();
  document.getElementById("money_from_selling_stack").textContent = format_number(selling_energy.mul(energy_cost()), true);
  document.getElementById("money_from_selling_one").textContent = format_number(energy_cost(), true);

  //pollution decay -- unused
  player.pollution = big(player.pollution).mul(0.9975**(delta/1000))
  
  //market decay
  if (player.upgrades['res-17'].is_active()) {
    for( let i in player.bought ){
      if (!player.bought.hasOwnProperty(i)) continue;
      player.bought[i] = big(player.bought[i]).sub(player[i]).mul(0.9995**(delta/1000)).add(player[i]);
    }
  }
  
  // ascension tab render
  for (let key of Object.keys(ASCENSION_REQS)) {
    let element = document.getElementById("ascend_" + key);
    if (element !== null) {
      if (big(player[key]).gte(ASCENSION_REQS[key])) {
        element.getElementsByClassName("not-ready")[0].style.display = "none";
        element.getElementsByClassName("ready")[0].style.display = "";
      }
      else {
        element.getElementsByClassName("not-ready")[0].style.display = "";
        element.getElementsByClassName("ready")[0].style.display = "none";
      }
      
      element.getElementsByClassName("requirement")[0].textContent = format_number(ASCENSION_REQS[key]);
      element.getElementsByClassName("percentage")[0].textContent = format_number(big(player[key]).mul(100).div(ASCENSION_REQS[key]).min(100), true) + "%";
      element.getElementsByClassName("percentage-bar")[0].style.right = format_number(big(100).sub(big(player[key]).mul(100).div(ASCENSION_REQS[key]).min(100))) + "%";
    }
  }
  
  render();
  
  // hide extra researches
  let researches_on_screen = 0;
  for (let key of Object.keys(player.upgrades)) {
    if (key.includes('res-')) {
      let element = document.getElementById(key);
      if (element !== null) {
        if (element.style.display == "none") continue;
        if (researches_on_screen == 4) element.style.display = "none";
        else if (player.upgrades[key].amt > 0) element.style.display = "none";
        else researches_on_screen += 1;
      }
    }
  }
}

function first_loop() {
  document.getElementById("selling_stack").value = player.energy_for_sell;
  document.getElementById("buying_stack").value = player.resources_for_buy;
  document.getElementById("sending_stack").value = player.energy_for_send;
  
  const autojobs = ["coal", "oil", "uranium", "energy"];
  for (let i = 0; i < autojobs.length; i++) {
    update_job(autojobs[i]);
  }
}

setInterval(loop, TICK_INTERVAL);
