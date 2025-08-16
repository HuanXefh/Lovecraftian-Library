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
   * blk.rcMdl: rcMdl    // @PARAM: The recipe module used. REQUIRED. Check Project Reindustrialization for examples.
   * b.craftSound: se_gn    // @PARAM
   * b.useCep: bool    // @PARAM: Whether this factory is affected by core energy.
   * b.noDump: bool    // @PARAM: Whether this factory never actively dumps items.
   * b.isTall: false
   * b.rcHeader: ""
   * b.validTup: null
   * b.timeScl: 1.0
   * b.ignoreItemFullness: false
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
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM: CEPs used by this block.
   * DB_block.db["group"]["tall"]    // @PARAM: Whether this is a tall building.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseFactory");
  const EFF = require("lovec/glb/GLB_eff");
  const JAVA = require("lovec/glb/GLB_java");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");


  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_recipe = require("lovec/frag/FRAG_recipe");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_table = require("lovec/mdl/MDL_table");


  const DB_block = require("lovec/db/DB_block");


  const TP_stat = require("lovec/tp/TP_stat");
  const TP_table = require("lovec/tp/TP_table");


  /* <---------- auxilliary ----------> */


  function getProgInc(b, time) {
    var val_fi = 1.0;

    if(b.block.ignoreLiquidFullness) {

      val_fi = b.edelta() / time / b.timeScl;

    } else {

      let val = 1.0;
      let scl = 1.0;
      let hasLiquidOutput = false;

      let iCap = b.co.iCap();
      if(b.liquids != null && iCap > 0) {
        val = 0.0;
        let i = 0;
        while(i < iCap) {
          let liq = b.co[i];
          let amt = b.co[i + 1];
          let tmpVal = (b.block.liquidCapacity - b.liquids.get(liq)) / (amt * b.edelta());
          val = Math.max(val, tmpVal);
          scl = Math.min(scl, tmpVal);
          hasLiquidOutput = true;
        };
      };

      if(!hasLiquidOutput) val = 1.0;
      val_fi = b.edelta() / time * (b.block.dumpExtraLiquid ? Math.min(val, 1.0) : scl) / b.timeScl;

    };

    return val_fi;
  };


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;
    blk.saveConfig = true;
    blk.clearOnDoubleTap = false;

    blk.config(JAVA.STRING, (b, str) => {
      b.ex_updateParams(blk.rcMdl, str, true);
      b.ex_initParams();
      b.ex_accRcHeader(str);
      EFF.squareFadePack[b.block.size].at(b);
    });

    MDL_event._c_onLoad(() => {
      blk.outputsLiquid = MDL_recipe._hasAnyOutput_liq(blk.rcMdl, false);
      blk.hasConsumers = true;

      Core.app.post(() => MDL_recipe.initRc(blk.rcMdl, blk));
    });
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.productionTime);
    blk.stats.add(Stat.productionTime, blk.craftTime / 60.0, StatUnit.seconds);

    blk.stats.add(TP_stat.blk0fac_recipes, extend(StatValue, {display(tb) {
      tb.row();
      MDL_table.setDisplay_recipe(tb, blk.rcMdl, blk);
      MDL_table.__btnBase(tb, MDL_bundle._term("lovec", "new-window"), () => {
        Core.scene.add(TP_table._winDial(TP_stat.blk0fac_recipes.localized() + " (" + blk.localizedName + ")", tb1 => MDL_table.setDisplay_recipe(tb1, blk.rcMdl, blk)));
      }).row();
    }}));

    FRAG_faci.comp_setStats_cep(blk);
  };


  function comp_created(b) {
    const rcMdl = b.block.ex_getRcMdl();
    // Delay it so {b.rcHeader} is already read instead of {""}
    Time.run(1.0, () => {
      if(!MDL_recipe._hasHeader(rcMdl, b.rcHeader)) {
        let tmpHeader = MDL_recipe._firstHeader(rcMdl);
        b.ex_updateParams(rcMdl, tmpHeader, true);
        b.rcHeader = tmpHeader;
      } else {
        b.ex_updateParams(rcMdl, b.rcHeader, true);
      };
    });

    b.isTall = DB_block.db["group"]["tall"].includes(b.block.name);
  };


  function comp_updateTile(b) {
    if(PARAM.updateSuppressed) return;

    b.ex_updateParams(b.block.ex_getRcMdl(), b.rcHeader, false);
    if(b.validTup == null || !b.validTup[0](b)) b.efficiency = 0.0;

    if(b.efficiency < 0.0001 || !b.shouldConsume()) {

      b.warmup = Mathf.approachDelta(b.warmup, 0.0, b.block.warmupSpeed);
      if(b.warmup < 0.1 && b.hasRun) b.isStopped = true;

    } else {

      b.warmup = Mathf.approachDelta(b.warmup, b.warmupTarget(), b.block.warmupSpeed);
      b.progress += b.progInc;
      if(b.warmup > 0.9) {
        b.hasRun = true;
        b.isStopped = b.efficiency < 0.5;
      };
      if(b.progress > 1.0) b.craft();

      FRAG_recipe.produce_liq(b, b.progIncLiq, b.timeScl, b.co);
      FRAG_recipe.consume_liq(b, b.progIncLiq, b.timeScl, b.ci, b.aux);

      if(Mathf.chance(b.block.updateEffectChance * b.warmup)) MDL_effect.showAround(b.x, b.y, b.block.updateEffect, b.block.size * 0.5 * Vars.tilesize, 0.0);
      // Run script
      if(b.scrTup != null) b.scrTup[1](b);
      // Stop script
      if(b.scrTup != null && b.isStopped) b.scrTup[3](b);

    };

    b.totalProgress += b.warmup * b.edelta();
    // {splitAmt} and {presFluidType} are used in {BLK_pumpFactory}
    if(!b.noDump) FRAG_recipe.dump(b, b.co, b.dumpTup, b.splitAmt, b.presFluidType);
  };


  function comp_drawSelect(b) {
    MDL_draw.drawRegion_rs(b.x, b.y, b.rcIconNm, b.block.size);

    if(b.useCep) FRAG_faci.comp_drawSelect_cep(b);
  };


  function comp_setBars(blk) {
    // Don't add this or it flashes
    blk.removeBar("liquid");

    blk.addBar("lovec-prog", b => new Bar(
      MDL_bundle._term("lovec", "progress"),
      Pal.ammo,
      () => Mathf.clamp(b.progress, 0.0, 1.0),
    ));
  };


  function comp_consumesItem(blk, itm) {
    return MDL_recipe._hasInput(itm, blk.rcMdl);
  };


  function comp_consumesLiquid(blk, liq) {
    return MDL_recipe._hasInput(liq, blk.rcMdl);
  };


  function comp_outputsItems(blk) {
    return MDL_recipe._hasAnyOutput_itm(blk.rcMdl);
  };


  function comp_displayConsumption(b, tb) {
    tb.left();

    // BI
    var i = 0;
    var iCap = b.bi.iCap();
    while(i < iCap) {
      let tmp = b.bi[i];
      if(!(tmp instanceof Array)) {
        let amt = b.bi[i + 1];
        MDL_table.__reqRs(tb, b, tmp, amt);
      } else {
        let rss = [];
        let j = 0;
        let jCap = tmp.iCap();
        while(j < jCap) {
          rss.push(tmp[j]);
          j += 3;
        };
        MDL_table.__reqMultiRs(tb, b, rss);
      };
      i += 3;
    };

    // CI
    var i = 0;
    var iCap = b.ci.iCap();
    while(i < iCap) {
      let tmp = b.ci[i];
      MDL_table.__reqRs(tb, b, tmp);
      i += 2;
    };

    // AUX
    var i = 0;
    var iCap = b.aux.iCap();
    while(i < iCap) {
      let tmp = b.aux[i];
      MDL_table.__reqRs(tb, b, tmp);
      i += 2;
    };

    // OPT
    if(b.reqOpt) {
      let rss = [];
      let i = 0;
      let iCap = b.opt.iCap();
      while(i < iCap) {
        rss.push(b.opt[i]);
        i += 4;
      };
      MDL_table.__reqMultiRs(tb, b, rss);
    };
  };


  function comp_displayBars(b, tb) {
    FRAG_recipe._inputLiqs(b.ci, b.bi, b.aux).concat(FRAG_recipe._outputLiqs(b.co, b.bo)).forEach(liq => {
      tb.add(new Bar(
        liq.localizedName,
        Object.val(liq.barColor, liq.color),
        () => b.liquids.get(liq) / b.block.liquidCapacity,
      )).growX();
      tb.row();
    });
  };


  function comp_acceptItem(b, b_f, itm) {
    if(b.items == null) return false;
    if(b.items.get(itm) >= b.getMaximumAccepted(itm)) return false;
    if(b.isTall && !MDL_cond._isTallSource(b_f.block)) return false;
    if(!FRAG_recipe._hasInput(itm, b.ci, b.bi, b.aux, b.opt)) return false;

    return true;
  };


  function comp_acceptLiquid(b, b_f, liq) {
    if(b.liquids == null) return false;
    if(b.liquids.get(liq) > b.block.liquidCapacity - 0.0001) return false;
    if(!FRAG_recipe._hasInput(liq, b.ci, b.bi, b.aux, b.opt)) return false;

    return true;
  };


  function comp_craft(b) {
    b.progress %= 1.0;

    FRAG_recipe.produce_itm(b, b.bo, b.ex_getFailP(), b.fo);
    FRAG_recipe.consume_itm(b, b.bi, b.opt);

    MDL_effect.showAt(b.x, b.y, b.block.craftEffect, 0.0);
    // Craft script
    if(b.scrTup != null) b.scrTup[2](b);
  };


  function comp_buildConfiguration(b, tb) {
    MDL_table.setSelector_recipe(tb, b, () => b.rcHeader, val => b.configure(val), false, 7);
  };


  function comp_drawStatus(b) {
    let color = b.status().color;
    if(b.block.enableDrawStatus) MDL_draw.drawRegion_status(b.x, b.y, b.block.size, color);
  };


  function comp_ex_updateParams(b, rcMdl, rcHeader, forceLoad) {
    if(rcHeader != b.rcHeader || forceLoad) {
      b.rcIconNm = MDL_recipe._iconNm(rcMdl, rcHeader);
      b.validTup = [MDL_recipe._validGetter_fi(rcMdl, rcHeader)];
      b.timeScl = MDL_recipe._timeScl(rcMdl, rcHeader);
      b.ignoreItemFullness = MDL_recipe._ignoreItemFullness(rcMdl, rcHeader);
      b.ci = MDL_recipe._ci(rcMdl, rcHeader);
      b.bi = MDL_recipe._bi(rcMdl, rcHeader);
      b.aux = MDL_recipe._aux(rcMdl, rcHeader);
      b.reqOpt = MDL_recipe._reqOpt(rcMdl, rcHeader);
      b.opt = MDL_recipe._opt(rcMdl, rcHeader);
      b.co = MDL_recipe._co(rcMdl, rcHeader);
      b.bo = MDL_recipe._bo(rcMdl, rcHeader);
      b.failP = MDL_recipe._failP(rcMdl, rcHeader);
      b.fo = MDL_recipe._fo(rcMdl, rcHeader);
      b.scrTup = MDL_recipe._scrTup(rcMdl, rcHeader);
    };

    b.efficiency = b.tmpEffc;
    if(b.useCep) b.efficiency *= FRAG_faci._cepEffcCur(b.team);

    if(b.ex_getTimerEffc()) {
      b.tmpEffc = b.ex_getEffc();
      b.progInc = getProgInc(b, b.block.craftTime);
      b.progIncLiq = getProgInc(b, 1.0);
      b.canAdd = FRAG_recipe._canAdd(b, b.ignoreItemFullness, b.co, b.bo, b.fo);
      b.dumpTup = FRAG_recipe._dumpTup(b, b.bo, b.fo);
    };

    // Update script
    if(b.scrTup != null) b.scrTup[0](b);
  };


  function comp_ex_initParams(b) {
    b.progress = 0.0;
    b.efficiency = 0.0;
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
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
      comp_drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    setBars: function(blk) {
      comp_setBars(blk);
    },


    // @NOSUPER
    consumesItem: function(blk, itm) {
      return comp_consumesItem(blk, itm);
    },


    // @NOSUPER
    consumesLiquid: function(blk, liq) {
      return comp_consumesLiquid(blk, liq);
    },


    // @NOSUPER
    outputsItems: function(blk) {
      return comp_outputsItems(blk);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    displayConsumption: function(b, tb) {
      comp_displayConsumption(b, tb);
    },


    displayBars: function(b, tb) {
      comp_displayBars(b, tb);
    },


    // @NOSUPER
    acceptItem: function(b, b_f, itm) {
      return comp_acceptItem(b, b_f, itm);
    },


    // @NOSUPER
    acceptLiquid: function(b, b_f, liq) {
      return comp_acceptLiquid(b, b_f, liq);
    },


    // @NOSUPER
    shouldConsume: function(b) {
      return b.enabled && b.canAdd;
    },


    // @NOSUPER
    craft: function(b) {
      PARENT.craft(b);
      comp_craft(b);
    },


    // @NOSUPER
    buildConfiguration: function(b, tb) {
      comp_buildConfiguration(b, tb);
    },


    // @NOSUPER
    config: function(b) {
      return b.rcHeader;
    },


    // @NOSUPER
    drawStatus: function(b) {
      comp_drawStatus(b);
    },


    write: function(b, wr) {
      wr.str(b.rcHeader);
      wr.bool(b.isStopped);
    },


    read: function(b, rd, revi) {
      b.rcHeader = rd.str();
      b.isStopped = rd.bool();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-fac"],
    }),


    // @NOSUPER
    ex_getRcMdl: function(blk) {
      return blk.rcMdl;
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accRcHeader: function(b, param) {
      return param === "read" ? b.rcHeader : b.rcHeader = param;
    },


    // @NOSUPER
    ex_updateParams: function(b, rcMdl, rcHeader, forceLoad) {
      comp_ex_updateParams(b, rcMdl, rcHeader, forceLoad);
    },


    // @NOSUPER
    ex_initParams: function(b) {
      comp_ex_initParams(b);
    },


    // @NOSUPER
    ex_getEffc: function(b) {
      return FRAG_recipe._effc(b, b.ci, b.bi, b.aux, b.reqOpt, b.opt);
    },


    // @NOSUPER
    ex_getTimerEffc: function(b) {
      return TIMER.timerState_effc;
    },


    // @NOSUPER
    ex_getFailP: function(b) {
      return b.failP;
    },


  };
