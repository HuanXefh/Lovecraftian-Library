/* ----------------------------------------
 * NOTE:
 *
 * A collection of components (as interface) used in some class.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_interface = require("lovec/cls/struct/CLS_interface");
const CLS_objectBox = require("lovec/cls/struct/CLS_objectBox");


/* <---------- meta ----------> */


const BOX_comp = new CLS_objectBox({


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: ins.time, ins.lifetime, ins.timedDead
   * The instance will die finally.
   * ---------------------------------------- */
  timedComp: new CLS_interface({


    getTime() {
      return this.time;
    },


    getLifetime() {
      return this.lifetime;
    },


    fin() {
      return Mathf.clamp(this.time / this.lifetime);
    },


    fout() {
      return 1.0 - Mathf.clamp(this.time / this.lifetime);
    },


    updateLife(mtp) {
      if(this.timedDead) return;

      this.time = Math.min(this.time + Time.delta * Object.val(mtp, 1.0), this.lifetime);

      if(this.time >= this.lifetime) {
        this.timedDead = true;
        this.onTimedDeath();
      };
    },


    // @LATER
    onTimedDeath() {

    },


    resetLife(frac) {
      frac == null || typeof frac !== "number" ?
        this.time = 0.0 :
        this.time = this.lifetime * Mathf.clamp(frac);

      // Aha it's alive again
      this.timedDead = true;
    },


  }),


});


module.exports = BOX_comp;
