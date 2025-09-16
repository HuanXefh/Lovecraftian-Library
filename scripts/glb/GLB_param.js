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


  let upSup_i = 0;
  let upSupTime = 300;
  let secretCode = "";
  let unit_pl = null;
  let shouldLoadParam = false;


  // Not in {MDL_flow} to avoid coupling of modules
  function _glbHeat() {
    let pla = Vars.state.planet;
    if(pla == null) return 0.0;

    let nmPla = pla.name;
    let nmMap = Vars.state.map.plainName();

    return DB_env.db["param"]["map"]["heat"].read(nmMap, DB_env.db["param"]["pla"]["heat"].read(nmPla, 0.26)) * 100.0;
  };


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


  // Time to spawn bugs
  exports.debug = (function() {
    if(Core.settings.getString("lovec-misc-secret-code", "").includes("<anuke-mode>")) {
      Log.info("[LOVEC] " + "Debug mode".color(Pal.accent) + " is enabled.");
      return true;
    } else return false;
  })();


  // Whether required by other mods
  exports.modded = (function() {
    var cond1 = MDL_util._cfg("load-force-modded");
    var cond2 = DB_misc.db["mod"]["lovecMod"].some(nmMod => MDL_util._loadedMod(nmMod) != null);
    if(cond1 && !cond2) MDL_test._w_forceModded();

    return cond1 || cond2;
  })();


  MDL_event._c_onLoad(() => {

  }, 59556227);


  MDL_event._c_onUpdate(() => {


    upSup_i--;
    exports.updateSuppressed = upSup_i > 0;
    exports.updateDeepSuppressed = upSup_i > -upSupTime;


    if(TIMER.timerState_paramGlobal || shouldLoadParam) {


      // Param
      unit_pl = Vars.player.unit();


      /* <---------- param ----------> */


      exports.plaCur = global.lovecUtil.fun._plaCur();
      exports.mapCur = global.lovecUtil.fun._mapCur();
      exports.glbHeat = _glbHeat();


      /* <---------- setting ----------> */


      exports.testDraw = MDL_util._cfg("test-draw");
      exports.enableMemoryMonitor = MDL_util._cfg("test-memory");


      exports.drawWobble = MDL_util._cfg("draw-wobble");
      exports.drawStaticLoot = MDL_util._cfg("draw0loot-static");
      exports.drawLootAmount = MDL_util._cfg("draw0loot-amount");
      exports.treeAlpha = (Groups.player.size() > 1) ? 1.0 : MDL_util._cfg("draw0tree-alpha", true);
      exports.checkTreeDst = MDL_util._cfg("draw0tree-player") && MDL_cond._isCoverable(unit_pl);
      exports.showExtraInfo = MDL_util._cfg("draw0aux-extra-info");
      exports.drawBridgeTransportLine = MDL_util._cfg("draw0aux-bridge");
      exports.drawRouterHeresy = MDL_util._cfg("draw0aux-router");
      exports.drawScannerResult = MDL_util._cfg("draw0aux-scanner");
      exports.drawFluidHeat = MDL_util._cfg("draw0aux-fluid-heat");


      exports.flickerIconTag = MDL_util._cfg("icontag-flicker");
      exports.iconTagIntv = MDL_util._cfg("icontag-interval", true);


      exports.drawUnitStat = MDL_util._cfg("unit0stat-show");
      exports.drawPlayerStat = MDL_util._cfg("unit0stat-player");
      exports.drawUnitReload = MDL_util._cfg("unit0stat-reload");
      exports.drawMissileStat = MDL_util._cfg("unit0stat-missile");
      exports.drawBuildStat = MDL_util._cfg("unit0stat-build");
      exports.drawUnitNearMouse = MDL_util._cfg("unit0stat-mouse");
      exports.drawMinimalisticStat = MDL_util._cfg("unit0stat-minimalistic");
      exports.unitRemainsLifetime = MDL_util._cfg("unit0remains-lifetime", true);


      exports.displayDamage = MDL_util._cfg("damagedisplay-show");
      exports.damageDisplayThreshold = MDL_util._cfg("damagedisplay-min", true);


      exports.showWindow = MDL_util._cfg("window-show");


      secretCode = MDL_util._cfg("misc-secret-code");
      if(secretCode.includes("<crash>")) {
        Core.settings.put("lovec-misc-secret-code", "");
        throw new Error("You definitely know what <crash> means don't you?");
      };
      exports.secret_steelPipe = secretCode.includes("<steel-pipe>");


      shouldLoadParam = false;


    };
  }, 12976533);


  MDL_event._c_onWorldLoad(() => {


    upSup_i = upSupTime;


  }, 52647992);
