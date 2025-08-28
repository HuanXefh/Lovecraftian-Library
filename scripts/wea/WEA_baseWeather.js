/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent template for all weathers.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
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


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- status ----------> */


    init: function(wea) {

    },


    setStats: function(wea) {

    },


    update: function(wea, weaState) {

    },


    drawOver: function(wea, weaState) {

    },


    drawUnder: function(wea, weaState) {

    },


    /* <---------- status (specific) ----------> */


    /* <---------- status (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


    // @NOSUPER
    ex_getWeaEn: function(wea, minFreq, maxFreq, minDur, maxDur) {
      return new Weather.WeatherEntry(wea, minFreq, maxFreq, minDur, maxDur);
    },


    // @NOSUPER
    ex_getWeaEnPermanent: function(wea) {
      let weaEn = new Weather.WeatherEntry(wea);
      weaEn.always = true;

      return weaEn;
    },


  };
