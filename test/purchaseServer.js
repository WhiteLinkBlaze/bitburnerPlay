import {Port} from "js/checkOpenablePort.js";


/** @param {NS} ns */
export async function main(ns) {
  let name = "home";
  ns.disableLog('ALL');
  ns.tail();
  while(true)
  {
    ns.clearLog();
    
    let delay = 30000;
    let servers = ns.getPurchasedServers();
    let myMoney = ns.getPlayer().money;
    let count = servers.length;    
    let cost = ns.getPurchasedServerCost(2**5);

    while( myMoney > cost && ns.getPurchasedServerLimit() != count)
    {
      myMoney = ns.getPlayer().money;
      servers = ns.getPurchasedServers();
      count = servers.length;
      ns.purchaseServer(name + count, 2 ** 6);
      await ns.asleep(1000);
    }
    servers = servers.sort(function (a, b) {
        let maxRamA = ns.getServerMaxRam(a);
        let maxRamB = ns.getServerMaxRam(b);
      if (maxRamA > maxRamB) {
        return 1;
      }
      if (maxRamA < maxRamB) {
        return -1;
      }
      return 0;
    });
    for(let i = 0; i < count; i++)
    {
      let maxRam = ns.getServerMaxRam(servers[i]);
      let upgradeCost = ns.getPurchasedServerUpgradeCost(servers[i],maxRam*2);
      
      if(ns.upgradePurchasedServer(servers[i],maxRam*2)){
        ns.printf("[%s] upgrade Server %d, used cost %s",servers[i], maxRam*2, moneyUnit(ns,upgradeCost));
      }
    }
    if(ns.getPurchasedServerLimit() != count && cost <= myMoney)
    {
      ns.purchaseServer(name+count,2**5);
      ns.printf("[%s] purchase Server name: %s", "home", "home"+count);
    }
    await ns.asleep(delay);
  }
}

function moneyUnit(ns, money){
  let units = [" ", "k", "m", "b", "t"];
  let unitIndex = Math.floor(Math.log10(money));
  money = money / (10 ** unitIndex);
  money = money * (10 ** (unitIndex - Math.floor(unitIndex / 3) * 3));
  unitIndex = Math.floor(unitIndex / 3);
  return ns.sprintf("%d%s",money,units[unitIndex]);
}