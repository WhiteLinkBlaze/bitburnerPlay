import {Member} from "gang/member.js"

/** @param {NS} ns */
export async function main(ns) {
  if (!ns.gang.inGang()) {
    ns.tprint(ns.gang.createGang("Slum Snakes"));
  }
  let items = ns.gang.getEquipmentNames();
  // let tasks = ["Mug People", "Deal Drugs", "Strongarm Civilians", "Run a Con", "Armed Robbery", "Traffick Illegal Arms", "Threaten & Blackmail", "Human Trafficking"];
  let tasks = ["Mug People", "Strongarm Civilians", "Armed Robbery", "Traffick Illegal Arms", "Human Trafficking"];
  let otherGangs = ["The Black Hand", "Tetrads", "The Syndicate", "The Dark Army", "Speakers for the Dead", "NiteSec"];
  let count = 0;
  let name = "name";
  let memberList = [];
  while (true) {
    let members = ns.gang.getMemberNames();
    let money = ns.getPlayer().money;
    let chanceAvg = 0;
    let territoryCount = 0;
    let taskIndex = 0;
    let memberAvg = [];
    let otherGangsInfo = ns.gang.getOtherGangInformation();
    count = members.length;
    if (ns.gang.canRecruitMember()) {
      while (ns.gang.getMemberNames(name + count).findIndex >= 0) count++;
      ns.gang.recruitMember(name + count);
      members = ns.gang.getMemberNames();
      count = members.length;
      continue;
    }


    for (let i in otherGangs) {
      let otherGang = otherGangs[i];
      let otherGangInfo = otherGangsInfo[otherGang];
      if(otherGangInfo.territory != 0){
        chanceAvg += ns.gang.getChanceToWinClash(otherGang.name);
        territoryCount++;
      }
    }
    chanceAvg /= territoryCount;
    for (let i in members) {
      let member = members[i];
      //member = new Member(members[i]);
      let memberInfo = ns.gang.getMemberInformation(member);
      let str = memberInfo.str;
      let def = memberInfo.def;
      let dex = memberInfo.dex;
      let agi = memberInfo.agi;
      let cha = memberInfo.cha;
      let hac = memberInfo.hack;
      let ascensionResult = ns.gang.getAscensionResult(member);
      if(ascensionResult === undefined){
        ascensionResult = {str:1,def:1,dex:1,agi:1,cha:1,hack:1};
      }
      let asc_str = memberInfo.str_asc_mult * ascensionResult.str;
      let asc_def = memberInfo.def_asc_mult * ascensionResult.def;
      let asc_dex = memberInfo.dex_asc_mult * ascensionResult.dex;
      let asc_agi = memberInfo.agi_asc_mult * ascensionResult.agi;
      let asc_cha = memberInfo.cha_asc_mult * ascensionResult.cha;
      let asc_hack = memberInfo.hack_asc_mult * ascensionResult.hack;
      let checkStat = 0;
      let checkStatList = [0, 0, 0, 0, 0, 0];
      memberAvg.push([member, Math.floor((str + def + dex + agi + cha + hac) / 6)]);
      taskIndex = Math.max(1, Math.floor((memberAvg[i][1])/100));
      taskIndex = taskIndex >= tasks.length ? tasks.length - 1 : taskIndex;
      if (asc_str - memberInfo.str_asc_mult >= 1 + Math.floor(Math.sqrt(Math.log10(str/10)))) checkStatList[0]++;
      if (asc_def - memberInfo.def_asc_mult >= 1 + Math.floor(Math.sqrt(Math.log10(def/10)))) checkStatList[1]++;
      if (asc_dex - memberInfo.dex_asc_mult >= 1 + Math.floor(Math.sqrt(Math.log10(dex/10)))) checkStatList[2]++;
      if (asc_agi - memberInfo.agi_asc_mult >= 1 + Math.floor(Math.sqrt(Math.log10(agi/50)))) checkStatList[3]++;
      if (asc_cha - memberInfo.cha_asc_mult >= 1 ||  (asc_cha - memberInfo.cha_asc_mult >= 0.5 && memberInfo.cha_asc_mult == 1))  checkStatList[4]++;
      if (asc_hack - memberInfo.hack_asc_mult >= 1 || (asc_hack - memberInfo.hack_asc_mult >= 0.5 && memberInfo.hack_asc_mult == 1 )) checkStatList[5]++;
      ns.tprintf("%s:[%s]  %s",getTime(), member, checkStatList);
      for (let k in checkStatList) {
        checkStat += checkStatList[k];
      }
      if (checkStat == 6) {
        ns.gang.ascendMember(member);
        ns.gang.setMemberTask(member, "Train Combat");
        checkStat = 0;
      }
      if (asc_str - memberInfo.str_asc_mult < Math.floor(Math.sqrt(Math.log10(str/10))) ||
        asc_def - memberInfo.def_asc_mult < Math.floor(Math.sqrt(Math.log10(def/10))) ||
        asc_dex - memberInfo.dex_asc_mult < Math.floor(Math.sqrt(Math.log10(dex/10))) ||
        asc_agi - memberInfo.agi_asc_mult < 1) {
        ns.gang.setMemberTask(member, "Train Combat");
      }
      else if (asc_cha - memberInfo.cha_asc_mult < 0.8) {
        //Train Charisma
        ns.gang.setMemberTask(member, "Train Charisma");
      }
      else if (asc_hack - memberInfo.hack_asc_mult < 0.8) {
        //Train Hacking
        ns.gang.setMemberTask(member, "Train Hacking");
      }
      else {
        //task
        ns.gang.setMemberTask(member, tasks[taskIndex]);
      }
      for (let j in items) {
        let item = items[j];
        if (ns.gang.getEquipmentCost(item) < money) {
          ns.gang.purchaseEquipment(member, item);
        }
      }
    }

    memberAvg.sort(function (a, b) {
      if (a[1] > b[1]) {
        return -1;
      }
      else if (a[1] < b[1]) {
        return 1;
      }
      return 0;
    })
    if (members.length == 3) {
      taskIndex = Math.max(1, Math.floor(memberAvg[1][1]/100));
      taskIndex = taskIndex >= tasks.length ? tasks.length - 1 : taskIndex;
      ns.gang.setMemberTask(memberAvg[1][0], tasks[taskIndex]);
    }
    if (members.length >= 4) {
      ns.gang.setMemberTask(memberAvg[0][0], "Vigilante Justice");
      console.log(ns.sprintf("%s: chance Average %.2f%%",getTime(), chanceAvg * 100));
      if (chanceAvg < 0.95) ns.gang.setTerritoryWarfare(false);
      else ns.gang.setTerritoryWarfare(true);
      //Terrorism
      ns.gang.setMemberTask(memberAvg[1][0], "Terrorism");
      taskIndex = Math.max(1, Math.floor((memberAvg[3][1])/100));
      taskIndex = taskIndex >= tasks.length ? tasks.length - 1 : taskIndex;
      //Territory Warfare
      if(memberAvg[2][1] > 500) ns.gang.setMemberTask(memberAvg[2][0], "Territory Warfare");
      else ns.gang.setMemberTask(memberAvg[2][0], tasks[taskIndex]);
      ns.gang.setMemberTask(memberAvg[3][0], tasks[taskIndex]);
    }
    await ns.asleep(5000);
  }
}

function getTime(){
  let timeStamp = new Date().getTime();
  let date = new Date(timeStamp);
  let hour = ("0" + date.getHours()).slice(-2);
  let minute = ("0" + date.getMinutes()).slice(-2); 
  let second = ("0" + date.getSeconds()).slice(-2);
  let returnDate = hour + ":" + minute + ":" + second;
  return returnDate;
}