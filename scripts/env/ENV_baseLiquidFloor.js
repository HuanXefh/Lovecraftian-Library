/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Base template for liquid floors.
   * {blk.shallow} is basically the only thing you need to set for regular liquids.
   * If name is not set in bundle, the block will get its name from {liquidDrop}.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * !NOTHING
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/env/ENV_baseFloor");
  const VAR = require("lovec/glb/GLB_var");


  const MATH_base = require("lovec/math/MATH_base");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(blk) {
    var liq = blk.liquidDrop;

    blk.walkSound = MDL_effect._se("se-step-" + blk.ex_getMatGrp());
    blk.walkSoundVolume = 0.2;
    blk.walkSoundPitchMin = 0.95;
    blk.walkSoundPitchMax = 1.05;

    blk.isLiquid = true;
    if(Number(blk.speedMultiplier).fEqual(1.0)) {
      blk.speedMultiplier = blk.shallow ? 0.8 : 0.5;
      if(liq != null) blk.speedMultiplier *= MATH_base.applyInterp(1.0, 0.2, liq.viscosity, Interp.linear, 0.5, 1.0);
    };
    if(Number(blk.drownTime).fEqual(0.0)) blk.drownTime = blk.shallow ? 0.0 : VAR.time_drownDef;
    if(blk.status !== StatusEffects.none) blk.statusDuration = VAR.time_liqStaDef * (blk.shallow ? 1.0 : 2.0);
    blk.supportsOverlay = true;

    blk.cacheLayer = CacheLayer.water;
    blk.albedo = 0.9;
    blk.walkEffect = Fx.ripple;

    if(liq != null && Number(blk.liquidMultiplier).fEqual(1.0)) blk.liquidMultiplier = blk.shallow ? 0.5 : 1.0;

    if(liq != null) MDL_content.rename(
      blk,
      liq.localizedName + (!blk.shallow ? "" : (MDL_text._space() + "(" + MDL_bundle._term("lovec", "shallow") + ")")),
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- block ----------> */


    init: function(blk) {
      PARENT.init(blk);
      comp_init(blk);
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
    },


    drawBase: function(blk, t) {
      PARENT.drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-env"];
    },


    // @NOSUPER
    ex_getMatGrp: function(blk) {
      return "";
    },


  };
