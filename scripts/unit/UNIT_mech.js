/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The most common unit like Dagger.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * UnitType, MechUnit
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


  const PARENT = require("lovec/unit/UNIT_baseUnit");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- unit type ----------> */


    init: function(utp) {
      PARENT.init(utp);
    },


    setStats: function(utp) {
      PARENT.setStats(utp);
    },


    update: function(utp, unit) {
      PARENT.update(utp, unit);
    },


    killed: function(utp, unit) {
      PARENT.killed(utp, unit);
    },


    draw: function(utp, unit) {
      PARENT.draw(utp, unit);
    },


    /* <---------- status (specific) ----------> */


    /* <---------- status (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(utp) {
      return ["utp-lovec", "utp-inf"];
    },


  };
