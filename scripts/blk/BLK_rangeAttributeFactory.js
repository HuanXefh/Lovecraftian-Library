/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Attribute crafter that has a rectangular range.
   * Not meant to be used directly!
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


  const PARENT = require("lovec/blk/BLK_attributeFactory");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.remove(Stat.tiles);
    blk.stats.remove(Stat.affinities);

    blk.stats.add(TP_stat.blk_attrReq, MDL_attr._attrB(blk.attribute));
    blk.stats.add(Stat.range, blk.attrR, StatUnit.blocks);

    blk.stats.add(TP_stat.blk_attrReq, extend(StatValue, {display(tb) {
      tb.row();
      MDL_table.setDisplay_attr(tb, blk.attribute);
    }}));
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw.drawRect_normalPlace(blk, tx, ty, blk.attrR, valid, true);
  };


  function comp_drawSelect(b) {
    MDL_draw.drawRect_normalSelect(b, b.block.ex_getAttrR(), true, true);
  };


  function comp_sumAttribute(blk, attr, tx, ty) {
    return blk.ex_getAttrSum(tx, ty, 0);
  };


  const comp_ex_getAttrSum = function(blk, tx, ty, rot) {
    const thisFun = comp_ex_getAttrSum;

    if(thisFun.funTup.length === 0 || thisFun.funTup[0] !== blk || thisFun.funTup[1] !== tx || thisFun.funTup[2] !== ty || thisFun.funTup[3] !== rot) {
      thisFun.funTup[0] = blk;
      thisFun.funTup[1] = tx;
      thisFun.funTup[2] = ty;
      thisFun.funTup[3] = rot;

      thisFun.funTup[4] = MDL_attr._sum_rect(Vars.world.tile(tx, ty), blk.attrR, blk.size, blk.attribute, blk.ex_getAttrMode());
    };

    return thisFun.funTup[4];
  }
  .setProp({
    "funTup": [],
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
    },


    updateTile: function(b) {
      PARENT.updateTile(b);
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


    // @NOSUPER
    sumAttribute: function(blk, attr, tx, ty) {
      return comp_sumAttribute(blk, attr, tx, ty);
    },


    /* <---------- build (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


    // @NOSUPER
    ex_getAttrMode: function(blk) {
      return blk.attrMode;
    },


    // @NOSUPER
    ex_getAttrSum: function(blk, tx, ty, rot) {
      return comp_ex_getAttrSum(blk, tx, ty, rot);
    },


    // @NOSUPER
    ex_getAttrR: function(blk) {
      return blk.attrR;
    },


    /* <---------- build (extended) ----------> */


  };


  module.exports = TEMPLATE;
