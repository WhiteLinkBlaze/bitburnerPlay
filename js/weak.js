/** @param {NS} ns */
export async function main(ns) {
  let serverName = ns.args[0];
  await ns.weaken(serverName);
}