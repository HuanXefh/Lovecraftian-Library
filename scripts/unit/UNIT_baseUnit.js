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


  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_unit = require("lovec/frag/FRAG_unit");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(utp) {
    FRAG_faci.comp_init_outline(utp);
  };


  function comp_setStats(utp) {
    utp.stats.remove(Stat.mineTier);

    if(MDL_cond._isNonRobot(utp)) utp.stats.add(TP_stat.utp_notRobot, true);

    var polTol = FRAG_faci._polTol(utp);
    if(!polTol.fEqual(500.0)) utp.stats.add(TP_stat.blk_polTol, polTol, TP_stat.blk_polUnits);
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
      comp_init(utp);
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


    /* <---------- unit type (specific) ----------> */


    /* <---------- unit type (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(utp) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["utp-lovec"],
    }),


  };
