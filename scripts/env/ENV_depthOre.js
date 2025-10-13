/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Underground ore.
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
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.playerUnmineable = true;

    blk.needsSurface = false;
    blk.overlayAlpha = 0.5;
    blk.useColor = false;

    let itm = blk.itemDrop;
    if(itm != null) MDL_content.rename(
      blk,
      itm.localizedName + MDL_text._space() + "(" + MDL_bundle._term("lovec", "depth-ore") + ")",
    );

    FRAG_faci.comp_init_depthOre(blk);
  };


  function comp_drawBase(blk, t) {
    if(t instanceof EditorTile && !Vars.state.isGame()) {
      blk.super$drawBase(t);
    } else {
      blk.ex_setRevealed(t, t instanceof EditorTile);
    };
  };


  function comp_setRevealed(blk, t, bool) {
    blk.drawnMap.put(t, bool);
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
      comp_drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    // @NOSUPER
    getDisplayIcon: function(blk, t) {
      return VARGEN.iconRegs.questionMark;
    },


    // @NOSUPER
    getDisplayName: function(blk, t) {
      return MDL_bundle._term("lovec", "unknown");
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-env", "blk-dpore"],
    }),


    // @NOSUPER
    ex_setRevealed: function(blk, t, bool) {
      comp_setRevealed(blk, t, bool);
    },


  };


  TEMPLATE._std = function() {
    return {
      drawnMap: new ObjectMap(),
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
    };
  };


  module.exports = TEMPLATE;
