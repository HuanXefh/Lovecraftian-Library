/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Ore overlay.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * OreBlock
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


  const PARENT = require("lovec/env/ENV_baseOverlay");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.needsSurface = false;
    blk.overlayAlpha = 0.5;
    blk.useColor = false;

    let itm = blk.itemDrop;
    if(itm != null) MDL_content.rename(
      blk,
      itm.localizedName + MDL_text._space() + "(" + MDL_bundle._term("lovec", "ground-ore") + ")",
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
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-env"],
    }),


  };
