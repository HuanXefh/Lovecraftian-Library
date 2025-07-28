/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Terrain walls.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * StaticWall
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * flr: flr_gn    // @PARAM, @NULL: The floor block as the parent, set to {null} if absent.
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


  const PARENT = require("lovec/env/ENV_baseProp");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.flr = MDL_content._ct(blk.flr, "blk");
    if(blk.flr != null) {
      if(blk.flr.wall === Blocks.air) blk.flr.wall = blk;
      MDL_content.rename(
        blk,
        blk.flr.localizedName + MDL_text._space() + "(" +  MDL_bundle._term("lovec", "wall") + ")",
      );
    };
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


    drawBase: function(blk, t) {
      PARENT.drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-env"];
    },


  };
