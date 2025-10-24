/* ----------------------------------------
 * NOTE:
 *
 * A collection of components (as interface) used in some class.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_objectBox = require("lovec/cls/struct/CLS_objectBox");
const CLS_interface = require("lovec/cls/struct/CLS_interface");


/* <---------- meta ----------> */


const BOX_comp = new CLS_objectBox({


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: ins.time, ins.lifetime, ins.isDead
   * The instance will die finally.
   * ---------------------------------------- */
  timedComp: new CLS_interface({


    /* ----------------------------------------
     * NOTE:
     *
     * Gets current time in frames.
     * ---------------------------------------- */
    getTime() {
      return this.time;
    },


    /* ----------------------------------------
     * NOTE:
     *
     * Gets lifetime in frames.
     * ---------------------------------------- */
    getLifetime() {
      return this.lifetime;
    },


    /* ----------------------------------------
     * NOTE:
     *
     * Gets fraction of lifetime.
     * ---------------------------------------- */
    fin() {
      return Mathf.clamp(this.time / this.lifetime);
    },


    /* ----------------------------------------
     * NOTE:
     *
     * Gets fraction of remaining time.
     * ---------------------------------------- */
    fout() {
      return 1.0 - Mathf.clamp(this.time / this.lifetime);
    },


    /* ----------------------------------------
     * NOTE:
     *
     * Update time of the instance, should be called in {update}.
     * ---------------------------------------- */
    updateLife(mtp) {
      if(this.isDead) return;

      this.time = Math.min(this.time + Time.delta * tryVal(mtp, 1.0), this.lifetime);
      if(this.time >= this.lifetime) {
        this.isDead = true;
        this.onTimedDeath();
      };
    },


    /* ----------------------------------------
     * NOTE:
     *
     * @LATER
     * Called when the instance is dead.
     * ---------------------------------------- */
    onTimedDeath() {

    },


    /* ----------------------------------------
     * NOTE:
     *
     * Resets the time of an instance.
     * ---------------------------------------- */
    resetLife(frac) {
      frac == null || typeof frac !== "number" ?
        this.time = 0.0 :
        this.time = this.lifetime * Mathf.clamp(frac);
      // Aha it's alive again
      if(frac < 1.0) this.isDead = true;
    },


  }),


});


module.exports = BOX_comp;
