/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Stacked cogwheels. Block size is used for the bottom one.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Wall
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


  const PARENT = require("lovec/blk/BLK_cogwheel");
  const PARENT_A = require("lovec/blk/BLK_baseTorqueBlock");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.ovSize % 2 === 0) ERROR_HANDLER.evenCog(blk);

    MDL_event._c_onLoad(() => {
      blk.region = Core.atlas.find(blk.botParent);
      blk.customShadowRegion = Core.atlas.find(blk.botParent + "-shadow");
      blk.fullIcon = blk.uiIcon = Core.atlas.find(blk.name + "-full1");
    });
  };


  function comp_created(b) {
    b.invReg = Core.atlas.find(b.block.ex_getBotParent() + "-inv");
    b.drawW = b.block.region.width * 2.0 * 1.06 / Vars.tilesize;
    b.ovReg = Core.atlas.find(b.block.ex_getOvParent());
    b.ovInvReg = Core.atlas.find(b.block.ex_getOvParent() + "-inv");
    b.ovShaReg = Core.atlas.find(b.block.ex_getOvParent() + "-shadow");
    b.ovDrawW = b.ovReg.width * 2.0 * 1.06 / Vars.tilesize;

    Time.run(5.0, () => {
      if(isNaN(b.rpmCur)) b.rpmCur = 0.0;
      if(isNaN(b.torCur)) b.torCur = 0.0;
    });
  };


  function comp_draw(b) {
    var ang = Mathf.mod(b.tProg, 90.0);
    let invOffAng = 22.5 / (b.block.size + 1) * 2.0;
    let ovInvOffAng = 22.5 / (b.block.ex_getOvSize() + 1) * 2.0;

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
    Draw.z(Layer.power - 1.6 + b.block.ex_getOvSize() * 0.001);
    Draw.alpha(1.0);
    Draw.rect(b.ovShaReg, b.x, b.y);
    let ovA = b.block.ex_getOvSize() > b.block.size ? VAR.blk_ovCogA1 : VAR.blk_ovCogA2;
    if(b.isInv) {
      Draw.alpha(ang / 90.0 * ovA);
      Draw.rect(b.ovInvReg, b.x, b.y, b.ovDrawW, b.ovDrawW, -ang + 90.0 + ovInvOffAng);
      Draw.alpha((1.0 - ang / 90.0) * ovA);
      Draw.rect(b.ovInvReg, b.x, b.y, b.ovDrawW, b.ovDrawW, -ang + ovInvOffAng);
    } else {
      Draw.alpha((1.0 - ang / 90.0) * ovA);
      Draw.rect(b.ovReg, b.x, b.y, b.ovDrawW, b.ovDrawW, ang);
      Draw.alpha(ang / 90.0 * ovA);
      Draw.rect(b.ovReg, b.x, b.y, b.ovDrawW, b.ovDrawW, ang - 90.0);
    };
    Draw.reset();
  };


  function comp_createIcons(blk, packer) {
    MDL_texture.comp_createIcons_ctTag(blk, packer, blk.botParent, blk.ovParent, "-full1");
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

        if(!MDL_cond._isCogStack(ob.block)) {
          val = Math.max(
            ob.ex_accRpmCur("read") * ob.block.size / b.block.size,
            val,
          );
        } else {
          val = Math.max(
            ob.ex_accRpmCur("read") * ob.block.ex_getOvSize() / b.block.ex_getOvSize(),
            val,
          );
        };

      });
    };

    return val;
  };


  const comp_getTransTgs = function(b) {
    const thisFun = comp_getTransTgs;
    const arr = [];

    let tmpSize;

    tmpSize = b.block.size;
    while(tmpSize > 0) {
      for(let i = 0; i < 4; i++) {
        let ob = thisFun.findCog(b, tmpSize, i, false);
        if(ob == null) continue;

        arr.push(ob);
      };
      tmpSize -= 2;
    };
    tmpSize = b.block.ex_getOvSize();
    while(tmpSize > 0) {
      for(let i = 0; i < 4; i++) {
        let ob = thisFun.findCog(b, tmpSize, i, true);
        if(ob == null) continue;

        arr.push(ob);
      };
      tmpSize -= 2;
    };

    return arr;
  }
  .setProp({
    findCog: (b, size, ind, isOv) => {
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
      if(ob == null || (isOv ? (!MDL_cond._isCogStack(ob.block) || ot !== ob.tile) : !MDL_cond._isCog(ob.block)) || (ob.tileX() !== b.tileX() && ob.tileY() !== b.tileY())) return null;

      return ob;
    },
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
      PARENT_A.created(b);
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
      PARENT_A.draw(b);
      comp_draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    setBars: function(blk) {
      PARENT.setBars(blk);
    },


    createIcons: function(blk, packer) {
      comp_createIcons(blk, packer);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    unitOn: function(b, unit) {
      PARENT.unitOn(b, unit);
    },


    // @NOSUPER
    configTapped: function(b) {
      return PARENT.configTapped(b);
    },


    // @NOSUPER
    config: function(b) {
      return PARENT.config(b);
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
      tempTags: ["blk-cog", "blk-cog0stack"],
    }),


    // @NOSUPER
    ex_getOvSize: function(blk) {
      return blk.ovSize;
    },


    // @NOSUPER
    ex_getBotParent: function(blk) {
      return blk.botParent;
    },


    // @NOSUPER
    ex_getOvParent: function(blk) {
      return blk.ovParent;
    },


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
      return PARENT.ex_getTorSourceArr(b);
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
      return PARENT.ex_canSupplyTor(b);
    },


    // @NOSUPER
    ex_supplyTor: function(b) {
      PARENT.ex_supplyTor(b);
    },


    // @NOSUPER
    ex_updateTor: function(b) {
      PARENT.ex_updateTor(b);
    },


    // @NOSUPER
    ex_accIsInv: function(b, param) {
      return PARENT.ex_accIsInv(b, param);
    },


  };


  TEMPLATE._std = function(ovSize, botParent, ovParent) {
    return {
      ovSize: tryVal(ovSize, 3), botParent: botParent, ovParent: ovParent,
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
      createIcons(packer) {
        this.super$createIcons(packer);
        TEMPLATE.createIcons(this, packer);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getOvSize() {
        return TEMPLATE.ex_getOvSize(this);
      },
      ex_getBotParent() {
        return TEMPLATE.ex_getBotParent(this);
      },
      ex_getOvParent() {
        return TEMPLATE.ex_getOvParent(this);
      },
    };
  };


  TEMPLATE._std_b = function() {
    return {
      tProg: 0.0, rpmCur: 0.0, torCur: 0.0, torSourceArr: [], supplyTgArr: [], transTgs: [],
      isInv: false, invReg: null, drawW: 0.0,
      ovReg: null, ovInvReg: null, ovShaReg: null, ovDrawW: 0.0,
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
        TEMPLATE.draw(this);
      },
      drawSelect() {
        this.super$drawSelect();
        TEMPLATE.drawSelect(this);
      },
      unitOn(unit) {
        TEMPLATE.unitOn(this, unit);
      },
      configTapped() {
        return TEMPLATE.configTapped(this);
      },
      config() {
        return TEMPLATE.config(this);
      },
      write(wr) {
        this.super$write(wr);
        TEMPLATE.write(this, wr);
      },
      read(rd, revi) {
        this.super$read(rd, revi);
        TEMPLATE.read(this, rd, revi);
      },
      ex_accRpmCur(param) {
        return TEMPLATE.ex_accRpmCur(this, param);
      },
      ex_accTorCur(param) {
        return TEMPLATE.ex_accTorCur(this, param);
      },
      ex_getTargetRpm() {
        return TEMPLATE.ex_getTargetRpm(this);
      },
      ex_getTorSourceArr() {
        return TEMPLATE.ex_getTorSourceArr(this);
      },
      ex_getSupplyTgArr() {
        return TEMPLATE.ex_getSupplyTgArr(this);
      },
      ex_getTransTgs() {
        return TEMPLATE.ex_getTransTgs(this);
      },
      ex_canSupplyTor() {
        return TEMPLATE.ex_canSupplyTor(this);
      },
      ex_supplyTor() {
        TEMPLATE.ex_supplyTor(this);
      },
      ex_updateTor() {
        TEMPLATE.ex_updateTor(this);
      },
      ex_accIsInv(param) {
        return TEMPLATE.ex_accIsInv(this, param);
      },
    };
  };


  module.exports = TEMPLATE;
