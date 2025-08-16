/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Any fluid that is unwanted.
   * Technically an intermediate, but categorized as waste.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Liquid
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * liq.alts: 0
   * liq.intmdParent: rs_gn    // @PARAM, @NULL
   * liq.useParentRegion: bool    // @PARAM
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


  const PARENT = require("lovec/rs/RS_intermediateFluid");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(liq) {
    liq.stats.remove(TP_stat.rs_isIntermediate);
    liq.stats.add(TP_stat.rs_isWaste, true);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- resource ----------> */


    init: function(liq) {
      PARENT.init(liq);
    },


    setStats: function(liq) {
      PARENT.setStats(liq);
      comp_setStats(liq);
    },


    update: function(liq, puddle) {
      PARENT.update(liq, puddle)
    },


    loadIcon: function(liq) {
      PARENT.loadIcon(liq);
    },


    createIcons: function(liq, packer) {
      PARENT.createIcons(liq, packer);
    },


    /* <---------- resource (specific) ----------> */


    // @NOSUPER
    willBoil: function(liq) {
      return PARENT.willBoil(liq);
    },


    /* <---------- resource (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(liq) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["rs-was"],
    }),


    // @NOSUPER
    ex_getParent: function(liq) {
      return liq.intmdParent;
    },


  };
