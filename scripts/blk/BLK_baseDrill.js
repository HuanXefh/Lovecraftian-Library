/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent for all drills.
   * A drill is a block that dynamically mines items using {itemDrop}.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM: CEPs used by this block.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseMiner");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(DB_block.db["group"]["nonSandMiner"].includes(blk.name)) MDL_event._c_onLoad(() => {
      if(blk.blockedItems == null) blk.blockedItems = new Seq();
      blk.blockedItems.addAll(VARGEN.sandItms);
    });
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.drillTier);
    blk.stats.remove(Stat.drillSpeed);

    let drillSpd = FRAG_faci._drillSpd(blk, false);
    blk.stats.add(TP_stat.blk0min_baseDrillSpd, drillSpd, StatUnit.itemsSecond);
    let drillSpdBoosted = FRAG_faci._drillSpd(blk, true)
    if(!drillSpd.fEqual(drillSpdBoosted)) blk.stats.add(TP_stat.blk0min_boostedDrillSpd, drillSpdBoosted, StatUnit.itemsSecond);

    blk.stats.add(TP_stat.blk0min_drillTier, blk.tier);

    if(blk.blockedItems != null) blk.stats.add(TP_stat.blk0min_blockedItms, extend(StatValue, {display(tb) {
      tb.row();
      MDL_table.setDisplay_ctLi(tb, blk.blockedItems.toArray());
    }}));

    FRAG_faci.comp_setStats_cep(blk);
  };


  function comp_updateTile(b) {
    if(b.useCep) FRAG_faci.comp_updateTile_cepEff(b);
  };


  function comp_drawSelect(b) {
    if(b.useCep) FRAG_faci.comp_drawSelect_cep(b);
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(b.useCep) b.efficiency *= FRAG_faci._cepEffcCur(b.team);
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


    // @LATER
    canMine: function(blk, t) {
      return true;
    },


    /* <---------- build (specific) ----------> */


    updateEfficiencyMultiplier: function(b) {
      comp_updateEfficiencyMultiplier(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-min", "blk-drl"],
    }),


    /* <---------- build (extended) ----------> */


  };


  module.exports = TEMPLATE;
