/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * A block that conducts power.
   * ----------------------------------------
   * DEDICATION:
   *
   * Inspried by Asthosus.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * ArmoredConveyor
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["group"]["shortCircuit"]    // @PARAM
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_basePowerTransmitter");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.conductivePower = true;
    blk.connectedPower = false;
    blk.enableDrawStatus = false;

    blk.pushUnits = false;
    blk.junctionReplacement = null;
    blk.bridgeReplacement = null;

    blk.addBar("power", PowerNode.makePowerBalance());
    blk.addBar("batteries", PowerNode.makeBatteryBalance());
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.itemsMoved);
  };


  function comp_unitOn(b, unit) {
    if(!Mathf.chance(0.03) || b.power == null || b.power.status < 0.1) return;
    if(!MDL_cond._isWet(unit)) return;

    FRAG_attack.apply_lightning(b.x, b.y, null, null, null, 6, 4);
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


    // @NOSUPER
    outputsItems: function(blk) {
      return true;
    },


    canPlaceOn: function(blk, t, team, rot) {
      return PARENT.canPlaceOn(blk, t, team, rot);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    acceptItem: function(b, b_f, itm) {
      return false;
    },


    unitOn: function(b, unit) {
      comp_unitOn(b, unit);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-pow", "blk-pow0trans"];
    },


    /* <---------- build (extended) ----------> */


  };
