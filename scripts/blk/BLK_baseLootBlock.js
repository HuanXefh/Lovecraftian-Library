/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Base template of all loot-related blocks.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["amount"]["base"]    // @PARAM: Amount of items the block processes each time.
   * DB_block.db["param"]["time"]["base"]    // @PARAM: Interval that the loot block uses.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseItemBlock");


  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.update = true;
  };


  function comp_setStats(blk) {
    var amtRun = DB_block.db["param"]["amount"]["base"].read(blk.name, 0);
    var intvRun = DB_block.db["param"]["time"]["base"].read(blk.name, Infinity);

    if(amtRun > 0 && isFinite(intvRun)) blk.stats.add(Stat.itemsMoved, amtRun / intvRun * 60.0, StatUnit.itemsSecond);
  };


  function comp_created(b) {
    b.amtRun = DB_block.db["param"]["amount"]["base"].read(b.block.name, 0);
    b.intvRun = DB_block.db["param"]["time"]["base"].read(b.block.name, Infinity);
  };


  function comp_updateTile(b) {
    b.dump();

    if(b.timerCall.get(b.intvRun)) b.ex_lootCall();
  };


  function comp_onProximityUpdate(b) {
    b.ts = b.block.ex_getTs(b.tileX(), b.tileY(), b.rotation);
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
      comp_setStats(blk);
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


    updateTile: function(b) {
      PARENT.updateTile(b);
      comp_updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
      comp_onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    // @NOSUPER
    outputsItems: function(blk) {
      return true;
    },


    /* <---------- build (specific) ----------> */


    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


    // @LATER
    // @NOSUPER
    ex_getTs: function(blk, tx, ty, rot) {
      return Array.air;
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_lootCall: function(b) {

    },


  };


  module.exports = TEMPLATE;
