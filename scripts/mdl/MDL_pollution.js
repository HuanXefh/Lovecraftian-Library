/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TRIGGER = require("lovec/glb/BOX_trigger");
  const PARAM = require("lovec/glb/GLB_param");
  const SAVE = require("lovec/glb/GLB_save");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");
  const DB_fluid = require("lovec/db/DB_fluid");
  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- base ----------> */


  let basePol = 0.0;
  let dynaPol = 0.0;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets pollution produced/reduced by some block.
   * ---------------------------------------- */
  const _blkPol = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return 0.0;

    return DB_block.db["param"]["pol"].read(blk.name, 0.0);
  }
  .setCache();
  exports._blkPol = _blkPol;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets pollution of some fluid.
   * ---------------------------------------- */
  const _liqPol = function(liq_gn) {
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return 0.0;

    return DB_fluid.db["param"]["pol"].read(liq.name, (function() {
      if(liq.ex_getIntmdParent == null) {
        return 0.0;
      } else {
        let parent = liq.ex_getIntmdParent();
        return parent == null ? 0.0 : _liqPol(parent);
      };
    })());
  }
  .setCache();
  exports._liqPol = _liqPol;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current total pollution.
   * ---------------------------------------- */
  const _glbPol = function() {
    return basePol + dynaPol;
  };
  exports._glbPol = _glbPol;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets pollution tolerance of some block or unit type.
   * ---------------------------------------- */
  const _polTol = function(ct_gn) {
    let ct = MDL_content._ct(ct, null, true);
    if(ct == null) return 500.0;

    return (ct instanceof UnitType ? DB_unit : DB_block).db["param"]["polTol"].read(ct.name, 500.0);
  };
  exports._polTol = _polTol;


  /* ----------------------------------------
   * NOTE:
   *
   * Increases current dynamic pollution.
   * ---------------------------------------- */
  const addDynaPol = function(amt) {
    dynaPol += amt;
  };
  exports.addDynaPol = addDynaPol;


  const comp_setStats_pol = function(blk) {
    let pol = _blkPol(blk);
    if(!pol.fEqual(0.0)) blk.stats.add(pol > 0.0 ? TP_stat.blk_pol : TP_stat.blk_polRed, Math.abs(pol), TP_stat.blk_polUnits);
  };
  exports.comp_setStats_pol = comp_setStats_pol;


/*
  ========================================
  Section: Application
  ========================================
*/




MDL_event._c_onLoad(() => {

  TRIGGER.majorIter.start.addListener(() => {
    basePol = 0.0;
  });
  TRIGGER.majorIter.building.addListener((b, isActive) => {
    if(isActive && Mathf.chance(VAR.p_polUpdateP)) basePol += _blkPol(b.block);
  });
  TRIGGER.majorIter.end.addListener(() => {
    basePol /= VAR.p_polUpdateP;
  });

}, 42067771);




MDL_event._c_onWorldLoad(() => {

  Time.run(25.0, () => {
    dynaPol = SAVE.get("dynamic-pollution");
  });

}, 45200137);




MDL_event._c_onUpdate(() => {

  if(PARAM.modded) {
    if(!Vars.state.isGame()) {
      dynaPol = 0.0;
    } else {
      if(TIMER.sec) dynaPol *= 0.984;
      if(TIMER.paramLarge) SAVE.set("dynamic-pollution", dynaPol);
    };
  };

}, 28199720);
