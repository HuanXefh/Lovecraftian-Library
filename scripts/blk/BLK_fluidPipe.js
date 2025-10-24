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
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");


  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_reaction = require("lovec/mdl/MDL_reaction");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  const TP_cons = require("lovec/tp/TP_cons");
  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(DB_block.db["group"]["shortCircuitPipe"].includes(blk.name)) {
      blk.conductivePower = false;
      blk.connectedPower = false;
      blk.enableDrawStatus = false;

      let consPow = TP_cons._consPow_shortCircuit(0.0, 1.0);
      blk.consumers = [consPow];
      blk.consPower = consPow;
    };
  };


  function comp_setStats(blk) {
    let pipeDiam = MDL_flow._pipeDiam(blk);
    blk.stats.add(TP_stat.blk0liq_pipeDiam, pipeDiam);
  };


  function comp_onDestroyed(b) {
    if(PARAM.secret_steelPipe && MDL_flow._matGrp(b.block).equalsAny(["iron", "steel", "galvanized-steel", "stainless-steel"])) MDL_effect.playAt(b.x, b.y, "se-meme-steel-pipe");
  };


  function comp_updateTile(b) {
    if(TIMER.timerState_heat) b.ex_updatePres();

    if(TIMER.timerState_sec && b.isLeaked && b.liquids.currentAmount() > 0.001) FRAG_faci.addDynaPol(FRAG_faci._liqPol(b.liquids.current()) / 60.0);

    if(Mathf.chance(0.008) && b.block.consPower != null) b.block.consPower.trigger(b);
  };


  function comp_onProximityUpdate(b) {
    if(!b.block.leaks) b.isLeaked = false;
    let ot = b.tile.nearby(b.rotation);
    if(ot == null) {
      b.isLeaked = true;
    } else {
      b.isLeaked = !ot.solid();
    };
  };


  function comp_moveLiquid(b, b_t, liq) {
    let amtTrans = 0.0;
    if(PARAM.updateSuppressed || b_t == null || liq == null) return amtTrans;

    // Called occasionally to update params in {b}
    if(TIMER.timerState_liq) {
      b.liqEnd = b_t.getLiquidDestination(b, liq);
    };

    if(b.liqEnd == null || b.liqEnd.liquids == null) return amtTrans;

    amtTrans = FRAG_fluid.transLiquid(
      b,
      b.liqEnd,
      liq,
      b.block.liquidCapacity * Math.max(b.liquids.get(liq) / b.block.liquidCapacity - b.liqEnd.liquids.get(liq) / b.liqEnd.block.liquidCapacity, 0.0),
    );

    let oliq = b.liqEnd.liquids.current();
    if(
      !b.liqEnd.block.consumesLiquid(liq)
      && oliq !== liq
      && b.liqEnd.liquids.get(oliq) / b.liqEnd.block.liquidCapacity > 0.1
      && b.liquids.get(liq) / b.block.liquidCapacity > 0.1
    ) {

      if(Mathf.chanceDelta(0.1)) MDL_reaction.handleReaction(liq, oliq, 10.0, b_t);

    };

    return amtTrans;
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
    },


    onDestroyed: function(b) {
      PARENT.onDestroyed(b);
      comp_onDestroyed(b);
    },


    updateTile: function(b) {
      PARENT.updateTile(b);
      comp_updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
      comp_onProximityUpdate(b);
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
      tempTags: ["blk-fcond"],
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


  TEMPLATE._std = function(fluidType) {
    return {
      fluidType: tryVal(fluidType, "both"),
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
    };
  };


  TEMPLATE._std_b = function() {
    return {
      liqEnd: null, pres: 0.0, presBase: 0.0, presTmp: 0.0,
      presRes: 0.0, vacRes: 0.0, corRes: 1.0, cloggable: false, fHeatCur: 0.0, fHeatTg: 0.0, heatRes: Infinity,
      heatReg: null,
      isLeaked: false,
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
      moveLiquid(b_t, liq) {
        return TEMPLATE.moveLiquid(this, b_t, liq);
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
