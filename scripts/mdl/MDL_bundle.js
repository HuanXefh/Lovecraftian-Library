/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  const _base = function(bundleStr) {
    return Vars.headless ? "" : Core.bundle.get(bundleStr.toLowerCase());
  };
  exports._base = _base;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns {Core.bundle.get("info.nmMod-info-bp.name")} by default.
   * Mostly same for other methods here.
   * ---------------------------------------- */
  const _info = function(nmMod, bp, isDes) {
    return Vars.headless ? "" : Core.bundle.get(("info." + nmMod + "-info-" + bp + (isDes ? ".description" : ".name")).toLowerCase());
  };
  exports._info = _info;


  const _term = function(nmMod, bp, isDes) {
    return Vars.headless ? "" : Core.bundle.get(("term." + nmMod + "-term-" + bp + (isDes ? ".description" : ".name")).toLowerCase());
  };
  exports._term = _term;


  const _dial = function(nmMod, bp, isDes) {
    return Vars.headless ? "" : Core.bundle.get(("dial." + nmMod + "-dial-" + bp + (isDes ? ".description" : ".name")).toLowerCase());
  };
  exports._dial = _dial;


  const _stat = function(nmMod, bp) {
    return Vars.headless ? "" : Core.bundle.get(("stat." + nmMod + "-stat-" + bp).toLowerCase());
  };
  exports._stat = _stat;


  /* <---------- drama ----------> */


  const _chara = function(nmMod, nmChara) {
    return Vars.headless ? "" : Core.bundle.get(("chara." + nmMod + "-" + nmChara).toLowerCase());
  };
  exports._chara = _chara;


  const _dialText = function(nmMod, nmDial, ind) {
    return Vars.headless ? "" : Core.bundle.get(("dial." + nmMod + "-" + nmDial + "-" + ind).toLowerCase());
  };
  exports._dialText = _dialText;
