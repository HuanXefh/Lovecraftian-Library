/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Items that can be obtained through mining.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseItem");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- component ----------> */


  function comp_init(itm) {
    itm.sintTemp = itm.sintTemp >= 0.0 ? itm.sintTemp : MDL_content._sintTemp(itm);
  };


  function comp_setStats(itm) {
    itm.stats.add(TP_stat.rs_isOre, true);
    if(itm.sintTemp > 100.0) itm.stats.add(TP_stat.rs_sintTemp, itm.sintTemp, TP_stat.rs_heatUnits);

    let oreBlks = MDL_content._oreBlks(itm);
    if(oreBlks.length > 0) itm.stats.add(TP_stat.rs_blockRelated, newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_ctLi(tb, oreBlks, 48.0);
    }));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Item)
  .setTags("rs-ore")
  .setParam({
    // @PARAM: Sintering temperature, has DB entry.
    sintTemp: -1.0,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
