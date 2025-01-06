import {Member} from "gang/member.js"

var otherGangs = ["The Black Hand", "Tetrads", "The Syndicate", "The Dark Army", "Speakers for the Dead", "NiteSec"];
var tasks = ["Mug People", "Strongarm Civilians", "Armed Robbery", "Traffick Illegal Arms", "Human Trafficking"];
var name = "name";
/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  ns.print(ns.gang.createGang("Slum Snakes"));
  
  let items = ns.gang.getEquipmentNames();
  let members = ns.gang.getMemberNames();
  let memberList = [];
  let taskIndex = 0;
  let count = 0;
  for(let i in members){
    let member = members[i];
    memberList.push(new Member(ns, member));
  }

  //loop
  while(true){
    ns.clearLog();
    members = ns.gang.getMemberNames();
    let money = ns.getPlayer().money;
    let chanceAvg = 0;
    let memberAvg = [];
    count = members.length;
    //check memberList
    for(let i = 0; i < memberList.length ; i++){
      if(members.findIndex(element => element === memberList[i].name) < 0) {
        delete memberList[i];
        i--;
        continue;
      }
    }

    //Recruit Member
    if (ns.gang.canRecruitMember()) {
      while (ns.gang.getMemberNames(name + count).findIndex >= 0) count++;
      ns.gang.recruitMember(name + count);
      memberList.push(new Member(ns,name+count));
      members = ns.gang.getMemberNames();
      count = members.length;
      continue;
    }
    
    //Manage task or train
    for(let i in memberList){
      let member = memberList[i];member.update(ns);
      let memberInfo = member.memberInfo;
      let checkStat = 0;
      let checkStatList = [0, 0, 0, 0, 0, 0];
      memberAvg.push([member.name, member.averageStat]);
      taskIndex = Math.max(1, Math.floor((memberAvg[i][1])/100));
      taskIndex = taskIndex >= tasks.length ? tasks.length - 1 : taskIndex;

      //Ascend check
      checkStatList = ascendCheck(member,memberInfo);
      ns.printf("%s:[%s]  %s",getTime(), member.name, checkStatList);
      for (let k in checkStatList) {
        checkStat += checkStatList[k];
      }

      //Ascend
      if (checkStat == 6) {
        ns.gang.ascendMember(member.name);
        ns.gang.setMemberTask(member.name, "Train Combat");
        checkStat = 0;
      }

      
      if (member.asc_str - memberInfo.str_asc_mult < 0.7  ||
        member.asc_def - memberInfo.def_asc_mult < 0.7    ||
        member.asc_dex - memberInfo.dex_asc_mult < 0.7    ||
        member.asc_agi - memberInfo.agi_asc_mult < 0.7 / Math.log10(member.agi/10 + 10)) {
        //Train
        ns.gang.setMemberTask(member.name, "Train Combat");
      }
      else if (member.asc_cha - memberInfo.cha_asc_mult < 0.3 / Math.log10(member.cha + 10)) {
        //Train Charisma
        ns.gang.setMemberTask(member.name, "Train Charisma");
      }
      else if (member.asc_hack - memberInfo.hack_asc_mult < 0.3 / Math.log10(member.hack + 10)) {
        //Train Hacking
        ns.gang.setMemberTask(member.name, "Train Hacking");
      }
      else {
        //Task
        ns.gang.setMemberTask(member.name, tasks[taskIndex]);
      }


      //Buy Equipment
      for (let j in items) {
        let item = items[j];
        if (ns.gang.getEquipmentCost(item) < money) {
          ns.gang.purchaseEquipment(member.name, item);
        }
      }
    }
    //member status avg sorting
    memberAvg.sort(function (a, b) {
      if (a[1] > b[1]) {
        return -1;
      }
      else if (a[1] < b[1]) {
        return 1;
      }
      return 0;
    })
    //other Gangs clash chance
    chanceAvg = chanceToWinClashAverage(ns,otherGangs);

    if (members.length == 3) {
      taskIndex = Math.max(1, Math.floor(memberAvg[1][1]/100));
      taskIndex = taskIndex >= tasks.length ? tasks.length - 1 : taskIndex;
      ns.gang.setMemberTask(memberAvg[1][0], tasks[taskIndex]);
    }
    
    if (members.length >= 4) {
      
      //console.log(ns.sprintf("%s: chance Average %.2f%%",getTime(), chanceAvg * 100));
      if (chanceAvg < 0.8) ns.gang.setTerritoryWarfare(false);
      else ns.gang.setTerritoryWarfare(true);

      taskIndex = Math.max(1, Math.floor((memberAvg[0][1])/100));
      taskIndex = taskIndex >= tasks.length ? tasks.length - 1 : taskIndex;

      ns.gang.setMemberTask(memberAvg[0][0], "Vigilante Justice");
      //Terrorism
      if(memberAvg[1][1] > 500 && chanceAvg < 0.9) ns.gang.setMemberTask(memberAvg[1][0], "Territory Warfare");
      else ns.gang.setMemberTask(memberAvg[1][0], "Terrorism");
      //Territory Warfare
      if(memberAvg[2][1] > 500) ns.gang.setMemberTask(memberAvg[2][0], "Territory Warfare");
      else ns.gang.setMemberTask(memberAvg[2][0], tasks[taskIndex]);
      ns.gang.setMemberTask(memberAvg[3][0], tasks[taskIndex]);
    }

    await ns.asleep(10000);
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

function ascendCheck(member, memberInfo)
{
  let checkStatList = [0,0,0,0,0,0];
  if (member.asc_str - memberInfo.str_asc_mult >= 1 + 0.5/Math.log10(member.str + 10) ) checkStatList[0]++;
  if (member.asc_def - memberInfo.def_asc_mult >= 1 + 0.5/Math.log10(member.def + 10) ) checkStatList[1]++;
  if (member.asc_dex - memberInfo.dex_asc_mult >= 1 + 0.5/Math.log10(member.dex + 10) ) checkStatList[2]++;
  if (member.asc_agi - memberInfo.agi_asc_mult >= 0.7/Math.log10(member.agi/10 + 10)) checkStatList[3]++;
  if (member.asc_cha - memberInfo.cha_asc_mult >= 0.2 +  0.3/Math.log10(member.cha + 10))  checkStatList[4]++;
  if (member.asc_hack - memberInfo.hack_asc_mult >= 0.2 +  0.2/Math.log10(member.hack + 10) ) checkStatList[5]++;
  return checkStatList;
}

function chanceToWinClashAverage(ns, otherGangList){
  let otherGangsInfo = ns.gang.getOtherGangInformation();
  let result = 0;
  let territoryCount = 0;
  for(let i in otherGangList)
  {
    let otherGang = otherGangList[i];
    let otherGangInfo = otherGangsInfo[otherGang];
    if(otherGangInfo.territory != 0)
    {
      result += ns.gang.getChanceToWinClash(otherGang);
      territoryCount++;
    }
  }
  return result/Math.max(territoryCount,1);
}