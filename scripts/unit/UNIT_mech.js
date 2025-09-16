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
   * UnitType (MechUnit)
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


  const TEMPLATE = {


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


    /* <---------- unit type (specific) ----------> */


    /* <---------- unit type (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(utp) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["utp-lovec", "utp-inf"],
    }),


  };


  TEMPLATE.init = PARENT.init;


  TEMPLATE._std = function(typeStr) {
    return {
      etpStr: typeStr,
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      update(unit) {
        this.super$update(unit);
        TEMPLATE.update(this, unit);
      },
      killed(unit) {
        this.super$killed(unit);
        TEMPLATE.killed(this, unit);
      },
      draw(unit) {
        this.super$draw(unit);
        TEMPLATE.draw(this, unit);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  module.exports = TEMPLATE;
