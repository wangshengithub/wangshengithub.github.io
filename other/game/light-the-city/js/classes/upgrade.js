class Upgrade {
  /*
    id: id of upgrade <button>
    limit: limit on upgrade levels, -1 if unlimited
    cost_function: function(amt_bought) that returns cost of the next level -- must return Decimal
    cost_currency: name of currency in player object
    availability_function: function() that returns whether the upgrade is available
    effect_function: function(amt) that returns the effect of upgrades -- must return Decimal
    unlock_function: function() that returns whether you can buy the upgrade, if any other conditions are needed
    buy_function: function(amt) that does something other than normal on buying the upgrade
  */
  constructor(id, limit, cost_function, cost_currency, 
               availability_function=function(){return true}, 
               effect_function=function(amt){return big(1)}, 
               unlock_function=function(){return true}, 
               buy_function=function(amt){return}) {
    this.id = id;
    this.limit = limit;
    this.cost_function = cost_function;
    this.cost_currency = cost_currency;
    this.availability_function = availability_function;
    this.effect_function = effect_function;
    this.unlock_function = unlock_function;
    this.buy_function = buy_function;
    
    this.amt = 0;
    
    let upg_btn = document.getElementById(this.id);
    if (upg_btn !== null) {
      if (upg_btn.getElementsByClassName('buy').length > 0) upg_btn.getElementsByClassName('buy')[0].onclick = function() { player.upgrades[this.parentNode.id].buy(); };
      else upg_btn.onclick = function() { player.upgrades[this.id].buy(); };
    }
  }
  
  can_buy() {
    return (this.limit == -1 || this.limit > this.amt) 
    && this.availability_function() 
    && this.unlock_function() 
    && can_have_resource(this.cost_currency, this.cost_function(this.amt));
  }
  
  buy() {
    if (!this.can_buy()) return;
    buy_to_amt(this.cost_currency, this.cost_function(this.amt));
    player[this.cost_currency] = player[this.cost_currency].sub(this.cost_function(this.amt));
    this.amt += 1;
    this.buy_function(1);
  }
  
  get_monetary_cost(full=true) {
    if (player[this.cost_currency + "_price"] == undefined) return big(0);
    let resources_needed = this.cost_function(this.amt);
    if (!full) resources_needed = resources_needed.sub(player[this.cost_currency]).max(0);
    return resources_needed.mul(player[this.cost_currency + "_price"]);
  }
  
  get_effect() {
    if (!this.availability_function()) return this.effect_function(0);
    else return this.effect_function(this.amt);
  }
  
  is_active() {
    return this.availability_function() && (this.amt > 0);
  }
  
  render() {
    let upg_btn = document.getElementById(this.id);
    if (upg_btn !== null) {
      if (this.availability_function()) upg_btn.style.display = "";
      else upg_btn.style.display = "none";
      
      if (upg_btn.getElementsByClassName('buy').length > 0) {
        if (this.can_buy()) upg_btn.getElementsByClassName('buy')[0].disabled = false;
        else upg_btn.getElementsByClassName('buy')[0].disabled = true;
      }
      else {
        if (this.can_buy()) upg_btn.disabled = false;
        else upg_btn.disabled = true;
      }
      
      if (this.amt == this.limit) upg_btn.classList.add("upgrade-complete");
      else upg_btn.classList.remove("upgrade-complete");
      
      if (upg_btn.getElementsByClassName('cost').length > 0) {
        if (this.amt == this.limit) upg_btn.getElementsByClassName('cost')[0].style.display = "none";
        else upg_btn.getElementsByClassName('cost')[0].style.display = "";
      }
      
      if (upg_btn.getElementsByClassName('monetary-cost').length > 0) {
        if (this.get_monetary_cost(false).eq(0)) upg_btn.getElementsByClassName('monetary-cost')[0].style.display = "none";
        else upg_btn.getElementsByClassName('monetary-cost')[0].style.display = "";
      }
      
      if (upg_btn.getElementsByClassName('next-effect').length > 0) {
        if (this.amt == this.limit) upg_btn.getElementsByClassName('next-effect')[0].style.display = "none";
        else upg_btn.getElementsByClassName('next-effect')[0].style.display = "";
      }
      
      if (upg_btn.getElementsByClassName('amount').length > 0) upg_btn.getElementsByClassName('amount')[0].textContent = format_number(this.amt);
      
      if (upg_btn.getElementsByClassName('cost-value').length > 0) upg_btn.getElementsByClassName('cost-value')[0].textContent = format_number(this.cost_function(this.amt), upg_btn.getElementsByClassName('cost-value')[0].attributes.fixed !== undefined);
      
      if (upg_btn.getElementsByClassName('monetary-cost-value').length > 0) upg_btn.getElementsByClassName('monetary-cost-value')[0].textContent = format_number(this.get_monetary_cost(false));
      if (upg_btn.getElementsByClassName('monetary-cost-value-full').length > 0) upg_btn.getElementsByClassName('monetary-cost-value-full')[0].textContent = format_number(this.get_monetary_cost(true));
      
      if (upg_btn.getElementsByClassName('effect-value').length > 0) upg_btn.getElementsByClassName('effect-value')[0].textContent = format_number(this.get_effect(), upg_btn.getElementsByClassName('effect-value')[0].attributes.fixed !== undefined);
      if (upg_btn.getElementsByClassName('next-effect-value').length > 0) upg_btn.getElementsByClassName('next-effect-value')[0].textContent = format_number(this.effect_function(this.amt + 1));
    }
  }
}