/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A block that perodically applys status effect on units in range.
   * No optional item input!
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * MendProjector
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.staTg: sta_gn    // @PARAM, @NULL: Status effect applied to matching units.
   * blk.filterScr: (b, unit) => bool    // @PARAM: Filter function for selection of units.
   * b.useCep: bool    // @PARAM
   * b.staDur: 0.0
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM
   * DB_block.db["param"]["time"]["dur"]    // @PARAM: Duration for the status effect.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseProjector");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.suppressable = false;

    blk.staTg = MDL_content._ct(blk.staTg, "sta");
  };


  function comp_stats(blk) {
    blk.stats.remove(Stat.repairTime);
    blk.stats.remove(Stat.booster);

    if(blk.staTg != null) blk.stats.add(TP_stat.blk0misc_status, StatValues.content([blk.staTg].toSeq()));
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw.comp_drawPlace_baseBlock(blk, tx, ty, rot, valid);

    MDL_draw.drawCircle_normalPlace(blk, tx, ty, blk.range, blk.baseColor, true)
  };


  function comp_created(b) {
    b.staDur = DB_block.db["param"]["time"]["dur"].read(b.block.name, 0.0);
  };


  function comp_updateTile(b) {
    b.heat = Mathf.lerpDelta(b.heat, b.efficiency > 0.0 ? 1.0 : 0.0, 0.01);
    if(b.heat < 0.01) b.heat = 0.0;
    b.charge += b.heat * b.delta();

    if(b.efficiency > 0.0 && b.timer.get(b.block.timerUse, b.block.useTime)) b.consume();

    if(b.charge > b.block.reload - 0.0001) {
      b.charge = 0.0;

      let rad = b.block.range * b.heat;
      if(rad > 1.0) MDL_pos._it_units(b.x, b.y, rad, null, ounit => b.block.filterScr(b, ounit), ounit => ounit.apply(b.block.ex_getStaTg(), b.staDur));
    };
  };


  function comp_drawSelect(b) {
    MDL_draw.drawCircle_normalSelect(b, b.block.range * b.heat, b.block.baseColor, true);
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
      comp_stats(blk);
    },


    // @NOSUPER
    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
      comp_drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT.created(b);
      comp_created(b);
    },


    onDestroyed: function(b) {
      PARENT.onDestroyed(b);
    },


    // @NOSUPER
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


    // @NOSUPER
    drawSelect: function(b) {
      PARENT.drawSelect(b);
      comp_drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- build (specific) ----------> */


    updateEfficiencyMultiplier: function(b) {
      PARENT.updateEfficiencyMultiplier(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-proj"],
    }),


    // @NOSUPER
    ex_getStaTg: function(blk) {
      return blk.staTg;
    },


    /* <---------- build (extended) ----------> */


  };
