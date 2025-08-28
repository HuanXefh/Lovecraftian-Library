/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla rain weather, no modification.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * RainWeather
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


  const PARENT = require("lovec/wea/WEA_decoWeather");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- status ----------> */


    init: function(wea) {
      PARENT.init(wea);
    },


    setStats: function(wea) {
      PARENT.setStats(wea);
    },


    update: function(wea, weaState) {
      PARENT.update(wea, weaState);
    },


    drawOver: function(wea, weaState) {
      PARENT.drawOver(wea, weaState);
    },


    drawUnder: function(wea, weaState) {
      PARENT.drawUnder(wea, weaState);
    },


    /* <---------- status (specific) ----------> */


    /* <---------- status (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["wea-deco"],
    }),


    // @NOSUPER
    ex_getWeaEn: function(wea, minFreq, maxFreq, minDur, maxDur) {
      return PARENT.ex_getWeaEn(wea, minFreq, maxFreq, minDur, maxDur);
    },


    // @NOSUPER
    ex_getWeaEnPermanent: function(wea) {
      return PARENT.ex_getWeaEnPermanent(wea);
    },


  };
