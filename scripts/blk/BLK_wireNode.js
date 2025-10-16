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


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_draw = require("lovec/mdl/MDL_draw");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- auxiliay ----------> */


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
    if(Mathf.dst(b.x, b.y, b_t.x, b_t.y) < blk.laserRange * Vars.tilesize * blk.minRadFrac) return false;
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


  const TEMPLATE = {


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
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-pow", "blk-pow0trans", "blk-node"],
    }),


    // @NOSUPER
    ex_getMinRadFrac: function(blk) {
      return blk.minRadFrac;
    },


    /* <---------- build (extended) ----------> */


  };


  TEMPLATE._std = function(wireMat, linkMode, minRadFrac) {
    return {
      wireMat: tryVal(wireMat, "copper"), linkMode: tryVal(linkMode, "any"), minRadFrac: tryVal(minRadFrac, 0.0),
      linkFilterTup: null,
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
      canPlaceOn(t, team, rot) {
        if(!this.super$canPlaceOn(t, team, rot)) return false;
        if(!TEMPLATE.canPlaceOn(this, t, team, rot)) return false;
        return true;
      },
      linkValid(b, b_t) {
        if(!this.super$linkValid(b, b_t, true)) return false;
        if(!TEMPLATE.linkValid(this, b, b_t)) return false;
        return true;
      },
      drawLaser(x1, y1, x2, y2, size1, size2) {
        TEMPLATE.drawLaser(this, x1, y1, x2, y2, size1, size2);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getMinRadFrac() {
        return TEMPLATE.ex_getMinRadFrac(this);
      },
    };
  };


  TEMPLATE._std_b = function(touchDmg, arcColor) {
    return {
      touchDmg: tryVal(touchDmg, 0.0), arcColor: tryVal(arcColor, Pal.accent),
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
      drawConfigure() {
        this.super$drawConfigure();
        TEMPLATE.drawConfigure(this);
      },
    };
  };


  module.exports = TEMPLATE;
