import {ServerInfo} from "js/serverInfo.js"
/** @param {NS} ns */
export async function main(ns) {
  let scanList = ns.read("/runningServer.txt");
  scanList = scanList.split(',');

  let targetList = []
  for(let i in scanList)
  {
    ServerInfo.makeServerInfo(ns,scanList[i]);
    targetList.push(new ServerInfo(scanList[i],ns.read("/servers/"+scanList[i]+".txt")));
    ns.killall(scanList[i]);
  }
  targetList = targetList.sort(function (a, b) {
    if ( a.maxMoney / a.growthTime >  b.maxMoney / b.growthTime) {
      return -1;
    }
    if (a.maxMoney / a.growthTime < b.maxMoney / b.growthTime) {
      return 1;
    }
    return 0;
  });
  let purchaseServer = ["home"];
  purchaseServer = purchaseServer.concat(ns.getPurchasedServers());
  ns.tprint(purchaseServer);
  for(let i  = 0; i < purchaseServer.length && i < targetList.length; i++)
  {
    ns.scriptKill("test/scheduledServerManager.js",purchaseServer[i]);
    if(i != 0)ns.killall(purchaseServer[i]);
    ns.run("/killAllServer.js",1, targetList[i].serverName);
    ns.scp("test/scheduledServerManager.js", purchaseServer[i], "home");
    ns.exec("test/scheduledServerManager.js", purchaseServer[i], 1, targetList[i].serverName);
  }
}