/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Decorative tall blocks for walls.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * TallBlock
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * flr: flr_gn    // @PARAM, @NULL: Analog of {flr} in {ENV_wall}.
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


  const PARENT = require("lovec/env/ENV_baseProp");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.floating = true;
    blk.placeableLiquid = true;

    blk.flr = MDL_content._ct(blk.flr, "blk");
    if(blk.flr != null) {
      MDL_content.rename(
        blk,
        blk.flr.localizedName + MDL_text._space() + "(" +  MDL_bundle._term("lovec", "heap") + ")",
      );
    };
  };


  function comp_drawBase(blk, t) {
    var reg = MDL_content._regVari(blk, t);
    var ang = Mathf.randomSeedRange(t.pos() + 1, blk.rotationRand);

    MDL_draw.drawRegion_blurredShadow(t.worldx(), t.worldy(), reg, ang, 1.3, 0.5, blk.shadowLayer);
    MDL_draw.drawRegion_normal(t.worldx(), t.worldy(), reg, ang, 1.0, null, blk.layer);
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


    // @NOSUPER
    drawBase: function(blk, t) {
      comp_drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-env"];
    },


  };
