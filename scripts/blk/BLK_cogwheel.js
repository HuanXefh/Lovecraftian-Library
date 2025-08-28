/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Cogwheels, which are used to transfer torque.
   * RPM will be passed to another cogwheel if the direction is different.
   * Only the small cogwheels can interact with torque producers and consumers.
   * Size of cogwheels cannot be even numbers!
   *
   * Using {customShadow} is recommended if you don't create a gearbox, or the block shadow looks wierd.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Wall
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * b.tProg: 0.0
   * b.rpmCur: 0.0
   * b.torCur: 0.0
   * b.torSourceArr: []
   * b.supplyTgs: []
   * b.transTgs: []
   * b.isInv: false
   * b.invReg: null
   * b.drawW: 0.0
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


  const PARENT = require("lovec/blk/BLK_baseTorqueBlock");
  const JAVA = require("lovec/glb/GLB_java");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.size % 2 === 0) throw new Error("Size of a cogwheel cannot be even!");

    blk.configurable = true;

    blk.group = BlockGroup.none;
    blk.solid = false;
    blk.underBullets = true;

    blk.config(JAVA.BOOLEAN, (b, bool) => {
      b.ex_accIsInv(bool);
      b.ex_accRpmCur(0.0);
      MDL_effect.showAt_click(b.x, b.y, b.team);
      Sounds.click.at(b);
      // Force this cogwheel to update RPM inmediately, or it will stop for a second and waste torque
      b.ex_accRpmCur(b.ex_getTargetRpm());
    });
  };


  function comp_created(b) {
    b.invReg = MDL_content._reg(b.block, "-inv");
    b.drawW = b.block.region.width * 2.0 * 1.06 / Vars.tilesize;

    Time.run(5.0, () => {
      if(isNaN(b.rpmCur)) b.rpmCur = 0.0;
    });
  };


  function comp_draw(b) {
    var ang = Mathf.mod(b.tProg, 90.0);
    var invOffAng = 22.5 / (b.block.size + 1) * 2.0;

    Draw.z(Layer.block + b.block.size * 0.001 + 0.72);
    if(b.isInv) {
      Draw.rect(b.invReg, b.x, b.y, b.drawW, b.drawW, -ang + 90.0 + invOffAng);
      Draw.alpha(1.0 - ang / 90.0);
      Draw.rect(b.invReg, b.x, b.y, b.drawW, b.drawW, -ang + invOffAng);
    } else {
      Draw.rect(b.block.region, b.x, b.y, b.drawW, b.drawW, ang);
      Draw.alpha(ang / 90.0);
      Draw.rect(b.block.region, b.x, b.y, b.drawW, b.drawW, ang - 90.0);
    };
    Draw.reset();
  };


  function comp_unitOn(b, unit) {
    let dst = Mathf.dst(b.x, b.y, unit.x, unit.y);
    dst > 3.0 ?
      unit.impulse(Tmp.v1.set(unit).sub(b).rotate90(Mathf.sign(!b.isInv)).nor().scl(b.rpmCur * 3.0 * b.block.size / Math.max(dst * 0.7, 1.0))) :
      MDL_entity.rotateUnit(unit, b.rpmCur * 0.2 * Mathf.sign(!b.isInv));
  };


  function comp_configTapped(b) {
    b.configure(!b.isInv);

    return false;
  };


  function comp_ex_getTargetRpm(b) {
    var val = 0.0;

    if(b.block.size === 1) {
      // Gain RPM from torque producers
      let i = 0;
      let iCap = b.torSourceArr.iCap();
      let ob, amt;
      while(i < iCap) {
        ob = b.torSourceArr[i];
        amt = b.torSourceArr[i + 1];
        if(ob.block instanceof LiquidSource) {
          val += ob.source === VARGEN.auxTor ? 100.0 : 0.0;
        } else {
          val += FRAG_fluid.addLiquid(ob, b, VARGEN.auxTor, -amt, true, true) * amt * 60.0;
        };
        i += 2;
      };
    };

    if(val < 0.0001) {
      // Find the highest RPM in other valid cogwheels
      b.transTgs.forEachFast(ob => {
        if(ob.ex_accIsInv("read") === b.isInv) return;

        val = Math.max(
          ob.ex_accRpmCur("read") * ob.block.size / b.block.size,
          val,
        );
      });
    };

    return val;
  };



  function comp_ex_getTorSourceArr(b) {
    const arr = [];

    b.proximity.each(ob => {
      if((!ob.block.rotate ? true : ob.relativeTo(b) === b.rotation) && ob.liquids != null) {
        if(ob.block instanceof LiquidSource) {
          // Liquid source is a special case here, it's buggy but for test only, I won't fix it
          arr.push(ob, 1.66666667);
        } else {
          // Adds the building if it's a torque producer
          let rate = MDL_recipeDict._prodAmt(VARGEN.auxTor, ob.block);
          if(rate < 0.0001) return;

          arr.push(ob, rate);
        };
      };
    });

    return arr;
  };


  const comp_getTransTgs = function(b) {
    const thisFun = comp_getTransTgs;
    const arr = [];

    let tmpSize = b.block.size;
    while(tmpSize > 0) {
      for(let i = 0; i < 4; i++) {
        let ob = thisFun.funScr(b, tmpSize, i);
        if(ob == null) continue;

        arr.push(ob);
      };
      tmpSize -= 2;
    };

    return arr;
  }
  .setProp({
    // Gets valid cogwheel on a proper position
    "funScr": (b, size, ind) => {
      let pon2;
      let dstT = (size + 1) / 2;
      switch(ind) {
        case 0 :
          pon2 = new Point2(-dstT, 0);
          break;
        case 1 :
          pon2 = new Point2(0, -dstT);
          break;
        case 2 :
          pon2 = new Point2(dstT, 0);
          break;
        case 3 :
          pon2 = new Point2(0, dstT);
          break;
      };

      let ot = b.tile.nearby(pon2);
      if(ot == null) return null;
      let ob = ot.build;
      if(ob == null || !MDL_cond._isCog(ob.block)) return null;

      return ob;
    },
  });


  function comp_updateTor(b) {
    let torGenRate = 0.0, torTransAmtTg = 0.0;
    let i, iCap;
    i = 0;
    iCap = b.torSourceArr.iCap();
    while(i < iCap) {
      torGenRate += b.torSourceArr[i].efficiency * b.torSourceArr[i + 1];
      i += 2;
    };
    i = 0;
    iCap = b.supplyTgArr.iCap();
    while(i < iCap) {
      torGenRate -= b.supplyTgArr[i].efficiency * b.supplyTgArr[i + 1];
      i += 2;
    };
    b.torCur = Mathf.clamp(b.torCur + torGenRate * Time.delta, 0.0, b.rpmCur * b.block.size);

    b.transTgs.forEachFast(ob => {
      if(ob.ex_accIsInv("read") === b.isInv) return;

      torTransAmtTg = (ob.ex_accTorCur("read") + b.torCur) * 0.5;
      ob.ex_accTorCur(torTransAmtTg);
      b.torCur = torTransAmtTg;
    });

    b.rpmCur = b.ex_getTargetRpm();
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
      comp_created(b);
    },


    onDestroyed: function(b) {
      PARENT.onDestroyed(b);
    },


    updateTile: function(b) {
      PARENT.updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
    },


    // @NOSUPER
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
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    unitOn: function(b, unit) {
      comp_unitOn(b, unit);
    },


    // @NOSUPER
    configTapped: function(b) {
      return comp_configTapped(b);
    },


    // @NOSUPER
    config: function(b) {
      return b.isInv;
    },


    write: function(b, wr) {
      PARENT.write(b, wr);
      wr.bool(b.isInv);
    },


    read: function(b, rd, revi) {
      PARENT.read(b, rd, revi);
      b.isInv = rd.bool();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-cog"],
    }),


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accRpmCur: function(b, param) {
      return PARENT.ex_accRpmCur(b, param);
    },


    // @NOSUPER
    ex_accTorCur: function(b, param) {
      return PARENT.ex_accTorCur(b, param);
    },


    // @NOSUPER
    ex_getTargetRpm: function(b) {
      return comp_ex_getTargetRpm(b);
    },


    // @NOSUPER
    ex_getTorSourceArr: function(b) {
      return comp_ex_getTorSourceArr(b);
    },


    // @NOSUPER
    ex_getSupplyTgArr: function(b) {
      return PARENT.ex_getSupplyTgArr(b);
    },


    // @NOSUPER
    ex_getTransTgs: function(b) {
      return comp_getTransTgs(b);
    },


    // @NOSUPER
    ex_canSupplyTor: function(b) {
      return b.block.size === 1;
    },


    // @NOSUPER
    ex_supplyTor: function(b) {
      PARENT.ex_supplyTor(b);
    },


    // @NOSUPER
    ex_updateTor: function(b) {
      comp_updateTor(b);
    },


    // @NOSUPER
    ex_accIsInv: function(b, param) {
      return param === "read" ? b.isInv : (b.isInv = param);
    },


  };
