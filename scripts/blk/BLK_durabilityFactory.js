/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Multi-crafters with recipes to choose from.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * GenericCrafter
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.rcMdl: rcMdl    // @PARAM
   * b.craftSound: se_gn    // @PARAM
   * b.useCep: bool    // @PARAM
   * b.noDump: bool    // @PARAM
   * b.isTall: false
   * b.rcHeader: ""
   * b.validTup: null
   * b.timeScl: 1.0
   * b.ci: []
   * b.bi: []
   * b.aux: []
   * b.reqOpt: false
   * b.opt: []
   * b.co: []
   * b.bo: []
   * b.failP: 0.0
   * b.fo: []
   * b.scrTup: null
   * b.tmpEffc: 0.0
   * b.progInc: 0.0
   * b.progIncLiq: 0.0
   * b.canAdd: false
   * b.hasRun: false
   * b.isStopped: false
   * b.dumpTup: null
   * b.durabDecMtp: 1.0
   * b.durabTime: Infinity
   * b.durab: 1.0
   * b.durabMode: "dec"
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM
   * DB_block.db["group"]["tall"]    // @PARAM
   * DB_block.db["param"]["time"]["base"]    // @PARAM: Time for durability to deplete.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_recipeFactory");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- base ----------> */


  function comp_setStats(blk) {
    let durabTime = DB_block.db["param"]["time"]["base"].read(blk.name, Infinity);
    if(isFinite(durabTime) && durabTime > 0.0) blk.stats.add(TP_stat.blk0fac_durabTime, Number(durabTime / 3600.0 * 0.75).deciDigit(2), StatUnit.minutes);
  };


  function comp_created(b) {
    b.durabTime = DB_block.db["param"]["time"]["base"].read(b.block.name, Infinity);
  };


  function comp_updateTile(b) {
    if(b.durabMode === "dec") {

      b.durab -= (!isFinite(b.durabTime) || b.durabTime < 0.0001) ? 0.0 : (1.0 / b.durabTime * b.edelta());
      if(b.durab < 0.0) {
        b.durab = 0.0;
        b.durabMode = "inc";
        FRAG_attack.damage(b, b.maxHealth * 0.75, true, true);
      };

    } else {

      if(b.health / b.maxHealth > 0.9999) {
        b.durab = Mathf.lerp(0.5, 1.0, Math.random());
        b.durabMode = "dec";
      };

    };
  };


  function comp_drawSelect(b) {
    if(b.durabMode !== "dec") MDL_draw.drawText_select(b, MDL_bundle._info("lovec", "text-require-repair"), false, b.useCep ? 1.0 : 0.0);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-durability", b => new Bar(
      MDL_bundle._term("lovec", "durability"),
      Pal.sap,
      () => b.ex_getDurabFrac(),
    ));
  };


  function comp_ex_updateParams(b, rcMdl, rcHeader, forceLoad) {
    if(rcHeader != b.rcHeader || forceLoad) {
      b.durabDecMtp = MDL_recipe._durabDecMtp(rcMdl, rcHeader);
    };
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
      comp_created(b);
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
      comp_drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    setBars: function(blk) {
      PARENT.setBars(blk);
      comp_setBars(blk);
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
      wr.f(b.durab);
      wr.str(b.durabMode);
    },


    read: function(b, rd, revi) {
      PARENT.read(b, rd, revi);
      b.durab = rd.f();
      b.durabMode = rd.str();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-fac"];
    },


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
      comp_ex_updateParams(b, rcMdl, rcHeader, forceLoad);
    },


    // @NOSUPER
    ex_initParams: function(b) {
      PARENT.ex_initParams(b);
    },


    // @NOSUPER
    ex_getEffc: function(b) {
      return b.durabMode !== "dec" ? 0.0 : PARENT.ex_getEffc(b);
    },


    // @NOSUPER
    ex_getTimerEffc: function(b) {
      return PARENT.ex_getTimerEffc(b);
    },


    // @NOSUPER
    ex_getFailP: function(b) {
      return PARENT.ex_getFailP(b);
    },


    // @NOSUPER
    ex_getDurabFrac: function(b) {
      return Mathf.clamp(b.durab);
    },


  };
