/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The most basic items that have no features.
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


  const PARENT = require("lovec/rs/RS_baseResource");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const DB_item = require("lovec/db/DB_item");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(itm) {
    itm.hardness = DB_item.db["param"]["hardness"].read(itm.name, 0);
  };


  function comp_setStats(itm) {
    itm.stats.remove(Stat.explosiveness);
    itm.stats.remove(Stat.flammability);
    itm.stats.remove(Stat.radioactivity);
    itm.stats.remove(Stat.charge);

    if(itm.explosiveness > 0.0) itm.stats.addPercent(Stat.explosiveness, itm.explosiveness);
    if(itm.flammability > 0.0) itm.stats.addPercent(Stat.flammability, itm.flammability);
    if(itm.radioactivity > 0.0) itm.stats.addPercent(Stat.radioactivity, itm.radioactivity);
    if(itm.charge > 0.0) itm.stats.addPercent(Stat.charge, itm.charge);

    if(itm.buildable) itm.stats.add(TP_stat.rs_buildable, true);
    if(itm.hardness > 0) itm.stats.add(TP_stat.rs_hardness, itm.hardness);

    if(VARGEN.fuelItms.includes(itm)) {
      itm.stats.add(TP_stat.rs0fuel_point, FRAG_faci._fuelPon(itm));
      itm.stats.add(TP_stat.rs0fuel_level, FRAG_faci._fuelLvl(itm));
    };
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
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
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
