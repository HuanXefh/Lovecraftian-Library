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


  /* ----------------------------------------
   * BASE:
   *
   * Item
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


  const PARENT = require("lovec/rs/RS_baseItem");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(itm) {
    itm.stats.add(TP_stat.rs_isWaste, true);
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
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["rs-was"],
    }),


  };


  TEMPLATE._std = function() {
    return {
      alts: 0,
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
