/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- setting ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Reads the settings. See {DB_misc}.
   * ---------------------------------------- */
  const _cfg = function(nmCfg, useScl) {
    return DB_misc.db["config"].read(nmCfg, Function.airNull)(useScl);
  };
  exports._cfg = _cfg;


  /* <---------- input ----------> */


  let mouseMoveX = 0.0;
  let mouseMoveY = 0.0;
  let mouseMoveStartX = 0.0;
  let mouseMoveStartY = 0.0;


  /* ----------------------------------------
   * NOTE:
   *
   * Mouse movement velocity in pixels per second.
   * LMB must be pressed.
   * ---------------------------------------- */
  const _mouseVel = function() {
    return Math.sqrt(Math.pow(mouseMoveX, 2) + Math.pow(mouseMoveY, 2));
  };
  exports._mouseVel = _mouseVel;


  /* <---------- mod ----------> */


  const _loadedMod = function(nmMod) {
    if(nmMod === "vanilla") return null;

    return Vars.mods.locateMod(nmMod);
  };
  exports._loadedMod = _loadedMod;


  /* ----------------------------------------
   * NOTE:
   *
   * Localize the mod stats.
   * Put {info.modname-info-mod} in your bundle.
   * ---------------------------------------- */
  const setMod_localization = function(nmMod) {
    let mod = _loadedMod(nmMod);
    if(mod == null) return;

    mod.meta.displayName = MDL_bundle._info(nmMod, "mod");
    mod.meta.description = MDL_bundle._info(nmMod, "mod", true);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.setMod_localization = setMod_localization;


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onDrag((dx, dy, x_f, y_f) => {
    mouseMoveX = dx;
    mouseMoveY = dy;
    mouseMoveStartX = x_f;
    mouseMoveStartY = y_f;
  }, 42885962);
