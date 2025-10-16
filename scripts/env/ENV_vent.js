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
   *
   * Special values for {nmLiq}:
   * "fire" - Turns the vent into a fire vent.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * SteamVent
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

    if(!blk.liq.equalsAny([
      "fire",
    ])) {
      blk.liq = MDL_content._ct(blk.liq, "rs");
      if(blk.liq != null) {
        blk.effect = TP_effect._ventSmog(null, null, blk.liq, null);
        blk.effectSpacing = 20.0;
        MDL_content.rename(
          blk,
          blk.liq.localizedName + MDL_text._space() + MDL_bundle._term("lovec", "vent") + MDL_text._space() + "(" + blk.parent.localizedName + ")",
        );
      };
    } else {
      switch(blk.liq) {
        case "fire" :
          blk.effect = TP_effect._ventSmog(null, null, "bfbfbf", 0.25);
          blk.effectSpacing = 2.0;
          MDL_content.rename(
            blk,
            MDL_bundle._term("lovec", "fire") + MDL_text._space() + MDL_bundle._term("lovec", "vent") + MDL_text._space() + "(" + blk.parent.localizedName + ")",
          );
          break;
      };
    };


    let ventSize = Math.round(blk.armor);
    if(ventSize > 1 && ventSize < 6) {
      blk.armor = ventSize;
      blk.pons2 = MDL_pos.sizeOffsetPons2[ventSize];
      blk.offDraw = (ventSize % 2 === 0) ? 4.0 : 0.0;
    };
  };


  function comp_setStats(blk) {
    let ventSize = Math.round(blk.armor);
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

      if(blk.liq === "fire" && !Vars.state.isEditor() && Mathf.chance(0.02)) Damage.createIncend(t.worldx() + blk.offDraw, t.worldy() + blk.offDraw, blk.armor * Vars.tilesize * 0.6, 1);
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
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-env", "blk-vent"],
    }),


    // @NOSUPER
    ex_getMatGrp: function(blk) {
      return tryVal(tryFun(blk.parent.ex_getMatGrp, null, blk.parent), "");
    },


    // @NOSUPER
    ex_getRsDrop: function(blk) {
      return blk.liq;
    },


  };


  TEMPLATE._std = function(ventSize, nmLiq) {
    return {
      armor: ventSize == null ? 3 : ventSize, liq: nmLiq,
      pons2: null, offDraw: 0.0,
      randRegs: [], randRegDenom: 80, randRegOffs: [0, 0],
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
      isCenterVent(t) {
        return TEMPLATE.isCenterVent(this, t);
      },
      renderUpdate(renderState) {
        TEMPLATE.renderUpdate(this, renderState);
      },
      checkAdjacent(t) {
        return TEMPLATE.checkAdjacent(this, t);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getMatGrp() {
        return TEMPLATE.ex_getMatGrp(this);
      },
      ex_getRsDrop() {
        return TEMPLATE.ex_getRsDrop(this);
      },
    };
  };


  module.exports = TEMPLATE;
