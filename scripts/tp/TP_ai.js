/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new unit AIs.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_ai = require("lovec/mdl/MDL_ai");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- attack ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Only targets missiles in range.
   * ---------------------------------------- */
  newAi(
    "missile-interceptor",
    (paramObj) => extend(MissileAI, {


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


    }),
  );


  /* <---------- support ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Mines selected item and offload it into {dockB}.
   * ---------------------------------------- */
  newAi(
    "drone-miner",
    (paramObj) => extend(AIController, {


      dockB: null,
      oreT: null,
      isMining: false,
      timerFind: new Interval(1),


      updateMovement() {
        if(this.dockB == null || this.dockB.efficiency < 0.9) return;

        MDL_ai.comp_updateMovement_mine(this, this.unit, this.dockB, this.dockB.ex_accRsTg("read"), this.dockB.block.ex_getBlkR() * Vars.tilesize);
      },


      ex_accDockB(param) {
        return param === "read" ? this.dockB : (this.dockB = param);
      },


    }),
  );
