/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * These blocks are related to item distribution and storage.
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


  const PARENT = require("lovec/blk/BLK_baseBlock");


  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk0itm_unloadable, blk.unloadable);

    if(MDL_cond._isExposedBlock(blk)) blk.stats.add(TP_stat.blk0itm_exposed, true);
  };


  function comp_updateTile(b) {
    FRAG_item.comp_updateTile_exposed(b);
    FRAG_item.comp_updateTile_virtual(b);
  };


  function comp_onDestroyed(b) {
    FRAG_item.comp_onDestroyed_exposed(b);
  };


  function comp_acceptItem(b, b_f, itm) {
    return !(MDL_cond._isVirt(itm) && !MDL_cond._isVirtBlk(b.block))
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
      comp_onDestroyed(b);
    },


    updateTile: function(b) {
      PARENT.updateTile(b);
      comp_updateTile(b);
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


    acceptItem: function(b, b_f, itm) {
      return comp_acceptItem(b, b_f, itm);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return [];
    },


    /* <---------- build (extended) ----------> */


  };
