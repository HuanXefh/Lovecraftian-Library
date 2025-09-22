/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  const MDL_ai = require("lovec/mdl/MDL_ai");
  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- auxiliay ----------> */


  const regisAiSetter = function(nm, aiSetter) {
    MDL_event._c_onLoad(() => {
      global.lovecUtil.db.aiSetter.push(nm, aiSetter);
    });
  };
  exports.regisAiSetter = regisAiSetter;


  /* <---------- support ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used for a drone miner dock, the unit will mine the selected ore and offload it to the building.
   * {dockB} should be set after the unit is spawned.
   * ---------------------------------------- */
  const _droneMiner = function() {
    return extend(AIController, {


      timerFind: new Interval(1), isMining: false, oreT: null,
      dockB: null,


      updateMovement() {
        if(this.dockB == null || this.dockB.efficiency < 0.9) return;

        MDL_ai.comp_updateMovement_mine(this, this.unit, this.dockB, this.dockB.ex_accRsTg("read"), this.dockB.block.ex_getMineR() * Vars.tilesize);
      },


      ex_accDockB(param) {
        return param === "read" ? this.dockB : (this.dockB = param);
      },


    });
  }
  .setAnno(ANNO.__INIT__, null, function() {
    regisAiSetter("drone-miner", this);
  });
  exports._droneMiner = _droneMiner;
