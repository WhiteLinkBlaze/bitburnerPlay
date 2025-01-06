const initGrowFile = "oneTime/grow.js";
const initWeakenFile = "oneTime/weaken.js";
const initHackFile = "oneTime/hack.js";
var oneBlockTime = 500;
/** @param {NS} ns */
export async function main(ns) {
  let serverName = ns.args[0];
  let hostName = ns.getHostname();
  let delay = 1000;
  let check = 0;
  let growth = ns.getServerGrowth(serverName);
  console.clear();
  fileInit(ns, serverName, hostName);

  let growSecurity = ns.growthAnalyzeSecurity(1);
  let hackSecurity = ns.hackAnalyzeSecurity(1);
  let weakSecurity = ns.weakenAnalyze(1);
  killRelatedProgram(ns, hostName);

  //initServer
  let serverMaxMoney = ns.getServerMaxMoney(serverName);
  let minSecurityLevel = ns.getServerMinSecurityLevel(serverName);
  let maxRam = ns.getServerMaxRam(hostName);
  let totalThread = Math.floor((maxRam - ns.getServerUsedRam(hostName)) / 1.75);
  let serverMoneyAvailable = ns.getServerMoneyAvailable(serverName);

  let money = serverMaxMoney;
  let units = [" ", "k", "m", "b", "t"];
  let unitIndex = Math.floor(Math.log10(money));
  money = money / (10 ** unitIndex);
  money = money * (10 ** (unitIndex - Math.floor(unitIndex / 3) * 3));
  unitIndex = Math.floor(unitIndex / 3);
  ns.tprintf("[%s] maxMoney        %.2f %s", ns.args[0], money, units[unitIndex]);

  while (true) {
    serverMoneyAvailable = ns.getServerMoneyAvailable(serverName);
    let securityLevel = ns.getServerSecurityLevel(serverName);
    totalThread = Math.floor((maxRam - ns.getServerUsedRam(hostName)) / 1.75);
    //초기화
    if (serverMaxMoney != serverMoneyAvailable || securityLevel != minSecurityLevel) {
      let initGrowThread = Math.floor(totalThread / 2 * (1-serverMoneyAvailable/serverMaxMoney)) + 1;
      let initWeakenThread = Math.floor(((100 - minSecurityLevel) / weakSecurity));
      initWeakenThread = Math.ceil(totalThread - initGrowThread < initWeakenThread ? totalThread - initGrowThread : initWeakenThread);
      initWeakenThread = initWeakenThread <= 0 ? 1 : initWeakenThread;
      //ns.tprintf("[%s] %f %f", hostName, initGrowThread, initWeakenThread);
      ns.run(initGrowFile, initGrowThread, serverName);
      ns.run(initWeakenFile, initWeakenThread, serverName);
      await ns.asleep(ns.getWeakenTime(serverName) + delay);
      continue;
    }
    await ns.asleep(delay);
    ns.tprintf("[%s] initialized ", hostName);

    if (check == 0) break;
  }
  //비동기 스레드 관리
  let growTime = ns.getGrowTime(serverName);
  let hackTime = ns.getHackTime(serverName);
  let weakTime = ns.getWeakenTime(serverName);
  let hackAllAvailMoneyThread = Math.ceil(ns.hackAnalyzeThreads(serverName, serverMoneyAvailable));
  totalThread = Math.floor((maxRam - ns.getServerUsedRam(hostName)) / 1.75);
  serverMoneyAvailable = ns.getServerMoneyAvailable(serverName);
  oneBlockTime = hackTime * 0.01;
  let limitGrow = Math.ceil(Math.min(totalThread * 0.15 , totalThread * 0.15 * Math.abs(1 - growth/100) + hackAllAvailMoneyThread * growth/2));

  console.log(ns.sprintf("[%s] hack chance: %.2f%%", serverName, ns.hackAnalyzeChance(serverName) * 100));
  console.log(ns.sprintf("[%s] avail thread:  %d", serverName, hackAllAvailMoneyThread));
  console.log(ns.sprintf("[%s] server Growth: %d", serverName, growth));
  console.log(ns.sprintf("[%s] time: %.2f, %.2f, %.2f, %.2f", serverName, oneBlockTime, weakTime, hackTime, growTime));
  ns.tprintf("[%s] hack all avail Money thread %d", serverName, hackAllAvailMoneyThread);
  while (true) {
    growTime = Math.ceil(ns.getGrowTime(serverName));
    hackTime = Math.ceil(ns.getHackTime(serverName));
    weakTime = Math.ceil(ns.getWeakenTime(serverName));
    oneBlockTime = hackTime*0.01;
    oneBlockTime = oneBlockTime < 100 ? hackTime*0.1:oneBlockTime;
    if (ns.getServerSecurityLevel(serverName) - minSecurityLevel > 0) {
      await ns.asleep(oneBlockTime);
    }
    let growThread = 1 + Math.floor(totalThread * 0.15);
    let hackThread = 1 + Math.min(Math.floor(growThread * growth / 1000) , Math.floor(totalThread * 0.05));
    let weakThreadRato = Math.ceil(growThread * ((growSecurity + hackSecurity) / weakSecurity));
    let weakThread = 1 + Math.min(weakThreadRato, totalThread * 0.1);
    if (hackAllAvailMoneyThread * 10 + hackAllAvailMoneyThread *
      ((100 - minSecurityLevel) / weakSecurity) <= totalThread) {
      growThread = Math.round(totalThread * 0.15 + hackAllAvailMoneyThread * 10);
      hackThread = Math.ceil(hackAllAvailMoneyThread);
      weakThread = 1 + Math.ceil((growThread + hackThread) * ((growSecurity + hackSecurity) / weakSecurity));
    }
    //ns.tprint(weakThread);
    growThread = Math.min( limitGrow , growThread);
    hackThread = Math.min(hackThread , hackAllAvailMoneyThread);
    hackThread = hackThread < 0 ? 1 : hackThread;
    weakThread = Math.min(weakThread, (100 - minSecurityLevel)/weakSecurity);
    if (Math.floor((maxRam - ns.getServerUsedRam(hostName)) / 1.75) >= growThread + hackThread + weakThread) {
      //total 스레드 용량에 따른 비율 조정
      //ns.tprintf("%f %f %f", growThread, hackThread, weakThread);
      batch(ns, serverName, hackThread, weakThread, growThread, hackTime, growTime, weakTime, serverMaxMoney);
    }
    await ns.asleep(oneBlockTime * 2);
  }

}

/** @param {NS} ns */
function killRelatedProgram(ns, hostName) {
  ns.scriptKill(initGrowFile, hostName);
  ns.scriptKill(initWeakenFile, hostName);
  ns.scriptKill(initHackFile, hostName);

}

function fileInit(ns, serverName, hostName) {
  ns.scp(initGrowFile, serverName, "home");
  ns.scp(initWeakenFile, serverName, "home");
  ns.scp(initHackFile, serverName, "home");
  ns.scp(initGrowFile, hostName, "home");
  ns.scp(initWeakenFile, hostName, "home");
  ns.scp(initHackFile, hostName, "home");
}

/** @param {NS} ns */
async function batch(ns, serverName, hackThread, weakThread, growThread, hackTime, growTime, weakTime, maxMoney) {
  let hackOffset = weakTime - hackTime - oneBlockTime * 0.5;
  let weakOffset = oneBlockTime;
  let growOffset = weakTime + weakOffset * 0.5 - growTime;

  //weak1
  ns.run(initWeakenFile, weakThread, serverName, 0);
  //hack + offset
  ns.run(initHackFile, hackThread, serverName, hackOffset, 0, maxMoney);
  //weak2
  ns.run(initWeakenFile, weakThread, serverName, weakOffset);
  //grow + offset
  ns.run(initGrowFile, growThread, serverName, growOffset);
  //(weak - block) ~ (block + weak)
}
