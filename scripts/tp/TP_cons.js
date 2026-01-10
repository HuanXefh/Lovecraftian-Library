/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new consumers.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TRIGGER = require("lovec/glb/BOX_trigger");
  const VAR = require("lovec/glb/GLB_var");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  /* <---------- special ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A power consumer that releases lightning arcs, used by some metallic conduits.
   * ---------------------------------------- */
  newConsumer(
    "ConsumePowerShortCircuitPipe",
    (paramObj) => extend(ConsumePower, {


      usage: readParam(paramObj, "amt", 0.0),
      dmgMtp: readParam(paramObj, "dmgMtp", 1.0),


      display(stats) {},


      trigger(b) {
        if(b.liquids == null || !tryFun(b.liquids.current().ex_getIsConductive, b.liquids.current(), false)) return;
        if(b.power == null || b.power.status < 0.0001) return;

        TRIGGER.poweredMetalPipe.fire();
        FRAG_attack._a_lightning(b.x, b.y, null, VAR.blk_lightningDmg * b.power.status * this.dmgMtp, null, 6, 4, null, "ground");
      },


      efficiency(b) {
        return 1.0;
      },


    }),
  );
