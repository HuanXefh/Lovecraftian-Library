/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  const MDL_ai = require("lovec/mdl/MDL_ai");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- auxiliay ----------> */


  const regisAiSetter = function(nm, aiSetter) {
    MDL_event._c_onLoad(() => {
      global.lovecUtil.db.aiSetter.push(nm, aiSetter);
    });
  };
  exports.regisAiSetter = regisAiSetter;


  /* <---------- attack ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A missile unit that will only target missiles in range.
   * ---------------------------------------- */
  const _missileInterceptor = function() {
    return extend(MissileAI, {


      updateMovement() {
        this.unloadPayloads();

        let time = this.unit instanceof TimedKillc ? unit.time : 999999.0;
        if(time >= unit.type.homingDelay && this.shooter != null && !this.shooter.dead) {
          this.unit.lookAt(this.shooter.aimX, this.shooter.aimY);
        };

        this.unit.moveAt(Reflect.get(AIController, this, "vec").trns(
          this.unit.rotation,
          this.unit.type.missileAccelTime < 0.0001 ?
            this.unit.speed() :
            Mathf.pow(Math.min(time / unit.type.missileAccelTime, 1.0), 2.0) * unit.speed(),
        ));
      },


      target(x, y, rad, targetAir, targetGround) {
        return MDL_pos._e_tg(x, y, this.unit.team, rad, true, false, e => e.isMissile());
      },


    });
  }
  .setAnno(ANNO.__INIT__, null, function() {
    regisAiSetter("missile-interceptor", this);
  });
  exports._missileInterceptor = _missileInterceptor;


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
