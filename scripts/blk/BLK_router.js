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


  const TEMPLATE = {


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
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-dis", "blk-gate", "blk-router"],
    }),


    /* <---------- build (extended) ----------> */


  };


  TEMPLATE._std = function() {
    return {
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      drawPlace(tx, ty, rot, valid) {
        this.super$drawPlace(tx, ty, rot, valid);
        TEMPLATE.drawPlace(this, tx, ty, rot, valid);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  TEMPLATE._std_b = function() {
    return {
      lastTg: null,
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
        this.super$draw();
        TEMPLATE.draw(this);
      },
      drawSelect() {
        this.super$drawSelect();
        TEMPLATE.drawSelect(this);
      },
      acceptItem(b_f, itm) {
        if(!this.super$acceptItem(b_f, itm)) return false;
        if(!TEMPLATE.acceptItem(this, b_f, itm)) return false;
        return true;
      },
    };
  };


  module.exports = TEMPLATE;
