/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Esscentially a manual pump, but controlled by a timer that is reset when pump is clicked.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Pump
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.fluidType: "liquid"
   * blk.presProd: f    // @PARAM
   * b.liqEnd: null
   * b.pres: 0.0
   * b.presBase: 0.0
   * b.presTmp: 0.0
   * b.presRes: 0.0
   * b.vacRes: 0.0
   * b.corRes: 1.0
   * b.cloggable: false
   * b.fHeatCur: 0.0
   * b.fHeatTg: 0.0
   * b.heatRes: Infinity
   * b.heatReg: null
   * b.useCep: bool    // @PARAM
   * b.splitAmt: 1
   * b.dur: 0.0
   * b.maxDur: 3600.0
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM
   * DB_block.db["param"]["amount"]["base"]    // @PARAM
   * DB_block.db["param"]["timer"]["base"]    // @PARAM: Maximum duration in frames.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_liquidPump");
  const JAVA = require("lovec/glb/GLB_java");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;

    blk.config(JAVA.STRING, (b, str) => {

      if(str === "start") {
        b.ex_accDur(Math.min(b.ex_accDur("read") + 300.0, b.ex_getMaxDur()));
        MDL_effect.showAt_click(b.x, b.y, b.team);
        Sounds.click.at(b);
      };

    });
  };


  function comp_setStats(blk) {
    let maxDur = DB_block.db["param"]["time"]["base"].read(blk.name, 3600.0);
    blk.stats.add(TP_stat.blk0misc_maxDur, maxDur / 3600.0, StatUnit.minutes);
  };


  function comp_created(b) {
    b.maxDur = DB_block.db["param"]["time"]["base"].read(b.block.name, 3600.0);
  };


  function comp_updateTile(b) {
    if(b.efficiency > 0.0) b.dur = Mathf.maxZero(b.dur - b.edelta());
  };


  function comp_drawSelect(b) {
    MDL_draw.drawText_select(
      b,
      MDL_bundle._info("lovec", "text-remaining-time") + " " + Strings.fixed(b.dur / 60.0, 0) + " " + StatUnit.seconds.localized(),
      b.dur > 0.0,
    );
  };


  function comp_shouldConsume(b) {
    return b.dur > 0.0;
  };


  function comp_configTapped(b) {
    Vars.state.paused ?
      MDL_ui.show_fadeInfo("lovec", "paused-manual-click") :
      b.configure("start");

    return false;
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
      comp_created(b);
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
      comp_drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    setBars: function(blk) {
      PARENT.setBars(blk);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    remove: function(b) {
      PARENT.remove(b);
    },


    acceptLiquid: function(b, b_f, liq) {
      return PARENT.acceptLiquid(b, b_f, liq);
    },


    // @NOSUPER
    shouldConsume: function(b) {
      return PARENT.shouldConsume(b) && comp_shouldConsume(b);
    },


    updateEfficiencyMultiplier: function(b) {
      PARENT.updateEfficiencyMultiplier(b);
    },


    // @NOSUPER
    configTapped: function(b) {
      return comp_configTapped(b);
    },


    // @NOSUPER
    drawStatus: function(b) {
      PARENT.drawStatus(b);
    },


    write: function(b, wr) {
      PARENT.write(b, wr);
      wr.f(b.dur);
    },


    read: function(b, rd, revi) {
      PARENT.read(b, rd, revi);
      b.dur = rd.f();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-pump"],
    }),


    // @NOSUPER
    ex_getFluidType: function(blk) {
      return PARENT.ex_getFluidType(blk);
    },


    // @NOSUPER
    ex_getPresProd: function(blk) {
      return PARENT.ex_getPresProd(blk);
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accPresBase: function(b, param) {
      return PARENT.ex_accPresBase(b, param);
    },


    // @NOSUPER
    ex_getPresTmp: function(b) {
      return PARENT.ex_getPresTmp(b);
    },


    // @NOSUPER
    ex_updatePres: function(b) {

    },


    // @NOSUPER
    ex_getFHeatCur: function(b) {
      return PARENT.ex_getFHeatCur(b);
    },


    // @NOSUPER
    ex_accDur: function(b, param) {
      return param === "read" ? b.dur : (b.dur = param);
    },


    // @NOSUPER
    ex_getMaxDur: function(b) {
      return b.maxDur;
    },


  };
