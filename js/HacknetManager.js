/** @param {NS} ns */
export async function main(ns) {

  var max_ram = 64;
  var nodes = 0;

  while (true) {

    //sleep for second to prevent the loop from crashing the game
    await ns.sleep(1000);
    nodes = ns.hacknet.numNodes();
    
    // combined with Nodenum, type, price/increase_rate
    let most_effecient = [-1, -1, Infinity];
    let effectiveness = 0;

    for (var i = 0; i < nodes; i++) {

      // gets NodeStats
      let level = ns.hacknet.getNodeStats(i).level;
      let ram = ns.hacknet.getNodeStats(i).ram;
      let core = ns.hacknet.getNodeStats(i).cores;

      // current node's production
      let current_production = expected_production(level, ram, max_ram, core);


      // Calculate Upgrade it's Level's efficiency
      effectiveness = Math.abs(
        ns.hacknet.getLevelUpgradeCost(i, 10) /
        (expected_production(level + 10, ram, max_ram, core) - current_production)
      )
      if (effectiveness < most_effecient[2]) {
        most_effecient = [i, 0, effectiveness];
      }

      // Calculate Upgrade it's Ram's efficiency
      effectiveness = Math.abs(
        ns.hacknet.getRamUpgradeCost(i, 1) /
        (expected_production(level, ram * 2, max_ram, core) - current_production)
      )
      if (effectiveness < most_effecient[2]) {
        most_effecient = [i, 1, effectiveness];
      }

      // Calculate Upgrade it's Core's efficiency
      effectiveness = Math.abs(
        ns.hacknet.getCoreUpgradeCost(i, 1) /
        (expected_production(level, ram, max_ram, core + 1) - current_production)
      )
      if (effectiveness < most_effecient[2]) {
        most_effecient = [i, 2, effectiveness];
      }
    }

    let money = ns.getServerMoneyAvailable("home");

    // buy most effecient upgrade if you afford it
    switch (most_effecient[1]) {

      case 0:
        if (money > ns.hacknet.getLevelUpgradeCost(most_effecient[0], 10)) {
          ns.hacknet.upgradeLevel(most_effecient[0], 10);
        }
        break;
      case 1:
        if (money > ns.hacknet.getRamUpgradeCost(most_effecient[0], 1)) {
          ns.hacknet.upgradeRam(most_effecient[0], 1);
        }
        break;
      case 2:
        if (money > ns.hacknet.getCoreUpgradeCost(most_effecient[0], 1)) {
          ns.hacknet.upgradeCore(most_effecient[0], 1);
        }
        break;
    }
  }
}

function expected_production(level, ramUsed, maxRam, cores) {

  let baseGain = 0.001 * level;

  let ramMultiplier = Math.pow(1.07, Math.log2(maxRam));

  let coreMultiplier = 1 + (cores - 1) / 5;

  let ramRatio = 1 - ramUsed / maxRam;

  ramRatio = ramRatio == 0 ? 1 : ramRatio;

  return baseGain * ramMultiplier * coreMultiplier * ramRatio;
}