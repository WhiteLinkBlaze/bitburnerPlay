/** @param {NS} ns */
export async function main(ns) {
  let results = scanning(ns,"home",ns.args[0]);
  let fileName = "/scanning"+ns.args[0]+".txt";
  ns.rm(fileName);
  results = uniqHost(results);
  ns.tprint(results);
  ns.write(fileName,results[0],"w"|"a");
  for(let i = 1; i < results.length; i++)
  {
    ns.write(fileName, ","+results[i], "w" | "a");
  }
  ns.tprintf("test scanning Stack"+scanningStack(ns, "home"));
}
function check(hostname)
{
  let blackList = ["home"];
  for(let i = 0; i < blackList.length; i++){
    if(hostname.includes(blackList[i]))
    {
      return false;
    }
  }
  return true;
}
function uniqHost(arr)
{
  return arr.filter((element, index) => {
    return arr.indexOf(element) === index;
  });
}
function scanning(ns, currentHost, depth)
{
  if(depth == 0)return [];
  let neighbor = ns.scan(currentHost);
  let result = [];
  for(let i = 0; i < neighbor.length; i++)
  {
    let curNeighbor = neighbor[i];
    if(!check(curNeighbor))
    {
      continue;
    }
    result.push(curNeighbor);
    result = result.concat(scanning(ns, curNeighbor, depth - 1));
  }
  return result;
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
      if(result.findIndex((element) => element === scanResult[i]) < 0){
        stack.push(scanResult[i]);
        result.push(scanResult[i]);
      }
    }
  }
  return result;
}