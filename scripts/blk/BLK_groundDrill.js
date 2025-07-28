/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The most common drill type that mines the floor beneath.
   * Cannot mine depth ores.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Drill
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * b.useAccel: bool    // @PARAM: Whether this drill spins faster when ready to output.
   * b.timeDrilledInc: 0.0
   * b.useCep: bool    // @PARAM: Whether this drill is affected by core energy.
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM: CEPs used by this block.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseDrill");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    FRAG_faci.comp_setStats_cep(blk);
  };


  function comp_update(b) {
    if(b.dominantItem == null || !b.useAccel) return;

    // DEDICATION: Inspired by Psammos
    b.timeDrilledInc = Mathf.approachDelta(b.timeDrilledInc, Mathf.lerp(0.0, b.warmup * b.delta() * 8.0, b.dominantItem == null ? 0.0 : Interp.pow5In.apply(Mathf.clamp(b.progress / b.block.getDrillTime(b.dominantItem)))), 0.1);
    b.timeDrilled += b.timeDrilledInc;
  };


  function comp_drawSelect(b) {
    if(b.useCep) FRAG_faci.comp_drawSelect_cep(b);
  };


  function comp_canMine(blk, t) {
    return !MDL_cond._isDepthOre(t.overlay());
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(b.useCep) b.efficiency *= FRAG_faci._cepEffcCur(b.team);
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
      comp_update(b);
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
      comp_drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    canMine: function(blk, t) {
      return comp_canMine(blk, t);
    },


    /* <---------- build (specific) ----------> */


    updateEfficiencyMultiplier: function(b) {
      comp_updateEfficiencyMultiplier(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-min", "blk-drl"];
    },


    /* <---------- build (extended) ----------> */


  };
