/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Unbreakable sea bush.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * SeaBush
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


  const PARENT = require("lovec/env/ENV_baseProp");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.breakable = false;
    blk.unitMoveBreakable = false;

    blk.solid = false;
    blk.alwaysReplace = false;
    blk.placeableLiquid = true;

    // Have to bypass vanilla shadow because of the hard-coded alpha
    blk.hasShadow = false;
    blk.customShadow = true;
  };


  function comp_drawBase(blk, t) {
    Draw.z(Layer.block - 0.1);
    Draw.rect(blk.customShadowRegion, t.worldx(), t.worldy());
    Draw.reset();
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
      comp_drawBase(blk, t);
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
