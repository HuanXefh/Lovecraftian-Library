/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Unbreakable sea bush.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * SeaBush
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


  const PARENT = require("lovec/env/ENV_baseProp");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.breakable = false;
    blk.unitMoveBreakable = false;

    blk.solid = false;
    blk.alwaysReplace = false;
    blk.placeableLiquid = true;

    // Have to bypass vanilla shadow because of the hard-coded alpha
    blk.hasShadow = false;
    blk.customShadow = true;
  };


  function comp_drawBase(blk, t) {
    Draw.z(Layer.block - 0.1);
    Draw.rect(blk.customShadowRegion, t.worldx(), t.worldy());
    Draw.reset();
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
      comp_drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-env"],
    }),


  };


  TEMPLATE._std = function(grassLay) {
    return {
      layer: tryVal(grassLay, Layer.groundUnit - 1.2),
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
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  module.exports = TEMPLATE;
