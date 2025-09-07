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
   * b.isPresInlet: false
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
      MDL_draw.drawDisk_warning(tx * Vars.tilesize + blk.offset, ty * Vars.tilesize + blk.offset, FRAG_attack._presExploRad(blk.size));
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
      thisFun.funCount++;
      if(thisFun.funCount > 4) {
        b.pres = 0.0;
        return;
      };
    } else {
      thisFun.funCount = 0;
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
    "funCount": 0,
  });


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
    },


    read: function(b, rd, revi) {
      PARENT.read(b, rd, revi);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-fcont"],
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
