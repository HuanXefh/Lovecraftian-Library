/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Toggable liquid junction.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * LiquidJunction
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * b.isOn: false
   * b.onReg: null
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


  const PARENT = require("lovec/blk/BLK_fluidJunction");
  const JAVA = require("lovec/glb/GLB_java");


  const MDL_content = require("lovec/mdl/MDL_content");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;

    blk.config(JAVA.BOOLEAN, (b, bool) => {
      b.ex_accIsOn(bool);
      Sounds.click.at(b);
    });
  };


  function comp_created(b) {
    b.onReg = MDL_content._reg(b.block, "-on");
  };


  function comp_draw(b) {
    if(b.isOn) Draw.rect(b.onReg, b.x, b.y);
  };


  function comp_getLiquidDestination(b, b_f, liq) {
    return b.isOn ? b : PARENT.getLiquidDestination(b, b_f, liq);
  };


  function comp_configTapped(b) {
    b.configure(!b.isOn);

    return false;
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


    // @NOSUPER
    getLiquidDestination: function(b, b_f, liq) {
      return comp_getLiquidDestination(b, b_f, liq);
    },


    // @NOSUPER
    configTapped: function(b) {
      return comp_configTapped(b);
    },


    write: function(b, wr) {
      wr.bool(b.isOn);
    },


    read: function(b, rd, revi) {
      b.isOn = rd.bool();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-fjunc"],
    }),


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accIsOn: function(b, param) {
      return param === "read" ? b.isOn : (b.isOn = param);
    },


  };
