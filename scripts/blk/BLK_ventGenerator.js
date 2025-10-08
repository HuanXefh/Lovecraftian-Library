/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Generators built on vents. It checks vent size now since it's not strictly 3x3.
   * You don't need to divide production by squared block size in .json files, it's done in {init}.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * ThermalGenerator
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


  const PARENT = require("lovec/blk/BLK_baseGenerator");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_cond = require("lovec/mdl/MDL_cond");

  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    var sizeSqr = Math.pow(blk.size, 2);
    blk.displayEfficiency = false;
    blk.displayEfficiencyScale = 1.0 / sizeSqr;
    blk.minEfficiency = sizeSqr - 0.0001;
    blk.powerProduction /= sizeSqr;
    blk.outputLiquid.amount /= sizeSqr;
  };


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk_attrReq, MDL_attr._attrB(blk.attribute));
  };


  function comp_canPlaceOn(blk, t, team, rot) {
    let flr = t.floor();

    return MDL_cond._isVentBlock(flr) && flr.armor === blk.size;
  };


  function comp_warmup(b) {
    // Shouldn't be over 1.0
    return b.super$warmup() / Math.pow(b.block.size, 2);
  };


  function comp_totalProgress(b) {
    return MDL_cond._canUpdate(b) && b.sum > 0.0 ? Time.time : 0.0;
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


    canPlaceOn: function(blk, t, team, rot) {
      return comp_canPlaceOn(blk, t, team, rot);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    warmup: function(b) {
      return comp_warmup(b);
    },


    // @NOSUPER
    totalProgress: function(b) {
      return comp_totalProgress(b);
    },


    createExplosion: function(b) {
      PARENT.createExplosion(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-pow", "blk-pow0gen"],
    }),


    /* <---------- build (extended) ----------> */


  };


  TEMPLATE._std = function(shouldGenParam, genEff, genEffP, exploEff) {
    return {
      shouldGenParam: Object.val(shouldGenParam, false),
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
      canPlaceOn(t, team, rot) {
        if(!this.super$canPlaceOn(t, team, rot)) return false;
        if(!TEMPLATE.canPlaceOn(this, t, team, rot)) return false;
        return true;
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      // @SPEC
      generateEffect: Object.val(genEff, Fx.none), effectChance: Object.val(genEffP, 0.02),
      explodeEffect: Object.val(exploEff, Fx.none),
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
      warmup() {
        return TEMPLATE.warmup(this);
      },
      totalProgress() {
        return TEMPLATE.totalProgress(this);
      },
      createExplosion() {
        this.super$createExplosion();
        TEMPLATE.createExplosion(this);
      },
    };
  };


  module.exports = TEMPLATE;
