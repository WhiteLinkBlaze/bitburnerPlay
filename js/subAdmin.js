import {Port} from "js/checkOpenablePort.js";


/** @param {NS} ns */
export async function main(ns) {
  let name = "home";
  let lvCheck = 0;
  let externalServerCheck = 0;
  let torCheck = 0;
  let minServerRam = 0;
  let numPortProgram = checkPortProgram(ns,ns.ls("home",".exe"));
  let teraCheck = 0;
  let somthing = 0;
  //ns.scriptKill("js/subAdmin.js","home");
  while(true)
  {
    let delay = 10000;
    let servers = ns.getPurchasedServers();
    let myMoney = ns.getPlayer().money;
    let count = servers.length;    
    let cost = ns.getPurchasedServerCost(2**5);
    let beforePort = Port.checkOpenablePort(ns);
    servers = servers.sort(function (a, b) {
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
    
    if(servers.length == 25 && servers.length != 0 && minServerRam != ns.getServerMaxRam(servers[0])){
      if(teraCheck != 1){
        ns.scriptKill("js/serverManager.js","home");
        ns.run("js/allInOne.js");
        ns.run("js/serverManager.js",1, Math.floor(512/ns.getServerMaxRam(servers[0]))+2);
      }
      else{
        ns.scriptKill("js/serverManager.js","home");
        ns.scriptKill("test/useExternalServer.js","home");
        ns.run("test/useExternalServer.js");
      }
      minServerRam = ns.getServerMaxRam(servers[0]);
    }
    if(teraCheck == 1 && somthing == 0)
    {
      ns.scriptKill("js/serverManager.js","home");
      ns.scriptKill("test/useExternalServer.js","home");
      ns.run("test/useExternalServer.js");
      somthing = 1;
    }
    for(let i = 0; i < count; i++)
    {
      let maxRam = ns.getServerMaxRam(servers[i]);
      let upgradeCost = ns.getPurchasedServerUpgradeCost(servers[i],maxRam*2);
      
      if(ns.upgradePurchasedServer(servers[i],maxRam*2)){
        ns.tprintf("[%s] upgrade Server %d, used cost %dk",servers[i], maxRam*2, upgradeCost/1000);
      }
    }
    if(ns.getPurchasedServerLimit() != count && cost <= myMoney)
    {
      ns.purchaseServer(name+count,2**5);
      ns.tprintf("[%s] purchase Server name: %s", "home", "home"+count);
    }
    //first server purchase
    if(teraCheck != 1 && externalServerCheck == 0 && count == 1){
      ns.run("js/serverManager.js");
      externalServerCheck = 1;
    }
    if(lvCheck == 0 && ns.getHackingLevel()%50 == 0){
      //ns.run("js/allInOneByFile.js");
      lvCheck = 1;
    }
    if(numPortProgram[5] != Port.checkOpenablePort(ns)[5])
    {
      numPortProgram = Port.checkOpenablePort(ns);
      //ns.run("js/allInOneByFile.js");
    }
    if(minServerRam >= 2**13){
      teraCheck = 1;
    }
    await ns.asleep(delay);
  }
}


function checkPortProgram(ns,arr){
  let count = 0;
  let programCount = 0;
  let portProgramList = ns.read("portProgramList.txt");
  let results = [0,0,0,0,0,-1];
  portProgramList = portProgramList.split('\r\n');
  for(let i = 0; i < portProgramList.length;i++)
  {
    if(arr.indexOf(portProgramList[i]) != -1)
    {
      results[i] = 1;
      programCount = count++;
    }
  }
  results[results.length - 1] = programCount;
  return results;
}
