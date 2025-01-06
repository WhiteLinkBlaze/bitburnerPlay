/** @param {NS} ns */
export async function main(ns) {
  let count = 0;
  let list = ns.read("/scanning15.txt");
  list = list.split(',');
  for(let i in list)
  {
    if(ns.getServerRequiredHackingLevel(list[i]) > ns.getHackingLevel())
    {
      ns.tprintf("[%s]  hackLv    %d",list[i],ns.getServerRequiredHackingLevel(list[i]));
      ns.tprintf("[%s]  maxMoney  %.2f",list[i],ns.getServerMaxMoney(list[i]));
    }
    count++;
  }
  ns.tprintf("total server %d",count);
}