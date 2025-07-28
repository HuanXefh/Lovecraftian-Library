/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  const newIns_stat = function(bp, statCat) {
    if(statCat == null) statCat = StatCat.function;

    return new Stat("lovec-stat-" + bp, statCat);
  };


  const newIns_statUnit = function(bp, param) {
    return param == null ? new StatUnit("lovec-stat0unit-" + bp) : new StatUnit("lovec-stat0unit-" + bp, param);
  };


  /* <---------- stat ----------> */


  /* block */


  exports.blk_minR = newIns_stat("blk-minr");
  exports.blk_canExplode = newIns_stat("blk-canexplode");
  exports.blk_exploRad = newIns_stat("blk-explorad");
  exports.blk_exploDmg = newIns_stat("blk-explodmg");
  exports.blk_exploLiq = newIns_stat("blk-exploliq");
  exports.blk_shortCircuit = newIns_stat("blk-shortcircuit");
  exports.blk_attrReq = newIns_stat("blk-attrreq");
  exports.blk_terReq = newIns_stat("blk-terreq");
  exports.blk_terBan = newIns_stat("blk-terban");
  exports.blk_polTol = newIns_stat("blk-poltol");


  /* block (env) */


  exports.blk0env_ventSize = newIns_stat("blk0env-ventsize", StatCat.general);
  exports.blk0env_treeType = newIns_stat("blk0env-treetype", StatCat.general);
  exports.blk0env_rsLvl = newIns_stat("blk0env-rsLvl", StatCat.general);


  /* block (miner) */


  exports.blk0min_baseDrillSpd = newIns_stat("blk0min-basedrillspd", StatCat.crafting);
  exports.blk0min_boostedDrillSpd = newIns_stat("blk0min-boosteddrillspd", StatCat.crafting);
  exports.blk0min_drillTier = newIns_stat("blk0min-drilltier", StatCat.crafting);
  exports.blk0min_blockedItms = newIns_stat("blk0min-blockeditms", StatCat.crafting);


  /* block (factory) */


  exports.blk0fac_fuel = newIns_stat("blk0fac-fuel", StatCat.crafting);
  exports.blk0fac_fuelConsMtp = newIns_stat("blk0fac-fuelconsmtp", StatCat.crafting);
  exports.blk0fac_fuelLvlMtp = newIns_stat("blk0fac-fuellvlmtp", StatCat.crafting);
  exports.blk0fac_durabTime = newIns_stat("blk0fac-durabtime", StatCat.crafting);
  exports.blk0fac_recipes = newIns_stat("blk0fac-recipes", StatCat.crafting);


  /* block (item) */


  exports.blk0itm_unloadable = newIns_stat("blk0itm-unloadable", StatCat.items);
  exports.blk0itm_exposed = newIns_stat("blk0itm-exposed", StatCat.items);


  /* block (liquid) */


  /* block (power) */


  exports.blk0pow_powLoss = newIns_stat("blk0pow-powloss", StatCat.power);


  /* block (misc) */


  exports.blk0misc_cepProv = newIns_stat("blk0misc-cepprov");
  exports.blk0misc_cepUse = newIns_stat("blk0misc-cepuse");


  /* resource */


  exports.rs_isOre = newIns_stat("rs-isore");
  exports.rs_sintTemp = newIns_stat("rs-sinttemp");


  exports.rs_isConsumable = newIns_stat("rs-isconsumable");
  exports.rs_isIntermediate = newIns_stat("rs-isintermediate");
  exports.rs_isWaste = newIns_stat("rs-iswaste");


  exports.rs0int_parent = newIns_stat("rs0int-parent");


  exports.rs0fuel_point = newIns_stat("rs0fuel-point");
  exports.rs0fuel_level = newIns_stat("rs0fuel-level");


  exports.rs_buildable = newIns_stat("rs-buildable");
  exports.rs_hardness = newIns_stat("rs-hardness");


  exports.rs_fluidStatus = newIns_stat("rs-fluidstatus");
  exports.rs_conductiveLiq = newIns_stat("rs-conductiveliq");


  exports.rs_dens = newIns_stat("rs-dens");
  exports.rs_fHeat = newIns_stat("rs-fheat");


  exports.rs_eleGrp = newIns_stat("rs-elegrp");
  exports.rs_fTags = newIns_stat("rs-ftags");
  exports.rs_corPow = newIns_stat("rs-corpow");


  exports.rs_blockRelated = newIns_stat("rs-blockrelated");


  /* unit type */


  exports.utp_notRobot = newIns_stat("utp-notrobot");


  /* status */


  exports.sta_robotOnly = newIns_stat("sta-robotonly");
  exports.sta_burstTime = newIns_stat("sta-bursttime");
  exports.sta_burstDmg = newIns_stat("sta-burstdmg");


  /* VERY SPECIAL ZONE */


  exports.spec_faction = newIns_stat("spec-faction");
  exports.spec_facFami = newIns_stat("spec-facfami");
  exports.spec_fromTo = newIns_stat("spec-fromto");


  /* <---------- stat unit ----------> */


  /* block */


  exports.blk_perBlock = newIns_statUnit("blk-perblock", true);


  exports.blk_polUnits = newIns_statUnit("rs-polunits");


  /* resource */


  exports.rs_heatUnits = newIns_statUnit("rs-heatunits");
