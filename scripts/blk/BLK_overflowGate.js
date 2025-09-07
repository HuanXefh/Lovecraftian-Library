/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * {OverflowGate} but can be inverted.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * OverflowGate
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * invReg: null
   * isInv: false
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


  const PARENT = require("lovec/blk/BLK_baseItemGate");
  const EFF = require("lovec/glb/GLB_eff");
  const JAVA = require("lovec/glb/GLB_java");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;
    blk.saveConfig = true;
    blk.clearOnDoubleTap = false;

    blk.config(JAVA.BOOLEAN, (b, bool) => {
      b.ex_accIsInv(bool);
      EFF.squareFadePack[b.block.size].at(b);
    });
  };


  function comp_created(b) {
    b.invReg = MDL_texture._reg(b.block, "-inv");
  };


  function comp_draw(b) {
    if(b.isInv) MDL_draw.drawRegion_normal(b.x, b.y, b.invReg);
  };


  function comp_getTileTarget(b, itm, b_f, isFlip) {
    var rot = b_f.relativeTo(b);
    var b_t = b.nearby(rot);
    var tg = b_t;
    var cond0 = b_t != null && b_t.team === b.team && !(b_t.block.instantTransfer && b.block.instantTransfer) && b_t.acceptItem(b, itm);

    if(!cond0 || b.isInv === b.enabled) {

      let b_s1 = b.nearby(Mathf.mod(rot - 1, 4));
      let b_s2 = b.nearby(Mathf.mod(rot + 1, 4));
      let cond1 = b_s1 != null && b_s1.team === b.team && !(b_s1.block.instantTransfer && b_f.block.instantTransfer) && b_s1.acceptItem(b, itm);
      let cond2 = b_s2 != null && b_s2.team === b.team && !(b_s2.block.instantTransfer && b_f.block.instantTransfer) && b_s2.acceptItem(b, itm);

      if(!cond1 && !cond2) return b.isInv === b.enabled && cond0 ? b_t : null;
      if(cond1 && !cond2) {tg = b_s1}
      else if(!cond1 && cond2) {tg = b_s2}
      else {
        tg = (b.rotation & (1 << rot)) === 0 ? b_s1 : b_s2;
        if(isFlip) b.rotation ^= (1 << rot);
      };

    };

    return tg;
  };


  function comp_buildConfiguration(b, tb) {
    MDL_table.__btnCfg_toggle(tb, b, VARGEN.icons.swap, VARGEN.icons.swap, b.isInv);
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


    draw: function(b) {
      PARENT.draw(b);
      comp_draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- build (specific) ----------> */


    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm);
    },


    // @NOSUPER
    getTileTarget: function(b, itm, b_f, isFlip) {
      return comp_getTileTarget(b, itm, b_f, isFlip);
    },


    // @NOSUPER
    buildConfiguration: function(b, tb) {
      comp_buildConfiguration(b, tb);
    },


    // @NOSUPER
    config: function(b) {
      return b.isInv;
    },


    write: function(b, wr) {
      wr.bool(b.isInv);
    },


    read: function(b, rd, revi) {
      b.isInv = rd.bool();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-dis", "blk-gate"],
    }),


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accIsInv: function(b, param) {
      return param === "read" ? b.isInv : (b.isInv = param);
    },


  };
