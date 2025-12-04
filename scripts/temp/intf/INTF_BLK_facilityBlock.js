/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods that most factories and generators should have.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const TRIGGER = require("lovec/glb/BOX_trigger");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  const comp_updateTile = function thisFun(b) {
    if(b.block.ex_getSkipFacilityMethod()) return;

    let liqCur = b.liquids == null ? null : b.liquids.current();

    // Cap the abstract liquids
    if(b.liquids != null && TIMER.sec) {
      b.liquids.each(liq => {
        if(!MDL_cond._isAuxilliaryFluid(liq) || MDL_cond._isNoCapAuxilliaryFluid(liq) || b.liquids.get(liq) <= VAR.ct_auxCap) return;
        b.liquids.set(liq, VAR.ct_auxCap);
      });
    };

    // Explode if near fire
    if(
      Vars.state.rules.reactorExplosions && !Vars.net.client()
        && Mathf.chance(0.004)
        && (thisFun.checkExplosiveLiquid(b, liqCur) || thisFun.checkExplosiveItem(b))
        && MDL_pos._tsEdge(b.tile, b.block.size, false, thisFun.tmpTs).some(ot => Fires.get(ot.x, ot.y) != null)
    ) {
      TRIGGER.buildingFireExplosion.fire(b);
      FRAG_attack._a_explosion_global(
        b.x, b.y,
        FRAG_attack._presExploRad(b.block.size),
        FRAG_attack._presExploDmg(b.block.size),
        8.0,
      );
    };

    // TODO: Pressured explosion???
  }
  .setProp({
    tmpTs: [],
    checkExplosiveLiquid: (b, liqCur) => {
      return b.liquids != null && (liqCur.explosiveness >= 0.3 || liqCur.flammability >= 0.3);
    },
    checkExplosiveItem: b => {
      if(b.items == null) return;

      let cond = false;
      b.items.each(itm => {
        if(cond) return;
        cond = itm.explosiveness >= 0.3 && itm.flammability >= 0.3;
      });

      return cond;
    },
  });


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Whether to skip facility block update.
        skipFacilityMethod: false,
      }),
      __GETTER_SETTER__: () => [
        "skipFacilityMethod",
      ],


    }),


    // Building
    new CLS_interface({


      updateTile: function() {
        comp_updateTile(this);
      },


    }),


  ];
