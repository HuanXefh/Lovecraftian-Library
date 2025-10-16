/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The base of all status effects, has no features.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * StatusEffect
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


  const MDL_content = require("lovec/mdl/MDL_content");


  const DB_status = require("lovec/db/DB_status");


  /* <---------- component ----------> */


  function comp_init(sta) {
    DB_status.db["map"]["affinity"].read(sta.name, Array.air).forEachRow(2, (nmSta, scr) => {
      let osta = MDL_content._ct(nmSta, "sta");
      if(osta == null) return;
      sta.affinity(osta, scr);
    });

    let tmpOpposite = DB_status.db["map"]["opposite"].read(sta.name, Array.air);
    let oppositeArr = typeof tmpOpposite === "function" ? tmpOpposite() : tmpOpposite;
    oppositeArr.forEachFast(sta_gn => {
      let osta = MDL_content._ct(sta_gn, "sta");
      if(osta == null) return;
      sta.opposite(osta);
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- status ----------> */


    init: function(sta) {
      comp_init(sta);
    },


    setStats: function(sta) {

    },


    update: function(sta, unit, staEn) {

    },


    /* <---------- status (specific) ----------> */


    /* <---------- status (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: [],
    }),


  };


  TEMPLATE._std = function(eff, effP) {
    return {
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      update(unit, staEn) {
        this.super$update(unit, staEn);
        TEMPLATE.update(this, unit, staEn);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      // @SPEC
      effect: tryVal(eff, Fx.none), effectChance: tryVal(effP, 0.02),
    };
  };


  module.exports = TEMPLATE;
