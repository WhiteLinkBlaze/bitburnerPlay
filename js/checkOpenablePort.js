/** @param {NS} ns */
export async function main(ns) {

}
export class Port {
  static checkOpenablePort(ns) {
    let portProgramList = ["BruteSSH.exe",
      "FTPCrack.exe",
      "relaySMTP.exe",
      "HTTPWorm.exe",
      "SQLInject.exe"];

    let openablePort = [0, 0, 0, 0, 0, 0];
    for (let i in portProgramList) {
      if (ns.fileExists(portProgramList[i])) openablePort[5] += openablePort[i] = 1;
    }
    return openablePort;
  }
  static openPort(ns,arr, curNeighbor)
  {
    let ret = true;
    let openablePort = arr;
    if (openablePort[0] == 1) ns.brutessh(curNeighbor);
    else ret = false;
    if (openablePort[1] == 1) ns.ftpcrack(curNeighbor);
    else ret = false;
    if (openablePort[2] == 1) ns.relaysmtp(curNeighbor);
    else ret = false;
    if (openablePort[3] == 1) ns.httpworm(curNeighbor);
    else ret = false;
    if (openablePort[4] == 1) ns.sqlinject(curNeighbor);
    else ret = false;

    return ret;
  }
}
