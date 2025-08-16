/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Equivalent of vanilla conduit.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Conduit, ArmoredConduit
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.fluidType: str    // @PARAM
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
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["pipeDiam"]    // @PARAM: Pipe diameter for this pipe, may affect flow rate.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseFluidBlock");
  const TIMER = require("lovec/glb/GLB_timer");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_flow = require("lovec/mdl/MDL_flow");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    let pipeDiam = MDL_flow._pipeDiam(blk);
    blk.stats.add(TP_stat.blk0liq_pipeDiam, pipeDiam);
  };


  function comp_updateTile(b) {
    if(TIMER.timerState_heat) b.ex_updatePres();
  };


  function comp_moveLiquid(b, b_t, liq) {
    return FRAG_fluid.moveLiquid(b, b_t, liq);
  };


  function comp_ex_updatePres(b) {
    var val = 0.0;
    let liqCur = b.liquids.current();
    let b_t = b.nearby(b.rotation);
    b.proximity.each(ob => {
      if(ob === b_t || ob.ex_getPresTmp == null) return;
      if(ob.nearby(ob.rotation) !== b) return;

      val += ob.ex_getPresTmp();
    });

    b.pres = b.presBase + val;
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
    moveLiquid: function(b, b_t, liq) {
      return comp_moveLiquid(b, b_t, liq);
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
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-fcond"],
    }),


    // @NOSUPER
    ex_getFluidType: function(blk) {
      return PARENT.ex_getFluidType(blk);
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
    ex_getFHeatCur: function(b) {
      return PARENT.ex_getFHeatCur(b);
    },


    // @NOSUPER
    ex_updatePres: function(b) {
      comp_ex_updatePres(b);
    },


  };
