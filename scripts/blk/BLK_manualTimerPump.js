/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Esscentially a manual pump, but controlled by a timer that is set when pump is clicked.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Pump
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
        b.ex_accDur(Math.min(b.ex_accDur("read") + blk.clickTimeInc, b.ex_getMaxDur()));
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


    // @NOSUPER
    icons: function(blk) {
      return PARENT.icons(blk);
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
      processRevision(wr);
      wr.f(b.dur);
    },


    read: function(b, rd, revi) {
      PARENT.read(b, rd, revi);
      processRevision(rd);
      b.dur = rd.f();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-pump"],
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


  TEMPLATE._std = function(presProd, clickTimeInc) {
    return {
      fluidType: "liquid",
      presProd: tryVal(presProd, 0.0),
      clickTimeInc: tryVal(clickTimeInc, 300.0),
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      icons() {
        return TEMPLATE.icons(this);
      },
      drawPlace(tx, ty, rot, valid) {
        this.super$drawPlace(tx, ty, rot, valid);
        TEMPLATE.drawPlace(this, tx, ty, rot, valid);
      },
      setBars() {
        this.super$setBars();
        TEMPLATE.setBars(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getFluidType() {
        return TEMPLATE.ex_getFluidType(this);
      },
      ex_getPresProd() {
        return TEMPLATE.ex_getPresProd(this);
      },
    };
  };


  TEMPLATE._std_b = function(useCep, splitAmt) {
    return {
      liqEnd: null, pres: 0.0, presBase: 0.0, presTmp: 0.0,
      presRes: 0.0, vacRes: 0.0, corRes: 1.0, cloggable: false, fHeatCur: 0.0, fHeatTg: 0.0, heatRes: Infinity,
      heatReg: null,
      useCep: tryVal(useCep, false), splitAmt: 1,
      dur: 0.0, maxDur: 3600.0,
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
      remove() {
        TEMPLATE.remove(this);
      },
      acceptLiquid(b_f, liq) {
        if(!this.super$acceptLiquid(b_f, liq)) return false;
        if(!TEMPLATE.acceptLiquid(this, b_f, liq)) return false;
        return true;
      },
      shouldConsume() {
        return TEMPLATE.shouldConsume(this);
      },
      updateEfficiencyMultiplier() {
        this.super$updateEfficiencyMultiplier();
        TEMPLATE.updateEfficiencyMultiplier(this);
      },
      configTapped() {
        return TEMPLATE.configTapped(this);
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
      ex_accPresBase(param) {
        return TEMPLATE.ex_accPresBase(this, param);
      },
      ex_getPresTmp() {
        return TEMPLATE.ex_getPresTmp(this);
      },
      ex_updatePres() {
        TEMPLATE.ex_updatePres(this);
      },
      ex_getFHeatCur() {
        return TEMPLATE.ex_getFHeatCur(this);
      },
      ex_accDur(param) {
        return TEMPLATE.ex_accDur(this, param);
      },
      ex_getMaxDur() {
        return TEMPLATE.ex_getMaxDur(this);
      },
    };
  };


  module.exports = TEMPLATE;
