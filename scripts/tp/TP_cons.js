/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- special ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A power consumer that releases lightning arcs, used by some metallic conduits.
   * ---------------------------------------- */
  const _consPow_shortCircuit = function(powCons, dmgMtp) {
    if(powCons == null) powCons = 1.0;
    if(dmgMtp == null) dmgMtp = 1.0;

    return extend(ConsumePower, {


      usage: powCons, capacity: 0.0, buffered: false,


      display(stats) {},


      trigger(b) {
        let effc = b.power.status;
        if(effc < 0.0001) return;
        if(b.liquids == null || !MDL_cond._isConductiveLiq(b.liquids.current())) return;

        FRAG_attack.apply_lightning(b.x, b.y, null, VAR.blk_lightningDmg * effc * dmgMtp, null, 6, 4);
      },


    });
  };
  exports._consPow_shortCircuit = _consPow_shortCircuit;
