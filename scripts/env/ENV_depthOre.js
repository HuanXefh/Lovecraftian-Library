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
   * KEY:
   *
   * blk.drawnMap: new ObjectMap()
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
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_text = require("lovec/mdl/MDL_text");
  const MDL_texture = require("lovec/mdl/MDL_texture");


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

    MDL_event._c_onWorldLoadStart(() => {
      blk.drawnMap.clear();
    });

    MDL_event._c_onDraw(() => {
      if(!Vars.state.isGame() || (!Vars.state.isEditor() && !PARAM.drawScannerResult)) return;

      blk.drawnMap.each((t, cond) => {
        if(!cond || !MDL_cond._posVisible(t.worldx(), t.worldy(), 8.0)) return;

        Draw.z(VAR.lay_dporeRevealed);
        Draw.alpha(0.65);
        Draw.rect(MDL_texture._regVari(blk, t), t.worldx(), t.worldy());
        Draw.reset();
      });
    });
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


  module.exports = {


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
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-env", "blk-dpore"],
    }),


    // @NOSUPER
    ex_setRevealed: function(blk, t, bool) {
      comp_setRevealed(blk, t, bool);
    },


  };
