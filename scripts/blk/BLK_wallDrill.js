/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Beam drill but no beam.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * BeamDrill
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * b.useCep: bool    // @PARAM
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseDrill");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.drawArrow = true;
    blk.laserWidth = 0.0;
    blk.sparks = 10;
    blk.sparkRange = blk.size * Vars.tilesize * 0.5;
    blk.sparkLife = 20.0;
    blk.sparkRecurrence = 2.0;
    blk.sparkSpread = 50.0;
    blk.sparkSize = 0.5 + blk.size * 0.5;

    blk.range = 1;
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


    updateEfficiencyMultiplier: function(b) {
      PARENT.updateEfficiencyMultiplier(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-min", "blk-drl"],
    }),


    /* <---------- build (extended) ----------> */


  };
