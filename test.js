/** @param {NS} ns */
export async function main(ns) {
  let list = ns.read("runningServer.txt").split(",");
  list.pop();
  for(let i in list)
  {
    let growth = ns.getServerGrowth(list[i]);
    let maxMoney = ns.getServerMaxMoney(list[i]);
    let cpuCores = ns.getServer(list[i]).cpuCores;
    let growthAnalyze = Math.ceil(Math.max(1,ns.growthAnalyze(list[i],10,cpuCores)));
    let growThreads =  ns.formulas.hacking.growThreads(ns.getServer(list[i]),ns.getPlayer(),ns.getServerMaxMoney(list[i]))
    ns.tprintf("[%s]  %d               %d    %d",list[i],growthAnalyze,growth,growThreads);
    ns.tprintf("[%s]  %d %.2f  %.2f  %d",list[i], maxMoney,Math.log10(maxMoney), Math.log(maxMoney), 10000 * growth/10 * ( 1 - growth/100));
    ns.tprintf("[%s]  %d",list[i],ns.getServer(list[i]).cpuCores);
    ns.tprintf("[%s]  %.2f",list[i], Math.sqrt(maxMoney)/(growth/10));
  }
}