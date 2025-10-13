/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Floor material: sand.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Floor
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


  function comp_init(blk) {
    if(blk.speedMultiplier.fEqual(1.0)) blk.speedMultiplier = 0.75;
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


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-env"],
    }),


    // @NOSUPER
    ex_getMatGrp: function(blk) {
      return "sand";
    },


  };


  TEMPLATE._std = function(randRegs, randRegDenom, randRegOffs) {
    return {
      randRegs: Object.val(randRegs, []), randRegDenom: Object.val(randRegDenom, 80), randRegOffs: Object.val(randRegOffs, [0, 0]),
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      drawBase(t) {
        this.super$drawBase(t);
        TEMPLATE.drawBase(this, t);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getMatGrp() {
        return TEMPLATE.ex_getMatGrp(this);
      },
    };
  };


  module.exports = TEMPLATE;
