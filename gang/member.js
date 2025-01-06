/** @param {NS} ns */
export class Member {
  memberInfo;
  asc_str;
  asc_def;
  asc_dex;
  asc_agi;
  asc_cha;
  asc_hack;
  averageStat = 0;
  constructor(ns, memberName) {
    this.memberInfo = ns.gang.getMemberInformation(memberName);
    let ascensionResult = ns.gang.getAscensionResult(memberName);
    if(ascensionResult === undefined){
      ascensionResult = {str:1,def:1,dex:1,agi:1,cha:1,hack:1};
    }
    this.asc_str = this.memberInfo.str_asc_mult * ascensionResult.str;
    this.asc_def = this.memberInfo.def_asc_mult * ascensionResult.def;
    this.asc_dex = this.memberInfo.dex_asc_mult * ascensionResult.dex;
    this.asc_agi = this.memberInfo.agi_asc_mult * ascensionResult.agi;
    this.asc_cha = this.memberInfo.cha_asc_mult * ascensionResult.cha;
    this.asc_hack = this.memberInfo.hack_asc_mult * ascensionResult.hack;
    this.averageStat = Math.floor((this.memberInfo.str + this.memberInfo.def + this.memberInfo.dex + this.memberInfo.agi + this.memberInfo.cha + this.memberInfo.hack)/6);
  }
  update(ns)
  {
    this.memberInfo = ns.gang.getMemberInformation(this.memberInfo.name);
    let ascensionResult = ns.gang.getAscensionResult(this.name);
    if(ascensionResult === undefined){
      ascensionResult = {str:1,def:1,dex:1,agi:1,cha:1,hack:1};
    }
    this.asc_str = this.memberInfo.str_asc_mult * ascensionResult.str;
    this.asc_def = this.memberInfo.def_asc_mult * ascensionResult.def;
    this.asc_dex = this.memberInfo.dex_asc_mult * ascensionResult.dex;
    this.asc_agi = this.memberInfo.agi_asc_mult * ascensionResult.agi;
    this.asc_cha = this.memberInfo.cha_asc_mult * ascensionResult.cha;
    this.asc_hack = this.memberInfo.hack_asc_mult * ascensionResult.hack;
    this.averageStat =(this.memberInfo.str + this.memberInfo.def + this.memberInfo.dex + this.memberInfo.agi + this.memberInfo.cha + this.memberInfo.hack)/6;
  }
  get name()
  {
    return this.memberInfo.name;
  }
  get str()
  {
    return this.memberInfo.str;
  }
  get asc_str()
  {
    return this.asc_str;
  }
  get def()
  {
    return this.memberInfo.def;
  }
  get asc_def()
  {
    return this.asc_def;
  }get dex()
  {
    return this.memberInfo.dex;
  }
  get asc_dex()
  {
    return this.asc_dex;
  }get agi()
  {
    return this.memberInfo.agi;
  }
  get asc_agi()
  {
    return this.asc_agi;
  }get cha()
  {
    return this.memberInfo.cha;
  }
  get asc_cha()
  {
    return this.asc_cha;
  }get hack()
  {
    return this.memberInfo.hack;
  }
  get asc_hack()
  {
    return this.asc_hack;
  }
  get averageStat()
  {
    return this.averageStat;
  }
  get memberInfo()
  {
    return this.memberInfo;
  }
}