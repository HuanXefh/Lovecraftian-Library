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


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_intermediateFluid");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(liq) {
    liq.stats.remove(TP_stat.rs_isIntermediate);
    liq.stats.add(TP_stat.rs_isWastete, true);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Liquid)
  .setTags("rs-waste")
  .setParam({
    databaseTag: null,
  })
  .setMethod({


    setStats: function() {
      comp_setStats(this);
    },


  });
