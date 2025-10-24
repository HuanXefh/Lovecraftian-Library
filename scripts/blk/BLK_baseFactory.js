/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent for all factories.
   * A factory is a block that processes something to produce something else.
   * An auxiliay factory is a block that only produces auxiliay fluids.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * GenericCrafter
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


  const PARENT = require("lovec/blk/BLK_baseBlock");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.liquidOutputDirections != null) {
      blk.drawArrow = blk.liquidOutputDirections.length === 1 && blk.liquidOutputDirections[0] === -1;
    };
  };


  function comp_setStats(blk) {
    if(DB_block.db["map"]["facFami"].includes(blk.name)) blk.stats.add(TP_stat.spec_facFami, newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_facFami(tb, blk);
    }));
  };


  function comp_updateTile(b) {
    FRAG_fluid.comp_updateTile_capAux(b);
    FRAG_fluid.comp_updateTile_flammable(b);
    FRAG_fluid.comp_updateTile_pressuredBuilding(b);
  };


  function comp_craft(b) {
    MDL_effect.playAt(b.x, b.y, b.craftSound, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
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


    // @NOSUPER
    icons: function(blk) {
      return PARENT.icons(blk);
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
    },


    /* <---------- block (specific) ----------> */


    /* <---------- build (specific) ----------> */


    craft: function(b) {
      comp_craft(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-fac"],
    }),


    /* <---------- build (extended) ----------> */


  };


  TEMPLATE._std = function(craftEff, updateEff, updateEffP) {
    return {
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      icons() {
        return TEMPLATE.icons(this);
      },
      drawPlace(tx, ty, rot, valid) {
        this.super$drawPlace(tx, ty, rot, valid);
        TEMPLATE.drawPlace(this, tx, ty, rot, valid);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      // @SPEC
      craftEffect: tryVal(craftEff, Fx.none), updateEffect: tryVal(updateEff, Fx.none), updateEffectChance: tryVal(updateEffP, 0.02),
    };
  };


  TEMPLATE._std_b = function(craftSe) {
    return {
      craftSound: tryVal(craftSe, Sounds.none),
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
      craft() {
        this.super$craft();
        TEMPLATE.craft(this);
      },
    };
  };


  module.exports = TEMPLATE;
