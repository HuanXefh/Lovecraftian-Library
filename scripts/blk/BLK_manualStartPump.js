/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Pump with an independent warmup rate.
   * If stopped, you have to click it fast to start it.
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
   * b.pumpWarmup: 0.0
   * b.pumpWarmupRate: f    // @PARAM: How fast the pump warms up to full efficiency.
   * b.pumpCooldownRate: f    // @PARAM: How fast the pump cools down to stop.
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM
   * DB_block.db["param"]["amount"]["base"]    // @PARAM
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_liquidPump");
  const JAVA = require("lovec/glb/GLB_java");


  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;

    blk.config(JAVA.STRING, (b, str) => {

      if(str === "start") {
        b.ex_accPumpWarmup(Mathf.lerp(b.ex_accPumpWarmup("read"), 1.2, b.ex_getPumpCooldownRate() * 1.65));
        MDL_effect.showAt_click(b.x, b.y, b.team);
        Sounds.click.at(b);
      };

    });
  };


  function comp_updateTile(b) {
    if(b.efficiency < 0.0001 || !b.shouldConsume()) {
      b.pumpWarmup = Mathf.lerpDelta(b.pumpWarmup, 0.0, b.pumpCooldownRate);
    } else {
      b.pumpWarmup = Mathf.lerpDelta(b.pumpWarmup, 1.4, b.pumpWarmupRate);
    };
    if(b.pumpWarmup < 0.0001) b.pumpWarmup = 0.0;
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-warmup", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-warmup-amt", b.ex_getPumpWarmupFrac().perc())),
      prov(() => Pal.accent),
      () => b.ex_getPumpWarmupFrac(),
    ));
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.ex_getPumpWarmupFrac();
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


    setBars: function(blk) {
      PARENT.setBars(blk);
      comp_setBars(blk);
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
      return PARENT.shouldConsume(b);
    },


    updateEfficiencyMultiplier: function(b) {
      PARENT.updateEfficiencyMultiplier(b);
      comp_updateEfficiencyMultiplier(b);
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
      wr.f(b.pumpWarmup);
    },


    read: function(b, rd, revi) {
      PARENT.read(b, rd, revi);
      b.pumpWarmup = rd.f();
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
    ex_accPumpWarmup: function(b, param) {
      return param === "read" ? b.pumpWarmup : (b.pumpWarmup = param);
    },


    // @NOSUPER
    ex_getPumpWarmupFrac: function(b) {
      return Mathf.clamp(b.pumpWarmup - 0.2);
    },


    // @NOSUPER
    ex_getPumpCooldownRate: function(b) {
      return b.pumpCooldownRate;
    },


  };
