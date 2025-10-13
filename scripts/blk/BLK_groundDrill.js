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


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(b.dominantItem == null || !b.useAccel) return;

    // DEDICATION: Inspired by Psammos
    b.timeDrilledInc = Mathf.approachDelta(b.timeDrilledInc, Mathf.lerp(0.0, b.warmup * b.delta() * 8.0, b.dominantItem == null ? 0.0 : Interp.pow5In.apply(Mathf.clamp(b.progress / b.block.getDrillTime(b.dominantItem)))), 0.1);
    b.timeDrilled += b.timeDrilledInc;
  };


  function comp_canMine(blk, t) {
    return !MDL_cond._isDepthOre(t.overlay());
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


    canMine: function(blk, t) {
      return comp_canMine(blk, t);
    },


    /* <---------- build (specific) ----------> */


    updateEfficiencyMultiplier: function(b) {
      PARENT.updateEfficiencyMultiplier(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-min", "blk-drl"],
    }),


    /* <---------- build (extended) ----------> */


  };


  TEMPLATE._std = function(drillEff, drillEffP, drillEffRnd, updateEff, updateEffP) {
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
      canMine(t) {
        if(!this.super$canMine(t)) return false;
        if(!TEMPLATE.canMine(this, t)) return false;
        return true;
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      // @SPEC
      drillEffect: Object.val(drillEff, Fx.none), drillEffectChance: Object.val(drillEffP, 1.0), drillEffectRnd: Object.val(drillEffRnd, 0.0),
      updateEffect: Object.val(updateEff, Fx.none), updateEffectChance: Object.val(updateEffP, 0.02),
    };
  };


  TEMPLATE._std_b = function(useCep, useAccel) {
    return {
      useCep: Object.val(useCep, false),
      useAccel: Object.val(useAccel, false), timeDrilledInc: 0.0,
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
      updateEfficiencyMultiplier() {
        this.super$updateEfficiencyMultiplier();
        TEMPLATE.updateEfficiencyMultiplier(this);
      },
    };
  };


  module.exports = TEMPLATE;
