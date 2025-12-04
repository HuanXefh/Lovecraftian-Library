/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles impact wave creation.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const TRIGGER = require("lovec/glb/BOX_trigger");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk_impactR, blk.impactRad / Vars.tilesize, StatUnit.blocks);
  };


  function comp_drawPlace(blk, tx, ty, rot) {
    MDL_draw._d_pulseCircle(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.impactRad);
  };


  function comp_ex_getImpactDmg(blk) {
    return FRAG_attack._impactDmg(blk.size, blk.ex_getImpactIntv());
  };


  function comp_ex_getImpactDur(blk) {
    return FRAG_attack._impactDur(blk.ex_getImpactIntv());
  };


  function comp_ex_getImpactMinRad(blk) {
    return FRAG_attack._impactMinRad(blk.size);
  };


  function comp_drawSelect(b) {
    MDL_draw._d_pulseCircle(b.x, b.y, b.block.ex_getImpactRad());
  };


  function comp_createImpactWave(b) {
    TRIGGER.impactWave.fire(b.x, b.y, b.block.ex_getImpactDmg(), b.block.ex_getImpactRad());
    FRAG_attack._a_impact(
      b.x, b.y,
      b.block.ex_getImpactDmg(),
      b.block.ex_getImpactDur(),
      b.block.ex_getImpactRad(),
      b.block.ex_getImpactMinRad(),
      b.block.ex_getImpactShake(),
    );
    MDL_effect.showAt_dust(b.x, b.y, FRAG_attack._impactDustRad(b.block.size), Math.pow(b.block.size, 2));
    MDL_effect.showAt_colorDust(b.x, b.y, FRAG_attack._impactDustRad(b.block.size) * 1.5, b.tile);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Impact wave radius.
        impactRad: 40.0,
      }),
      __GETTER_SETTER__: () => [
        "impactRad",
      ],


      setStats: function() {
        comp_setStats(this);
      },


      drawPlace: function(tx, ty, rot) {
        comp_drawPlace(this, tx, ty, rot);
      },


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Returns expected interval between each impact wave.
       * This affects things like impact damage by default.
       * ---------------------------------------- */
      ex_getImpactIntv: function() {
        return 60.0;
      }
      .setProp({
        noSuper: true,
      }),


      ex_getImpactDmg: function() {
        return comp_ex_getImpactDmg(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getImpactDur: function() {
        return comp_ex_getImpactDur(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getImpactMinRad: function() {
        return comp_ex_getImpactMinRad(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getImpactShake: function() {
        return 1.0;
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    new CLS_interface({


      drawSelect: function() {
        comp_drawSelect(this);
      },


      /* ----------------------------------------
       * NOTE:
       *
       * Use this method to create a impact wave.
       * ---------------------------------------- */
      ex_createImpactWave: function() {
        comp_createImpactWave(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
