/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Floor material: salt.
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


  const MATH_base = require("lovec/math/MATH_base");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(MATH_base.fEqual(blk.speedMultiplier, 1.0)) blk.speedMultiplier = 0.8;
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
      return "sand";
    },


  };
