/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The parent for all floors with a material.
   *
   * About random overlay:
   * Those regions are randomly drawn over the floor texture region, like {OverlayFloor} but generated.
   * You will need set {randRegs} for the block, which is an array of tags.
   * Tags and corresponding array getter functions are stored in {DB_env.db["map"]["randRegTag"]}.
   * You can add more tags and functions by creating your own {DB_env}.
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


  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");


  const DB_env = require("lovec/db/DB_env");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.walkSound = MDL_effect._se("se-step-" + blk.ex_getMatGrp());
    blk.walkSoundVolume = 0.2;
    blk.walkSoundPitchMin = 0.95;
    blk.walkSoundPitchMax = 1.05;

    if(blk.status !== StatusEffects.none) blk.statusDuration = VAR.time_flrStaDef;

    // Generate random overlay regions
    const randRegs = [];
    blk.randRegs.forEach(tag => {
      let mapF = DB_env.db["map"]["randRegTag"].read(tag);
      if(mapF != null) randRegs.pushAll(mapF());
    });
    blk.randRegs = randRegs;
  };


  function comp_drawBase(blk, t) {
    MDL_draw.drawRegion_randomOverlay(t, blk.randRegs, blk.randRegDenom, blk.randRegOffs[0], blk.randRegOffs[1]);
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
      comp_drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-env"],
    }),


    // @NOSUPER
    ex_getMatGrp: function(blk) {
      return "";
    },


  };


  module.exports = TEMPLATE;
