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
   * KEY:
   *
   * sta.fadeReg: str    // @PARAM: The region used for drawing
   * sta.fadeColor: color    // @PARAM: The color used for drawing
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
    VARGEN.fadeStas.forEach(osta => {
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


  module.exports = {


    /* <---------- status ----------> */


    init: function(sta) {
      PARENT.init(sta);
      comp_init(sta);
    },


    setStats: function(sta) {
      PARENT.setStats(sta);
    },


    update: function(sta, unit, time) {
      PARENT.update(sta, unit, time);
    },


    /* <---------- status (specific) ----------> */


    draw: function(sta, unit) {
      comp_draw(sta, unit);
    },


    /* <---------- status (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return ["sta-fade"];
    },


  };
