import { ServerInfo } from "js/serverInfo.js"

var ratioServer = 10;
/** @param {NS} ns */
export async function main(ns) {
  console.clear();
  if(ns.args.length >= 1) ratioServer = ns.args[0];
  let targets = filterRunningServer(ns);
  let targetList = [];
  let targetMaxEff = 0;
  ns.tprint(targets);
  targetList = targets.sort(function (a, b) {
    if (a.maxMoney / a.growthTime > b.maxMoney / b.growthTime) {
      return -1;
    }
    if (a.maxMoney / a.growthTime < b.maxMoney / b.growthTime) {
      return 1;
    }
    return 0;
  });
  ns.tprint(targetList);
  ns.tprint(targetList[0].serverName);
  let beforeTarget = [];
  let runningServerList = ns.getPurchasedServers();
  if(ns.args.length >= 2)runningServerList.push("home");
  //runningServerList.push("home");
  for (let i = 0; i < runningServerList.length; i++) {
    ns.scriptKill("js/grow.js", runningServerList[i]);
    ns.scriptKill("js/weak.js", runningServerList[i]);
    ns.scriptKill("js/hack.js", runningServerList[i]);
  }
  if (runningServerList.length < ratioServer) ratioServer = runningServerList.length;
  for (let i = 0; i < runningServerList.length / ratioServer; i++) {
    beforeTarget.push(new ServerInfo(targetList[i].serverName, ns.read(ServerInfo.path + targetList[i].serverName + ".txt")));
    resideProgram(ns, runningServerList, targetList[i], i);
  }

  while (true) {
    let delay = 1000;
    runningServerList = ns.getPurchasedServers();
    //runningServerList.push("home");
    for (let i = 0; i < beforeTarget.length; i++) {
      running(ns, runningServerList, targetList[i], i, beforeTarget[i]);
    }
    await ns.asleep(delay);
  }
}
//running function
/** @param {NS} ns */
function running(ns, runningServerList, targetServer, sep, beforeTarget) {
  let check = 0;
  if (beforeTarget.availMoney != targetServer.availMoney
    || beforeTarget.securityLevel != targetServer.securityLevel) {
    beforeTarget.update(ns);
    check = 1;
  }
  for (let i = sep * ratioServer; i < runningServerList.length && i < (sep + 1) * ratioServer; i++) {
    ns.scp("js/weak.js", runningServerList[i], "home");
    ns.scp("js/grow.js", runningServerList[i], "home");
    ns.scp("js/hack.js", runningServerList[i], "home");
  }
  let growSecurity = ns.growthAnalyzeSecurity(1,targetServer.serverName);
  let hackSecurity = ns.hackAnalyzeSecurity(1,targetServer.serverName);
  let security = ns.weakenAnalyze(1);
  let securityRatio = (growSecurity + hackSecurity)/security;
  for (let i = sep * ratioServer; i < runningServerList.length && i < (sep + 1) * ratioServer; i++) {
    let totalThread = Math.round(((ns.getServerMaxRam(runningServerList[i]) - ns.getServerUsedRam(runningServerList[i])) / 1.75));
    let threadRateGrow = 1 + Math.round(totalThread * ((targetServer.maxMoney*1.5 - targetServer.availMoney)/(targetServer.maxMoney*1.5)));
    let threadRateSec = threadRateGrow * securityRatio;
    threadRateSec = Math.round(threadRateSec > (100 - targetServer.minSecurityLevel)/ns.weakenAnalyze(1) ?(100 - targetServer.minSecurityLevel)/security: threadRateSec);
    totalThread -= (threadRateGrow + threadRateSec);
    let threadRateHack = Math.round(totalThread);
    threadRateHack = Math.round(threadRateHack > ns.hackAnalyzeThreads(targetServer.serverName,targetServer.availMoney) ? ns.hackAnalyzeThreads(targetServer.serverName,targetServer.availMoney): threadRateHack);
    
    if (threadRateSec > 0 && targetServer.securityLevel > targetServer.minSecurityLevel) {
      ns.exec("js/weak.js", runningServerList[i], threadRateSec, targetServer.serverName);
      threadRateSec = 0;
    }
    if (threadRateGrow > 0) {
      ns.exec("js/grow.js", runningServerList[i], threadRateGrow, targetServer.serverName);
      threadRateGrow = 0;
    }
    if (threadRateHack > 0 && targetServer.maxMoney * 0.95 <= targetServer.availMoney) {
      ns.exec("js/hack.js", runningServerList[i], threadRateHack, targetServer.serverName);
      threadRateHack = 0;
    }

    // if (targetServer.maxMoney * 0.999 < targetServer.availMoney) ns.scriptKill("js/grow.js", runningServerList[i]);
    // if (targetServer.minSecurityLevel >= targetServer.securityLevel) ns.scriptKill("js/weak.js", runningServerList[i]);
    // if (targetServer.maxMoney * 0.4 >= targetServer.availMoney
    //   || targetServer.minSecurityLevel * 3 <= targetServer.securityLevel) ns.scriptKill("js/hack.js", runningServerList[i]);
  }
  ServerInfo.makeServerInfo(ns, targetServer.serverName);
  targetServer.update(ns);
  if (check == 1) {
    targetServer.showInfoConsole(ns);
    //ns.tprintf("[%s]  hackChance      %0.2f%%", targetServer.serverName, targetServer.hackChance * 100);
  }
}

/** @param {NS} ns */
function filterRunningServer(ns) {
  let results = [];
  let scanList = ns.read("/scanning15.txt");
  scanList = scanList.split(',');

  for (let i = 0; i < scanList.length; i++) {
    let target = scanList[i];
    ServerInfo.makeServerInfo(ns, target);
    target = new ServerInfo(target, ns.read(ServerInfo.path + target + ".txt"));
    if (checkRootAccess(ns, target)) {
      results.push(target);
    }
  }
  return results;
}

function checkPortProgram(ns) {
  let count = 0;
  let programCount = 0;
  let portProgramList = ["FTPCrack.exe"
    , "BruteSSH.exe"
    , "relaySMTP.exe"
    , "HTTPWorm.exe"
    , "SQLInject.exe"];
  let list = ns.ls("home", ".exe");
  let results = [0, 0, 0, 0, 0, -1];
  for (let i = 0; i < portProgramList.length; i++) {
    if (list.indexOf(portProgramList[i]) != -1) {
      results[i] = 1;
      programCount = count++;
    }
  }
  results[results.length - 1] = programCount;
  return results;
}

function checkRootAccess(ns, target) {
  let curNeighbor = target.serverName;
  let curHackingLv = ns.getHackingLevel();
  let maxRam = target.maxRam;
  let useThreadNumberCalbyRam = Math.round(maxRam / 2);
  let requiredNumPort = target.requiredNumPort;
  let numPortProgram = checkPortProgram(ns);
  if (ns.hasRootAccess(curNeighbor) == 1) return true;
  if (useThreadNumberCalbyRam == 0) return false;
  if (curHackingLv >= target.hackingLevel
    && requiredNumPort <= numPortProgram[5]) {
    //check openable port   
    if (numPortProgram[0] == 1) ns.ftpcrack(curNeighbor);
    if (numPortProgram[1] == 1) ns.brutessh(curNeighbor);
    if (numPortProgram[2] == 1) ns.relaysmtp(curNeighbor);
    if (numPortProgram[3] == 1) ns.httpworm(curNeighbor);
    if (numPortProgram[4] == 1) ns.sqlinject(curNeighbor);
    //check rootAccess
    if (!ns.hasRootAccess(curNeighbor)) ns.nuke(curNeighbor);
    //check server has money 
    if (ns.getServerMaxMoney(curNeighbor) == 0) return false;
    return true;
  }
  return false;
}

function resideProgram(ns, runningServerList, targetServer, sep) {
  for (let i = sep * ratioServer; i < runningServerList.length && i < (sep + 1) * ratioServer; i++) {
    ns.scp("js/resideWeaken.js", runningServerList[i], "home");
    ns.scp("js/resideGrow.js", runningServerList[i], "home");
    ns.scp("js/resideHack.js", runningServerList[i], "home");
    ns.scriptKill("js/resideWeaken.js", runningServerList[i]);
    ns.scriptKill("js/resideGrow.js", runningServerList[i]);
    ns.scriptKill("js/resideHack.js", runningServerList[i]);
  }
  for (let i = sep * ratioServer; i < runningServerList.length && i < (sep + 1) * ratioServer; i++) {
    let totalThread = Math.round((ns.getServerMaxRam(runningServerList[i]) - ns.getServerUsedRam(runningServerList[i])) / 1.75);
    let threadRateGrow = Math.round(totalThread * 0.5);
    let threadRateSec = Math.round(totalThread * 0.3);
    
    threadRateSec = threadRateSec > (ns.getServerMinSecurityLevel(targetServer.serverName))/ns.weakenAnalyze(1)/2 ?(ns.getServerMinSecurityLevel(targetServer.serverName))/ns.weakenAnalyze(1)/2: threadRateSec;
    let threadRateHack = Math.round(threadRateGrow * 0.1 + targetServer.growthTime/targetServer.hackTime);
    threadRateHack = threadRateHack > 100 ? Math.round((targetServer.growth + targetServer.growthTime/targetServer.hackTime*Math.log(2,threadRateGrow) + 80*(runningServerList.length)/25  )/ ratioServer) : Math.round(threadRateHack/ratioServer);

    if(threadRateGrow >= ns.hackAnalyzeThreads(targetServer.serverName,ns.getServerMoneyAvailable(targetServer.serverName))*10) 
      threadRateHack = Math.round(ns.hackAnalyzeThreads(targetServer.serverName,ns.getServerMoneyAvailable(targetServer.serverName)));
    threadRateHack = threadRateHack <= 0 ? Math.round((targetServer.growth + targetServer.growthTime/targetServer.hackTime*Math.log(2,threadRateGrow) + 80*(runningServerList.length)/25  )/ ratioServer) : threadRateHack; 

    ns.tprintf("[%s]  Hack Program runnning thread num: %d", runningServerList[i],threadRateHack);
    ns.tprintf("[%s]  reside Program runnning thread num: %d", runningServerList[i], threadRateSec + threadRateGrow + threadRateHack);
    ns.exec("js/resideWeaken.js", runningServerList[i], threadRateSec, targetServer.serverName);
    ns.exec("js/resideGrow.js", runningServerList[i], threadRateGrow, targetServer.serverName);
    //ns.exec("js/resideHack.js", runningServerList[i], threadRateHack, targetServer.serverName);
  }
}