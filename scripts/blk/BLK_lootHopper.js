/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A storage block that collects loots over it.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * StorageBlock
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * b.tsGetter: null
   * b.ts: []
   * b.timerCall: new Interval(1)
   * b.amtRun: 0
   * b.intvRun: Infinity
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["amount"]["base"]    // @PARAM
   * DB_block.db["param"]["time"]["base"]    // @PARAM
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseLootBlock");


  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.solid = false;
    blk.underBullets = true;
  };


  function comp_created(b) {
    b.tsGetter = () => MDL_pos._tsBuild(b);
    b.ts = b.tsGetter(b);
  };


  function comp_ex_lootCall(b) {
    let loot = MDL_pos._lootTs(b.ts);
    if(loot != null) {
      if(FRAG_item.takeLoot(b, loot, b.amtRun, true)) MDL_effect.showBetween_itemTransfer(loot.x, loot.y, b);
    };
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


    // @NOSUPER
    outputsItems: function(blk) {
      return true;
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    acceptItem: function(b, b_f, itm) {
      return false;
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return [];
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_lootCall: function(b) {
      PARENT.ex_lootCall(b);
      comp_ex_lootCall(b);
    },


  };
