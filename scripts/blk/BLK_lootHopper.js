/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A storage block that collects loots on top of it.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * StorageBlock
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


  const TEMPLATE = {


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
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: [],
    }),


    // @NOSUPER
    ex_getTs: function(blk, tx, ty, rot) {
      return MDL_pos._tsBuild(Vars.world.build(tx, ty));
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_lootCall: function(b) {
      PARENT.ex_lootCall(b);
      comp_ex_lootCall(b);
    },


  };


  TEMPLATE._std = function() {
    return {
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      drawPlace(tx, ty, rot, valid) {
        this.super$drawPlace(tx, ty, rot, valid);
        TEMPLATE.drawPlace(this, tx, ty, rot, valid);
      },
      outputsItems() {
        return TEMPLATE.outputsItems(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getTs(tx, ty, rot) {
        return TEMPLATE.ex_getTs(this, tx, ty, rot);
      },
    };
  };


  TEMPLATE._std_b = function() {
    return {
      ts: [],
      timerCall: new Interval(1), amtRun: 0, intvRun: Infinity,
      created() {
        this.super$created();
        TEMPLATE.created(this);
      },
      onDestroyed() {
        this.super$onDestroyed();
        TEMPLATE.onDestroyed(this);
      },
      updateTile() {
        this.super$updateTile();
        TEMPLATE.updateTile(this);
      },
      onProximityUpdate() {
        this.super$onProximityUpdate();
        TEMPLATE.onProximityUpdate(this);
      },
      draw() {
        this.super$draw();
        TEMPLATE.draw(this);
      },
      drawSelect() {
        this.super$drawSelect();
        TEMPLATE.drawSelect(this);
      },
      acceptItem(b_f, itm) {
        if(!TEMPLATE.acceptItem(this, b_f, itm)) return false;
        return true;
      },
      ex_lootCall() {
        TEMPLATE.ex_lootCall(this);
      },
    };
  };


  module.exports = TEMPLATE;
