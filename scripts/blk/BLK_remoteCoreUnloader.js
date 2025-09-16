/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A special directional unloader that always unloads items from the nearest core.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * DirectionalUnloader
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


  const PARENT = require("lovec/blk/BLK_directionalUnloader");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    FRAG_faci.comp_setStats_cep(blk);
  };


  function comp_updateTile(b) {
    if(b.useCep) FRAG_faci.comp_updateTile_cepEff(b);
  };


  function comp_drawSelect(b) {
    if(b.useCep) FRAG_faci.comp_drawSelect_cep(b);
  };


  function comp_back(b) {
    return b.closestCore();
  };


  function comp_shouldConsume(b) {
    return b.enabled && b.unloadItem != null;
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


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    back: function(b) {
      return comp_back(b);
    },


    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm);
    },


    // @NOSUPER
    shouldConsume: function(b) {
      return comp_shouldConsume(b);
    },


    updateEfficiencyMultiplier: function(b) {
      comp_updateEfficiencyMultiplier(b);
    },


    // @NOSUPER
    buildConfiguration: function(b, tb) {
      PARENT.buildConfiguration(b, tb);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-dis", "blk-gate"],
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


  TEMPLATE._std_b = function(useCep) {
    return {
      useCep: Object.val(useCep, false),
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
      back() {
        return TEMPLATE.back(this);
      },
      acceptItem(b_f, itm) {
        if(!this.super$acceptItem(b_f, itm)) return false;
        if(!TEMPLATE.acceptItem(this, b_f, itm)) return false;
        return true;
      },
      shouldConsume() {
        return TEMPLATE.shouldConsume(this);
      },
      updateEfficiencyMultiplier() {
        this.super$updateEfficiencyMultiplier();
        TEMPLATE.updateEfficiencyMultiplier(this);
      },
      buildConfiguration(tb) {
        TEMPLATE.buildConfiguration(this, tb);
      },
    };
  };


  module.exports = TEMPLATE;
