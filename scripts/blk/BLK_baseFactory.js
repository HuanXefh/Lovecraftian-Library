/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent for all factories.
   * A factory is a block that processes something to produce something else.
   * An auxilliary factory is a block that only produces auxilliary fluids.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * b.craftSound: se_gn    // @PARAM: The sound played when the building crafts.
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


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    if(DB_block.db["map"]["facFami"].includes(blk.name)) blk.stats.add(TP_stat.spec_facFami, extend(StatValue, {display(tb) {
      tb.row();
      MDL_table.setDisplay_facFami(tb, blk);
    }}));
  };


  function comp_updateTile(b) {
    FRAG_fluid.comp_updateTile_capAux(b);
    FRAG_fluid.comp_updateTile_flammable(b);
    FRAG_fluid.comp_updateTile_pressure(b);
  };


  function comp_craft(b) {
    MDL_effect.playAt(b.x, b.y, b.craftSound, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
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


    craft: function(b) {
      comp_craft(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-fac"];
    },


    /* <---------- build (extended) ----------> */


  };
