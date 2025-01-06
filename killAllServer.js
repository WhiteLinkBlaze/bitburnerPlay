/** @param {NS} ns */
export async function main(ns) {
  if(ns.args.length == 1){
    let list = ns.args[0];
    ns.killall(list);
  }
  else{
    let list = ns.getPurchasedServers();
    for(let i in list){
      ns.killall(list[i]);
    }
  }
}