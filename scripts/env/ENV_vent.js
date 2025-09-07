/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Steam vents with customized size.
   * Set {parent} to load parameters from it.
   * Vents should be loaded after the parent floors!
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * SteamVent
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.armor: int    // @PARAM: Used to determine the size of the vent, from 2 to 5 only.
   * blk.liq: liq_gn    // @PARAM, @NULL: Used to set up effects and names, {liq_gn} should be the expected output.
   * blk.pons2: null
   * blk.offDraw: 0.0
   * blk.randRegs: tags    // @PARAM
   * blk.randRegDenom: num    // @PARAM
   * blk.randRegOffs: [int, int]    // @PARAM
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


  const PARENT = require("lovec/env/ENV_materialFloor");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_text = require("lovec/mdl/MDL_text");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  const TP_effect = require("lovec/tp/TP_effect");
  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.blendGroup = blk.parent;
    blk.speedMultiplier = blk.parent.speedMultiplier;
    if(blk.itemDrop == null) {
      blk.itemDrop = blk.parent.itemDrop;
      blk.playerUnmineable = blk.parent.playerUnmineable;
    };

    blk.liq = MDL_content._ct(blk.liq, "rs");
    if(blk.liq != null) {
      blk.effect = TP_effect._ventSmog(null, null, blk.liq, null);
      blk.effectSpacing = 20.0;
      MDL_content.rename(
        blk,
        blk.liq.localizedName + MDL_text._space() + MDL_bundle._term("lovec", "vent") + MDL_text._space() + "(" + blk.parent.localizedName + ")",
      );
    };

    var ventSize = Math.round(blk.armor);
    if(ventSize > 1 && ventSize < 6) {
      blk.armor = ventSize;
      blk.pons2 = MDL_pos.sizeOffsetPons2[ventSize];
      blk.offDraw = (ventSize % 2 === 0) ? 4.0 : 0.0;
    };
  };


  function comp_setStats(blk) {
    var ventSize = Math.round(blk.armor);
    blk.stats.add(TP_stat.blk0env_ventSize, ventSize + "x" + ventSize);
  };


  function comp_drawBase(blk, t) {
    if(!blk.isCenterVent(t)) return;

    let ot;
    blk.pons2.forEachFast(pon2 => {
      ot = t.nearby(pon2);
      if(ot != null) blk.parent.drawBase(ot);
    });

    Draw.z(VAR.lay_vent);
    Draw.rect(MDL_texture._regVari(blk, t), t.worldx() + blk.offDraw, t.worldy() + blk.offDraw);
    Draw.reset();
  };


  function comp_isCenterVent(blk, t) {
    return t != null && blk.checkAdjacent(t);
  };


  function comp_renderUpdate(blk, renderState) {
    let t = renderState.tile;
    if(blk.isCenterVent(t) && t.block() === Blocks.air && ((renderState.data += Time.delta) > blk.effectSpacing - 0.0001)) {
      blk.effect.at(t.worldx() + blk.offDraw, t.worldy() + blk.offDraw);
      renderState.data = 0.0;
    };
  };


  function comp_checkAdjacent(blk, t) {
    if(blk.pons2 == null) return false;

    var cond = true;
    let ot;
    for(let pon2 of blk.pons2) {
      ot = Vars.world.tile(t.x + pon2.x, t.y + pon2.y);
      if(ot == null || ot.floor() !== blk) {
        cond = false;
        break;
      };
    };

    return cond;
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


    // @NOSUPER
    drawBase: function(blk, t) {
      comp_drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    // @NOSUPER
    isCenterVent: function(blk, t) {
      return comp_isCenterVent(blk, t);
    },


    // @NOSUPER
    renderUpdate: function(blk, renderState) {
      comp_renderUpdate(blk, renderState);
    },


    // @NOSUPER
    checkAdjacent: function(blk, t) {
      return comp_checkAdjacent(blk, t);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-env", "blk-vent"],
    }),


    // @NOSUPER
    ex_getMatGrp: function(blk) {
      let matGrp = Function.tryFun(blk.parent.ex_getMatGrp, null, blk.parent);

      return Object.val(matGrp, "");
    },


  };
