/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * All the decorative weathers.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
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


  const PARENT = require("lovec/wea/WEA_baseWeather");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


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
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["wea-deco"],
    }),


  };


  module.exports = TEMPLATE;
