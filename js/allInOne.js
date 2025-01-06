import {Port} from "js/checkOpenablePort.js"
var localPath = "/status/";
/** @param {NS} ns */
export async function main(ns){
  let curHackingLv = ns.getHackingLevel();
  let count = 0;
  let depth = 15;
  //scan file already have
  if(!ns.fileExists("/scanning" + depth +".txt"))ns.run("js/scanning.js",1,depth);
  let scanningList = ns.read("/scanning" + depth +".txt");
  let neighbor = scanningList.split(',');
  let openablePort = Port.checkOpenablePort(ns);
  let runningServerFile = "/runningServer.txt";
  let hackingFile = "js/hackingFile.js";
  ns.rm(runningServerFile);

  for (let i = 0; i < neighbor.length; i++) {
    let curNeighbor = neighbor[i];
    let maxRam = ns.getServerMaxRam(curNeighbor);
    let useThreadNumberCalbyRam = Math.round(maxRam / 2);
    let requiredNumPort = ns.getServerNumPortsRequired(curNeighbor);
    //do
    makeServerStatusFile(ns, curNeighbor);
    if (curHackingLv >= ns.getServerRequiredHackingLevel(curNeighbor)
      && requiredNumPort <= openablePort[5]) 
    {
      Port.openPort(ns,openablePort,curNeighbor);
      if(!ns.hasRootAccess(curNeighbor)) ns.nuke(curNeighbor);
      if(ns.getServerMaxMoney(curNeighbor) == 0) continue;
      if(useThreadNumberCalbyRam == 0) continue;
      ns.write(runningServerFile, curNeighbor + ",", "w" | "a");
      ns.killall(curNeighbor);
      ns.scp(hackingFile, curNeighbor, "home");
      if (ns.exec(hackingFile, curNeighbor, useThreadNumberCalbyRam, curNeighbor, useThreadNumberCalbyRam) != 0) {
        count++;
        displayInfo(ns,curNeighbor);
        ns.rm(hackingFile, curNeighbor);
      }
    }
  }
  ns.tprintf("total depth %d server number %d",depth,neighbor.length)
  ns.tprintf("start server number %d", count);

  ns.kill("js/serverStatusFileManager.js");
  ns.run("js/serverStatusFileManager.js");
  ns.kill("js/HacknetManager.js");
  ns.run("js/HacknetManager.js");
}

function makeServerStatusFile(ns, serverName)
{
  let availMoney = ns.getServerMoneyAvailable(serverName);
  let maxMoney = ns.getServerMaxMoney(serverName);
  let minSecurityLevel = ns.getServerMinSecurityLevel(serverName);
  let securityLevel = ns.getServerSecurityLevel(serverName);
  let hackChance = ns.hackAnalyzeChance(serverName);
  
  let fileName = serverName + "ServerStatus.txt";
  ns.rm(localPath+fileName);
  let results = [availMoney, maxMoney, securityLevel, minSecurityLevel, hackChance];

  ns.tprintf("[%s] make ServerStatus     ",serverName);
  ns.write(localPath+fileName, results[0], "w" | "a");
  for (let i = 1; i < results.length; i++) {
    ns.write(localPath+fileName, "," + results[i], "w" | "a");
  }
  ns.scp(localPath+fileName,serverName,"home");
}

function displayInfo(ns,serverName)
{
  let curNeighbor = serverName;
  let maxRam = ns.getServerMaxRam(curNeighbor);
  let useThreadNumberCalbyRam = Math.round(maxRam / 2);
  let requiredNumPort = ns.getServerNumPortsRequired(curNeighbor);
  let hackAnal = (ns.hackAnalyze(curNeighbor)*useThreadNumberCalbyRam);
  ns.tprint("---------------------------------------------------------------");
  ns.tprint("host name:         " + curNeighbor);
  ns.tprint("use thread number: " + useThreadNumberCalbyRam);
  ns.tprint("available money:   " + ns.getServerMoneyAvailable(curNeighbor));
  ns.tprint("max money:         " + ns.getServerMaxMoney(curNeighbor));
  ns.tprint("required port num: " + requiredNumPort);
  ns.tprint("runnig " + curNeighbor + " thread number " + useThreadNumberCalbyRam);
  ns.tprint("hack analyze:      " + ns.hackAnalyze(curNeighbor) + "/ " + hackAnal);
  ns.tprint("hack moeny:        " + hackAnal * ns.getServerMoneyAvailable(curNeighbor));
  ns.tprint("hack chacnce:      " + ns.hackAnalyzeChance(curNeighbor));
  ns.tprint("growth analyze:    " + Math.ceil(ns.growthAnalyze(curNeighbor, 2)));
  ns.tprint("---------------------------------------------------------------");
}
