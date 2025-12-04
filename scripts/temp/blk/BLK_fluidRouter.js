/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla liquid router.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      if(blk.size === 1) {
        blk.solid = false;
        blk.underBullets = true;
      };
    };

    if(blk.fldTp !== "liquid") {
      blk.presExploRad = FRAG_attack._presExploRad(blk.size);
      blk.presExploDmg = FRAG_attack._presExploDmg(blk.size);
    };
  };


  function comp_setStats(blk) {
    if(blk.fldTp !== "liquid") {
      blk.stats.add(TP_stat.blk_canExplode, true);
      blk.stats.add(TP_stat.blk_exploR, blk.presExploRad / Vars.tilesize, StatUnit.blocks);
      blk.stats.add(TP_stat.blk_exploDmg, blk.presExploDmg);
    };
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    if(blk.ex_getFldTp() !== "liquid") {
      MDL_draw._d_diskWarning(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.presExploRad);
    };
  };


  function comp_onDestroyed(b) {
    let liqCur = b.liquids.current();
    if(MDL_cond._isAuxilliaryFluid(liqCur) || (!liqCur.gas && !liqCur.willBoil())) return;
    let frac = b.liquids.get(liqCur) / b.block.liquidCapacity;
    if(frac < 0.01) return;

    FRAG_attack._a_explosion(
      b.x, b.y,
      b.block.ex_getPresExploDmg() * frac,
      b.block.ex_getPresExploRad() * frac,
      12.0 * frac,
    );
  };


  function comp_drawSelect(b) {
    if(b.block.ex_getFldTp() !== "liquid") {
      MDL_draw._d_diskWarning(b.x, b.y, b.block.ex_getPresExploRad());
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(LiquidRouter)
    .setTags("blk-liq", "blk-fcont")
    .setParam({
      presExploRad: 0.0,
      presExploDmg: 0.0,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


    })
    .setGetter("presExploRad", "presExploDmg"),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(LiquidRouter.LiquidRouterBuild)
    .setParam({})
    .setMethod({


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


    }),


  ];
