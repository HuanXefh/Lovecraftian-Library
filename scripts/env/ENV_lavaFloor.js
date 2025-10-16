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


  const MDL_color = require("lovec/mdl/MDL_color");


  const TP_cacheLayer = require("lovec/tp/TP_cacheLayer");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.walkSound = Sounds.splash;

    blk.speedMultiplier = 0.05;
    blk.cacheLayer = TP_cacheLayer.shader0surf_flr0liq_lava;
    blk.albedo = 0.2;
    blk.emitLight = true;
    blk.lightRadius = 40.0;
    if(MDL_color._isSameColor(blk.lightColor, Color.white)) blk.lightColor = Color.valueOf("faae7560");
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


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


    // @NOSUPER
    updateRender: function(blk, t) {
      return PARENT.updateRender(blk, t);
    },


    // @NOSUPER
    renderUpdate: function(blk, renderState) {
      PARENT.renderUpdate(blk, renderState);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-env"],
    }),


    // @NOSUPER
    ex_getMatGrp: function(blk) {
      return "lava";
    },


  };


  TEMPLATE._std = function(updateEff, updateEffP) {
    return {
      updateEff: tryVal(updateEff, Fx.none), updateEffP: tryVal(updateEffP, 0.02),
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      drawBase(t) {
        this.super$drawBase(t);
        TEMPLATE.drawBase(this, t);
      },
      updateRender(t) {
        return TEMPLATE.updateRender(this, t);
      },
      renderUpdate(renderState) {
        TEMPLATE.renderUpdate(this, renderState);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getMatGrp() {
        return TEMPLATE.ex_getMatGrp(this);
      },
    };
  };


  module.exports = TEMPLATE;
