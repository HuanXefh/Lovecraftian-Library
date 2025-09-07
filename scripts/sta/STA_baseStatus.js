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
   * KEY:
   *
   * !NOTHING
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


  module.exports = {


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
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


  };
