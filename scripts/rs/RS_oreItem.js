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


  /* ----------------------------------------
   * BASE:
   *
   * Item
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * itm.alts: 0
   * itm.sintTemp: 0.0
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_item.db["param"]["sintTemp"]    // @PARAM: Sintering temperature, used for recipe generation.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/rs/RS_baseItem");


  const MATH_base = require("lovec/math/MATH_base");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- component ----------> */


  function comp_init(itm) {
    itm.sintTemp = MDL_content._sintTemp(itm);
  };


  function comp_setStats(itm) {
    itm.stats.add(TP_stat.rs_isOre, true);
    if(!MATH_base.fEqual(itm.sintTemp, 100.0)) itm.stats.add(TP_stat.rs_sintTemp, itm.sintTemp, TP_stat.rs_heatUnits);

    const oreblks = MDL_content._oreBlks(itm);
    if(oreblks.length > 0) itm.stats.add(TP_stat.rs_blockRelated, extend(StatValue, {display(tb) {
      tb.row();
      MDL_table.setDisplay_ctRow(tb, oreblks);
    }}));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- resource ----------> */


    init: function(itm) {
      PARENT.init(itm);
      comp_init(itm);
    },


    setStats: function(itm) {
      PARENT.setStats(itm);
      comp_setStats(itm);
    },


    loadIcon: function(itm) {
      PARENT.loadIcon(itm);
    },


    createIcons: function(itm, packer) {
      PARENT.createIcons(itm, packer);
    },


    /* <---------- resource (specific) ----------> */


    /* <---------- resource (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(itm) {
      return ["rs-ore"];
    },


  };
