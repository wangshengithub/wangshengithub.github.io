function sigmoid(x) {
  if (x > 100) return 1;
  if (x < -100) return 0;
  return Math.exp(x) / (1 + Math.exp(x));
}

function crank_power() {
  let base_power = player.upgrades['upg-crank1'].get_effect();
  if (player.upgrades['upg-u4'].is_active()) base_power = base_power.mul(player.upgrades['upg-u4'].get_effect());
  return base_power;
}

function energy_cost() {
  if (player.population >= 1) return big(1).add(big(big(player.population).log(10)).pow(2).div(5));
  return big(1);
}

function battery_storage(amt) {
  let base_storage = big(100);
  if (!player.upgrades['res-storage6'].is_active()) base_storage = base_storage.mul(1 + player.engineers['battery']);
  else base_storage = base_storage.mul(1 + 9 * player.engineers['battery']);
  if (player.upgrades['res-8'].is_active()) base_storage = base_storage.mul(player.upgrades['res-8'].get_effect());
  return base_storage;
}

function accumulator_storage(amt) {
  let base_storage = big(1000);
  if (!player.upgrades['res-storage6'].is_active()) base_storage = base_storage.mul(1 + player.engineers['accumulator']);
  else base_storage = base_storage.mul(1 + 9 * player.engineers['accumulator']);
  if (player.upgrades['res-storage3'].is_active()) base_storage = base_storage.mul(player.upgrades['res-storage3'].get_effect());
  return base_storage;
}

function substation_storage(amt) {
  let base_storage = big(10000);
  if (!player.upgrades['res-storage6'].is_active()) base_storage = base_storage.mul(1 + player.engineers['substation']);
  else base_storage = base_storage.mul(1 + 9 * player.engineers['substation']);
  if (player.upgrades['res-storage5'].is_active()) base_storage = base_storage.mul(player.upgrades['res-storage5'].get_effect());
  return base_storage;
}

function energy_storage() {
  let base_storage = big(10);
  if (player.upgrades['upg-u2'].is_active()) base_storage = base_storage.add(player.upgrades['upg-u2'].get_effect());
  if (player.upgrades['upg-u6'].is_active()) base_storage = base_storage.add(player.upgrades['upg-u6'].get_effect());
  if (player.upgrades['res-3'].is_active()) base_storage = base_storage.mul(player.upgrades['res-3'].get_effect());
  base_storage = base_storage.add(player.upgrades['battery'].get_effect().mul(player.upgrades['battery'].amt));
  base_storage = base_storage.add(player.upgrades['accumulator'].get_effect().mul(player.upgrades['accumulator'].amt));
  base_storage = base_storage.add(player.upgrades['substation'].get_effect().mul(player.upgrades['substation'].amt));
  return base_storage;
}

function energy_for_sell() {
  try {
    let c = big(player.energy_for_sell).round().max(0).min(player.energy);
    c=isNaN(c)?big(0):c;
    return c;
  }
  catch(e) { return big(0); }
}

function sell_energy() {
  let selling_energy = energy_for_sell();
  if (player.energy.gte(selling_energy) && selling_energy.gte(0) && !isNaN(selling_energy.toNumber())) {
    player.energy = player.energy.sub(selling_energy);
    player.money = player.money.add(selling_energy.mul(energy_cost()));
  }
}

function switch_tab(tab) {
  let elements = document.getElementsByClassName("tab-button");
  for (let i = 0; i < elements.length; i++) {
    elements.item(i).disabled = false;
  }
  if (document.getElementById("tab_btn_" + tab) !== null) document.getElementById("tab_btn_" + tab).disabled = true;
  
  elements = document.getElementsByClassName("tab");
  for (let i = 0; i < elements.length; i++) {
    elements.item(i).style.display = "none";
  }
  if (document.getElementById("tab_" + tab) !== null) document.getElementById("tab_" + tab).style.display = "";
}

function energy_overflow_selling_percent(amt) {
  let base_percent = big(10);
  if (player.upgrades['res-5'].is_active()) base_percent = player.upgrades['res-5'].get_effect();
  if (player.upgrades['res-10'].is_active()) base_percent = player.upgrades['res-10'].get_effect();
  if (player.upgrades['res-autosell3'].is_active()) base_percent = player.upgrades['res-autosell3'].get_effect();
  if (player.upgrades['res-autosell4'].is_active()) base_percent = player.upgrades['res-autosell4'].get_effect();
  return base_percent;
}

// Market

function can_have_resource(resource, amt) {
  if (player[resource].gte(amt)) return true;
  if (player[resource + "_price"] !== undefined) {
    if (player[resource].add(player.money.div(player[resource + "_price"])).gte(amt)) return true;
  }
  return false;
}

function buy_resource(resource, amt) {
  player.money = player.money.sub(player[resource + "_price"].mul(amt)).max(0);
  player.bought[resource] = player.bought[resource].add(amt);
  player[resource] = player[resource].add(amt);
}

function buy_to_amt(resource, amt) {
  if (!can_have_resource(resource, amt)) return;
  if (player[resource + "_price"] !== undefined && player[resource].lt(amt)) {
    let resources_needed = big(amt).sub(player[resource]);
    player.money = player.money.sub(player[resource + "_price"].mul(resources_needed)).max(0);
    player.bought[resource] = player.bought[resource].add(resources_needed);
    player[resource] = amt;
  }
}

function equilibrium_price(resource) {
  const base_price = {
    "metal": 10,
    "coal": 12,
    "oil": 8,
    "electronics": 600,
    "uranium": 10000
  }
  const bought_influence = {
    "metal": 4,
    "coal": 8,
    "oil": 12,
    "electronics": 2,
    "uranium": 3
  }
  const pop_influence = {
    "metal": 0.05,
    "coal": 0.1,
    "oil": 0.15,
    "electronics": 0.2,
    "uranium": 0
  }
  const hardcap = {
	"metal": 100,
    "coal": 300,
    "oil": 1000,
    "electronics": 10000,
    "uranium": 30000
  }
  
  let resource_price = big(base_price[resource]);
  let bought_effect = player.bought[resource].add(1).pow(bought_influence[resource] / 30);
  resource_price = resource_price.mul(bought_effect);
  let population_pow = big(1).add(big(1).mul(pop_influence[resource])).div(big(1).add(big(big(player.population).add(10).log(10)).mul(pop_influence[resource])));
  resource_price = resource_price.pow(population_pow);
  
  return resource_price.min(hardcap[resource]);
}

function market_tick(resource) {
  /* Factors that influence the price:
  1. equilibrium_price: the price would slowly move towards that point
  2. the price 30 market ticks ago (still on screen) -- huge factor, to create some strategic possibilities
  3. a bit of randomness
  */
  
  const base_price = {
    "metal": 10,
    "coal": 12,
    "oil": 8,
    "electronics": 600,
    "uranium": 10000
  }
  
  const MAX_PRICE_CHANGE = 1.3;
  
  while (player.market_history[resource].length < 30) player.market_history[resource].push(base_price[resource]);
  
  let potential_price = equilibrium_price(resource).pow(0.2).mul(big(player.market_history[resource][0]).pow(0.8));
  let potential_growth_raw = potential_price.div(player[resource + "_price"]).log(10);
  let potential_growth = sigmoid(potential_growth_raw);
  let rnd_change = Math.random() - 1 + potential_growth;
  
  player[resource + "_price"] = player[resource + "_price"].mul(Math.pow(MAX_PRICE_CHANGE, rnd_change));
  
  for (let i = 0; i < 29; i++) player.market_history[resource][i] = player.market_history[resource][i+1];
  player.market_history[resource][29] = player[resource + "_price"].max(1e-200).min(1e200).toNumber();
}

function resources_for_buy() {
  try {
    let c = big(player.resources_for_buy).max(0);
    c=isNaN(c)?big(0):c;
    return c;
  }
  catch(e) { return big(0); }
}

function buy_resources() {
  let buying_resources = resources_for_buy().min(player.money.div(player[player.selected_resource + "_price"]));
  if (buying_resources.gte(0) && !isNaN(buying_resources.toNumber())) {
    player.money = player.money.sub(buying_resources.mul(player[player.selected_resource + "_price"])).max(0);
    player[player.selected_resource] = player[player.selected_resource].add(buying_resources);
    player.bought[player.selected_resource] = player.bought[player.selected_resource].add(buying_resources);
  }
}

// Plant resources

function coal_pp_power() {
  let base_power = big(60);
  base_power = base_power.mul(1 + player.engineers['coal_plant']);
  if (player.upgrades['res-16'].is_active()) base_power = base_power.mul(player.upgrades['res-16'].get_effect().div(100).mul(player.upgrades['coal_plant'].amt).add(1));
  return base_power;
}

function oil_pp_power() {
  let base_power = big(200);
  base_power = base_power.mul(1 + player.engineers['oil_plant']);
  if (player.upgrades['res-scale2'].is_active()) base_power = base_power.mul(player.upgrades['res-scale2'].get_effect().div(100).mul(player.upgrades['oil_plant'].amt).add(1));
  return base_power;
}

function nuclear_pp_power() {
  let base_power = big(400);
  base_power = base_power.add(player.upgrades['res-15'].is_active()?player.upgrades['res-15'].get_effect():0);
  base_power = base_power.add(player.upgrades['res-18'].is_active()?player.upgrades['res-18'].get_effect():0);
  base_power = base_power.mul(1 + player.engineers['nuclear_plant']);
  if (player.upgrades['res-scale3'].is_active()) base_power = base_power.mul(player.upgrades['res-scale3'].get_effect().div(100).mul(player.upgrades['nuclear_plant'].amt).add(1));
  return base_power;
}

function coal_pp_requirements() {
  let base_requirement = big(1);
  if (player.upgrades['res-1'].is_active()) base_requirement = base_requirement.mul(big(100).sub(player.upgrades['res-1'].get_effect()).div(100));
  return base_requirement;
}

function oil_pp_requirements() {
  let base_requirement = big(4);
  if (player.upgrades['res-7'].is_active()) base_requirement = base_requirement.mul(big(100).sub(player.upgrades['res-7'].get_effect()).div(100));
  if (player.upgrades['res-13'].is_active()) base_requirement = base_requirement.mul(big(100).sub(player.upgrades['res-13'].get_effect()).div(100));
  return base_requirement;
}
function nuclear_pp_requirements() {
  let base_requirement = big(0.1).add(player.upgrades["res-15"].is_active()?0.075:0).add(player.upgrades["res-18"].is_active()?0.125:0);
  return base_requirement;
}

// Lab resources

function lab_effectiveness() {
  let base_effectiveness = big(1);
  if (player.upgrades['res-2'].is_active()) base_effectiveness = base_effectiveness.mul(player.upgrades['res-2'].get_effect().div(100).mul(player.population).add(1));
  if (player.upgrades['res-6'].is_active()) base_effectiveness = base_effectiveness.mul(player.upgrades['res-6'].get_effect().div(100).mul(Math.max(0, player.engineers['laboratory'] - 1)).add(1));
  if (player.upgrades['res-lab3'].is_active()) base_effectiveness = base_effectiveness.mul(2);
  if (player.upgrades['res-lab4'].is_active()) base_effectiveness = base_effectiveness.mul(player.upgrades['res-lab4'].get_effect().div(100).mul(Math.min(player.upgrades['laboratory'].amt, player.engineers['laboratory'])).add(1));
  if (player.upgrades['res-lab5'].is_active()) base_effectiveness = base_effectiveness.pow(player.upgrades['res-lab5'].get_effect());
  if (player.upgrades['res-lab6'].is_active()) base_effectiveness = base_effectiveness.mul(player.upgrades['res-lab6'].get_effect().div(100).mul(player.upgrades['laboratory'].amt).add(1));
  return base_effectiveness;
}

function lab_requirements() {
  let base_requirements = big(100);
  if (player.upgrades['res-6'].is_active()) base_requirements = base_requirements.mul(player.upgrades['res-6'].get_effect().div(100).mul(Math.max(0, player.engineers['laboratory'] - 1)).add(1));
  if (player.upgrades['res-lab3'].is_active()) base_requirements = base_requirements.mul(1.5);
  if (player.upgrades['res-lab5'].is_active()) base_requirements = base_requirements.mul(3);
  if (player.upgrades['res-lab6'].is_active()) base_requirements = base_requirements.mul(2);
  return base_requirements;
}

// City lights

function energy_for_send() {
  try {
    return big(player.energy_for_send).max(0);
  }
  catch(e) { return big(0); }
}

function send_energy() {
  let sending_energy = energy_for_send();
  if (player.energy.gte(sending_energy) && sending_energy.gte(0) && !isNaN(sending_energy.toNumber())){
    player.energy = player.energy.sub(sending_energy)
    player.city_energy = player.city_energy.add(sending_energy)
  }
}

function get_town_energy_requirements() {
  let base_energy = big(10).mul(big(player.population).pow(1.2));
  if (player.upgrades['res-12'].is_active()) base_energy = base_energy.mul(big(100).sub(player.upgrades['res-12'].get_effect()).div(100));
  if (player.upgrades['res-savings2'].is_active()) base_energy = base_energy.mul(big(100).sub(player.upgrades['res-savings2'].get_effect()).div(100));
  if (player.upgrades['res-savings3'].is_active()) base_energy = base_energy.mul(big(100).sub(player.upgrades['res-savings3'].get_effect()).div(100));
  if (player.upgrades['res-savings4'].is_active()) base_energy = base_energy.mul(big(100).sub(player.upgrades['res-savings4'].get_effect()).div(100));
  return base_energy;
}

// Energy production

function get_average_energy_production() {
  let energy_per_second = big(0);
  
  // Crank
  if (player.crank_active && player.upgrades['upg-u1'].is_active()) {
    energy_per_second = energy_per_second.add(crank_power().mul(1000).div(player.upgrades["upg-crank2"].get_effect()));
  }
  
  // Coal power plant
  if (player.plants_working['coal'] && (player['coal'].gt(0.01) || player.engineers['coal'] > 0)) {
    energy_per_second = energy_per_second.add(player.upgrades['coal_plant'].get_effect().mul(player.upgrades['coal_plant'].amt));
  }
  
  // Oil power plant
  if (player.plants_working['oil'] && (player['oil'].gt(0.01) || player.engineers['oil'] > 0)) {
    energy_per_second = energy_per_second.add(player.upgrades['oil_plant'].get_effect().mul(player.upgrades['oil_plant'].amt));
  }
  
  // Uranium power plant
  if (player.plants_working['nuclear'] && (player['uranium'].gt(0.01) || player.engineers['uranium'] > 0)) {
    energy_per_second = energy_per_second.add(player.upgrades['nuclear_plant'].get_effect().mul(player.upgrades['nuclear_plant'].amt));
  }
  
  // Wind
  energy_per_second = energy_per_second.add(wind_limit_avg().mul(player.upgrades['wind_turbine'].amt));
  
  // Water
  energy_per_second = energy_per_second.add(player.upgrades['water_dam'].get_effect().mul(player.upgrades['water_dam'].amt));
  
  // Solar
  energy_per_second = energy_per_second.add(solar_limit_avg().mul(player.upgrades['solar_panel'].amt));
  
  // Geothermal
  energy_per_second = energy_per_second.add(earth_limit_avg().mul(player.upgrades['geothermal'].amt));
  
  // Labs
  let working_labs = Math.min(player.upgrades['laboratory'].amt, player.engineers['laboratory']);
  energy_per_second = energy_per_second.sub(lab_requirements().mul(working_labs));
  
  return energy_per_second;
}

// Engineers

function engineer_price(amt) {
  return big(100).pow(amt).div(big(player.population).max(1).pow(2)).mul(10000000);
}

function update_job(job) {
  let element = document.getElementById("engineer_" + job);
  if (element !== null) {
    if (player.engineers[job] == 0) {
      element.getElementsByClassName('on-job')[0].style.display = "none";
      element.getElementsByClassName('not-on-job')[0].style.display = "";
    }
    else {
      element.getElementsByClassName('on-job')[0].style.display = "";
      element.getElementsByClassName('not-on-job')[0].style.display = "none";
    }
  }
}

function switch_engineer(job) {
  if (player.engineers[job] == 0) {
    if (player.engineers['free'] > 0) {
      player.engineers['free'] -= 1;
      player.engineers[job] += 1;
    }
  }
  else {
    player.engineers['free'] += 1;
    player.engineers[job] -= 1;
  }
  
  update_job(job);
}

function add_engineer(job) {
  if (player.engineers['free'] > 0) {
    player.engineers['free'] -= 1;
    player.engineers[job] += 1;
  }
}

function remove_engineer(job) {
  if (player.engineers[job] > 0) {
    player.engineers['free'] += 1;
    player.engineers[job] -= 1;
  }
}

// Clean energy

function wind_limit_min() {
  let base_limit = big(0);
  if (player.upgrades['res-wind1'].is_active()) base_limit = player.upgrades['res-wind1'].get_effect().div(100).mul(wind_limit_max());
  return base_limit;
}

function wind_limit_max() {
  let base_limit = big(1500);
  if (!player.upgrades['res-alternate6'].is_active()) base_limit = base_limit.mul(1 + player.engineers['wind_turbine']);
  else base_limit = base_limit.mul(1 + (player.engineers['wind_turbine'] * player.engineers['wind_turbine']));
  if (player.upgrades['res-wind3'].is_active()) base_limit = base_limit.mul(player.upgrades['res-wind3'].get_effect());
  if (player.upgrades['res-wind4'].is_active()) base_limit = base_limit.mul(player.upgrades['res-wind4'].get_effect().div(100).mul(player.upgrades['wind_turbine'].amt).add(1));
  return base_limit;
}

function wind_classification(cat) {
  switch (cat) {
    case 0: return [0, "Calm", "#F0F8FF"]; break;
    case 1: return [0.2, "Breeze", "#E6E6FA"]; break;
    case 2: return [0.4, "Windy", "#87CEFA"]; break;
    case 3: return [0.6, "Gale", "#00BFFF"]; break;
    case 4: return [1, "Storm", "#1E90FF"]; break;
    case 5: return [player.upgrades['res-wind2'].is_active() ? 1 : 0, "Hurricane", "#4682B4"]; break;  
  }
}

function wind_limit_avg() {
  let coeffs = [1/10, 2/10, 2/10, 2/10, 2/10, 1/10];
  let coeff_avg = 0;
  for (let i = 0; i < coeffs.length; i++) coeff_avg += wind_classification(i)[0] * coeffs[i];
  return wind_limit_min().add(wind_limit_max().sub(wind_limit_min()).mul(coeff_avg));
}

function water_limit() {
  let base_limit = big(5000);
  if (!player.upgrades['res-alternate6'].is_active()) base_limit = base_limit.mul(1 + player.engineers['water_dam']);
  else base_limit = base_limit.mul(1 + player.engineers['water_dam'] * player.engineers['water_dam']);
  if (player.upgrades['res-water4'].is_active()) base_limit = base_limit.mul(player.upgrades['res-water4'].get_effect().div(100).mul(player.upgrades['water_dam'].amt).add(1));
  return base_limit;
}

function water_production() {
  let base_prod = big(1);
  if (player.upgrades['res-water1'].is_active()) base_prod = base_prod.mul(player.upgrades['res-water1'].get_effect().div(100).add(1));
  if (player.upgrades['res-water3'].is_active()) base_prod = base_prod.mul(player.upgrades['res-water3'].get_effect().div(100).add(1));
  return base_prod;
}

function water_consumption() {
  let base_prod = big(4);
  return base_prod;
}

function water_limit_avg() {
  return water_limit().mul(water_production()).div(water_production().add(water_consumption()));
}

function water_power() {
  if (!player.water_works) return big(0);
  if (player.water.gt(0)) return water_limit();
  if (player.upgrades['res-water2'].is_active() && player.engineers['water_dam'] > 0) return water_limit_avg();
  return big(0);
}

function solar_get_time() {
  // Cycle is 20 mins = 1200000 ms
  // 9 is night/day, 1 is sunrise/sunset
  let cycle_phase = Date.now() % 1200000;
  if (cycle_phase < 4.5 * 60000) return 0;
  if (cycle_phase < 5.5 * 60000) return 1;
  if (cycle_phase < 14.5 * 60000) return 2;
  if (cycle_phase < 15.5 * 60000) return 3;
  return 0;
}

function solar_update_icon(clouds) {
  document.getElementById("solar_sunny").style.display = "none";
  document.getElementById("solar_sunrise").style.display = "none";
  document.getElementById("solar_sunset").style.display = "none";
  document.getElementById("solar_partly_cloudy").style.display = "none";
  document.getElementById("solar_cloudy").style.display = "none";
  document.getElementById("solar_night").style.display = "none";
  switch (solar_get_time()) {
    case 0: document.getElementById("solar_night").style.display = ""; break;
    case 1: document.getElementById("solar_sunrise").style.display = ""; break;
    case 3: document.getElementById("solar_sunset").style.display = ""; break;
    case 2: switch (clouds) {
      case 0: document.getElementById("solar_sunny").style.display = ""; break;
      case 1: document.getElementById("solar_partly_cloudy").style.display = ""; break;
      case 2: document.getElementById("solar_cloudy").style.display = ""; break;
    }
  }
}

function solar_text(clouds) {
  switch (solar_get_time()) {
    case 0: return ["Night", "#999999"];
    case 1: return ["Sunrise", "#FD5E53"];
    case 3: return ["Sunset", "#FAD6A5"];
    case 2: switch (clouds) {
      case 0: return ["Sunny", "#FFCC33"];
      case 1: return ["Partly Cloudy", "#EFD070"];
      case 2: return ["Cloudy", "#E0E0E0"];
    }
  }
}

function solar_time_coefficient() {
  let cycle_phase = Date.now() % 1200000;
  return Math.max(0, Math.min(1, (1 - Math.abs(cycle_phase - 600000) / 600000) / 0.3 - 0.45 / 0.3));
}

function solar_time_capped_coefficient(clouds) {
  let cloud_cap = [1, 1/2, 1/3];
  return Math.min(solar_time_coefficient(), cloud_cap[clouds]);
}

function solar_limit() {
  let base_limit = big(6000);
  if (!player.upgrades['res-alternate6'].is_active()) base_limit = base_limit.mul(1 + player.engineers['solar_panel']);
  else base_limit = base_limit.mul(1 + player.engineers['solar_panel'] * player.engineers['solar_panel']);
  if (player.upgrades['res-solar1'].is_active()) base_limit = base_limit.mul(player.upgrades['res-solar1'].get_effect().div(100).add(1));
  if (player.upgrades['res-solar2'].is_active()) base_limit = base_limit.mul(player.upgrades['res-solar2'].get_effect().div(100).mul(player.upgrades['solar_panel'].amt).add(1));
  return base_limit;
}

function solar_limit_avg() {
  let avg_time_coefficient = 193 / 720;
  return solar_limit().mul(avg_time_coefficient);
}

function earth_min_temp() {
  let base_temp = big(100);
  if (player.upgrades['res-geo1'].is_active()) base_temp = player.upgrades['res-geo1'].get_effect();
  return base_temp;
}

function earth_limit() {
  let base_limit = big(100);
  if (!player.upgrades['res-alternate6'].is_active()) base_limit = base_limit.mul(1 + player.engineers['geothermal']);
  else base_limit = base_limit.mul(1 + player.engineers['geothermal'] * player.engineers['geothermal']);
  if (player.upgrades['res-geo2'].is_active()) base_limit = base_limit.mul(player.upgrades['res-geo2'].get_effect().div(100).mul(player.upgrades['geothermal'].amt).add(1));
  return base_limit;
}

function earth_limit_avg() {
  return earth_limit().mul(big(120).sub(earth_min_temp()));
  // the precise math here is too hevi even for me.
  // it is a lower bound.
}

function earth_power() {
  if (big(player.earth_temperature).round().lt(earth_min_temp())) return big(0);
  return big(player.earth_temperature).round().sub(earth_min_temp()).mul(earth_limit());
}

// ascension stuff

function check_ascension() {
  for (let key of Object.keys(ASCENSION_REQS)) {
    if (!big(player[key]).gte(ASCENSION_REQS[key])) return false;
  }
  return true;
}

function ascend() {
  if (!check_ascension()) return;
  document.getElementById("modal_ascend").style.display = "";
}