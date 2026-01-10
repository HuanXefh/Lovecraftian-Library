/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Collection of unit sorting functions.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- auxiliay ----------> */


  const newIns_sortF = function(costGetter) {
    return extend(Units.Sortf, {
      cost(unit, x, y) {
        return costGetter(unit, x, y);
      },
    });
  };
  exports.newIns_sortF = newIns_sortF


  const newIns_sortF_prop = function(propGetter) {
    return newIns_sortF((unit, x, y) => propGetter(unit, x, y) + Mathf.dst2(unit.x, unit.y, x, y) / 6400.0);
  };
  exports.newIns_sortF_prop = newIns_sortF_prop;


  const newIns_sortF_mix = function() {
    let sortFs = Array.from(arguments);

    return extend(Units.Sortf, {
      cost(unit, x, y) {
        return sortFs.sum(sortF => sortF.cost(unit, x, y));
      },
    });
  };
  exports.newIns_sortF_mix = newIns_sortF_mix;


  /* <---------- base ----------> */


  exports.smallest = newIns_sortF_prop((unit, x, y) => unit.hitSize);
  exports.largest = newIns_sortF_prop((unit, x, y) => -unit.hitSize);
  exports.slowest = newIns_sortF_prop((unit, x, y) => unit.speed());
  exports.fastest = newIns_sortF_prop((unit, x, y) => -unit.speed());
  exports.lowestHealth = newIns_sortF_prop((unit, x, y) => unit.health);
  exports.highestHealth = newIns_sortF_prop((unit, x, y) => -unit.health);
  exports.lowestShield = newIns_sortF_prop((unit, x, y) => unit.shield);
  exports.highestShield = newIns_sortF_prop((unit, x, y) => -unit.shield);
  exports.flying = newIns_sortF_prop((unit, x, y) => unit.flying ? -99999999.0 : 0.0);
  exports.player = newIns_sortF_prop((unit, x, y) => unit.isPlayer() ? -99999999.0 : 0.0);
  exports.luckiest = newIns_sortF_prop((unit, x, y) => Mathf.randomSeed(unit.id, 0.0, 999999.0));
