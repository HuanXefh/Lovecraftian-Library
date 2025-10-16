/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Multi-crafters that can supply pressure/vacuum to nearby blocks.
   * Well, nothing new is defined here.
   * {ignoreLiquidFullness} is expected to be {true} at most time.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * GenericCrafter
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM
   * DB_block.db["param"]["amount"]["base"]    // @PARAM: See {BLK_liquidPump}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_recipeFactory");


  const MDL_recipe = require("lovec/mdl/MDL_recipe");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- base ----------> */


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk0liq_splitAmt, DB_block.db["param"]["amount"]["base"].read(blk.name, 1));
  };


  function comp_created(b) {
    b.splitAmt = DB_block.db["param"]["amount"]["base"].read(b.block.name, 1);
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
      comp_setStats(blk);
    },


    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT.created(b);
      comp_created(b);
    },


    onDestroyed: function(b) {
      PARENT.onDestroyed(b);
    },


    // @NOSUPER
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


    setBars: function(blk) {
      PARENT.setBars(blk);
    },


    // @NOSUPER
    consumesItem: function(blk, itm) {
      return PARENT.consumesItem(blk, itm);
    },


    // @NOSUPER
    consumesLiquid: function(blk, liq) {
      return PARENT.consumesLiquid(blk, liq);
    },


    // @NOSUPER
    outputsItems: function(blk) {
      return PARENT.outputsItems(blk);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    displayConsumption: function(b, tb) {
      PARENT.displayConsumption(b, tb);
    },


    displayBars: function(b, tb) {
      PARENT.displayBars(b, tb);
    },


    // @NOSUPER
    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm);
    },


    // @NOSUPER
    acceptLiquid: function(b, b_f, liq) {
      return PARENT.acceptLiquid(b, b_f, liq);
    },


    // @NOSUPER
    shouldConsume: function(b) {
      return PARENT.shouldConsume(b);
    },


    // @NOSUPER
    craft: function(b) {
      PARENT.craft(b);
    },


    // @NOSUPER
    buildConfiguration: function(b, tb) {
      PARENT.buildConfiguration(b, tb);
    },


    // @NOSUPER
    config: function(b) {
      return b.rcHeader;
    },


    // @NOSUPER
    drawStatus: function(b) {
      PARENT.drawStatus(b);
    },


    write: function(b, wr) {
      PARENT.write(b, wr);
      processRevision(wr);
    },


    read: function(b, rd, revi) {
      PARENT.read(b, rd, revi);
      processRevision(rd);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-fac", "blk-pump"],
    }),


    // @NOSUPER
    ex_getRcMdl: function(blk) {
      return PARENT.ex_getRcMdl(blk);
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accRcHeader: function(b, param) {
      return PARENT.ex_accRcHeader(b, param);
    },


    // @NOSUPER
    ex_updateParams: function(b, rcMdl, rcHeader, forceLoad) {
      PARENT.ex_updateParams(b, rcMdl, rcHeader, forceLoad);
    },


    // @NOSUPER
    ex_initParams: function(b) {
      PARENT.ex_initParams(b);
    },


    // @NOSUPER
    ex_getEffc: function(b) {
      return PARENT.ex_getEffc(b);
    },


    // @NOSUPER
    ex_getTimerEffcState: function(b) {
      return PARENT.ex_getTimerEffcState(b);
    },


    // @NOSUPER
    ex_getFailP: function(b) {
      return PARENT.ex_getFailP(b);
    },


  };


  TEMPLATE._std = function(nmBlk, craftEff, updateEff, updateEffP) {
    return {
      rcMdl: MDL_recipe._rcMdl("projreind", nmBlk),
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
      setBars() {
        this.super$setBars();
        TEMPLATE.setBars(this);
      },
      consumesItem(itm) {
        return TEMPLATE.consumesItem(this, itm);
      },
      consumesLiquid(liq) {
        return TEMPLATE.consumesLiquid(this, liq);
      },
      outputsItems() {
        return TEMPLATE.outputsItems(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getRcMdl() {
        return TEMPLATE.ex_getRcMdl(this);
      },
      // @SPEC
      craftEffect: tryVal(craftEff, Fx.none), updateEffect: tryVal(updateEff, Fx.none), updateEffectChance: tryVal(updateEffP, 0.02),
    };
  };


  TEMPLATE._std_b = function(craftSe, useCep, noDump, presFluidType) {
    return {
      craftSound: tryVal(craftSe, Sounds.none),
      useCep: tryVal(useCep, false), noDump: tryVal(noDump, false),
      rcHeader: "", validTup: null, timeScl: 1.0, ignoreItemFullness: false,
      ci: [], bi: [], aux: [], reqOpt: false, opt: [],
      co: [], bo: [], failP: 0.0, fo: [],
      scrTup: null, tmpEffc: 0.0, progInc: 0.0, progIncLiq: 0.0, canAdd: false,
      hasRun: false, isStopped: false, dumpTup: null,
      splitAmt: 1, presFluidType: tryVal(presFluidType, "both"),
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
      displayConsumption(tb) {
        TEMPLATE.displayConsumption(this, tb);
      },
      displayBars(tb) {
        this.super$displayBars(tb);
        TEMPLATE.displayBars(this, tb);
      },
      acceptItem(b_f, itm) {
        return TEMPLATE.acceptItem(this, b_f, itm);
      },
      acceptLiquid(b_f, liq) {
        return TEMPLATE.acceptLiquid(this, b_f, liq);
      },
      shouldConsume() {
        return TEMPLATE.shouldConsume(this);
      },
      craft() {
        this.super$craft();
        TEMPLATE.craft(this);
      },
      buildConfiguration(tb) {
        TEMPLATE.buildConfiguration(this, tb);
      },
      config() {
        return TEMPLATE.config(this);
      },
      drawStatus() {
        TEMPLATE.drawStatus(this);
      },
      write(wr) {
        this.super$write(wr);
        TEMPLATE.write(this, wr);
      },
      read(rd, revi) {
        this.super$read(rd, revi);
        TEMPLATE.read(this, rd, revi);
      },
      ex_accRcHeader(param) {
        return TEMPLATE.ex_accRcHeader(this, param);
      },
      ex_updateParams(rcMdl, rcHeader, forceLoad) {
        TEMPLATE.ex_updateParams(this, rcMdl, rcHeader, forceLoad);
      },
      ex_initParams() {
        TEMPLATE.ex_initParams(this);
      },
      ex_getEffc() {
        return TEMPLATE.ex_getEffc(this);
      },
      ex_getTimerEffcState() {
        return TEMPLATE.ex_getTimerEffcState(this);
      },
      ex_getFailP() {
        return TEMPLATE.ex_getFailP(this);
      },
    };
  };


  module.exports = TEMPLATE;
