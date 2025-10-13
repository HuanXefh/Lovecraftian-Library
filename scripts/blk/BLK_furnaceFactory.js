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
   * GenericCrafter
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["multiplier"]["fuelCons"]    // @PARAM: Multiplier on fuel consumption speed.
   * DB_block.db["param"]["multiplier"]["fuelLvl"]    // @PARAM: Multiplier on fuel level used.
   * DB_block.db["param"]["heatRes"]    // @PARAM: Temperature above which the furnace get damaged.
   * DB_block.db["param"]["cep"]["use"]    // @PARAM
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
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const CLS_window = require("lovec/cls/ui/CLS_window");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_item = require("lovec/frag/FRAG_item");
  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  const DB_block = require("lovec/db/DB_block");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.clipSize += 140.0;
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
            arr = VARGEN.fuelGases.slice();
            break;
          case "any" :
            arr = VARGEN.fuelItms.concat(VARGEN.fuelLiqs).concat(VARGEN.fuelGases);
            break;
          default :
            arr = [];
        };
        arr.pullAll(blk.blockedFuels.map(nmRs => MDL_content._ct(nmRs, "rs")));
        let fuelConsMtp = DB_block.db["param"]["multiplier"]["fuelCons"].read(blk, 1.0);
        arr.forEach(rs => {
          rs instanceof Item ?
            MDL_recipeDict.addItmConsTerm(blk, rs, 1, 1.0, {"icon": "lovec-icon-fuel", "time": FRAG_faci._fuelPon(rs) * 60.0 / fuelConsMtp}) :
            MDL_recipeDict.addFldConsTerm(blk, rs, FRAG_faci._fuelPon(rs) * fuelConsMtp, {"icon": "lovec-icon-fuel"});
        });
      });
    });
  };


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk0fac_fuel, extend(StatValue, {display(tb) {
      tb.row();
      MDL_table.__btnSmallBase(tb, "?", () => {
        new CLS_window(
          MDL_bundle._term("lovec", "fuel") + " (" + blk.localizedName + ")",
          tb1 => MDL_table.setDisplay_ctLi(tb1, FRAG_faci._fuelArr(blk), null, 7),
        ).add();
      }).left().padLeft(28.0).row();
    }}));

    let fuelConsMtp = DB_block.db["param"]["multiplier"]["fuelCons"].read(blk.name, 1.0);
    if(!fuelConsMtp.fEqual(1.0)) blk.stats.add(TP_stat.blk0fac_fuelConsMtp, fuelConsMtp.perc());
    let fuelLvlMtp = DB_block.db["param"]["multiplier"]["fuelLvl"].read(blk.name, 1.0);
    if(!fuelLvlMtp.fEqual(1.0)) blk.stats.add(TP_stat.blk0fac_fuelLvlMtp, fuelLvlMtp.perc());

    let heatRes = MDL_flow._heatRes(blk);
    blk.stats.add(TP_stat.blk0heat_heatRes, heatRes, TP_stat.rs_heatUnits);
  };


  function comp_created(b) {
    b.heatReg = MDL_texture._reg(b.block, "-heat");
    b.heatRes = MDL_flow._heatRes(b.block);
    if(b.tempCur < 0.0) b.tempCur = PARAM.glbHeat;
    b.fuelConsMtp = DB_block.db["param"]["multiplier"]["fuelCons"].read(b.block.name, 1.0);
    b.fuelLvlMtp = DB_block.db["param"]["multiplier"]["fuelLvl"].read(b.block.name, 1.0);
  };


  function comp_updateTile(b) {
    if(PARAM.updateSuppressed || b.fuelTup == null) return;

    if(TIMER.timerState_sec) {
      b.tempCur = Mathf.lerpDelta(b.tempCur, Mathf.lerp(PARAM.glbHeat, b.fuelTup[2] * 100.0 * b.fuelLvlMtp, FRAG_faci._tempTgFrac(b, b.fuelTup[0])), b.heatIncRate * 60.0);
      if(b.tempCur > b.heatRes) FRAG_attack.damage(b, (VAR.blk_corDmgMin + VAR.blk_corDmgFrac * b.maxHealth) * (b.tempCur - b.heatRes) / 25.0, true, "heat");
    };

    if(b.fuelTup[0] != null && TIMER.timerState_heat) {
      if(b.fuelTup[0] instanceof Item) {
        if(b.fuelPonCur < 1.0 && b.fuelTup[1] > 0.0 && FRAG_item.consumeItem(b, b.fuelTup[0], 1)) {
          b.fuelPonCur += b.fuelTup[1];
        };
      } else {
        let amtCons = b.fuelTup[1] * b.fuelConsMtp * b.delta() * VAR.time_heatIntv;
        if(FRAG_fluid.addLiquid(b, null, b.fuelTup[0], -amtCons) > amtCons) {
          b.fuelPonCur = 1.0;
        };
      };
    };
    b.fuelPonCur = Mathf.maxZero(b.fuelPonCur - b.delta() / 60.0 * b.fuelConsMtp);
  };


  function comp_draw(b) {
    MDL_draw.drawRegion_heat(b.x, b.y, Math.pow(b.ex_getHeatFrac(), 3) * 0.8, b.heatReg, b.drawrot(), b.block.size);
    MDL_draw.drawRegion_heat(b.x, b.y, Math.pow(b.ex_getHeatFrac(), 3) * 0.5, VARGEN.blockHeatRegs[b.block.size + 2], b.drawrot(), b.block.size);
    MDL_draw.drawRegion_light(b.x, b.y, Mathf.clamp((b.tempCur - 60.0) / 940.0), 56.0, b.block.size);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-furnace-temp", b => new Bar(
      prov(() => Core.bundle.format("bar.heatpercent", Strings.fixed(b.ex_getHeat(), 2) + " " + TP_stat.rs_heatUnits.localized(), b.efficiency.roundFixed(2) * 100.0)),
      prov(() => Pal.lightOrange),
      () => b.ex_getHeatFrac(),
    ));
  };


  function comp_acceptItem(b, b_f, itm) {
    if(b.items == null) return false;
    if(b.block.ex_getFuelType() !== "item" && b.block.ex_getFuelType() !== "any") return false;
    if(b.items.get(itm) >= b.getMaximumAccepted(itm)) return false;
    if(!VARGEN.fuelItms.includes(itm) || b.block.ex_getBlockedFuels().includes(itm.name)) return false;

    return true;
  };


  function comp_acceptLiquid(b, b_f, liq) {
    if(b.liquids == null) return false;
    if(b.block.ex_getFuelType() === "item") return false;
    if(b.liquids.get(liq) > b.block.liquidCapacity - 0.0001) return false;
    if((!VARGEN.fuelLiqs.includes(liq) && !VARGEN.fuelGases.includes(liq)) || b.block.ex_getBlockedFuels().includes(liq.name)) return false;

    return true;
  };


  function comp_ex_updateParams(b, rcMdl, rcHeader, forceLoad) {
    if(rcHeader != b.rcHeader || forceLoad) {
      b.tempReq = MDL_recipe._tempReq(rcMdl, rcHeader);
      b.tempAllowed = MDL_recipe._tempAllowed(rcMdl, rcHeader);
    };

    if(TIMER.timerState_secFive) {
      b.fuelTup = FRAG_faci._fuelTup(b);
    };
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


    displayBars: function(b, tb) {
      PARENT.displayBars(b, tb);
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
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-fac", "blk-furn"],
    }),


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
    ex_getTimerEffcState: function(b) {
      return PARENT.ex_getTimerEffcState(b);
    },


    // @NOSUPER
    ex_getFailP: function(b) {
      return !isFinite(b.tempAllowed) ? b.failP : Mathf.clamp((b.tempCur - b.tempAllowed) * 0.0015 + b.failP, b.failP, 1.0);
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


  TEMPLATE._std = function(nmBlk, fuelType, blockedFuels, craftEff, updateEff, updateEffP) {
    return {
      rcMdl: MDL_recipe._rcMdl("projreind", nmBlk),
      fuelType: Object.val(fuelType, "item"), blockedFuels: Object.val(blockedFuels, []),
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
      ex_getFuelType() {
        return TEMPLATE.ex_getFuelType(this);
      },
      ex_getBlockedFuels() {
        return TEMPLATE.ex_getBlockedFuels(this);
      },
      // @SPEC
      craftEffect: Object.val(craftEff, Fx.none), updateEffect: Object.val(updateEff, Fx.none), updateEffectChance: Object.val(updateEffP, 0.02),
    };
  };


  TEMPLATE._std_b = function(craftSe, useCep, noDump, heatIncRate) {
    return {
      craftSound: Object.val(craftSe, Sounds.none),
      useCep: Object.val(useCep, false), noDump: Object.val(noDump, false), heatIncRate: Object.val(heatIncRate, 0.0001),
      rcHeader: "", validTup: null, timeScl: 1.0, ignoreItemFullness: false,
      ci: [], bi: [], aux: [], reqOpt: false, opt: [],
      co: [], bo: [], failP: 0.0, fo: [],
      scrTup: null, tmpEffc: 0.0, progInc: 0.0, progIncLiq: 0.0, canAdd: false,
      hasRun: false, isStopped: false, dumpTup: null,
      heatReg: null, heatRes: Infinity, tempReq: 0.0, tempAllowed: Infinity, tempCur: -1.0, fuelPonCur: 0.0, fuelConsMtp: 1.0, fuelLvlMtp: 1.0, fuelTup: null,
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
      warmupTarget() {
        return TEMPLATE.warmupTarget(this);
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
      ex_getHeat() {
        return TEMPLATE.ex_getHeat(this);
      },
      ex_getHeatFrac() {
        return TEMPLATE.ex_getHeatFrac(this);
      },
    };
  };


  TEMPLATE.tempFuels = {
    bioFuelItms: [
      "loveclab-item0bio-log",
      "loveclab-item0bio-timber",
      "loveclab-item0bio-sawdust",
      "loveclab-item0bio-hypha-rod",
    ],
  };


  module.exports = TEMPLATE;
