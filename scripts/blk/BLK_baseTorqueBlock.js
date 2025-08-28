/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Blocks that are related to torque (rotational force).
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * b.tProg: 0.0
   * b.rpmCur: 0.0
   * b.torCur: 0.0
   * b.torSourceArr: []
   * b.supplyTgArr: []
   * b.transTgs: []
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
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");


  /* <---------- auxiliary ----------> */


  const timerAlign = new Interval(1);
  let timerState_align;


  MDL_event._c_onUpdate(() => {
    timerState_align = timerAlign.get(18000.0);
  }, 48552116);


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.update = true;
    blk.canOverdrive = false;
  };


  function comp_updateTile(b) {
    if(timerState_align) b.tProg = 0.0;

    b.tProg += b.rpmCur / 6.0;

    b.ex_updateTor();
    b.ex_supplyTor();

    // Should be called last, or the RPM may stay unchanged
    b.rpmCur = Mathf.maxZero(b.rpmCur - 0.025 * Time.delta / b.block.size);
  };


  function comp_onProximityUpdate(b) {
    b.torSourceArr = b.ex_getTorSourceArr();
    b.supplyTgArr = b.ex_getSupplyTgArr();
    b.transTgs = b.ex_getTransTgs();
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-rpm", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-rpm-amt", Strings.fixed(b.ex_accRpmCur("read"), 1))),
      prov(() => Pal.powerBar),
      () => Mathf.clamp(b.ex_accRpmCur("read") / 10.0),
    ));
    blk.addBar("lovec-tor", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-tor-amt", Strings.fixed(b.ex_accTorCur("read"), 1))),
      prov(() => Pal.metalGrayDark),
      () => Mathf.clamp(b.ex_accTorCur("read") / b.block.size / Math.max(b.ex_accRpmCur("read"), 0.1)),
    ));
  };


  function comp_ex_getSupplyTgArr(b) {
    const arr = [];

    b.proximity.each(ob => {
      if(ob.block instanceof LiquidVoid) {
        arr.push(ob, 1.66666667);
      } else if(ob.block.consumesLiquid(VARGEN.auxTor) || MDL_cond._isTCont(ob.block)) {
        arr.push(ob, MDL_recipeDict._consAmt(VARGEN.auxTor, ob.block));
      };
    });

    return arr;
  };


  function comp_ex_supplyTor(b) {
    if(!b.ex_canSupplyTor()) return;

    let i = 0;
    let iCap = b.supplyTgArr.iCap();
    let ob, rate;
    while(i < iCap) {
      ob = b.supplyTgArr[i];
      rate = Math.min(b.supplyTgArr[i + 1] * ob.edelta(), b.torCur);
      ob.handleLiquid(b, VARGEN.auxTor, rate);
      i += 2;
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
      comp_setBars(blk);
    },


    /* <---------- build (specific) ----------> */


    write: function(b, wr) {
      wr.f(b.rpmCur);
      wr.f(b.torCur);
    },


    read: function(b, rd, revi) {
      b.rpmCur = rd.f();
      b.torCur = rd.f();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accRpmCur: function(b, param) {
      return param === "read" ? b.rpmCur : (b.rpmCur = param);
    },


    // @NOSUPER
    ex_accTorCur: function(b, param) {
      return param === "read" ? b.torCur : (b.torCur = param);
    },


    // @NOSUPER
    ex_getTargetRpm: function(b) {
      return 0.0;
    },


    // @NOSUPER
    ex_getTorSourceArr: function(b) {
      return [];
    },


    // @NOSUPER
    ex_getSupplyTgArr: function(b) {
      return comp_ex_getSupplyTgArr(b);
    },


    // @NOSUPER
    ex_getTransTgs: function(b) {
      return [];
    },


    // @NOSUPER
    ex_canSupplyTor: function(b) {
      return true;
    },


    // @NOSUPER
    ex_supplyTor: function(b) {
      comp_ex_supplyTor(b);
    },


    // @NOSUPER
    ex_updateTor: function(b) {

    },


  };
