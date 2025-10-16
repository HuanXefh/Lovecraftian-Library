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
    if(!itm.sintTemp.fEqual(100.0)) itm.stats.add(TP_stat.rs_sintTemp, itm.sintTemp, TP_stat.rs_heatUnits);

    const oreblks = MDL_content._oreBlks(itm);
    if(oreblks.length > 0) itm.stats.add(TP_stat.rs_blockRelated, newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_ctLi(tb, oreblks, 48.0);
    }));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


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
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["rs-ore"],
    }),


  };


  TEMPLATE._std = function() {
    return {
      alts: 0,
      sintTemp: 0.0,
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      loadIcon() {
        this.super$loadIcon();
        TEMPLATE.loadIcon(this);
      },
      createIcons(packer) {
        this.super$createIcons(packer);
        TEMPLATE.createIcons(this, packer);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  module.exports = TEMPLATE;
