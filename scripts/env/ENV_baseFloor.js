/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Basic floor without features.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Floor
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


  const PARENT = require("lovec/env/ENV_baseEnvBlock");


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


  };
