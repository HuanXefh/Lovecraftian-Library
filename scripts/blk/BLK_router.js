/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Simply {Router}.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Router
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * b.nextToRouter: false
   * b.lastTg: null
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
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(TIMER.timerState_rsCur) b.lastTg = b.items.first();

    if(TIMER.timerState_effc) {
      b.nextToRouter = false;
      b.proximity.each(ob => {if(MDL_cond._isRouter(ob.block)) b.nextToRouter = true});
    };
  };


  function comp_draw(b) {
    if(PARAM.drawRouterHeresy && b.nextToRouter) {
      b.proximity.each(ob => {if(MDL_cond._isRouter(ob.block)) MDL_draw.drawArea_tShrink(ob.tile, ob.block.size, false)});
    };
  };


  function comp_drawSelect(b) {
    MDL_draw.drawRegion_rs(b.x, b.y, b.lastTg, b.block.size);
  };


  function comp_acceptItem(b, b_f, itm) {
    b.lastTg = itm;

    return true;
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
    },


    draw: function(b) {
      PARENT.draw(b);
      comp_draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
      comp_drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- build (specific) ----------> */


    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm) && comp_acceptItem(b, b_f, itm);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-dis", "blk-gate", "blk-router"],
    }),


    /* <---------- build (extended) ----------> */


  };
