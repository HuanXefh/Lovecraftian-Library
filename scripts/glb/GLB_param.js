/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_test = require("lovec/mdl/MDL_test");
  const MDL_util = require("lovec/mdl/MDL_util");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  let upSup_i = 0;
  let upSupTime = 180;


  let shouldLoadParam = false;
  const forceLoadParam = function() {
    shouldLoadParam = true;
  };
  exports.forceLoadParam = forceLoadParam;


/*
  ========================================
  Section: Application
  ========================================
*/


  // Whether required by other mods
  exports.modded = (function() {

    var cond1 = MDL_util._cfg("load-force-modded");
    var cond2 = DB_misc.db["mod"]["lovecMod"].some(nmMod => MDL_util._loadedMod(nmMod) != null);
    if(cond1 && !cond2) MDL_test._w_forceModded();

    return cond1 || cond2;

  })();


  MDL_event._c_onLoad(() => {


  });


  MDL_event._c_onUpdate(() => {


    exports.updateSuppressed = upSup_i-- > 0;


    if(TIMER.timerState_paramGlobal || shouldLoadParam) {


      // Param
      let unit_pl = Vars.player.unit();


      /* <---------- param ----------> */


      exports.plaCur = Vars.state.rules.planet;
      exports.mapCur = Vars.state.map;


      exports.glbHeat = MDL_flow._glbHeat();


      /* <---------- setting ----------> */


      exports.testDraw = MDL_util._cfg("test-draw");
      exports.enableMemoryMonitor = MDL_util._cfg("test-memory");


      exports.drawWobble = MDL_util._cfg("draw-wobble");
      exports.drawBlurredShadow = MDL_util._cfg("draw0shadow-blurred");
      exports.drawCircleShadow = MDL_util._cfg("draw0shadow-circle");
      exports.drawStaticLoot = MDL_util._cfg("draw0loot-static");
      exports.drawLootAmount = MDL_util._cfg("draw0loot-amount");
      exports.treeAlpha = (Groups.player.size() > 1) ? 1.0 : MDL_util._cfg("draw0tree-alpha", true);
      exports.checkTreeDst = MDL_util._cfg("draw0tree-player") && MDL_cond._isCoverable(unit_pl);
      exports.drawBridgeTransportLine = MDL_util._cfg("draw0aux-bridge");
      exports.drawRouterHeresy = MDL_util._cfg("draw0aux-router");


      exports.showIconTag = MDL_util._cfg("icontag-show");
      exports.iconTagIntv = MDL_util._cfg("icontag-interval", true);


      exports.drawUnitStat = MDL_util._cfg("unit0stat-show");
      exports.drawPlayerStat = MDL_util._cfg("unit0stat-player");
      exports.drawUnitReload = MDL_util._cfg("unit0stat-reload");
      exports.drawMissileStat = MDL_util._cfg("unit0stat-missile");
      exports.drawBuildStat = MDL_util._cfg("unit0stat-build");
      exports.drawUnitNearMouse = MDL_util._cfg("unit0stat-mouse");


      exports.displayDamage = MDL_util._cfg("damagedisplay-show");
      exports.damageDisplayThreshold = MDL_util._cfg("damagedisplay-min", true);
      exports.unitRemainsLifetime = MDL_util._cfg("unit0remains-lifetime", true);


      shouldLoadParam = false;


    };
  }, 12976533);


  MDL_event._c_onWorldLoad(() => {


    upSup_i = upSupTime;


  }, 52647992);
