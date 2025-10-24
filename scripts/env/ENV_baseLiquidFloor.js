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


  const MATH_interp = require("lovec/math/MATH_interp");


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
    if(blk.speedMultiplier.fEqual(1.0)) {
      blk.speedMultiplier = blk.shallow ? 0.8 : 0.5;
      if(liq != null) blk.speedMultiplier *= MATH_interp.applyInterp(1.0, 0.2, liq.viscosity, Interp.linear, 0.5, 1.0);
    };
    if(blk.drownTime.fEqual(0.0)) blk.drownTime = blk.shallow ? 0.0 : VAR.time_drownDef;
    if(blk.status !== StatusEffects.none) blk.statusDuration = VAR.time_liqStaDef * (blk.shallow ? 1.0 : 2.0);
    blk.supportsOverlay = true;

    blk.cacheLayer = CacheLayer.water;
    blk.albedo = 0.9;
    blk.walkEffect = Fx.ripple;

    if(liq != null && blk.liquidMultiplier.fEqual(1.0)) blk.liquidMultiplier = blk.shallow ? 1.0 : 1.5;

    if(liq != null) MDL_content.rename(
      blk,
      liq.localizedName + (!blk.shallow ? "" : (MDL_text._space() + "(" + MDL_bundle._term("lovec", "shallow") + ")")),
    );
  };


  function comp_updateRender(blk, t) {
    return blk.updateEff !== Fx.none && Mathf.randomSeed(t.pos(), 0.0, 1.0) > 0.4;
  };


  function comp_renderUpdate(blk, renderState) {
    if(Mathf.chance(blk.updateEffP)) blk.updateEff.at(renderState.tile.worldx() + Mathf.range(3.0), renderState.tile.worldy() + Mathf.range(3.0));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


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


    // @NOSUPER
    updateRender: function(blk, t) {
      return comp_updateRender(blk, t);
    },


    // @NOSUPER
    renderUpdate: function(blk, renderState) {
      comp_renderUpdate(blk, renderState);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-env"],
    }),


    // @NOSUPER
    ex_getMatGrp: function(blk) {
      return "";
    },


  };


  module.exports = TEMPLATE;
