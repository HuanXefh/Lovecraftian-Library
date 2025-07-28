/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The root of all units.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
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


  const MATH_base = require("lovec/math/MATH_base");


  const FRAG_unit = require("lovec/frag/FRAG_unit");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_pollution = require("lovec/mdl/MDL_pollution");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(utp) {
    utp.stats.remove(Stat.mineTier);

    if(MDL_cond._isNonRobot(utp)) utp.stats.add(TP_stat.utp_notRobot, true);

    var polTol = MDL_pollution._polTol(utp);
    if(!MATH_base.fEqual(polTol, 500.0)) utp.stats.add(TP_stat.blk_polTol, polTol, TP_stat.blk_polUnits);
  };


  function comp_update(utp, unit) {
    FRAG_unit.comp_update_damaged(utp, unit);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- unit type ----------> */


    init: function(utp) {

    },


    setStats: function(utp) {
      comp_setStats(utp);
    },


    update: function(utp, unit) {
      comp_update(utp, unit);
    },


    killed: function(utp, unit) {

    },


    draw: function(utp, unit) {

    },


    /* <---------- status (specific) ----------> */


    /* <---------- status (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(utp) {
      return ["utp-lovec"];
    },


  };
