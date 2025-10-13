/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The root of all blocks.
   * The BLK files work like classes, they store pre-defined functions which can be used when creating actual contents.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
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


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_cond = require("lovec/mdl/MDL_cond");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  const comp_setStats = function(blk) {
    const thisFun = comp_setStats;

    if(thisFun.addedStats.includes(blk)) return;

    if(MDL_cond._canShortCircuit(blk)) blk.stats.add(TP_stat.blk_shortCircuit, true);
    FRAG_faci.comp_setStats_pol(blk);

    thisFun.addedStats.push(blk);
  }
  .setProp({
    addedStats: [],
  });


  function comp_onDestroyed(b) {
    if(DB_block.db["group"]["noLoot"].includes(b.block.name)) return;

    /* ----------------------------------------
     * NOTE:
     *
     * I don't think dropping building materials as loot is a good idea.
     * When you destroy turrets and walls, there shouldn't be items everywhere.
     * ---------------------------------------- */
    /*b.block.requirements.forEach(itmStack => {
      let amt = itmStack.amount;
      if(amt >= 20) MDL_call.spawnLoot(b.x, b.y, itmStack.item, amt.randFreq(0.3), b.block.size * Vars.tilesize * 0.7);
    });*/

    if(b.items != null) {
      b.items.each(itm => {
        let amt = !(b.block instanceof CoreBlock) ? b.items.get(itm) : (b.items.get(itm) / Math.max(b.team.cores().size, 1));
        if(amt >= 20) MDL_call.spawnLoot(b.x, b.y, itm, amt.randFreq(0.3), b.block.size * Vars.tilesize * 0.7);
      });
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

    },


    setStats: function(blk) {
      comp_setStats(blk);
    },


    drawPlace: function(blk, tx, ty, rot, valid) {

    },


    /* <---------- build ----------> */


    created: function(b) {

    },


    onDestroyed: function(b) {
      comp_onDestroyed(b);
    },


    updateTile: function(b) {

    },


    onProximityUpdate: function(b) {

    },


    draw: function(b) {

    },


    drawSelect: function(b) {

    },


    /* <---------- block (specific) ----------> */


    /* <---------- build (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: [],
    }),


    /* <---------- build (extended) ----------> */


  };


  module.exports = TEMPLATE;
