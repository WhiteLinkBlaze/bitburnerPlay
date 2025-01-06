var localPath = "/status/";
/** @param {NS} ns */
export async function main(ns) {
  let neighbor = readScanningFile(ns);
  while(true)
  {
    await postServerSatusFile(ns, neighbor);
    await ns.asleep(60000);
  }
}
function readScanningFile(ns) {
  let neighbors = ns.read("/runningServer.txt");
  neighbors = neighbors.split(`,`);
  neighbors.pop();
  ns.tprint(neighbors);
  //
  return neighbors;
}
async function postServerSatusFile(ns, neighbor)
{
  for (let i = 0; i < neighbor.length; i++) {
    let curNeighbor = neighbor[i];
    //ns.tprintf("start %s postServerStatusFile", curNeighbor);
    makeServerStatusFile(ns,curNeighbor);
    ns.scp(localPath+curNeighbor+"ServerStatus.txt", curNeighbor, "home");
  }
}

function makeServerStatusFile(ns, serverName)
{
  let availMoney = ns.getServerMoneyAvailable(serverName);
  let maxMoney = ns.getServerMaxMoney(serverName);
  let minSecurityLevel = ns.getServerMinSecurityLevel(serverName);
  let securityLevel = ns.getServerSecurityLevel(serverName);
  let serverhackChance = ns.hackAnalyzeChance(serverName);
  
  let fileName = serverName + "ServerStatus.txt";
  ns.rm(localPath + fileName);
  let results = [availMoney, maxMoney, securityLevel, minSecurityLevel, serverhackChance];
  // ns.tprintf("[%s]  ServerStatus File Updated",serverName);
  // ns.tprintf("[%s] start ServerStatus     ", serverName);
  // ns.tprintf("[%s] remaining Money        %0.2f$",serverName,maxMoney - availMoney);
  // ns.tprintf("[%s] Security               %0.2f",serverName,securityLevel - minSecurityLevel);
  // ns.tprintf("[%s] hackChance             %0.2f%%", serverName, serverhackChance*100);
  ns.write(localPath + fileName, results[0], "w" | "a");
  for (let i = 1; i < results.length; i++) {
    ns.write(localPath + fileName, "," + results[i], "w" | "a");
  }
  ns.scp(localPath+fileName,serverName,"home");
}

