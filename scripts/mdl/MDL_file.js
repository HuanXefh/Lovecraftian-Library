/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_util = require("lovec/mdl/MDL_util");


  /* <---------- directory ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the root directory of a mod.
   * ---------------------------------------- */
  const _root = function(nmMod) {
    let mod = MDL_util._loadedMod(nmMod);

    return mod == null ? null : mod.root;
  };
  exports._root = _root;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the "scripts" folder of a mod.
   * ---------------------------------------- */
  const _script = function(nmMod) {
    let dirRt = _root(nmMod);

    return dirRt == null ? null : dirRt.child("scripts");
  };
  exports._script = _script;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the "sprites" folder of a mod.
   * ---------------------------------------- */
  const _sprite = function(nmMod) {
    let dirRt = _root(nmMod);

    return dirRt == null ? null : dirRt.child("sprites");
  };
  exports._sprite = _sprite;
