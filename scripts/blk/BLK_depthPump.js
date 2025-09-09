/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A pump used specifically for depth liquid deposits.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * AttributeCrafter
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.fluidType: str    // @PARAM
   * blk.presProd: f    // @PARAM: Pressure produced by this pump (negative for vacuum).
   * blk.attrRsMap: null
   * blk.attrMode: "ov"
   * blk.pumpRate: f    // @PARAM: Rate at which the target liquid is produced.
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
   * b.useCep: bool    // @PARAM: Whether this pump is affected by core energy.
   * b.splitAmt: 1
   * b.craftSound: se_gn    // @PARAM
   * b.shouldScaleCons: false
   * b.attrSum: 0.0
   * b.attrRs: null
   * b.prog: 0.0
   * b.scannerTg: null
   * b.liqReg: null
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM: CEPs used by this block.
   * DB_block.db["param"]["amount"]["base"]    // @PARAM: How many portions the total pressure output will be split into.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseFluidBlock");
  const PARENT_A = require("lovec/blk/BLK_dynamicAttributeFactory");
  const PARENT_B = require("lovec/blk/BLK_liquidPump");
  const TIMER = require("lovec/glb/GLB_timer");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_item = require("lovec/db/DB_item");


  const MOD_tmi = require("lovec/mod/MOD_tmi");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.hasConsumers = true;

    if(!blk.presProd.fEqual(0.0)) MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        MDL_recipeDict.addFldProdTerm(blk, blk.presProd > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, Math.abs(blk.presProd), null);
      });
    });

    blk.attrRsMap = DB_item.db["map"]["attr"]["dpliq"];
    blk.attrMode = "ov";

    MOD_tmi._r_presPump(blk, Math.abs(blk.presProd), blk.presProd < 0.0);
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.output, blk.pumpRate * 60.0, StatUnit.liquidSecond);
  };


  function comp_created(b) {
    b.liqReg = MDL_texture._reg(b.block, "-liquid");
  };


  function comp_updateTile(b) {
    if(TIMER.timerState_effc) {
      b.scannerTg = MDL_pos._b_scan(b.x, b.y, b.team);
    };
  };


  function comp_draw(b) {
    MDL_draw.drawRegion_normal(b.x, b.y, b.liqReg, 0.0, 1.0, b.attrRs, b.liquids.get(b.attrRs) / b.block.liquidCapacity);
  };


  function comp_drawSelect(b) {
    b.scannerTg == null ?
      MDL_draw.drawText_select(b, MDL_bundle._info("lovec", "text-no-scanner"), false, b.useCep ? 1 : 0) :
      MDL_draw.drawConnector_area(b, b.scannerTg);
  };


  function comp_setBars(blk) {
    blk.removeBar("liquid");
    blk.addBar("liquid", b => new Bar(
      b.ex_getAttrRs() != null ? b.ex_getAttrRs().localizedName : Core.bundle.get("bar.liquid"),
      b.ex_getAttrRs() != null ? Object.val(b.ex_getAttrRs().barColor, b.ex_getAttrRs().color) : Color.clear,
      () => b.ex_getAttrRs() == null ? 0.0 : Mathf.clamp(b.liquids.get(b.ex_getAttrRs())),
    ));
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.scannerTg == null ? 0.0 : b.scannerTg.ex_getScanFrac();
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
      PARENT_A.init(blk);
    },


    setStats: function(blk) {
      PARENT_A.setStats(blk);
      PARENT_B.setStats(blk);
      comp_setStats(blk);
    },


    // @NOSUPER
    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT_B.drawPlace(blk, tx, ty, rot, valid);
      PARENT_A.drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT_B.created(b);
      comp_created(b);
    },


    onDestroyed: function(b) {
      PARENT_B.onDestroyed(b);
    },


    updateTile: function(b) {
      PARENT_A.updateTile(b);
      PARENT_B.updateTile(b);
      comp_updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT_A.onProximityUpdate(b);
      PARENT_B.onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT_B.draw(b);
      comp_draw(b);
    },


    drawSelect: function(b) {
      PARENT_B.drawSelect(b);
      comp_drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    setBars: function(blk) {
      PARENT_A.setBars(blk);
      PARENT_B.setBars(blk);
      comp_setBars(blk);
    },


    // @NOSUPER
    canPlaceOn: function(blk, t, team, rot) {
      return PARENT_A.canPlaceOn(blk, t, team, rot);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    remove: function(b) {
      PARENT_B.remove(b);
    },


    acceptLiquid: function(b, b_f, liq) {
      return PARENT_B.acceptLiquid(b, b_f, liq);
    },


    // @NOSUPER
    shouldConsume: function(b) {
      return PARENT_A.shouldConsume(b) || PARENT_B.shouldConsume(b);
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
      PARENT_B.updateEfficiencyMultiplier(b);
      comp_updateEfficiencyMultiplier(b);
    },


    // @NOSUPER
    drawStatus: function(b) {
      PARENT_B.drawStatus(b);
    },


    write: function(b, wr) {
      PARENT_A.write(b, wr);
      PARENT_B.write(b, wr);
    },


    read: function(b, rd, revi) {
      PARENT_A.read(b, rd, revi);
      PARENT_B.read(b, rd, revi);
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
      return PARENT_B.ex_getFluidType(blk);
    },


    // @NOSUPER
    ex_getPresProd: function(blk) {
      return PARENT_B.ex_getPresProd(blk);
    },


    // @NOSUPER
    ex_getTs: function(blk, tx, ty, rot) {
      return MDL_pos._tsBlock(blk, tx, ty);
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
      return blk.pumpRate;
    },


    // @NOSUPER
    ex_getAttrSum: function(blk, tx, ty, rot) {
      return PARENT_A.ex_getAttrSum(blk, tx, ty, rot);
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accPresBase: function(b, param) {
      return PARENT_B.ex_accPresBase(b, param);
    },


    // @NOSUPER
    ex_getPresTmp: function(b) {
      return PARENT_B.ex_getPresTmp(b);
    },


    // @NOSUPER
    ex_updatePres: function(b) {

    },


    // @NOSUPER
    ex_getFHeatCur: function(b) {
      return PARENT_B.ex_getFHeatCur(b);
    },


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
