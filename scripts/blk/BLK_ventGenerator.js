/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Generators built on vents. It checks vent size now since it's not strictly 3x3.
   * Consumers are supported.
   * You don't need to divide production by squared block size in .json files.
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
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_table = require("lovec/mdl/MDL_table");

  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    var sizeSqr = Math.pow(blk.size, 2);
    blk.displayEfficiency = false;
    blk.displayEfficiencyScale = 1.0 / sizeSqr;
    blk.minEfficiency = sizeSqr - 0.0001;
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.tiles);
    blk.stats.remove(Stat.affinities);

    if(blk.outputLiquid != null) {
      blk.stats.remove(Stat.output);
      blk.stats.add(Stat.output, StatValues.liquid(blk.outputLiquid.liquid, blk.outputLiquid.amount * 60.0, true));
    };

    blk.stats.add(TP_stat.blk_attrReq, newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_attr(tb, blk.attribute, oblk => MDL_cond._isVentBlock(oblk) && oblk.armor.fEqual(blk.size));
    }));
  };


  function comp_updateTile(b) {
    if(TIMER.timerState_effc) {
      b.tmpEffc = (b.sum + b.block.attribute.env()) * b.efficiency / Math.pow(b.block.size, 2);
    };

    b.tmpWarmup = Mathf.approachDelta(b.tmpWarmup, b.tmpEffc > 0.0 ? 1.0 : 0.0, 0.008);
    b.productionEfficiency = Mathf.approachDelta(b.productionEfficiency, b.tmpEffc, 0.008);
    b.tProg += b.productionEfficiency * b.delta() * b.warmup();
    if(Mathf.chanceDelta(b.block.effectChance * b.productionEfficiency)) {
      b.block.generateEffect.at(b.x + Mathf.range(3.0), b.y + Mathf.range(3.0));
    };

    if(b.block.outputLiquid != null) {
      b.liquids.add(b.block.outputLiquid.liquid, Math.min(b.productionEfficiency * b.delta() * b.block.outputLiquid.amount, b.block.liquidCapacity - b.liquids.get(b.block.outputLiquid.liquid)));
      b.dumpLiquid(b.block.outputLiquid.liquid);
    };
  };


  function comp_canPlaceOn(blk, t, team, rot) {
    let flr = t.floor();

    return MDL_cond._isVentBlock(flr) && flr.armor.fEqual(blk.size);
  };


  function comp_warmup(b) {
    // Shouldn't be over 1.0
    return b.tmpWarmup;
  };


  function comp_totalProgress(b) {
    return b.tProg;
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
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-pow", "blk-pow0gen"],
    }),


    /* <---------- build (extended) ----------> */


  };


  TEMPLATE._std = function(shouldGenParam, genEff, genEffP, exploEff) {
    return {
      shouldGenParam: tryVal(shouldGenParam, false),
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
      generateEffect: tryVal(genEff, Fx.none), effectChance: tryVal(genEffP, 0.02),
      explodeEffect: tryVal(exploEff, Fx.none),
    };
  };


  TEMPLATE._std_b = function() {
    return {
      tProg: 0.0, tmpEffc: 0.0, tmpWarmup: 0.0,
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
