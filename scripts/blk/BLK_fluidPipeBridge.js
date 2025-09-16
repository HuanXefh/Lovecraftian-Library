/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Bridge for fluid transportation, can require pressure to transport.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * LiquidBridge
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


  const PARENT = require("lovec/blk/BLK_baseFluidBlock");
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_flow = require("lovec/mdl/MDL_flow");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    if(!blk.presThr.fEqual(0.0)) blk.stats.add(blk.presThr > 0.0 ? TP_stat.blk0liq_presReq : TP_stat.blk0liq_vacReq, blk.presThr);
  };


  function comp_updateTile(b) {
    if(TIMER.timerState_heat) b.ex_updatePres();
  };


  function comp_acceptLiquid(b, b_f, liq) {
    if(b_f == null || b_f.ex_getPresTmp == null) return false;

    let presThr = b.block.ex_getPresThr();

    return presThr > 0.0 ? (b_f.ex_getPresTmp() > presThr - 0.2) : (b_f.ex_getPresTmp() < presThr + 0.2);
  };


  function comp_ex_updatePres(b) {
    var val = 0.0;

    let ot = Vars.world.tile(b.link);
    let ob;
    let liqCur = b.liquids.current()
    if(b.block.linkValid(b.tile, ot)) {
      let rot_f = ot.build.relativeTo(b)
      for(let i = 0; i < 4; i++) {
        if(i === 2) continue;
        ob = b.nearby((rot_f + i) % 4);
        if(ob == null || ob.team !== b.team || ob.ex_getPresTmp == null) continue;

        val += ob.ex_getPresTmp();
      };
    };

    b.incoming.each(posInt => {
      ob = Vars.world.build(posInt);
      if(ob == null || ob.team !== b.team || ob.ex_getPresTmp == null) return;

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
      return PARENT.acceptLiquid(b, b_f, liq) && comp_acceptLiquid(b, b_f, liq);
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
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-brd"],
    }),


    // @NOSUPER
    ex_getFluidType: function(blk) {
      return PARENT.ex_getFluidType(blk);
    },


    // @NOSUPER
    ex_getPresThr: function(blk) {
      return blk.presThr;
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


  TEMPLATE._std = function(fluidType, presThr) {
    return {
      fluidType: Object.val(fluidType, "both"),
      presThr: Object.val(presThr, 0.0),
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
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getFluidType() {
        return TEMPLATE.ex_getFluidType(this);
      },
      ex_getPresThr() {
        return TEMPLATE.ex_getPresThr(this);
      },
    };
  };


  TEMPLATE._std_b = function() {
    return {
      liqEnd: null, pres: 0.0, presBase: 0.0, presTmp: 0.0,
      presRes: 0.0, vacRes: 0.0, corRes: 1.0, cloggable: false, fHeatCur: 0.0, fHeatTg: 0.0, heatRes: Infinity,
      heatReg: null,
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
