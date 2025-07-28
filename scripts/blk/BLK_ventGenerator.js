/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Generators built on vents. It checks vent size now since it's not strictly 3x3.
   * You don't need divide production by squared block size in json files, it's done in {init}.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * ThermalGenerator
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.shouldGenParam: bool    // @PARAM
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


  const PARENT = require("lovec/blk/BLK_baseGenerator");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_cond = require("lovec/mdl/MDL_cond");

  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    var sizeSqr = Math.pow(blk.size, 2);
    blk.displayEfficiency = false;
    blk.displayEfficiencyScale = 1.0 / sizeSqr;
    blk.minEfficiency = sizeSqr - 0.0001;
    blk.powerProduction /= sizeSqr;
    blk.outputLiquid.amount /= sizeSqr;
  };


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk_attrReq, MDL_attr._attrB(blk.attribute));
  };


  function comp_canPlaceOn(blk, t, team, rot) {
    let flr = t.floor();

    return MDL_cond._isVentBlock(flr) && flr.armor === blk.size;
  };


  function comp_warmup(b) {
    // Shouldn't be over 1.0
    return b.super$warmup() / Math.pow(b.block.size, 2);
  };


  function comp_totalProgress(b) {
    return MDL_cond._canUpdate(b) && b.sum > 0.0 ? Time.time : 0.0;
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
      comp_setStats(blk);
    },


    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT.created(b);
    },


    onDestroyed: function(b) {
      PARENT.onDestroyed(b);
    },


    updateTile: function(b) {
      PARENT.updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    canPlaceOn: function(blk, t, team, rot) {
      return comp_canPlaceOn(blk, t, team, rot);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    warmup: function(b) {
      return comp_warmup(b);
    },


    // @NOSUPER
    totalProgress: function(b) {
      return comp_totalProgress(b);
    },


    createExplosion: function(b) {
      PARENT.createExplosion(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-pow", "blk-pow0gen"];
    },


    /* <---------- build (extended) ----------> */


  };
