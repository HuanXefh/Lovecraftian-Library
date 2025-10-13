/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Underground liquid deposit.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * OverlayFloor
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


  const PARENT = require("lovec/env/ENV_baseOverlay");
  const PARENT_A = require("lovec/env/ENV_depthOre");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- auxilliary ----------> */


  const dynaAttrMap = DB_item.db["map"]["attr"]["dpliq"];


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.needsSurface = false;
    blk.overlayAlpha = 0.5;
    blk.useColor = false;

    blk.rsDrop = MDL_attr._dynaAttrRs(dynaAttrMap, blk);
    if(blk.rsDrop != null) MDL_content.rename(
      blk,
      blk.rsDrop.localizedName + MDL_text._space() + "(" + MDL_bundle._term("lovec", "depth-liquid") + ")",
    );

    FRAG_faci.comp_init_depthOre(blk);
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
    },


    // @NOSUPER
    drawBase: function(blk, t) {
      PARENT_A.drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    // @NOSUPER
    getDisplayIcon: function(blk, t) {
      return PARENT_A.getDisplayIcon(blk, t);
    },


    // @NOSUPER
    getDisplayName: function(blk, t) {
      return PARENT_A.getDisplayName(blk, t);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-env", "blk-dpliq"],
    }),


    // @NOSUPER
    ex_setRevealed: function(blk, t, bool) {
      PARENT_A.ex_setRevealed(blk, t, bool);
    },


    // @NOSUPER
    ex_getRsDrop: function(blk) {
      return blk.rsDrop;
    },


  };


  TEMPLATE._std = function() {
    return {
      drawnMap: new ObjectMap(),
      rsDrop: null,
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      drawBase(t) {
        TEMPLATE.drawBase(this, t);
      },
      getDisplayIcon(t) {
        return TEMPLATE.getDisplayIcon(this, t);
      },
      getDisplayName(t) {
        return TEMPLATE.getDisplayName(this, t);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_setRevealed(t, bool) {
        TEMPLATE.ex_setRevealed(this, t, bool);
      },
      ex_getRsDrop() {
        return TEMPLATE.ex_getRsDrop(this);
      },
    };
  };


  module.exports = TEMPLATE;
