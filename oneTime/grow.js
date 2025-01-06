/** @param {NS} ns */
export async function main(ns) {
  // if(ns.args.length >= 2)await ns.asleep(ns.args[1]);
  // await ns.grow(ns.args[0]);
  if(ns.args.length >= 2)await ns.grow(ns.args[0],{additionalMsec:ns.args[1]});
  else await ns.grow(ns.args[0]);
  if(ns.args.length >= 3)await ns.asleep(ns.args[2]);
}