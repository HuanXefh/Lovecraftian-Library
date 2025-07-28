/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Simply item bridges.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * ItemBridge
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * b.lastTg: null
   * b.isTall: false
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["group"]["tall"]    // @PARAM: Whether this is a tall bridge.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseItemDistributor");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_draw = require("lovec/mdl/MDL_draw");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- auxilliary ----------> */


  const bridgeChainArr = [];


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.unloadable = true;
    blk.allowConfigInventory = true;
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.range, blk.range, StatUnit.blocks);
  };


  function comp_created(b) {
    b.isTall = DB_block.db["group"]["tall"].includes(b.block.name);
  };


  function comp_updateTile(b) {
    if(TIMER.timerState_rsCur) b.lastTg = b.items.first();
  };


  function comp_drawSelect(b) {
    MDL_draw.drawRegion_rs(b.x, b.y, b.lastTg, b.block.size);

    if(!PARAM.drawBridgeTransportLine) return;

    var ot = b.tile.nearby(b.config());
    var tmpB = b;
    var tmpOb = null;
    var isFirst = true;
    bridgeChainArr.clear().push(tmpB);
    while(ot != null) {
      tmpOb = ot.build;
      if(tmpOb != null && !bridgeChainArr.includes(tmpOb)) {
        if(!isFirst) MDL_draw.drawConnector_circleArrow(tmpOb, tmpB);
        bridgeChainArr.push(tmpOb);
        tmpB = ot.build;
        // Idk why but on rare occasions this throws NullPointerException
        if(tmpB == null || tmpB.config() == null) break;
        ot = tmpB.tile.nearby(tmpB.config());
        isFirst = false;
      } else break;
    };
  };


  function comp_acceptItem(b, b_f, itm) {
    b.lastTg = itm;
    var cond = true;

    if(b.isTall && !MDL_cond._isTallSource(b_f.block)) cond = false;

    return cond;
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
      comp_setStats(blk);
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
      comp_updateTile(b);
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


    /* <---------- build (specific) ----------> */


    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm) && comp_acceptItem(b, b_f, itm);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-dis", "blk-brd"];
    },


    /* <---------- build (extended) ----------> */


  };
