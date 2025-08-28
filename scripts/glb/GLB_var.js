/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  exports.json = new Json();
  exports.jsonReader = new JsonReader();


  /* <---------- layer ----------> */


  exports.lay_offDraw = 6.11;
  exports.lay_offDrawOver = 26.11;


  exports.lay_effFlr = 14.11;
  exports.lay_effBase = 69.11;
  exports.lay_effSmog = 86.11;
  exports.lay_effBloom = 109.61;
  exports.lay_effSmogHigh = 116.01;
  exports.lay_effHigh = 116.41;
  exports.lay_overText = 219.81;


  exports.lay_vent = 0.61;
  exports.lay_randOv = 1.07;
  exports.lay_debugFlr = 2.21;
  exports.lay_unitRemains = 58.11;
  exports.lay_debugTop = 118.91;


  exports.lay_bulBase = 74.11;
  exports.lay_bulHigh = 86.01;
  exports.lay_bulFlame = 108.51;


  /* <---------- time ----------> */


  exports.time_liqIntv = 4.0;
  exports.time_heatIntv = 30.0;
  exports.time_paramIntv = 90.0;
  exports.time_paramGlobalIntv = 110.0;
  exports.time_paramLargeIntv = 600.0;
  exports.time_lightningIntv = 40.0;
  exports.time_unitIntv = 20.0;


  exports.time_drownDef = 200.0;
  exports.time_flrStaDef = 40.0;
  exports.time_liqStaDef = 150.0;
  exports.time_unitStaDef = 120.0;
  exports.time_stackStaExtDef = 120.0;


  exports.time_extraInfoCooldown = 50.0;
  exports.time_lootProtection = 240.0;
  exports.time_lootLifetime = 7200.0;


  /* <---------- chance ----------> */


  exports.p_effPCap = 0.08;


  exports.p_unitUpdateP = 0.6;
  exports.p_polUpdateP = 0.2;


  /* <---------- radius ----------> */


  exports.rad_ordRad = 120.0;
  exports.rad_mouseRad = 28.0;
  exports.rad_charBtnRad = 42.0;
  exports.rad_treeHideMaxRad = 28.0;
  exports.rad_presExploRad = 34.4;
  exports.rad_lootRad = 80.0;
  exports.rad_lootPickRad = 10.0;
  exports.rad_lootMergeRad = 4.0;
  exports.rad_unitLootRad = 18.0;


  exports.r_unitSurRange = 4;


  exports.r_offBuildStat = 2.25;


  exports.rad_treeScl = 0.15;


  /* <---------- length ----------> */


  exports.len_bgW = 1920.0;
  exports.len_bgH = 1080.0;
  exports.len_charaW = 450.0;
  exports.len_charaH = 900.0;


  /* <---------- damage ----------> */


  exports.dmg_presExploDmg = 1800.0;
  exports.dmg_impactMinDmg = 40.0;


  /* <---------- param ----------> */


  exports.ct_colorMtp = 1.15;
  exports.ct_colorMtpHigh = 1.5;
  exports.ct_auxCap = 1.0;


  exports.blk_terFlrThr = 0.75;
  exports.blk_presDmgFrac = 0.015;
  exports.blk_presDmgMin = 3.0;
  exports.blk_corDmgFrac = 0.0135;
  exports.blk_corDmgMin = 2.0;
  exports.blk_clogViscThr = 0.75;
  exports.blk_clogDmgFrac = 0.02;
  exports.blk_clogDmgMin = 3.0;
  exports.blk_lightningDmg = 20.0;
  exports.blk_shortCircuitDmgFrac = 0.12;
