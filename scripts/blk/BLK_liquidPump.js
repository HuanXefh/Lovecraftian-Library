/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Just vanilla pump with typical fluid block mechanics.
   * Pumps can output pressure/vacuum.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Pump
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
  const PARAM = require("lovec/glb/GLB_param");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  const MOD_tmi = require("lovec/mod/MOD_tmi");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.hasConsumers = true;
    blk.fluidType = "liquid";                     // Forced to "liquid" which is obvious

    if(!blk.presProd.fEqual(0.0)) MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        MDL_recipeDict.addFldProdTerm(blk, blk.presProd > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, Math.abs(blk.presProd), null);
      });
    });

    MOD_tmi._r_presPump(blk, Math.abs(blk.presProd), blk.presProd < 0.0);
  };


  function comp_setStats(blk) {
    blk.stats.remove(TP_stat.blk0liq_presRes);
    blk.stats.remove(TP_stat.blk0liq_vacRes);

    if(!blk.presProd.fEqual(0.0)) {
      blk.stats.add(blk.presProd > 0.0 ? TP_stat.blk0liq_presOutput : TP_stat.blk0liq_vacOutput, Math.abs(blk.presProd * 60.0), StatUnit.liquidSecond);
      blk.stats.add(TP_stat.blk0liq_splitAmt, DB_block.db["param"]["amount"]["base"].read(blk.name, 1));
    };

    FRAG_faci.comp_setStats_cep(blk);
  };


  function comp_created(b) {
    b.splitAmt = DB_block.db["param"]["amount"]["base"].read(b.block.name, 1);
  };


  function comp_updateTile(b) {
    if(b.useCep) FRAG_faci.comp_updateTile_cepEff(b);

    let presProd = b.block.ex_getPresProd();
    if(presProd.fEqual(0.0)) return;

    FRAG_fluid.comp_updateTile_capAux(b);

    if(PARAM.updateSuppressed) return;

    // Produces pressure/vacuum
    FRAG_fluid.addLiquid(b, b, presProd > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, Math.abs(presProd), true);
    if(FRAG_fluid.dumpPres(b, Math.abs(presProd), presProd < 0.0, b.splitAmt, "liquid") < 0.0001) {
      b.dumpLiquid(presProd > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, 2.0);
    };
  };


  const comp_drawSelect = function(b) {
    const thisFun = comp_drawSelect;

    MDL_draw.drawRegion_rs(b.x, b.y, b.liquidDrop, b.block.size);

    if(Math.abs(b.block.ex_getPresProd()) < 0.0001) return;

    thisFun.tmpInd = 0;
    b.proximity.each(ob => {
      if(thisFun.checkTg(ob)) {
        MDL_draw.drawArea_tShrink(ob.tile, ob.block.size, thisFun.tmpInd++ < b.splitAmt);
      };
    });

    if(b.useCep) FRAG_faci.comp_drawSelect_cep(b, 1);
  }
  .setProp({
    tmpInd: 0,
    checkTg: ob => ob.ex_accPresBase != null && !MDL_cond._isPump(ob.block) && tryFun(ob.block.ex_getFluidType, "", ob.block) === "liquid",
  });


  function comp_shouldConsume(b) {
    if(!b.enabled) return false;
    if(b.block instanceof Pump && b.liquidDrop == null) return false;
    if(b.block.ex_getPresProd().fEqual(0.0) && b.liquids.get(b.liquidDrop) > b.block.liquidCapacity - 0.01) return false;

    return true;
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(b.useCep) b.efficiency *= FRAG_faci._cepEffcCur(b.team);
  };


  function comp_drawStatus(b) {
    let color = b.status().color;
    if(b.block.enableDrawStatus) MDL_draw.drawRegion_status(b.x, b.y, b.block.size, color);
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
      return comp_shouldConsume(b);
    },


    updateEfficiencyMultiplier: function(b) {
      comp_updateEfficiencyMultiplier(b);
    },


    // @NOSUPER
    drawStatus: function(b) {
      comp_drawStatus(b);
    },


    write: function(b, wr) {
      PARENT.write(b, wr);
      processRevision(wr);
    },


    read: function(b, rd, revi) {
      PARENT.read(b, rd, revi);
      processRevision(rd);
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
      return blk.presProd;
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


  };


  TEMPLATE._std = function(presProd) {
    return {
      fluidType: "liquid",
      presProd: tryVal(presProd, 0.0),
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
    };
  };


  module.exports = TEMPLATE;
