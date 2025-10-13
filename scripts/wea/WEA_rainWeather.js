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


  TEMPLATE._std = function() {
    return {
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      update(weaState) {
        this.super$update(weaState);
        TEMPLATE.update(this, weaState);
      },
      drawOver(weaState) {
        this.super$drawOver(weaState);
        TEMPLATE.drawOver(this, weaState);
      },
      drawUnder(weaState) {
        this.super$drawUnder(weaState);
        TEMPLATE.drawUnder(this, weaState);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  module.exports = TEMPLATE;
