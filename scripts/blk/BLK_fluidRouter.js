/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Blocks for fluid storage.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * LiquidRouter
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


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_flow = require("lovec/mdl/MDL_flow");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.size === 1) {
      blk.solid = false;
      blk.underBullets = true;
    };
  };


  function comp_setStats(blk) {
    if(blk.ex_getFluidType() !== "liquid") {
      blk.stats.add(TP_stat.blk_canExplode, true);
      blk.stats.add(TP_stat.blk_exploR, FRAG_attack._presExploRad(blk.size) / Vars.tilesize, StatUnit.blocks);
      blk.stats.add(TP_stat.blk_exploDmg, FRAG_attack._presExploDmg(blk.size));
    };
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    if(blk.ex_getFluidType() !== "liquid") {
      MDL_draw.drawDisk_warning(tx.toFCoord(blk.size), ty.toFCoord(blk.size), FRAG_attack._presExploRad(blk.size));
    };
  };


  function comp_onDestroyed(b) {
    let liqCur = b.liquids.current();
    if(MDL_cond._isAux(liqCur) || !liqCur.willBoil()) return;

    let frac = b.liquids.get(liqCur) / b.block.liquidCapacity;
    if(frac < 0.002) return;

    FRAG_attack.apply_explosion(
      b.x,
      b.y,
      FRAG_attack._presExploDmg(b.block.size) * frac,
      FRAG_attack._presExploRad(b.block.size) * frac,
      12.0 * frac,
    );
  };


  function comp_updateTile(b) {
    if(TIMER.timerState_heat) b.ex_updatePres();
  };


  function comp_drawSelect(b) {
    if(b.block.ex_getFluidType() !== "liquid") {
      MDL_draw.drawDisk_warning(b.x, b.y, FRAG_attack._presExploRad(b.block.size));
    };
  };


  const comp_ex_updatePres = function(b) {
    const thisFun = comp_ex_updatePres;

    var val = 0.0;
    var tmpVal = 0.0;

    b.isPresInlet = false;
    let liqCur = b.liquids.current();

    // If no liquid for some time, clear pressure
    if(b.liquids.currentAmount() < 0.01) {
      thisFun.presClearCount++;
      if(thisFun.presClearCount > 4) {
        b.pres = 0.0;
        return;
      };
    } else {
      thisFun.presClearCount = 0;
    };

    // Find any pressure supplier
    b.proximity.each(ob => {
      if(ob.ex_getPresTmp == null) return;

      if(ob.block instanceof LiquidBridge) {

        if(!ob.block.linkValid(ob.tile, Vars.world.tile(ob.link))) {
          val += ob.ex_getPresTmp();
          b.isPresInlet = true;
        };

      } else if(ob.block.rotate) {

        if(ob.nearby(ob.rotation) === b) {
          val += ob.ex_getPresTmp();
          b.isPresInlet = true;
        };

      } else if(MDL_cond._isPump(ob.block)) {

        b.isPresInlet = true;

      };
    });

    // If no matching pressure supplier, find the liquid router with highest pressure/vacuum
    if(!b.isPresInlet) {
      b.proximity.each(ob => {
        if(ob.block !== b.block || ob.ex_getPresTmp == null) return;

        let tmp = ob.ex_getPresTmp() * 0.985;
        if(Math.abs(tmp) > Math.abs(tmpVal)) tmpVal = tmp;
      });
      val = tmpVal;
    };

    b.pres = b.presBase + val;
  }
  .setProp({
    presClearCount: 0,
  });


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
      comp_drawPlace(blk, tx, ty, rot, valid);
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
      tempTags: ["blk-fcont"],
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
      heatReg: null, isPresInlet: false,
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
