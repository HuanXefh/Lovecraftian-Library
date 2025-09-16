/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Multi-crafters that break your finger.
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
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_recipeFactory");
  const JAVA = require("lovec/glb/GLB_java");


  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- base ----------> */


  function comp_init(blk) {
    blk.config(JAVA.FLOAT, (b, f) => {
      b.ex_accManualCharge(f);
      MDL_effect.showAt_click(b.x, b.y, b.team);
    });
  };


  function comp_updateTile(b) {
    b.manualCharge = Mathf.maxZero(b.manualCharge - 0.002);
  };


  function comp_buildConfiguration(b, tb) {
    tb.row();
    tb.table(Styles.none, tb1 => {
      tb1.center();
      MDL_table.__btnCfg_base(tb1, b, () => {
        Vars.state.paused ?
          MDL_ui.show_fadeInfo("lovec", "paused-manual-click") :
          b.configure(Mathf.lerpDelta(b.manualCharge, 1.25, 0.125).toF());
      }, Icon.crafting, 72.0);
    });
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
      comp_buildConfiguration(b, tb);
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
    },


    read: function(b, rd, revi) {
      PARENT.read(b, rd, revi);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-fac"],
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
      return PARENT.ex_getEffc(b) * Mathf.clamp(b.manualCharge);
    },


    // @NOSUPER
    ex_getTimerEffcState: function(b) {
      return true;
    },


    // @NOSUPER
    ex_getFailP: function(b) {
      return PARENT.ex_getFailP(b);
    },


    // @NOSUPER
    ex_accManualCharge: function(b, param) {
      return param === "read" ? b.manualCharge : (b.manualCharge = param);
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
      craftEffect: Object.val(craftEff, Fx.none), updateEffect: Object.val(updateEff, Fx.none), updateEffectChance: Object.val(updateEffP, 0.02),
    };
  };


  TEMPLATE._std_b = function(craftSe, useCep, noDump) {
    return {
      craftSound: Object.val(craftSe, Sounds.none),
      useCep: Object.val(useCep, false), noDump: Object.val(noDump, false),
      rcHeader: "", validTup: null, timeScl: 1.0, ignoreItemFullness: false,
      ci: [], bi: [], aux: [], reqOpt: false, opt: [],
      co: [], bo: [], failP: 0.0, fo: [],
      scrTup: null, tmpEffc: 0.0, progInc: 0.0, progIncLiq: 0.0, canAdd: false,
      hasRun: false, isStopped: false, dumpTup: null,
      manualCharge: 0.0,
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
      ex_accManualCharge(param) {
        return TEMPLATE.ex_accManualCharge(this, param);
      },
    };
  };


  module.exports = TEMPLATE;
