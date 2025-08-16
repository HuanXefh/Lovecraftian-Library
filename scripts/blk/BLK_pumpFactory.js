/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Multi-crafters that can supply pressure/vacuum to nearby blocks.
   * Well, nothing new is defined here.
   * {ignoreLiquidFullness} is expected to be {true} at most time.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * GenericCrafter
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.rcMdl: rcMdl    // @PARAM
   * b.craftSound: se_gn    // @PARAM
   * b.useCep: bool    // @PARAM
   * b.noDump: bool    // @PARAM
   * b.isTall: false
   * b.rcHeader: ""
   * b.validTup: null
   * b.timeScl: 1.0
   * b.ci: []
   * b.bi: []
   * b.aux: []
   * b.reqOpt: false
   * b.opt: []
   * b.co: []
   * b.bo: []
   * b.failP: 0.0
   * b.fo: []
   * b.scrTup: null
   * b.tmpEffc: 0.0
   * b.progInc: 0.0
   * b.progIncLiq: 0.0
   * b.canAdd: false
   * b.hasRun: false
   * b.isStopped: false
   * b.splitAmt: 1
   * b.presFluidType: str    // @PARAM: Type of fluid blocks this can apply pressure to. See {BLK_baseFluidBlock}.
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM
   * DB_block.db["group"]["tall"]    // @PARAM
   * DB_block.db["param"]["amount"]["base"]    // @PARAM: See {BLK_liquidPump}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_recipeFactory");


  /* <---------- base ----------> */


  function comp_created(b) {
    b.splitAmt = DB_block.db["param"]["amount"]["base"].read(b.block.name, 1);
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
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
    },


    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT.created(b);
      comp_created(b);
    },


    onDestroyed: function(b) {
      PARENT.onDestroyed(b);
    },


    // @NOSUPER
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


    setBars: function(blk) {
      PARENT.setBars(blk);
    },


    // @NOSUPER
    consumesItem: function(blk, itm) {
      return PARENT.consumesItem(blk, itm);
    },


    // @NOSUPER
    consumesLiquid: function(blk, liq) {
      return PARENT.consumesLiquid(blk, liq);
    },


    // @NOSUPER
    outputsItems: function(blk) {
      return PARENT.outputsItems(blk);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    displayConsumption: function(b, tb) {
      PARENT.displayConsumption(b, tb);
    },


    displayBars: function(b, tb) {
      PARENT.displayBars(b, tb);
    },


    // @NOSUPER
    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm);
    },


    // @NOSUPER
    acceptLiquid: function(b, b_f, liq) {
      return PARENT.acceptLiquid(b, b_f, liq);
    },


    // @NOSUPER
    shouldConsume: function(b) {
      return PARENT.shouldConsume(b);
    },


    // @NOSUPER
    craft: function(b) {
      PARENT.craft(b);
    },


    // @NOSUPER
    buildConfiguration: function(b, tb) {
      PARENT.buildConfiguration(b, tb);
    },


    // @NOSUPER
    config: function(b) {
      return b.rcHeader;
    },


    // @NOSUPER
    drawStatus: function(b) {
      PARENT.drawStatus(b);
    },


    write: function(b, wr) {
      PARENT.write(b, wr);
    },


    read: function(b, rd, revi) {
      PARENT.read(b, rd, revi);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-fac", "blk-pump"],
    }),


    // @NOSUPER
    ex_getRcMdl: function(blk) {
      return PARENT.ex_getRcMdl(blk);
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accRcHeader: function(b, param) {
      return PARENT.ex_accRcHeader(b, param);
    },


    // @NOSUPER
    ex_updateParams: function(b, rcMdl, rcHeader, forceLoad) {
      PARENT.ex_updateParams(b, rcMdl, rcHeader, forceLoad);
    },


    // @NOSUPER
    ex_initParams: function(b) {
      PARENT.ex_initParams(b);
    },


    // @NOSUPER
    ex_getEffc: function(b) {
      return PARENT.ex_getEffc(b);
    },


    // @NOSUPER
    ex_getTimerEffc: function(b) {
      return PARENT.ex_getTimerEffc(b);
    },


    // @NOSUPER
    ex_getFailP: function(b) {
      return PARENT.ex_getFailP(b);
    },


  };
