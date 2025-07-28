/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent for all drills.
   * A drill is a block that dynamically mines items using {itemDrop}.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
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


  const PARENT = require("lovec/blk/BLK_baseMiner");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    MDL_event._c_onLoad(() => {
      if(blk.blockedItems == null) blk.blockedItems = VARGEN.sandItms.toSeq();
    });
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.drillTier);
    blk.stats.remove(Stat.drillSpeed);

    blk.stats.add(TP_stat.blk0min_baseDrillSpd, FRAG_faci._drillSpd(blk, false), StatUnit.itemsSecond);
    blk.stats.add(TP_stat.blk0min_boostedDrillSpd, FRAG_faci._drillSpd(blk, true), StatUnit.itemsSecond);

    blk.stats.add(TP_stat.blk0min_drillTier, blk.tier);

    if(blk.blockedItems != null) blk.stats.add(TP_stat.blk0min_blockedItms, extend(StatValue, {display(tb) {
      tb.row();
      MDL_table.setDisplay_ctLi(tb, blk.blockedItems.toArray());
    }}));
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


    /* <---------- build (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-min", "blk-drl"];
    },


    /* <---------- build (extended) ----------> */


  };
