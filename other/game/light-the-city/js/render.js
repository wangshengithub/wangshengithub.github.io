function render() {
  // Any variable of highest level / on the first one
  let elements = document.getElementsByClassName("variable-value");
  for (let i = 0; i < elements.length; i++) {
    if (elements.item(i).attributes.index === undefined)
      elements.item(i).textContent = format_number(player[elements.item(i).attributes.name.value], elements.item(i).attributes.fixed !== undefined, elements.item(i).attributes.rounded !== undefined, elements.item(i).attributes.integer !== undefined);
    else
      elements.item(i).textContent = format_number(player[elements.item(i).attributes.name.value][elements.item(i).attributes.index.value], elements.item(i).attributes.fixed !== undefined, elements.item(i).attributes.rounded !== undefined, elements.item(i).attributes.integer !== undefined);
  }

  
  // Progression tags
  if (player.energy.gt(4.5) || player.progression[0] === true) {
    document.getElementById("progression_tag_hidden_0").style.visibility = "";
    player.progression[0] = true;
  }
  else document.getElementById("progression_tag_hidden_0").style.visibility = "hidden";
  
  if (player.energy.gt(9.5) || player.progression[1] === true) {
    document.getElementById("progression_tag_hidden_1").style.visibility = "";
    player.progression[1] = true;
  }
  else document.getElementById("progression_tag_hidden_1").style.visibility = "hidden";
  
  if (player.energy.gt(9.5) || player.progression[2] === true) {
    document.getElementById("progression_tag_hidden_2").style.visibility = "";
    player.progression[2] = true;
  }
  else document.getElementById("progression_tag_hidden_2").style.visibility = "hidden";
  
  if (player.money.gt(19.5) || player.progression[3] === true) {
    document.getElementById("tab_btn_power").style.visibility = "";
    document.getElementById("tab_btn_upgrades").style.visibility = "";
    player.progression[3] = true;
  }
  else {
    document.getElementById("tab_btn_power").style.visibility = "hidden";
    document.getElementById("tab_btn_upgrades").style.visibility = "hidden";
  }
  
  if (player.upgrades['upg-u3'].is_active() || player.progression[4] === true) {
    document.getElementById("tab_btn_storage").style.visibility = "";
    player.progression[4] = true;
  }
  else document.getElementById("tab_btn_storage").style.visibility = "hidden";
  
  if (player.upgrades['upg-u5'].is_active() || player.progression[5] === true) {
    document.getElementById("progression_tag_hidden_5").style.visibility = "";
    player.progression[5] = true;
  }
  else document.getElementById("progression_tag_hidden_5").style.visibility = "hidden";
  
  if (player.upgrades['upg-u7'].is_active() || player.progression[6] === true) {
    document.getElementById("progression_tag_hidden_6").style.visibility = "";
    player.progression[6] = true;
  }
  else document.getElementById("progression_tag_hidden_6").style.visibility = "hidden";
  
  if (player.upgrades['upg-u9'].is_active() || player.progression[7] === true) {
    document.getElementById("progression_tag_hidden_7").style.visibility = "";
    player.progression[7] = true;
  }
  else document.getElementById("progression_tag_hidden_7").style.visibility = "hidden";
  
  if (player.upgrades['upg-u10'].is_active() || player.progression[8] === true) {
    document.getElementById("tab_btn_research").style.visibility = "";
    player.progression[8] = true;
  }
  else document.getElementById("tab_btn_research").style.visibility = "hidden";
  
  if (player.upgrades['res-4'].is_active() || player.progression[9] === true) {
    document.getElementById("resource_oil").style.visibility = "";
    document.getElementById("autobuy_oil").style.visibility = "";
    player.progression[9] = true;
  }
  else {
    document.getElementById("resource_oil").style.visibility = "hidden";
    document.getElementById("autobuy_oil").style.visibility = "hidden";
  }
  
  if ((player.progression[9] && player["oil_price"].gt(100)) || player.progression[10] === true) {
    player.progression[10] = true;
  }
  
  if (player.upgrades['res-9'].is_active() || player.progression[11] === true) {
    elements = document.getElementsByClassName("progression-tag-hidden-11");
    for (let i = 0; i < elements.length; i++) {
      elements.item(i).style.visibility = "";
    }
    player.progression[11] = true;
  }
  else {
    elements = document.getElementsByClassName("progression-tag-hidden-11");
    for (let i = 0; i < elements.length; i++) {
      elements.item(i).style.visibility = "hidden";
    }
  }
  
  if ((player.progression[9] && player["oil_price"].gt(300)) || player.progression[12] === true) {
    player.progression[12] = true;
  }
  
  if (player.upgrades['res-11'].is_active() || player.progression[13] === true) {
    document.getElementById("resource_electronics").style.visibility = "";
    player.progression[13] = true;
  }
  else {
    document.getElementById("resource_electronics").style.visibility = "hidden";
  } 
  
  if(player.upgrades['res-14'].is_active()|| player.progression[14] === true){
  player.progression[14] = true;
  document.getElementById("resource_uranium").style.visibility="";
  document.getElementById("autobuy_uranium").style.visibility="";
  }
  else {
    document.getElementById("resource_uranium").style.visibility = "hidden";
    document.getElementById("autobuy_uranium").style.visibility = "hidden";
   } 
  
  if (player.upgrades['res-smart'].is_active() || player.progression[15] === true) {
    document.getElementById("smart_autobuy").style.visibility = "";
    player.progression[15] = true;
  }
  else {
    document.getElementById("smart_autobuy").style.visibility = "hidden";
  } 
  
  if (player.upgrades['res-alternate1'].is_active() || player.progression[16] === true) {
    document.getElementById("tab_btn_alternate").style.visibility = "";
    player.progression[16] = true;
  }
  else {
    document.getElementById("tab_btn_alternate").style.visibility = "hidden";
  } 
  
  if (player.upgrades['res-alternate3'].is_active() || player.progression[17] === true) {
    elements = document.getElementsByClassName("progression-tag-hidden-17");
    for (let i = 0; i < elements.length; i++) {
      elements.item(i).style.visibility = "";
    }
    player.progression[17] = true;
  }
  else {
    elements = document.getElementsByClassName("progression-tag-hidden-17");
    for (let i = 0; i < elements.length; i++) {
      elements.item(i).style.visibility = "hidden";
    }
  }
  
  if (player.upgrades['res-ascend'].is_active() || player.progression[18] === true) {
    document.getElementById("tab_btn_starship").style.visibility = "";
    player.progression[18] = true;
  }
  else {
    document.getElementById("tab_btn_starship").style.visibility = "hidden";
  } 
  
  // Render upgrades
  for (let key of Object.keys(player.upgrades)) {
    player.upgrades[key].render();
  }
  
  // Crank
  if(player.crank_active){
  document.getElementById('crank').textContent = 'Stop turning the crank';
  }
  else document.getElementById('crank').textContent = 'Turn the crank';
  
  // Plants
  if(player.plants_working['coal']) document.getElementById('coal_switch').textContent = 'Turn off';
  else document.getElementById('coal_switch').textContent = 'Turn on';
  if(player.plants_working['oil']) document.getElementById('oil_switch').textContent = 'Turn off';
  else document.getElementById('oil_switch').textContent = 'Turn on';
  if(player.plants_working['nuclear']) document.getElementById('nuclear_switch').textContent = 'Turn off';
  else document.getElementById('nuclear_switch').textContent = 'Turn on';
  
  if(player.water_works) document.getElementById('water_switch').textContent = 'Turn off';
  else document.getElementById('water_switch').textContent = 'Turn on';
  
  // Town or city?
  elements = document.getElementsByClassName("town-or-city");
  for (let i = 0; i < elements.length; i++) {
    if (player.population < 5000) elements.item(i).textContent = "town";
    else elements.item(i).textContent = "city";
  }
  
  // Decrease-increase engineers and other engineer stuff as well
  const engineering_jobs = ['laboratory', 'coal_plant', 'oil_plant', 'nuclear_plant','battery', 'accumulator', 'substation', 'wind_turbine', 'water_dam', 'solar_panel', 'geothermal'];
  for (let i = 0; i < engineering_jobs.length; i++) {
    if (player.engineers[engineering_jobs[i]] == 0) document.getElementById(engineering_jobs[i]).getElementsByClassName('decrease-engineers')[0].disabled = true;
    else document.getElementById(engineering_jobs[i]).getElementsByClassName('decrease-engineers')[0].disabled = false;
    if (player.engineers['free'] == 0) document.getElementById(engineering_jobs[i]).getElementsByClassName('increase-engineers')[0].disabled = true;
    else document.getElementById(engineering_jobs[i]).getElementsByClassName('increase-engineers')[0].disabled = false;
    if (document.getElementById(engineering_jobs[i]).getElementsByClassName('engineer-effectiveness').length > 0) {
      if (player.engineers[engineering_jobs[i]] == 0) document.getElementById(engineering_jobs[i]).getElementsByClassName('engineer-effectiveness')[0].textContent = "";
      else if (['battery','accumulator','substation'].includes(engineering_jobs[i]) && player.upgrades['res-storage6'].is_active()) document.getElementById(engineering_jobs[i]).getElementsByClassName('engineer-effectiveness')[0].textContent = "+" + format_number(player.engineers[engineering_jobs[i]] * 900) + "%";
      else if (['wind_turbine', 'water_dam', 'solar_panel', 'geothermal'].includes(engineering_jobs[i]) && player.upgrades['res-alternate6'].is_active()) document.getElementById(engineering_jobs[i]).getElementsByClassName('engineer-effectiveness')[0].textContent = "+" + format_number((player.engineers[engineering_jobs[i]] * player.engineers[engineering_jobs[i]]) * 100) + "%";
      else document.getElementById(engineering_jobs[i]).getElementsByClassName('engineer-effectiveness')[0].textContent = "+" + format_number(player.engineers[engineering_jobs[i]] * 100) + "%";
    }
  }
  
  // Smart autobuy
  if(player.smart_autobuy) document.getElementById('smart_autobuy').textContent = 'Enable buying if unprofitable';
  else document.getElementById('smart_autobuy').textContent = 'Disable buying if unprofitable';
  
  // Restore backup button
  if (localStorage.hasOwnProperty("lightthecity_gamebackup")) document.getElementById('restore_backup').style.display = "";
  else document.getElementById('restore_backup').style.display = "none";
  
  // Ascension button
  if (check_ascension()) document.getElementById('ascend').disabled = false;
  else document.getElementById('ascend').disabled = true;
}