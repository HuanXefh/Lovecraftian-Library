/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Floor material: rock.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Floor
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.randRegs: regs    // @PARAM
   * blk.randRegDenom: num    // @PARAM
   * blk.randRegOffs: [int, int]    // @PARAM
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


  const PARENT = require("lovec/env/ENV_materialFloor");


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


    // @NOSUPER
    ex_getMatGrp: function(blk) {
      return "stone";
    },


  };
