/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Trees, the easiest lifeform to make in Mindustry.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * TreeBlock
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.armor: f    // @PARAM
   * blk.hidable: bool    // @PARAM
   * blk.drawUnd: bool    // @PARAM
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


  const PARENT = require("lovec/env/ENV_baseTree");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- block ----------> */


    init: function(blk) {
      PARENT.init(blk);
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
    },


    // @NOSUPER
    drawBase: function(blk, t) {
      PARENT.drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-env", "blk-tree"],
    }),


    // @NOSUPER
    ex_getTreeGrp: function(blk) {
      return "tree";
    },


    // @NOSUPER
    ex_getHidable: function(blk) {
      return blk.hidable;
    },


  };
