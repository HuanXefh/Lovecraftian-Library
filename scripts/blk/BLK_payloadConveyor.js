/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Modified payload conveyors that are affected by efficiency.
   * It's not possible to slow down the conveyor as it will break sync.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * PayloadConveyor
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


  const PARENT = require("lovec/blk/BLK_basePayloadBlock");
  const VAR = require("lovec/glb/GLB_var");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.canOverdrive = false;
    if(blk.hasPower) {
      blk.conductivePower = true;
      blk.connectedPower = false;
    };
  };


  function comp_updateTile(b) {
    if(b.efficiency > VAR.blk_updateEffcThr) {
      b.super$updateTile();
    } else {
      b.progress = Mathf.approachDelta(b.progress, b.block.moveTime, b.block.moveTime * 0.02);
      b.updatePayload();
    };
  };


  function comp_unitOn(b, unit) {
    if(b.efficiency > VAR.blk_updateEffcThr) b.super$unitOn(unit);
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


    // @NOSUPER
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


    // @NOSUPER
    unitOn: function(b, unit) {
      comp_unitOn(b, unit);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


    /* <---------- build (extended) ----------> */


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
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  TEMPLATE._std_b = function() {
    return {
      created() {
        this.super$created();
        TEMPLATE.created(this);
      },
      onDestroyed() {
        this.super$onDestroyed();
        TEMPLATE.onDestroyed(this);
      },
      updateTile() {
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
      unitOn(unit) {
        TEMPLATE.unitOn(this, unit);
      },
    };
  };


  module.exports = TEMPLATE;
