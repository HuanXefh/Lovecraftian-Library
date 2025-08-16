/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Floor group: lava.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Floor
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


  const PARENT = require("lovec/env/ENV_baseLiquidFloor");


  const MDL_draw = require("lovec/mdl/MDL_draw");


  const TP_cacheLayer = require("lovec/tp/TP_cacheLayer");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.walkSound = Sounds.splash;

    blk.speedMultiplier = 0.05;
    blk.cacheLayer = TP_cacheLayer.shader0surf_flr0liq_lava;
    blk.albedo = 0.2;
    blk.emitLight = true;
    blk.lightRadius = 40.0;
    if(MDL_draw._isSameColor(blk.lightColor, Color.white)) blk.lightColor = Color.valueOf("faae7560");
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- block ----------> */


    init: function(blk) {
      PARENT.init(blk);
      comp_init(blk);
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
    },


    drawBase: function(blk, t) {
      PARENT.drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-env"],
    }),


    // @NOSUPER
    ex_getMatGrp: function(blk) {
      return "lava";
    },


  };
