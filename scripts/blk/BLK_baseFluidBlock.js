/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Blocks that handle fluids. Does not include factories.
   * Most fluid blocks are related to corrosion, clogging, fluid heat and pressure mechanics.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.fluidType: str    // @PARAM: Type of fluid the block handles. Possible values: "liquid", "gas" and "both".
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
   * !NOTHING
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseBlock");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_flow = require("lovec/mdl/MDL_flow");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    let matGrpB = MDL_flow._matGrpB(blk);
    blk.stats.add(TP_stat.blk0liq_matGrp, matGrpB);

    if(MDL_cond._isCloggable(blk)) blk.stats.add(TP_stat.blk0liq_cloggable, true);

    let presRes = MDL_flow._presRes(blk);
    blk.stats.add(TP_stat.blk0liq_presRes, presRes);
    let vacRes = MDL_flow._vacRes(blk);
    blk.stats.add(TP_stat.blk0liq_vacRes, -vacRes);

    let heatRes = MDL_flow._heatRes(blk);
    blk.stats.add(TP_stat.blk0heat_heatRes, heatRes, TP_stat.rs_heatUnits);
  };


  function comp_created(b) {
    b.presRes = MDL_flow._presRes(b.block);
    b.vacRes = MDL_flow._vacRes(b.block);
    b.corRes = MDL_flow._corRes(b.block);
    b.cloggable = MDL_cond._isCloggable(b.block);
    b.fHeatCur = PARAM.glbHeat;
    b.fHeatTg = MDL_flow._fHeat_b(b, true);
    b.heatRes = MDL_flow._heatRes(b.block);
    b.heatReg = !Core.atlas.has(b.block.name + "-heat") ? null : Core.atlas.find(b.block.name + "heat");
  };


  function comp_updateTile(b) {
    if(PARAM.updateSuppressed) return;

    if(TIMER.timerState_liq) {
      let liqCur = b.liquids.current();
      if(b.liquids.get(liqCur) < 0.0005) b.liquids.reset(liqCur, 0.0);
    };

    if(TIMER.timerState_heat) {
      b.presTmp = (b.pres + b.presTmp) * 0.5;
    };

    FRAG_fluid.comp_updateTile_pres(b);

    FRAG_fluid.comp_updateTile_corrosion(b);
    FRAG_fluid.comp_updateTile_cloggable(b);
    FRAG_fluid.comp_updateTile_fHeat(b);

    if(TIMER.timerState_liq) b.fHeatCur = Mathf.lerpDelta(b.fHeatCur, b.fHeatTg, 0.004);
    if(TIMER.timerState_heat && Mathf.chance(0.33)) b.fHeatTg = MDL_flow._fHeat_b(b, true);
  };


  function comp_draw(b) {
    FRAG_fluid.comp_draw_fHeat(b, b.heatReg);
  };


  function comp_setBars(blk) {
    FRAG_fluid.comp_setBars_pres(blk);
    FRAG_fluid.comp_setBars_fHeat(blk);
  };


  function comp_remove(b) {
    if(b.liquids.currentAmount() < 0.01) {
      b.presBase = 0.0;
      b.presTmp = 0.0;
      b.fHeatCur = PARAM.glbHeat;
    };

    b.super$remove();
  };


  function comp_acceptLiquid(b, b_f, liq) {
    // Rarely used but required
    if(MDL_cond._isAux(liq)) return MDL_cond._isAuxBlk(b.block);
    // No fluid type restriction for pump, for consumption
    if(MDL_cond._isPump(b_f.block)) return true;

    if(((liq.gas || liq.willBoil()) && b.block.ex_getFluidType() === "liquid") || (!liq.gas && b.block.ex_getFluidType() === "gas")) return false;

    return true;
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


    updateTile: function(b) {
      PARENT.updateTile(b);
      comp_updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
      comp_draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    setBars: function(blk) {
      comp_setBars(blk);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    remove: function(b) {
      comp_remove(b);
    },


    acceptLiquid: function(b, b_f, liq) {
      return comp_acceptLiquid(b, b_f, liq);
    },


    write: function(b, wr) {
      wr.f(b.presTmp);
      wr.f(b.fHeatCur);
    },


    read: function(b, rd, revi) {
      var pres = rd.f();
      b.pres = pres;
      b.presTmp = pres;
      b.fHeatCur = rd.f();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


    // @NOSUPER
    ex_getFluidType: function(blk) {
      return blk.fluidType;
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accPresBase: function(b, param) {
      return param === "read" ? b.presBase : (b.presBase = param);
    },


    // @NOSUPER
    ex_getPresTmp: function(b) {
      return b.presTmp;
    },


    // @NOSUPER
    ex_updatePres: function(b) {

    },


    // @NOSUPER
    ex_getFHeatCur: function(b) {
      return b.fHeatCur;
    },


  };
