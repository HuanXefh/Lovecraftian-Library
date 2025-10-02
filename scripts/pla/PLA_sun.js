/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Regular sun.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Planet
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


  const PARENT = require("lovec/pla/PLA_basePlanet");


  /* <---------- component ----------> */


  function comp_load(pla) {
    pla.tidalLock = true;
    pla.drawOrbit = false;
    pla.hasAtmosphere = true;
    pla.bloom = true;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- planet ----------> */


    load: function(pla) {
      PARENT.load(pla);
      comp_load(pla);
    },


    init: function(pla) {
      PARENT.init(pla);
    },


    /* <---------- planet (specific) ----------> */


    /* <---------- planet (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["pla-sun"],
    }),


  };


  TEMPLATE.init = PARENT.init;


  TEMPLATE._std = function() {
    return {
      load() {
        this.super$load();
        TEMPLATE.load(this);
      },
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  module.exports = TEMPLATE;
