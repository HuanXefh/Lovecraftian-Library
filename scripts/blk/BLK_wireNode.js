/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A greatly nerfed power node.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * PowerNode
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.wireMat: str    // @PARAM: Material used to determine the wire region.
   * blk.linkMode: str    // @PARAM: Determines valid links. See {DB_misc.db["block"]["nodeLinkFilter"]}.
   * blk.minRadFrac: f    // @PARAM: Determines the minimum radius required to link, {0.0} if no need.
   * blk.linkFilterTup: null
   * b.touchDmg: f    // @PARAM: Damage dealt when a unit touches the wire, negative to disable it.
   * b.arcColor: color    // @PARAM: Color of the lightning arc.
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["group"]["shortCircuit"]    // @PARAM
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_basePowerTransmitter");
  const VAR = require("lovec/glb/GLB_var");


  const MATH_geometry = require("lovec/math/MATH_geometry");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_draw = require("lovec/mdl/MDL_draw");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- auxilliary ----------> */


  function getGlowAlpha(x1, y1, x2, y2) {
    let b = Vars.world.buildWorld(x1, y1);
    let b_t = Vars.world.buildWorld(x2, y2);
    if(b == null || b_t == null || b.power == null || b_t.power == null) return 0.0;

    return Math.max(b.power.status, b_t.power.status);
  };


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.update = true;

    blk.consumesPower = true;
    blk.conductivePower = true;
    blk.connectedPower = true;
    blk.autolink = false;

    blk.underBullets = blk.size === 1;

    blk.linkFilterTup = [DB_misc.db["block"]["nodeLinkFilter"].read(blk.linkMode, Function.airTrue)];
  };


  function comp_setStats(blk) {
    if(blk.minRadFrac > 0.0) blk.stats.add(TP_stat.blk_minR, blk.laserRange * blk.minRadFrac, StatUnit.blocks);
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    if(!blk.drawRange) return;

    MDL_draw.drawCircle_normalPlace(blk, tx, ty, blk.laserRange * Vars.tilesize, valid, false);
    MDL_draw.drawCircle_normalPlace(blk, tx, ty, blk.laserRange * Vars.tilesize * blk.minRadFrac, valid, true);
  };


  function comp_updateTile(b) {
    var dmg = b.touchDmg * b.power.status;
    if(dmg < 0.0001) return;

    let int_t = b.power.links.random();
    if(int_t == null) return;
    let b_t = Vars.world.build(int_t);

    if(!Mathf.chance(1.0 / Math.max(b.power.links.size, 1.0))) return;

    FRAG_faci.comp_updateTile_wireTouch(b, b_t, dmg, b.arcColor);
  };


  function comp_drawSelect(b) {
    if(!b.block.drawRange) return;

    MDL_draw.drawCircle_normalSelect(b, b.block.laserRange * Vars.tilesize * b.block.ex_getMinRadFrac(), true, true);
  };


  function comp_linkValid(blk, b, b_t) {
    if(MATH_geometry._dst(b.x, b.y, b_t.x, b_t.y) < blk.laserRange * Vars.tilesize * blk.minRadFrac) return false;
    if(!blk.linkFilterTup[0](b, b_t)) return false;

    return true;
  };


  function comp_drawLaser(blk, x1, y1, x2, y2, size1, size2) {
    var ang = Angles.angle(x1, y1, x2, y2);
    var offX = Mathf.cosDeg(ang);
    var offY = Mathf.sinDeg(ang);
    var offScl1 = size1 * Vars.tilesize * 0.5 - 0.5;
    var offScl2 = size2 * Vars.tilesize * 0.5 - 0.5;

    MDL_draw.drawLine_wire(
      x1 + offX * offScl1,
      y1 + offY * offScl1,
      x2 - offX * offScl2,
      y2 - offY * offScl2,
      blk.wireMat,
      blk.laserScale,
      getGlowAlpha(x1, y1, x2, y2),
      Layer.power + blk.size * 0.001,
    );
  };


  function comp_drawConfigure(b) {
    comp_drawSelect(b);
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


    canPlaceOn: function(blk, t, team, rot) {
      return PARENT.canPlaceOn(blk, t, team, rot);
    },


    linkValid: function(blk, b, b_t) {
      return comp_linkValid(blk, b, b_t);
    },


    // @NOSUPER
    drawLaser: function(blk, x1, y1, x2, y2, size1, size2) {
      comp_drawLaser(blk, x1, y1, x2, y2, size1, size2);
    },


    /* <---------- build (specific) ----------> */


    drawConfigure: function(b) {
      comp_drawConfigure(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-pow", "blk-pow0trans", "blk-node"];
    },


    // @NOSUPER
    ex_getMinRadFrac: function(blk) {
      return blk.minRadFrac;
    },


    /* <---------- build (extended) ----------> */


  };
