/** @param {NS} ns */
export async function main(ns) {
  let list = ns.ls("home",ns.args[0]);
  for(let i in list)
  {
    ns.tprint(list[i]);
    ns.mv("home",list[i],ns.args[1]+"/"+list[i]);
  }
}