/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A drill that outputs variants of an item based on terrain.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Drill
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseDrill");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    if(blk.itmWhitelist.length > 0) {
      blk.stats.remove(TP_stat.blk0min_blockedItms);
      blk.stats.add(TP_stat.blk0min_allowedItms, extend(StatValue, {display(tb) {
        tb.row();
        MDL_table.setDisplay_ctLi(tb, blk.itmWhitelist);
      }}));
    };
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    FRAG_faci.comp_drawPlace_ter(blk, tx, ty, rot, valid, 1);
  };


  function comp_onProximityUpdate(b) {
    b.terCur = FRAG_faci._ter(b.tile, b.block.size);

    let terItmMap = b.block.ex_getTerItmMapMap().get(b.dominantItem == null ? "null" : b.dominantItem.name);
    if(terItmMap == null) return;
    let itm = MDL_content._ct(terItmMap.get(Object.val(b.terCur, "transition")), "rs");
    if(itm == null) return;

    b.dominantItem = itm;
  };


  function comp_canMine(blk, t) {
    if(blk.itmWhitelist.length === 0) return true;
    let itm = t.drop();
    if(itm == null) return false;

    return blk.itmWhitelist.includes(itm.name);
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
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
      comp_onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    canMine: function(blk, t) {
      return comp_canMine(blk, t);
    },


    /* <---------- build (specific) ----------> */


    updateEfficiencyMultiplier: function(b) {
      PARENT.updateEfficiencyMultiplier(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-min", "blk-drl"],
    }),


    // @NOSUPER
    ex_getTerItmMapMap: function(blk) {
      return blk.terItmMapMap;
    },


    /* <---------- build (extended) ----------> */


  };


  TEMPLATE._std = function(itmWhitelist, terItmMapMap, drillEff, drillEffP, drillEffRnd, updateEff, updateEffP) {
    return {
      itmWhitelist: Object.val(itmWhitelist, Array.air), terItmMapMap: Object.val(terItmMapMap, new ObjectMap()),
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
      canMine(t) {
        if(!this.super$canMine(t)) return false;
        if(!TEMPLATE.canMine(this, t)) return false;
        return true;
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getTerItmMapMap() {
        return TEMPLATE.ex_getTerItmMapMap(this);
      },
      // @SPEC
      drillEffect: Object.val(drillEff, Fx.none), drillEffectChance: Object.val(drillEffP, 1.0), drillEffectRnd: Object.val(drillEffRnd, 0.0),
      updateEffect: Object.val(updateEff, Fx.none), updateEffectChance: Object.val(updateEffP, 0.02),
    };
  };


  TEMPLATE._std_b = function(useCep) {
    return {
      useCep: Object.val(useCep, false),
      terCur: null,
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
      updateEfficiencyMultiplier() {
        this.super$updateEfficiencyMultiplier();
        TEMPLATE.updateEfficiencyMultiplier(this);
      },
    };
  };


  TEMPLATE.tempItms = {
    sandItms: DB_item.db["group"]["sand"],
  };


  module.exports = TEMPLATE;
