/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The basic template for environmental blocks.
   * This template does not change anything.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    if(!blk.dropHardnessMtp.fEqual(1.0)) blk.stats.add(TP_stat.blk0env_hardnessMtp, blk.dropHardnessMtp.percColor(0, Pal.remove, Pal.heal, Pal.accent, 0.01));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(null)
  .setTags("blk-env")
  .setParam({
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaStat: true,
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaProp: true,
    // @PARAM: Multiplier on hardness of the item drop.
    dropHardnessMtp: 1.0,
  })
  .setMethod({


    setStats: function() {
      comp_setStats(this);
    },


  })
  .setGetter("dropHardnessMtp");
