/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Any block that transmits power to other blocks.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["group"]["shortCircuit"]    // @PARAM: Wether this block cannot be placed on conductive liquid floor.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_basePowerBlock");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_content = require("lovec/mdl/MDL_content");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.remove(Stat.powerUse);

    let powLoss = MDL_content._powConsAmt(blk);
    if(powLoss > 0.0) blk.stats.add(TP_stat.blk0pow_powLoss, powLoss * 60.0, StatUnit.powerSecond);
  };


  function comp_canPlaceOn(blk, t, team, rot) {
    return FRAG_fluid.comp_canPlaceOn_shortCircuit(blk, t, team, rot);
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


    // @NOSUPER
    icons: function(blk) {
      return PARENT.icons(blk);
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


    canPlaceOn: function(blk, t, team, rot) {
      return comp_canPlaceOn(blk, t, team, rot);
    },


    /* <---------- build (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-pow", "blk-pow0trans"],
    }),


    /* <---------- build (extended) ----------> */


  };


  module.exports = TEMPLATE;
