/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Collection of stats.
   * ---------------------------------------- */


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
  exports.newIns_stat = newIns_stat;


  const newIns_statUnit = function(bp, param) {
    return param == null ? new StatUnit("lovec-stat0unit-" + bp) : new StatUnit("lovec-stat0unit-" + bp, param);
  };
  exports.newIns_statUnit = newIns_statUnit;


  /* <---------- stat ----------> */


  /* block */


  exports.blk_minR = newIns_stat("blk-minr");
  exports.blk_cd = newIns_stat("blk-cd");
  exports.blk_cdInit = newIns_stat("blk-cdinit");
  exports.blk_canExplode = newIns_stat("blk-canexplode");
  exports.blk_exploR = newIns_stat("blk-explor");
  exports.blk_exploDmg = newIns_stat("blk-explodmg");
  exports.blk_exploLiq = newIns_stat("blk-exploliq");
  exports.blk_impactR = newIns_stat("blk-impactr");
  exports.blk_shortCircuit = newIns_stat("blk-shortcircuit");
  exports.blk_attrReq = newIns_stat("blk-attrreq");
  exports.blk_attrOutput = newIns_stat("blk-attroutput");
  exports.blk_terReq = newIns_stat("blk-terreq");
  exports.blk_terBan = newIns_stat("blk-terban");
  exports.blk_pol = newIns_stat("blk-pol");
  exports.blk_polRed = newIns_stat("blk-polred");
  exports.blk_polTol = newIns_stat("blk-poltol");


  /* block (env) */


  exports.blk0env_ventSize = newIns_stat("blk0env-ventsize", StatCat.general);
  exports.blk0env_treeType = newIns_stat("blk0env-treetype", StatCat.general);
  exports.blk0env_hardnessMtp = newIns_stat("blk0env-hardnessmtp", StatCat.general);
  exports.blk0env_rsLvl = newIns_stat("blk0env-rslvl", StatCat.general);
  exports.blk0env_depthLvl = newIns_stat("blk0env-depthlvl", StatCat.general);


  /* block (miner) */


  exports.blk0min_baseDrillSpd = newIns_stat("blk0min-basedrillspd", StatCat.crafting);
  exports.blk0min_boostedDrillSpd = newIns_stat("blk0min-boosteddrillspd", StatCat.crafting);
  exports.blk0min_drillTier = newIns_stat("blk0min-drilltier", StatCat.crafting);
  exports.blk0min_depthMtp = newIns_stat("blk0min-depthmtp", StatCat.crafting);
  exports.blk0min_blockedItms = newIns_stat("blk0min-blockeditms", StatCat.crafting);
  exports.blk0min_allowedItms = newIns_stat("blk0min-alloweditms", StatCat.crafting);
  exports.blk0min_scanTier = newIns_stat("blk0min-scantier", StatCat.crafting);


  /* block (factory) */


  exports.blk0fac_prodSpd = newIns_stat("blk0fac-prodspd", StatCat.crafting);
  exports.blk0fac_fuel = newIns_stat("blk0fac-fuel", StatCat.crafting);
  exports.blk0fac_fuelConsMtp = newIns_stat("blk0fac-fuelconsmtp", StatCat.crafting);
  exports.blk0fac_fuelLvlMtp = newIns_stat("blk0fac-fuellvlmtp", StatCat.crafting);
  exports.blk0fac_durabTime = newIns_stat("blk0fac-durabtime", StatCat.crafting);
  exports.blk0fac_recipes = newIns_stat("blk0fac-recipes", StatCat.crafting);


  /* block (item) */


  exports.blk0itm_unloadable = newIns_stat("blk0itm-unloadable", StatCat.items);
  exports.blk0itm_exposed = newIns_stat("blk0itm-exposed", StatCat.items);


  /* block (liquid) */


  exports.blk0liq_presOutput = newIns_stat("blk0liq-presoutput", StatCat.liquids);
  exports.blk0liq_vacOutput = newIns_stat("blk0liq-vacoutput", StatCat.liquids);


  exports.blk0liq_matGrp = newIns_stat("blk0liq-matgrp");
  exports.blk0liq_cloggable = newIns_stat("blk0liq-cloggable");
  exports.blk0liq_presRes = newIns_stat("blk0liq-presres");
  exports.blk0liq_presReq = newIns_stat("blk0liq-presreq");
  exports.blk0liq_vacRes = newIns_stat("blk0liq-vacres");
  exports.blk0liq_vacReq = newIns_stat("blk0liq-vacreq");
  exports.blk0liq_pipeDiam = newIns_stat("blk0liq-pipediam");


  /* block (heat) */


  exports.blk0heat_heatRes = newIns_stat("blk0heat-heatres");


  /* block (power) */


  exports.blk0pow_powLoss = newIns_stat("blk0pow-powloss", StatCat.power);
  exports.blk0pow_powUsePer100HU = newIns_stat("blk0pow-powuseper100hu", StatCat.power);


  /* block (misc) */


  exports.blk0misc_maxDur = newIns_stat("blk0misc-maxdur");
  exports.blk0misc_reloadTime = newIns_stat("blk0misc-reloadtime");
  exports.blk0misc_cepProv = newIns_stat("blk0misc-cepprov");
  exports.blk0misc_cepUse = newIns_stat("blk0misc-cepuse");
  exports.blk0misc_repairAmt = newIns_stat("blk0misc-repairamt");
  exports.blk0misc_unitRepairAmt = newIns_stat("blk0misc-unitrepairamt");
  exports.blk0misc_repairR = newIns_stat("blk0misc-repairr");
  exports.blk0misc_repairIntv = newIns_stat("blk0misc-repairintv");
  exports.blk0misc_status = newIns_stat("blk0misc-status");
  exports.blk0misc_blkTg = newIns_stat("blk0misc-blktg");


  /* resource */


  exports.rs_isOre = newIns_stat("rs-isore");
  exports.rs_sintTemp = newIns_stat("rs-sinttemp");


  exports.rs_isIntermediate = newIns_stat("rs-isintermediate");
  exports.rs_isWastete = newIns_stat("rs-iswaste");


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
  exports.spec_oreDict = newIns_stat("spec-oredict");
  exports.spec_fromTo = newIns_stat("spec-fromto");
  exports.spec_info = newIns_stat("spec-info");
  exports.spec_dialFlow = newIns_stat("spec-dialflow");


  /* <---------- stat unit ----------> */


  /* block */


  exports.blk_perBlock = newIns_statUnit("blk-perblock", true);
  exports.blk_polUnits = newIns_statUnit("blk-polunits");


  /* resource */


  exports.rs_heatUnits = newIns_statUnit("rs-heatunits");
