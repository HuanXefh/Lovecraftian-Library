/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla liquid junction.
   * Cannot transport abstract fluids.
   *
   * This does not inherit methods from {BLK_baseFluidBlock}, but I will call it a fluid block.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * LiquidJunction
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


  const PARENT = require("lovec/blk/BLK_baseFluidBlock");
  const PARENT_A = require("lovec/blk/BLK_baseBlock");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.solid = false;
    blk.underBullets = true;
  };


  function comp_getLiquidDestination(b, b_f, liq) {
    if(MDL_cond._isAux(liq)) return b;

    return b.super$getLiquidDestination(b_f, liq);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- block ----------> */


    init: function(blk) {
      PARENT_A.init(blk);
      comp_init(blk);
    },


    setStats: function(blk) {
      PARENT_A.setStats(blk);
    },


    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT_A.drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT_A.created(b);
    },


    onDestroyed: function(b) {
      PARENT_A.onDestroyed(b);
    },


    updateTile: function(b) {
      PARENT_A.updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT_A.onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT_A.draw(b);
    },


    drawSelect: function(b) {
      PARENT_A.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    getLiquidDestination: function(b, b_f, liq) {
      return comp_getLiquidDestination(b, b_f, liq);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-fjunc"],
    }),


    /* <---------- build (extended) ----------> */


  };
