/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Status effects that trigger something when the unit is dead.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * StatusEffect
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * sta.killedScr: unit => {...}   // @PARAM: The function run when the unit is killed.
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


  /* <---------- component ----------> */


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
    },


    /* <---------- status (specific) ----------> */


    /* <---------- status (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["sta-death"],
    }),


  };
