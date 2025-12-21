/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_test = require("lovec/mdl/MDL_test");
  const MDL_util = require("lovec/mdl/MDL_util");


  const DB_env = require("lovec/db/DB_env");
  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  let
    updateSuppressTimeCur = 0, updateSuppressTime = 300,
    unit_pl = null,
    secretCode = "",
    shouldLoadParam = true;


  /* ----------------------------------------
   * NOTE:
   *
   * Forces all parameters to get immediately updated.
   * ---------------------------------------- */
  const forceLoadParam = function() {
    shouldLoadParam = true;
  };
  exports.forceLoadParam = forceLoadParam;


/*
  ========================================
  Section: Application
  ========================================
*/




  // Parameters populated on load
  exports.debug = global.lovecUtil.prop.debug;
  exports.modded = (function() {
    let cond1 = MDL_util._cfg("load-force-modded");
    let cond2 = DB_misc.db["mod"]["lovecMod"].some(nmMod => fetchMod(nmMod) != null);
    if(cond1 && !cond2) MDL_test._w_forceModded();

    return cond1 || cond2;
  })();




  // Settings that cannot be {undefined} when loading
  exports.unitRemainsLifetime = MDL_util._cfg("unit0remains-lifetime", true);




  MDL_event._c_onLoad(() => {

  }, 59556227);




  MDL_event._c_onWorldLoad(() => {

    Time.run(5.0, () => forceLoadParam());

  }, 44492271);




  MDL_event._c_onUpdate(() => {


    updateSuppressTimeCur--;
    exports.updateSuppressed = updateSuppressTimeCur > 0;
    exports.updateDeepSuppressed = updateSuppressTimeCur > -updateSuppressTime;


    if(TIMER.paramGlobal || shouldLoadParam) {


      // Param load
      unit_pl = Vars.player.unit();
      secretCode = MDL_util._cfg("misc-secret-code");
      shouldLoadParam = false;


      /* <---------- param ----------> */


      exports.plaCur = global.lovecUtil.fun._plaCur();
      exports.mapCur = global.lovecUtil.fun._mapCur();
      exports.isCaveMap = DB_env.db["group"]["map"]["cave"].includes(module.exports.mapCur);
      exports.glbHeat = global.lovecUtil.fun._glbHeat();


      /* <---------- setting ----------> */


      exports.testDraw = MDL_util._cfg("test-draw");
      exports.enableMemoryMonitor = MDL_util._cfg("test-memory");


      exports.drawWobble = MDL_util._cfg("draw-wobble");
      exports.drawStaticLoot = MDL_util._cfg("draw0loot-static");
      exports.drawLootAmount = MDL_util._cfg("draw0loot-amount");
      exports.treeAlpha = (Groups.player.size() > 1) ? 1.0 : MDL_util._cfg("draw0tree-alpha", true);
      exports.checkTreeDst = MDL_util._cfg("draw0tree-player") && unit_pl != null && MDL_cond._isCoverable(unit_pl);
      exports.showExtraInfo = MDL_util._cfg("draw0aux-extra-info");
      exports.drawBridgeTransportLine = MDL_util._cfg("draw0aux-bridge");
      exports.drawRouterHeresy = MDL_util._cfg("draw0aux-router");
      exports.drawScannerResult = MDL_util._cfg("draw0aux-scanner");
      exports.drawFluidHeat = MDL_util._cfg("draw0aux-fluid-heat");
      exports.drawFurnaceHeat = MDL_util._cfg("draw0aux-furnace-heat");


      exports.flickerIconTag = MDL_util._cfg("icontag-flicker");
      exports.iconTagIntv = MDL_util._cfg("icontag-interval", true);


      exports.drawUnitStat = MDL_util._cfg("unit0stat-show");
      exports.drawUnitRange = MDL_util._cfg("unit0stat-range");
      exports.drawPlayerStat = MDL_util._cfg("unit0stat-player");
      exports.drawUnitReload = MDL_util._cfg("unit0stat-reload");
      exports.drawMissileStat = MDL_util._cfg("unit0stat-missile");
      exports.drawBuildStat = MDL_util._cfg("unit0stat-build");
      exports.drawUnitNearMouse = MDL_util._cfg("unit0stat-mouse");
      exports.drawMinimalisticStat = MDL_util._cfg("unit0stat-minimalistic");
      exports.unitRemainsLifetime = MDL_util._cfg("unit0remains-lifetime", true);
      exports.createBuildingRemains = MDL_util._cfg("unit0remains-building");


      exports.displayDamage = MDL_util._cfg("damagedisplay-show");
      exports.damageDisplayThreshold = MDL_util._cfg("damagedisplay-min", true);


      exports.showWindow = MDL_util._cfg("window-show");


      if(secretCode.includes("<crash>")) {
        Core.settings.put("lovec-misc-secret-code", secretCode.replace("<crash>", ""));
        Core.settings.put("lovec-misc-secret-code-crashed", true);
        throw new Error("You definitely know what <crash> means don't you?");
      };
      exports.secret_fireInTheHole = secretCode.includesAny("<fire-in-the-hole>", "<fire-in-da-hole>", "<fith>");
      exports.secret_steelPipe = secretCode.includes("<steel-pipe>", "<metal-pipe>");
      exports.secret_revisionFix = secretCode.includes("<revision-fix>");


    };
  }, 12976533);




  MDL_event._c_onWorldLoad(() => {


    updateSuppressTimeCur = updateSuppressTime;


  }, 52647992);
