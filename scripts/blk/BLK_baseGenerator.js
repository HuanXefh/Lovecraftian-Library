/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Blocks that produce power.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.shouldGenParam: bool    // @PARAM: Wether to generate parameters in {init}.
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


  const PARENT = require("lovec/blk/BLK_basePowerBlock");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_draw = require("lovec/mdl/MDL_draw");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.shouldGenParam) {
      blk.explosionRadius = Math.round(FRAG_attack._presExploRad(blk.size) / Vars.tilesize);
      blk.explosionDamage = FRAG_attack._presExploDmg(blk.size);

      if(blk.explosionPuddleLiquid != null) {
        blk.explosionPuddles = Math.round(Mathf.lerp(5, 10, blk.size / 2));
        blk.explosionPuddleRange = blk.explosionRadius * 0.75;
        blk.explosionPuddleAmount = Mathf.lerp(50.0, 70.0, blk.size / 2);
      };
    };
  };


  function comp_setStats(blk) {
    if(blk.explosionDamage > 0) {
      blk.stats.add(TP_stat.blk_canExplode, true);
      blk.stats.add(TP_stat.blk_exploR, blk.explosionRadius, StatUnit.blocks);
      blk.stats.add(TP_stat.blk_exploDmg, blk.explosionDamage);
      if(blk.explosionPuddleLiquid != null) blk.stats.add(TP_stat.blk_exploLiq, StatValues.content([blk.explosionPuddleLiquid].toSeq()));
    };
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    if(blk.explosionDamage > 0) MDL_draw.drawDisk_warning(tx * Vars.tilesize + blk.offset, ty * Vars.tilesize + blk.offset, blk.explosionRadius * Vars.tilesize);
  };


  function comp_updateTile(b) {
    FRAG_fluid.comp_updateTile_capAux(b);
  };


  function comp_drawSelect(b) {
    if(b.block.explosionDamage > 0) MDL_draw.drawDisk_warning(b.x, b.y, b.block.explosionRadius * Vars.tilesize);
  };


  function comp_createExplosion(b) {
    FRAG_attack.apply_impact(b.x, b.y, b.block.explosionDamage * 0.5, 480.0, b.block.explosionRadius * Vars.tilesize, 0.0, 0.0);
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


    /* <---------- build (specific) ----------> */


    createExplosion: function(b) {
      comp_createExplosion(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-pow", "blk-pow0gen"],
    }),


    /* <---------- build (extended) ----------> */


  };
