/** @param {NS} ns */
export async function main(ns) {
  let servers = ns.getPurchasedServers();
  servers.push("home");
  
  for(let i in servers)
  {
    let totalThread = (ns.getServerMaxRam(servers[i]) - ns.getServerUsedRam(servers[i]))/4;
    totalThread = Math.floor(totalThread);
    ns.scriptKill("test/share.js",servers[i]);
    ns.scp("test/share.js",servers[i],"home");
    if(totalThread > 0 )ns.exec("test/share.js",servers[i],totalThread);
  }
}