/** @param {NS} ns */
export async function main(ns) {
  let serverName        = ns.args[0];
  let numThread         = ns.args[1];
  let numGrow           = Math.round(1 + numThread*0.5);
  let numWeaken         = Math.round(1 + numThread*0.3);
  let numHack           = Math.round(1 + numThread*0.2);
  ns.tprintf("[%s]  start hackingFile.js", serverName);
  while (true) {
    let earnedMoney = 0;
    let statusList        = status(ns, serverName);
    let availMoney        = statusList[0];
    let maxMoney          = statusList[1];
    let securityLevel     = statusList[2];
    let minSecurityLevel  = statusList[3];
    let securityChance    = statusList[4];
    for(let i = 0; i<numWeaken  && securityLevel  > minSecurityLevel*1.1;i++) await ns.weaken(serverName);
    for(let i = 0; i<numGrow    && availMoney     < maxMoney * 0.9 ;i++) await ns.grow(serverName);
    for(let i = 0; i<numHack    && availMoney >= maxMoney  * 0.5; i++)   earnedMoney = await ns.hack(serverName);
    if(maxMoney == 0) 
    {
      ns.tprintf("[%s]  This server has no more Money", serverName);
      break;
    }
  }
}

function status(ns, serverName)
{
  let results = ns.read("/status/"+serverName+"ServerStatus.txt");
  results = results.split(",");
  for(let i = 0; i < results.length; i++)
  {
    results[i] = Number(results[i]);
  }
  return results;
}