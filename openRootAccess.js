import {Port} from "js/checkOpenablePort.js"
/** @param {NS} ns */
export async function main(ns) {
  ns.run("js/scanningAll.js");
  let list = ns.read("/scanningAll.txt");
  list = list.split(',');
  let  runnigServer = "/runningServer.txt";
  let count = 0;
  let record = "";
  ns.rm(runnigServer,"home");
  ns.tprint(list.length);
  for(let i in list)
  {
    if(list[i] !== "darkweb" && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(list[i])){
      let portList = Port.checkOpenablePort(ns);
      Port.openPort(ns, Port.checkOpenablePort(ns), list[i])
      if(portList[5] < ns.getServerNumPortsRequired(list[i]))continue;
      if(!ns.hasRootAccess(list[i]))ns.nuke(list[i]);
      if(ns.getServerMaxMoney(list[i]) == 0) continue;
      count++;
      record += list[i]+",";
    } 
    
  }
  ns.write(runnigServer,record.slice(0,record.length - 1), "w"|"a");
  ns.tprint(count);
}