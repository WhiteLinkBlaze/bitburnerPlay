/** @param {NS} ns */
export async function main(ns) {

}

export class ServerInfo
{
  static path = "servers/";
  serverName = "";
  #requiredHackLevel = 0;
  #securityLevel = 0;
  #minSecurityLevel = 0;
  #maxRam = 0;
  #availMoney = 0;
  #maxMoney = 0;
  #growth = 0;
  #growthTime = 0;
  #hackTime = 0;
  #weakTime = 0;
  #hackChance = 0.0;
  constructor(name)
  {
    this.serverName = name;
    //console.log(typeof(arguments[1]));
    if(arguments.length != 1 && typeof(arguments[1]) === "string"){
      let file = arguments[1];
      let keyValueFile = ServerInfo.serverInfoParse(file);
      this.#requiredHackLevel = keyValueFile[0][1];
    
      this.#securityLevel = keyValueFile[1][1];
      this.#minSecurityLevel = keyValueFile[2][1];

      this.#maxRam = keyValueFile[3][1];

      this.#availMoney = keyValueFile[4][1];
      this.#maxMoney = keyValueFile[5][1];
      this.#growth = keyValueFile[6][1];
      this.#growthTime = keyValueFile[7][1];
      this.#hackTime = keyValueFile[8][1];
      this.#weakTime = keyValueFile[9][1];
      this.#hackChance = keyValueFile[10][1];
    }
  }
  
  get serverName() 
  {
    return this.serverName;
  }
  get requiredHackLevel() 
  {
    return this.#requiredHackLevel;
  }
  get securityLevel()
  {
    return this.#securityLevel;
  }
  get minSecurityLevel()
  {
    return this.#minSecurityLevel;
  }
  get maxRam()
  {
    return this.#maxRam;
  }
  get availMoney()
  {
    return this.#availMoney;
  }
  get maxMoney()
  {
    return this.#maxMoney;
  }
  get growth()
  {
    return this.#growth;
  }
  get growthTime()
  {
    return this.#growthTime;
  }
  get hackTime()
  {
    return this.#hackTime;
  }
  get weakTime()
  {
    return this.#weakTime;
  }
  get hackChance()
  {
    return this.#hackChance;
  }
  update(ns)
  {
    let file = ns.read(ServerInfo.path + this.serverName+".txt");
    let keyValueFile = ServerInfo.serverInfoParse(file);
    
    this.#requiredHackLevel = keyValueFile[0][1];
  
    this.#securityLevel = keyValueFile[1][1];
    this.#minSecurityLevel = keyValueFile[2][1];

    this.#maxRam = keyValueFile[3][1];

    this.#availMoney = keyValueFile[4][1];
    this.#maxMoney = keyValueFile[5][1];
    this.#growth = keyValueFile[6][1];
    this.#growthTime = keyValueFile[7][1];
    this.#hackTime = keyValueFile[8][1];
    this.#weakTime = keyValueFile[9][1];
    this.#hackChance = keyValueFile[10][1];
  }
  showInfo(ns)
  {
    ns.tprintf("[%s]  serverName:     %s",this.serverName, this.serverName);
    ns.tprintf("[%s]  requiredHackLv: %0.2f",this.serverName, this.#requiredHackLevel);
    ns.tprintf("[%s]  securityLv:     %0.2f",this.serverName, this.#securityLevel);
    ns.tprintf("[%s]  minSecurityLV:  %0.2f",this.serverName, this.#minSecurityLevel);
    ns.tprintf("[%s]  maxRam:         %.2f",this.serverName, this.#maxRam);
    ns.tprintf("[%s]  availMoney:     %.2f$",this.serverName, this.#availMoney);
    ns.tprintf("[%s]  maxMoney:       %.2f$",this.serverName, this.#maxMoney);
    ns.tprintf("[%s]  growth:         %.2f",this.serverName, this.#growth);
    ns.tprintf("[%s]  growthTime:     %.2f",this.serverName, this.#growthTime);
    ns.tprintf("[%s]  hackTime:       %.2f",this.serverName, this.#hackTime);
    ns.tprintf("[%s]  weakTime:       %.2f",this.serverName, this.#weakTime);
    ns.tprintf("[%s]  hackChance:     %.2f",this.serverName, this.#hackChance);
  }
  showInfoConsole(ns)
  {
    let result = "";
    result += ns.sprintf("[%s]  serverName:     %s\n",this.serverName, this.serverName);
    result += ns.sprintf("[%s]  requiredHackLv: %0.2f\n",this.serverName, this.#requiredHackLevel);
    result += ns.sprintf("[%s]  securityLv:     %0.2f\n",this.serverName, this.#securityLevel);
    result += ns.sprintf("[%s]  minSecurityLV:  %0.2f\n",this.serverName, this.#minSecurityLevel);
    result += ns.sprintf("[%s]  maxRam:         %.2f\n",this.serverName, this.#maxRam);
    result += ns.sprintf("[%s]  availMoney:     %.2f$\n",this.serverName, this.#availMoney);
    result += ns.sprintf("[%s]  maxMoney:       %.2f$\n",this.serverName, this.#maxMoney);
    result += ns.sprintf("[%s]  growth:         %.2f\n",this.serverName, this.#growth);
    result += ns.sprintf("[%s]  growthTime:     %.2f\n",this.serverName, this.#growthTime);
    result += ns.sprintf("[%s]  hackTime:       %.2f\n",this.serverName, this.#hackTime);
    result += ns.sprintf("[%s]  weakTime:       %.2f\n",this.serverName, this.#weakTime);
    result += ns.sprintf("[%s]  hackChance:     %.2f\n",this.serverName, this.#hackChance);
    console.log(result);
  }
  save(ns)
  {
    result = ns.sprintf("requiredHackLv:%f,sercurityLV:%f,minSecurityLv:%f,maxRam:%f,availMoney:%f,maxMoney:%f,growth:%f,growthTime:%f,hackTime:%f,weakTime:%f}",
      this.#requiredHackLevel,this.#securityLevel,this.#minSecurityLevel,this.#maxRam,
      this.#availMoney,this.#maxMoney,this.#growth,this.#growthTime,this.#hackTime,this.#weakTime,
      this.#hackChance);
    ns.write(ServerInfo.path + this.serverName+".txt", result,"w" | "a");
    return result;
  }
  static serverInfoParse(file)
  {
    let infoFile = file;
    let splitFile = infoFile.split(',');
    let keyValueFile = [] ;
    for(let i = 0; i < splitFile.length ; i++){
      keyValueFile.push(splitFile[i].split(':'));
      keyValueFile[i][1] = parseFloat(keyValueFile[i][1]);
    }
    return keyValueFile;
  }
  static makeServerInfo(ns,serverName)
  {
    let result = "";
    let path = ServerInfo.path;
    ns.rm(path + serverName+".txt");
    let requiredHackLv = ns.getServerRequiredHackingLevel(serverName);
    let securityLv = ns.getServerSecurityLevel(serverName);
    let minSecurityLv = ns.getServerMinSecurityLevel(serverName);
    let maxRam = ns.getServerMaxRam(serverName);
    let availMoney = ns.getServerMoneyAvailable(serverName);
    let maxMoney = ns.getServerMaxMoney(serverName);
    let growth = ns.getServerGrowth(serverName);
    let growthTime = ns.getGrowTime(serverName);
    let hackTime = ns.getHackTime(serverName);
    let weakTime = ns.getWeakenTime(serverName);
    let hackChance = ns.hackAnalyzeChance(serverName);
    result = ns.sprintf("requiredHackLv:%f,sercurityLV:%f,minSecurityLv:%f,maxRam:%f,availMoney:%f,maxMoney:%f,growth:%f,growthTime:%f,hackTime:%f,weakTime:%f,hackChance:%f",
      requiredHackLv,securityLv,minSecurityLv,maxRam,availMoney,maxMoney,growth,growthTime,hackTime,weakTime,hackChance);
    ns.write(path+serverName+".txt", result,"w" | "a");
  }

}
