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
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");


  /* <---------- auxiliary ----------> */


  const timerAlign = new Interval(1);
  let timerState_align;


  MDL_event._c_onUpdate(() => {
    timerState_align = timerAlign.get(7200.0);
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
    b.rpmCur -= b.rpmCur * 0.002 * Time.delta / b.block.size;
    if(b.rpmCur < 0.0) b.rpmCur = 0.0;
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
      } else if(ob.block.consumesLiquid(VARGEN.auxTor) || ob.block.consumesLiquid(VARGEN.auxRpm) || MDL_cond._isTCont(ob.block)) {
        arr.push(ob, MDL_recipeDict._consAmt(VARGEN.auxTor, ob.block));
      };
    });

    return arr;
  };


  function comp_ex_supplyTor(b) {
    let i = 0;
    let iCap = b.supplyTgArr.iCap();
    let ob, rate1, rate2;
    while(i < iCap) {
      ob = b.supplyTgArr[i];
      rate1 = Math.min(b.supplyTgArr[i + 1], b.torCur);
      rate2 = b.rpmCur / 60.0;
      if(b.ex_canSupplyTor() && ob.acceptLiquid(b, VARGEN.auxTor)) ob.handleLiquid(b, VARGEN.auxTor, rate1 * b.edelta());
      if(ob.acceptLiquid(b, VARGEN.auxRpm)) {
        ob.handleLiquid(b, VARGEN.auxRpm, rate2 * b.edelta());
        if(Mathf.chance(0.03)) {
          let consAmt = MDL_recipeDict._consAmt(VARGEN.auxRpm, ob.block);
          if(rate2 / consAmt > 2.0) {
            let bTg = Mathf.chance(0.7) ? ob : b;
            FRAG_attack.damage(bTg, bTg.maxHealth * (VAR.blk_rpmDmgFrac + (rate2 - consAmt * 2.0) / consAmt));
          };
        };
      };
      i += 2;
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
      return TEMPLATE.ex_getTags.funArr;
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


  module.exports = TEMPLATE;
