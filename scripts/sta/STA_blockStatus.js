/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Block status is given to a unit when there are some particular blocks nearby.
   * You can define {filterScr} to customize the condition for application.
   * It's called in {FRAG_unit.comp_update_surrounding()}.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * StatusEffect
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * sta.filterScr: (unit, ts) => {...}    // @PARAM: The function for block selection, it should return a value to determine whether to apply the status.
   * sta.applyLimit: f    // @PARAM: The value above which the status will be applied.
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


  const PARENT = require("lovec/sta/STA_baseStatus");
  const TIMER = require("lovec/glb/GLB_timer");


  /* <---------- component ----------> */


  function comp_update(sta, unit, time) {
    if(TIMER.timerState_unit && !sta.ex_canApply(unit)) unit.unapply(sta);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- status ----------> */


    init: function(sta) {
      PARENT.init(sta);
    },


    setStats: function(sta) {
      PARENT.setStats(sta);
    },


    update: function(sta, unit, time) {
      PARENT.update(sta, unit, time);
      comp_update(sta, unit, time);
    },


    /* <---------- status (specific) ----------> */


    /* <---------- status (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["sta-blk"],
    }),


    // @NOSUPER
    ex_canApply: function(sta, unit, ts) {
      return sta.filterScr(unit, ts) > sta.applyLimit - 0.0001;
    },


  };
