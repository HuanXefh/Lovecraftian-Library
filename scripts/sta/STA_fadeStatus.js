/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Status effects that can stack up when applied, and finally burst to trigger something.
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


  const PARENT = require("lovec/sta/STA_baseStatus");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_draw = require("lovec/mdl/MDL_draw");


  /* <---------- component ----------> */


  function comp_init(sta) {
    sta.fadeReg = Core.atlas.find(sta.fadeReg);
  };


  function comp_draw(sta, unit) {
    var cond = true;
    var isAfter = false;
    VARGEN.fadeStas.forEachFast(osta => {
      if(osta === sta) isAfter = true;
      if(!isAfter && unit.hasEffect(osta) && osta !== sta) cond = false;
    });

    if(cond) MDL_draw.drawStatus_fade(unit, sta.fadeReg, sta.fadeColor);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- status ----------> */


    init: function(sta) {
      PARENT.init(sta);
      comp_init(sta);
    },


    setStats: function(sta) {
      PARENT.setStats(sta);
    },


    update: function(sta, unit, staEn) {
      PARENT.update(sta, unit, staEn);
    },


    /* <---------- status (specific) ----------> */


    draw: function(sta, unit) {
      comp_draw(sta, unit);
    },


    /* <---------- status (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["sta-fade"],
    }),


  };


  TEMPLATE._std = function(nmReg, fadeColor) {
    return {
      fadeReg: nmReg, fadeColor: tryVal(fadeColor, Color.white),
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
