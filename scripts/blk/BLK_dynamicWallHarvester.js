/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A wall crafter that outputs something based on attribute.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * WallCrafter
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


  const PARENT = require("lovec/blk/BLK_baseHarvester");
  const PARENT_A = require("lovec/blk/BLK_dynamicAttributeFactory");


  const MDL_pos = require("lovec/mdl/MDL_pos");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.isLiqBlk) {
      blk.outputsLiquid = true;
    };
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.output);
    blk.stats.remove(Stat.tiles);
    blk.stats.remove(Stat.drillSpeed);

    blk.stats.add(TP_stat.blk0fac_prodSpd, blk.isLiqBlk ? (blk.prodAmt * 60.0) : (blk.prodAmt / blk.craftTime), blk.isLiqBlk ? StatUnit.liquidSecond: StatUnit.itemsSecond);
  };


  function comp_updateTile(b) {
    if(b.attrRs == null) return;

    b.warmup = Mathf.approachDelta(b.warmup, Number(b.efficiency > 0), 0.025);
    b.totalTime += b.edelta() * b.warmup;

    if(Mathf.chance(b.block.updateEffectChance * b.warmup * 2.0)) {
      b.block.ex_getTs(b.tileX(), b.tileY(), b.rotation).forEachFast(ot => {
        if(Mathf.chance(0.5)) b.block.updateEffect.at(
          ot.worldx() + Mathf.range(3.0),
          ot.worldy() + Mathf.range(3.0),
          ot.block().mapColor,
        );
      });
    };
  };


  function comp_setBars(blk) {
    blk.removeBar("drillspeed");
    blk.addBar("drillspeed", b => new Bar(
      prov(() => Core.bundle.format("bar.drillspeed", Strings.fixed(b.efficiency * (blk.isLiqBlk ? (blk.prodAmt * 60.0) : (blk.prodAmt / blk.craftTime)), 2))),
      prov(() => Pal.ammo),
      () => b.warmup,
    ));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- block ----------> */


    init: function(blk) {
      PARENT_A.init(blk);
      comp_init(blk);
    },


    setStats: function(blk) {
      PARENT_A.setStats(blk);
      comp_setStats(blk);
    },


    // @NOSUPER
    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT_A.drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT_A.created(b);
    },


    onDestroyed: function(b) {
      PARENT_A.onDestroyed(b);
    },


    // @NOSUPER
    updateTile: function(b) {
      PARENT_A.updateTile(b);
      comp_updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT_A.onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT_A.draw(b);
    },


    drawSelect: function(b) {
      PARENT_A.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    setBars: function(blk) {
      PARENT_A.setBars(blk);
      comp_setBars(blk);
    },


    // @NOSUPER
    canPlaceOn: function(blk, t, team, rot) {
      return PARENT_A.canPlaceOn(blk, t, team, rot);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    shouldConsume: function(b) {
      return PARENT_A.shouldConsume(b);
    },


    // @NOSUPER
    getProgressIncrease: function(b, time) {
      return PARENT_A.getProgressIncrease(b, time);
    },


    // @NOSUPER
    efficiencyScale: function(b) {
      return PARENT_A.efficiencyScale(b);
    },


    updateEfficiencyMultiplier: function(b) {
      PARENT_A.updateEfficiencyMultiplier(b);
    },


    write: function(b, wr) {
      PARENT_A.write(b, wr);
    },


    read: function(b, rd, revi) {
      PARENT_A.read(b, rd, revi);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-min", "blk-harv"],
    }),


    // @NOSUPER
    ex_getTs: function(blk, tx, ty, rot) {
      return MDL_pos._tsRot(Vars.world.tile(tx, ty), rot, blk.size);
    },


    // @NOSUPER
    ex_getAttrRsMap: function(blk) {
      return PARENT_A.ex_getAttrRsMap(blk);
    },


    // @NOSUPER
    ex_getAttrMode: function(blk) {
      return PARENT_A.ex_getAttrMode(blk);
    },


    // @NOSUPER
    ex_getCraftTime: function(blk) {
      return blk.craftTime;
    },


    // @NOSUPER
    ex_getProdAmt: function(blk) {
      return blk.prodAmt;
    },


    // @NOSUPER
    ex_getAttrSum: function(blk, tx, ty, rot) {
      return PARENT_A.ex_getAttrSum(blk, tx, ty, rot);
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_getAttrRs: function(b) {
      return PARENT_A.ex_getAttrRs(b);
    },


    // @NOSUPER
    ex_getEffc: function(b) {
      return PARENT_A.ex_getEffc(b);
    },


    // @NOSUPER
    ex_updateAttrRs: function(b) {
      PARENT_A.ex_updateAttrRs(b);
    },


    // @NOSUPER
    ex_craftAttrRs: function(b) {
      PARENT_A.ex_craftAttrRs(b);
    },


  };


  TEMPLATE._std = function(attrRsMap, craftTime, prodAmt, isLiqBlk, updateEff, updateEffP) {
    return {
      attrRsMap: Object.val(attrRsMap, Array.air), attrMode: "blk",
      craftTime: Object.val(craftTime, 60.0), prodAmt: Object.val(prodAmt, 1.0),
      isLiqBlk: Object.val(isLiqBlk, false),
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      drawPlace(tx, ty, rot, valid) {
        TEMPLATE.drawPlace(this, tx, ty, rot, valid);
      },
      setBars() {
        this.super$setBars();
        TEMPLATE.setBars(this);
      },
      canPlaceOn(t, team, rot) {
        if(!TEMPLATE.canPlaceOn(this, t, team, rot)) return false;
        return true;
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getTs(tx, ty, rot) {
        return TEMPLATE.ex_getTs(this, tx, ty, rot);
      },
      ex_getAttrRsMap() {
        return TEMPLATE.ex_getAttrRsMap(this);
      },
      ex_getAttrMode() {
        return TEMPLATE.ex_getAttrMode(this);
      },
      ex_getCraftTime() {
        return TEMPLATE.ex_getCraftTime(this);
      },
      ex_getProdAmt() {
        return TEMPLATE.ex_getProdAmt(this);
      },
      ex_getAttrSum(tx, ty, rot) {
        return TEMPLATE.ex_getAttrSum(this, tx, ty, rot);
      },
      // @SPEC
      updateEffect: Object.val(updateEff, Fx.none), updateEffectChance: Object.val(updateEffP, 0.02),
    };
  };


  TEMPLATE._std_b = function(craftSound, shouldScaleCons) {
    return {
      craftSound: Object.val(craftSound, Sounds.none),
      shouldScaleCons: Object.val(shouldScaleCons, false),
      attrSum: 0.0, attrRs: null, prog: 0.0,
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
      shouldConsume() {
        if(!TEMPLATE.shouldConsume(this)) return false;
        return true;
      },
      getProgressIncrease(time) {
        return TEMPLATE.getProgressIncrease(this, time);
      },
      efficiencyScale() {
        return TEMPLATE.efficiencyScale(this);
      },
      updateEfficiencyMultiplier() {
        return TEMPLATE.updateEfficiencyMultiplier(this);
      },
      write(wr) {
        this.super$write(wr);
        TEMPLATE.write(this, wr);
      },
      read(rd, revi) {
        this.super$read(rd, revi);
        TEMPLATE.read(this, rd, revi);
      },
      ex_getAttrRs() {
        return TEMPLATE.ex_getAttrRs(this);
      },
      ex_getEffc() {
        return TEMPLATE.ex_getEffc(this);
      },
      ex_updateAttrRs() {
        TEMPLATE.ex_updateAttrRs(this);
      },
      ex_craftAttrRs() {
        TEMPLATE.ex_craftAttrRs(this);
      },
    };
  };


  module.exports = TEMPLATE;
