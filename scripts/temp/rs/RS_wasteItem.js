/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Items that are considered to be waste.
   * Unlike fluid, waste item has no relation with intermediate.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseItem");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(itm) {
    itm.stats.add(TP_stat.rs_isWastete, true);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Item)
  .setTags("rs-was")
  .setParam({})
  .setMethod({


    setStats: function() {
      comp_setStats(this);
    },


  });
