/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Conveyor, the most basic way of item transportation.
   * I tried to change that item capacity of 3, but it's too hard-coded.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Conveyor | ArmoredConveyor
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * sideReg1: null
   * sideReg2: null
   * shouldDrawSide1: false
   * shouldDrawSide2: false
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


  const PARENT = require("lovec/blk/BLK_baseItemDistributor");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  /* <---------- component ----------> */


  function comp_created(b) {
    b.sideReg1 = MDL_texture._reg(b.block, "-side1", "-side");
    b.sideReg2 = MDL_texture._reg(b.block, "-side2", "-side");
  };


  function comp_onProximityUpdate(b) {
    var cond1 = true;
    var cond2 = true;
    let b_t = b.nearby(b.rotation);
    let b_f = b.nearby((b.rotation + 2) % 4);
    let b_s1 = b.nearby((b.rotation + 1) % 4);
    let b_s2 = b.nearby((b.rotation + 3) % 4);
    if(b_s1 != null && b_s1.block instanceof Conveyor && b_s1.team === b.team && b_s1.nearby(b_s1.rotation) === b) cond1 = false;
    if(b_s2 != null && b_s2.block instanceof Conveyor && b_s2.team === b.team && b_s2.nearby(b_s2.rotation) === b) cond1 = false;
    if(b_f != null && b_f.team === b.team && (b_f.block.outputsItems() || b_f.block instanceof Conveyor) && !MDL_cond._isCable(b_f.block)) cond1 = false;
    if(b_t != null && b_t.team === b.team && b_t.items != null) cond2 = false;

    b.shouldDrawSide1 = cond1;
    b.shouldDrawSide2 = cond2;
  };


  function comp_draw(b) {
    if(b.shouldDrawSide1) MDL_draw.drawRegion_side(b.x, b.y, b.sideReg1, b.sideReg1, b.rotation, null, null, Layer.block - 0.19);
    if(b.shouldDrawSide2) MDL_draw.drawRegion_side(b.x, b.y, b.sideReg2, b.sideReg2, b.rotation + 2 % 4, null, null, Layer.block - 0.19);
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
      comp_onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
      comp_draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    // @NOSUPER
    icons: function(blk) {
      return [MDL_texture._reg(blk, "-icon")];
    },


    /* <---------- build (specific) ----------> */


    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-dis", "blk-conv"],
    }),


    /* <---------- build (extended) ----------> */


  };
