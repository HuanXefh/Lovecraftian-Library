/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");
  const SAVE = require("lovec/glb/GLB_save");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the hash value for the current amount of bits.
   * ---------------------------------------- */
  const _bitHash = function(amt) {
    return String(amt + amt % 2 + amt % 3 + amt % 5 + amt % 7 + amt % 11).toHash() % 1000000.0;
  }
  .setAnno(ANNO.__NONCONSOLE__);
  exports._bitHash = _bitHash;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current amount of bits for a team.
   * ---------------------------------------- */
  const _bitAmt = function(team) {
    if(team == null) return 0.0;

    let raw = SAVE.get("bits").read(team.toString(), null);
    let amt = raw == null ? 0.0 : Number(raw);
    let hash = SAVE.get("bit-hash");

    if(_bitHash(amt) === hash) {
      return amt;
    } else {
      Log.warn("[LOVEC] Bit amount does not match the hash value???");
      __bitAmt(team, 0.0);
      return 0.0;
    };

    return raw == null ? 0.0 : Number(raw);
  }
  .setAnno(ANNO.__NONCONSOLE__);
  exports._bitAmt = _bitAmt;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets amount of bits for a team.
   * ---------------------------------------- */
  const __bitAmt = function(team, amt) {
    if(team == null || amt == null) return;
    if(amt < 0.0) amt = 0.0;

    let arr = SAVE.get("bits").slice().write(team.toString(), String(amt));
    let hash = _bitHash(amt);

    if(!Vars.net.client()) {
      SAVE.set("bits", arr);
      SAVE.set("bit-hash", hash);
    } else {
      SAVE.requestSet("bits", arr);
      SAVE.requestSet("bit-hash", hash);
    };

    return amt;
  }
  .setAnno(ANNO.__NONCONSOLE__);
  exports.__bitAmt = __bitAmt;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds or removes some bits for a team.
   * ---------------------------------------- */
  const addBit = function(team, amtTrans) {
    if(team == null || amtTrans == null) return;
    if(amtTrans.fEqual(0.0)) return;

    return __bitAmt(team, _bitAmt(team) + amtTrans);
  }
  .setAnno(ANNO.__NONCONSOLE__);
  exports.addBit = addBit;
