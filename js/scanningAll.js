/** @param {NS} ns */
export async function main(ns) {
    let serverList = scanningStack(ns,"home");
    let fileName = "/scanningAll.txt";
    let result = "";
    ns.rm(fileName);
    //ns.tprint(serverList);
    for(let i in serverList)
    {
       result += serverList[i] + ",";
    }
    ns.write(fileName, result.slice(0,result.length-1), "w"|"a");
}
function scanningStack(ns,startServer)
{
  let result = [];
  let stack = [];
  result.push(startServer);
  stack.push(startServer);
  while(stack.length != 0)
  {
    let curServer = stack.pop();
    let scanResult = ns.scan(curServer);
    for(let i in scanResult)
    {
      if(scanResult[i].indexOf("home") >= 0)continue;
      if(result.findIndex((element) => element === scanResult[i]) < 0){
        stack.push(scanResult[i]);
        result.push(scanResult[i]);
      }
    }
  }
  return result;
}