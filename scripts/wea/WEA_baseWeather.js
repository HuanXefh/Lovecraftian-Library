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


  const TEMPLATE = {


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
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


  };


  module.exports = TEMPLATE;
