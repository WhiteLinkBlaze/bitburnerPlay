/** @param {NS} ns */
export async function main(ns) {
  // if (ns.args.length >= 2) await ns.asleep(ns.args[1]);
  // let earnedMoney = await ns.hack(ns.args[0]);
  let earnedMoney = 0;
  if(ns.args.length >= 2)earnedMoney = await ns.hack(ns.args[0],{additionalMsec:ns.args[1]});
  else await ns.hack(ns.args[0]);
  if (ns.args.length >= 4) {
    let money = unitMoney(ns,earnedMoney);
    let maxMoney = unitMoney(ns,ns.args[3]);
    if(earnedMoney != 0)console.log(ns.sprintf("[%s] earnedMoney      %s/%s",ns.args[0],money,maxMoney));
    else console.log(ns.sprintf("[%s] no earned",ns.args[0]));
  }
  if (ns.args.length >= 3) await ns.asleep(ns.args[2]);
}
function unitMoney(ns,earnedMoney)
  {
    let money = earnedMoney;
    let units = [" ", "k", "m", "b", "t"];
    let unitIndex = Math.floor(Math.log10(money));
    money = money / (10 ** unitIndex);
    money = money * (10 ** (unitIndex - Math.floor(unitIndex / 3) * 3));
    money = isNaN(money) ? 0 : money;
    unitIndex = Math.floor(unitIndex / 3);
    return ns.sprintf("%.2f %s",money,units[unitIndex]);
  }