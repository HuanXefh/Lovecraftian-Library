/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * It's just beam node.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * BeamNode
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.wireMat: str    // @PARAM: Material used to determine the wire region.
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


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_draw = require("lovec/mdl/MDL_draw");


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
    blk.conductivePower = false;
    blk.connectedPower = true;

    blk.underBullets = blk.size === 1;
  };


  function comp_updateTile(b) {
    var dmg = b.touchDmg * b.power.status;
    if(dmg < 0.0001) return;

    let b_t = b.links[(3).randInt(0)];
    if(b_t == null) return;

    FRAG_faci.comp_updateTile_wireTouch(b, b_t, dmg, b.arcColor);
  };


  function comp_draw(b) {
    MDL_draw.comp_draw_baseBuilding(b);

    if(Vars.renderer.laserOpacity < 0.0001 || b.team === Team.derelict) return;

    for(let i = 0; i < 4; i++) {
      let ot = b.dests[i];
      let ob = b.links[i];
      if(ot == null || !ob.wasVisible) continue;

      if(ob.block instanceof BeamNode) {
        if(ob.tileX() !== b.tileX() && ob.tileY() !== b.tileY()) continue;
        if(ob.id > b.id && b.block.range < ob.block.range) continue;
        if(b.block.range > ob.block.range) continue;
      };

      b.block.drawLaser(b.x, b.y, ob.x, ob.y, b.block.size, ob.block.size);
    };
  };


  function comp_drawLaser(blk, x1, y1, x2, y2, size1, size2) {
    var size = blk.size;
    var dst = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) / Vars.tilesize;
    if(dst < (size * 0.5 + 1.0)) return;

    var offSize = (dst - (size1 + size2) * 0.5) * Vars.tilesize;
    let pon2 = Geometry.d4[Tile.relativeTo(x1, y1, x2, y2)];
    MDL_draw.drawLine_wire(
      x1 + pon2.x * size * 0.5 * Vars.tilesize,
      y1 + pon2.y * size * 0.5 * Vars.tilesize,
      x1 + pon2.x * (size * 0.5 * Vars.tilesize + offSize),
      y1 + pon2.y * (size * 0.5 * Vars.tilesize + offSize),
      blk.wireMat,
      blk.laserWidth,
      getGlowAlpha(x1, y1, x2, y2),
      Layer.power + blk.size * 0.001,
    );
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


    // @NOSUPER
    draw: function(b) {
      PARENT.draw(b);
      comp_draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    canPlaceOn: function(blk, t, team, rot) {
      return PARENT.canPlaceOn(blk, t, team, rot);
    },


    // @NOSUPER
    drawLaser: function(blk, x1, y1, x2, y2, size1, size2) {
      comp_drawLaser(blk, x1, y1, x2, y2, size1, size2);
    },


    /* <---------- build (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-pow", "blk-pow0trans", "blk-relay"],
    }),


    /* <---------- build (extended) ----------> */


  };
