/** @param {NS} ns */
export async function main(ns) {
  let curHackingLv = ns.getHackingLevel();
  let beforeHackingLv = curHackingLv;
  let purchasedServers = ["home"];
  purchasedServers = purchasedServers.concat(ns.getPurchasedServers());
  let minServerRam = ns.getServerMaxRam(purchasedServers[purchasedServers.length - 1]);
  ns.scriptKill("test/purchaseServer.js", ns.getHostname());
  ns.run("test/purchaseServer.js");
  ns.scriptKill("js/HacknetManager.js", ns.getHostname());
  ns.run("js/HacknetManager.js");
  ns.run("openRootAccess.js");
  while (true) {
    curHackingLv = ns.getHackingLevel();
    if (curHackingLv != beforeHackingLv) {
      ns.run("openRootAccess.js");
      beforeHackingLv = curHackingLv;
    }

    purchasedServers = ["home"];
    purchasedServers = purchasedServers.concat(ns.getPurchasedServers());
    if (purchasedServers.length >= 2) {
      purchasedServers = purchasedServers.sort(function (a, b) {
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
      let curMaxRam = ns.getServerMaxRam(purchasedServers[0]);
      if(purchasedServers[0] == "home")curMaxRam = ns.getServerMaxRam(purchasedServers[1]);
      if (curMaxRam >= 2 ** 12 && minServerRam != curMaxRam) {
        minServerRam = curMaxRam;
        ns.run("test/useExernalServer.js");
      }
    }

    await ns.asleep(5000);
  }
}