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
   * A BLK file is a template that extends vanilla classes. Why not classes? Cauz {class} is a reserved word and I can't use it.
   * You can see the base class in the BASE section. If it says !NOTHING, then this file is not meant to be used as template.
   * I mean, why do you need extend baseBlock? Just write another BLK file!
   *
   * How to use:
   * const TEMPLATE = require("lovec/blk/BLK_baseBlock");    // Import the module
   * const yourBlk = extend(BaseBlockClass, "blockname", {
   *   blkKey1: null,
   *   blkKey2: null,
   *   setStats() {
   *     this.super$setStats();
   *     TEMPLATE.setStats(this);
   *   },
   * });
   * yourBlk.buildType = () => extend(BaseBlockClass.BaseBuildClass, yourBlk, {
   *   bKey1: null,
   *   bKey2: null,
   *   updateTile() {
   *     this.super$updateTile();
   *     TEMPLATE.updateTile(this);
   *   },
   * });
   *
   * Only {setStats()} and {updateTile()} are added in the case shown above.
   * If you are familiar with JS, you probably know what's going on.
   * Some functions are marked as @NOSUPER, which means you don't need {this.super$xxx()} any more.
   *
   * About keys:
   * Keys are extra params defined for the content, like {blkKey1} you have seen above. Check them out in the KEY section.
   * {blk.keyName: null} means you should put new key in the block part, with initial value as {null}.
   * {b.keyName: null} is similiar but for building, in that {buildType}.
   * If a key is marked as @PARAM, then you can change it for some tricks.
   *
   * About params:
   * Take {DB_block.db["param"]["range"]["base"]    // @PARAM: Mending range.} for example.
   * You need write your block name and range in the array to set the mending range.
   * How to access this array? Create your own scripts/db/DB_block.js file.
   * Then, do this:
   *
   * const db = {
   *
   *
   *   "param": {
   *
   *
   *     "range": {
   *
   *
   *       "base": [
   *         "modname-blockname", yourRange,
   *       ],
   *
   *
   *     },
   *
   *
   *   },
   *
   *
   * };
   * exports.db = db;
   *
   * Your {DB_block} will be automatically merged into the one defined here.
   * Same for other params, just keep your files correct in format. There shouldn't be things other than objects and arrays.
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


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_cond = require("lovec/mdl/MDL_cond");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    if(MDL_cond._canShortCircuit(blk)) blk.stats.add(TP_stat.blk_shortCircuit, true);

    FRAG_faci.comp_setStats_pol(blk);
  };


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
      if(amt >= 20) MDL_call.spawnLoot(b.x, b.y, itmStack.item, Number(amt).randFreq(0.3), b.block.size * Vars.tilesize * 0.7);
    });*/

    if(b.items != null) {
      b.items.each(itm => {
        let amt = !(b.block instanceof CoreBlock) ? b.items.get(itm) : (b.items.get(itm) / Math.max(b.team.cores().size, 1));
        if(amt >= 20) MDL_call.spawnLoot(b.x, b.y, itm, Number(amt).randFreq(0.3), b.block.size * Vars.tilesize * 0.7);
      });
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
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


    /* <---------- build (extended) ----------> */


  };
