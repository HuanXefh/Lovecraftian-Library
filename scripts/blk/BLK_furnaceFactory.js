/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A type of multi-crafter with temperature mechanics.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.rcMdl: rcMdl    // @PARAM
   * blk.fuelType: str    // @PARAM: Types of fuel accepted. Possible values: "item", "liquid", "gas" and "any".
   * blk.blockedFuels: nmRss    // @PARAM: Fuels that cannot be used by this furnace.
   * b.craftSound: se_gn    // @PARAM
   * b.useCep: bool    // @PARAM
   * b.noDump: bool    // @PARAM
   * b.isTall: false
   * b.heatIncRate: num    // @PARAM: Rate at which the furnace temperature changes.
   * b.rcHeader: ""
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
   * b.dumpTup: null
   * b.heatReg: null
   * b.tempReq: 0.0
   * b.tempAllowed: Infinity
   * b.tempCur: -1.0
   * b.fuelPonCur: 0.0
   * b.fuelConsMtp: 1.0
   * b.fuelLvlMtp: 1.0
   * b.fuelTup: null
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["multiplier"]["fuelCons"]    // @PARAM: Multiplier on fuel consumption speed.
   * DB_block.db["param"]["multiplier"]["fuelLvl"]    // @PARAM: Multiplier on fuel level used.
   * DB_block.db["param"]["cep"]["use"]    // @PARAM
   * DB_block.db["group"]["tall"]    // @PARAM
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_recipeFactory");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MATH_base = require("lovec/math/MATH_base");


  const FRAG_item = require("lovec/frag/FRAG_item");
  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");
  const FRAG_recipe = require("lovec/frag/FRAG_recipe");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_table = require("lovec/mdl/MDL_table");


  const DB_block = require("lovec/db/DB_block");


  const TP_stat = require("lovec/tp/TP_stat");
  const TP_table = require("lovec/tp/TP_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        let arr;
        switch(blk.fuelType) {
          case "item" :
            arr = VARGEN.fuelItms.slice();
            break;
          case "liquid" :
            arr = VARGEN.fuelLiqs.slice();
            break;
          case "gas" :
            arr = VARGEN.fuelGas.slice();
            break;
          case "any" :
            arr = VARGEN.fuelItms.concat(VARGEN.fuelLiqs).concat(VARGEN.fuelGas);
            break;
          default :
            arr = [];
        };
        arr.pullAll(blk.blockedFuels.map(nmRs => MDL_content._ct(nmRs, "rs")));
        let fuelConsMtp = DB_block.db["param"]["multiplier"]["fuelCons"].read(blk, 1.0);
        arr.forEach(rs => {
          rs instanceof Item ?
            FRAG_recipe.addItmConsTerm(blk, rs, 1, 1.0, {"icon": "lovec-icon-fuel", "time": FRAG_faci._fuelPon(rs) * 60.0 / fuelConsMtp}) :
            FRAG_recipe.addFldConsTerm(blk, rs, FRAG_faci._fuelPon(rs) * fuelConsMtp, {"icon": "lovec-icon-fuel"});
        });
      });
    });
  };


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk0fac_fuel, extend(StatValue, {display(tb) {
      tb.row();
      MDL_table.__btnSmallBase(tb, "?", () => {
        Core.scene.add(TP_table._winDial(MDL_bundle._term("lovec", "fuel") + " (" + blk.localizedName + ")", tb1 => MDL_table.setDisplay_ctLi(tb1, (function() {

          const arr = [];
          switch(blk.fuelType) {

            case "item" :
              arr.pushAll(VARGEN.fuelItms);
              break;

            case "liquid" :
              arr.pushAll(VARGEN.fuelLiqs);
              break;

            case "gas" :
              arr.pushAll(VARGEN.fuelGas);
              break;

            default :
              arr.pushAll(VARGEN.fuelItms);
              arr.pushAll(VARGEN.fuelLiqs);
              arr.pushAll(VARGEN.fuelGas);

          };

          return arr.filter(rs => !blk.blockedFuels.includes(rs.name));

        })(), null, 7)));
      }).left().padLeft(28.0).row();
    }}));

    var fuelConsMtp = DB_block.db["param"]["multiplier"]["fuelCons"].read(blk, 1.0);
    if(!MATH_base.fEqual(fuelConsMtp, 1.0)) blk.stats.add(TP_stat.blk0fac_fuelConsMtp, Number(fuelConsMtp).perc());
    var fuelLvlMtp = DB_block.db["param"]["multiplier"]["fuelLvl"].read(blk, 1.0);
    if(!MATH_base.fEqual(fuelLvlMtp, 1.0)) blk.stats.add(TP_stat.blk0fac_fuelLvlMtp, Number(fuelLvlMtp).perc());
  };


  function comp_created(b) {
    b.heatReg = MDL_content._reg(b.block, "-heat");
    if(b.tempCur < 0.0) b.tempCur = PARAM.glbHeat;
    b.fuelConsMtp = DB_block.db["param"]["multiplier"]["fuelCons"].read(b.block.name, 1.0);
    b.fuelLvlMtp = DB_block.db["param"]["multiplier"]["fuelLvl"].read(b.block.name, 1.0);
  };


  function comp_updateTile(b) {
    if(PARAM.updateSuppressed) return;

    let rsTg = null;
    let fuelPon = -1.0;
    let fuelLvl = -1.0;
    if(b.fuelTup != null) {
      rsTg = b.fuelTup[0];
      fuelPon = b.fuelTup[1];
      fuelLvl = b.fuelTup[2];
    };

    b.tempCur = Mathf.lerpDelta(b.tempCur, Mathf.lerp(PARAM.glbHeat, fuelLvl * 100.0 * b.fuelLvlMtp, FRAG_faci._tempTgFrac(b, rsTg)), b.heatIncRate);

    if(rsTg != null) {
      if(rsTg instanceof Item) {

        if(b.fuelPonCur < 1.0 && fuelPon > 0.0 && FRAG_item.consumeItem(b, rsTg, 1)) {
          b.fuelPonCur += fuelPon;
        };

      } else {

        let amtCons = fuelPon * b.fuelConsMtp * b.edelta;
        if(FRAG_fluid.addLiquid(b, null, rsTg, -amtCons) > amtCons) {
          b.fuelPonCur = 1.0;
        };

      };
    };
    b.fuelPonCur = Math.max(b.fuelPonCur - b.edelta() / 60.0 * b.fuelConsMtp, 0.0);
  };


  function comp_draw(b) {
    MDL_draw.drawRegion_heat(b.x, b.y, Math.pow(b.ex_getHeatFrac(), 3), b.heatReg, b.block.size);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-furnace-temp", b => new Bar(
      prov(() => Core.bundle.format("bar.heatpercent", Strings.fixed(b.ex_getHeat(), 2) + " " + TP_stat.rs_heatUnits.localized(), Number(b.efficiency).deciDigit(2) * 100.0)),
      prov(() => Pal.lightOrange),
      () => b.ex_getHeatFrac(),
    ));
  };


  function comp_acceptItem(b, b_f, itm) {
    if(b.items == null) return false;
    if(b.items.get(itm) >= b.getMaximumAccepted(itm)) return false;
    if(b.isTall && !MDL_cond._isTallSource(b_f.block)) return false;
    if(!VARGEN.fuelItms.includes(itm) || b.block.ex_getBlockedFuels().includes(itm.name)) return false;

    return true;
  };


  function comp_acceptLiquid(b, b_f, liq) {
    return (VARGEN.fuelLiqs.includes(liq) || VARGEN.fuelGas.includes(liq)) && !b.block.ex_getBlockedFuels().includes(liq.name);
  };


  function comp_ex_updateParams(b, rcMdl, rcHeader, forceLoad) {
    if(rcHeader != b.rcHeader || forceLoad) {
      b.tempReq = MDL_recipe._tempReq(rcMdl, rcHeader);
      b.tempAllowed = MDL_recipe._tempAllowed(rcMdl, rcHeader);
    };

    if(b.ex_getTimerEffc()) {
      b.fuelTup = FRAG_faci._fuelTup(b);
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
      comp_draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
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
      return comp_acceptItem(b, b_f, itm) || PARENT.acceptItem(b, b_f, itm);
    },


    // @NOSUPER
    acceptLiquid: function(b, b_f, liq) {
      return comp_acceptLiquid(b, b_f, liq) || PARENT.acceptLiquid(b, b_f, liq);
    },


    // @NOSUPER
    shouldConsume: function(b) {
      return PARENT.shouldConsume(b);
    },


    // @NOSUPER
    warmupTarget: function(b) {
      return b.ex_getHeatFrac();
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
      wr.f(b.tempCur);
    },


    read: function(b, rd, revi) {
      PARENT.read(b, rd, revi);
      b.tempCur = rd.f();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-fac", "blk-furn"];
    },


    // @NOSUPER
    ex_getRcMdl: function(blk) {
      return PARENT.ex_getRcMdl(blk);
    },


    // @NOSUPER
    ex_getFuelType: function(blk) {
      return blk.fuelType;
    },


    // @NOSUPER
    ex_getBlockedFuels: function(blk) {
      return blk.blockedFuels;
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
      let frac = Mathf.clamp(Math.min(
        Math.pow(b.tempCur / b.tempReq, 1.5),
        !isFinite(b.tempAllowed) ? Infinity : (b.tempAllowed - 2.0 * b.tempCur) / b.tempAllowed + 2.0,
      ));
      if(frac < 0.1) frac = 0.0;

      return PARENT.ex_getEffc(b) * frac;
    },


    // @NOSUPER
    ex_getTimerEffc: function(b) {
      return PARENT.ex_getTimerEffc(b);
    },


    // @NOSUPER
    ex_getFailP: function(b) {
      return !isFinite(b.tempAllowed) ? b.failP : Mathf.clamp((b.tempCur - 0.6 * b.tempAllowed) * 0.0015 + b.failP, b.failP, 1.0);
    },


    // @NOSUPER
    ex_getHeat: function(b) {
      return b.tempCur;
    },


    // @NOSUPER
    ex_getHeatFrac: function(b) {
      return Mathf.clamp(b.tempCur / Math.max(b.tempReq, 0.01), 0.0, 1.0);
    },


  };
