/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Blocks that handle fluids. Does not include factories.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * blk.fluidType: str    // @PARAM: Type of fluid the block handles. Possible values: "liq", "gas" and "both".
   * b.liqEnd: null
   * b.tmpFlow: null
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * !NOTHING
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


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    let liqCur = b.liquids.current();
    if(b.liquids.get(liqCur) < 0.0005) b.liquids.reset(liqCur, 0.0);

    FRAG_fluid.comp_updateTile_aux(b);
    FRAG_fluid.comp_updateTile_corrosion(b);
    FRAG_fluid.comp_updateTile_cloggable(b);
    FRAG_fluid.comp_updateTile_fHeat(b);
  };


  function comp_draw(b) {
    FRAG_fluid.comp_draw_fHeat(b);
  };


  function comp_setBars(blk) {
    FRAG_fluid.comp_setBars_fHeat(blk);
  };


  function comp_acceptLiquid(b, b_f, liq) {
    if(MDL_cond._isAux(liq) && !MDL_cond._isAuxBlk(b.block)) return false;
    if((liq.gas && b.block.ex_getFluidType() === "liq") || (!liq.gas && b.block.ex_getFluidType() === "gas")) return false;

    return true;
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
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
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
      comp_draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    setBars: function(blk) {
      comp_setBars(blk);
    },


    /* <---------- build (specific) ----------> */


    acceptLiquid: function(b, b_f, liq) {
      return comp_acceptLiquid(b, b_f, liq);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return [];
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_getFluidType: function(blk) {
      return blk.fluidType;
    },


  };
