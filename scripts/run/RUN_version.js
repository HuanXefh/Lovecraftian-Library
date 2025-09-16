/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  // NOTE: Nope, this should be completely independent.


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Checks if dependencies are all found and not outdated.
   * Returns {true} if not met, and shows error message on client load.
   * Expected to be called on top of everything in main.js.
   * You should code what will happen next.
   *
   * {minVerMap} is a 2-array of {nmDepend} and {minVer}.
   * {nmDepend} is the name of a dependency.
   * {minVer} is the version of a dependency, it should be a number. And the mod version should be a number in format.
   * Example line:
   * "lovec", 101,
   * ---------------------------------------- */
  const checkVersion = function(nmMod, minVerMap) {
    var str = "[gray]Unmet dependency for [accent]" + nmMod + "[]!\n";
    str += "\n----------------------------------------------------";
    var cond = false;

    var iCap = minVerMap.length;
    if(iCap === 0) return;
    let nmDepend, minVer, ver, mod;
    for(let i = 0; i < iCap; i += 2) {
      nmDepend = minVerMap[i];
      minVer = minVerMap[i + 1];
      ver = -1.0;
      mod = Vars.mods.locateMod(nmDepend);
      if(mod != null) {
        ver = Number(mod.meta.version);
        if(isNaN(ver)) ver = 0.0;
      };
      if(ver >= minVer) continue;
      cond = true;
      str += "\n" + nmDepend + "        " + minVer + "        " + (ver < 0.0 ? "!NOTFOUND" : "!OUTDATED");
    };
    str += "\n----------------------------------------------------";
    str += "\n[]";

    if(cond) {
      Events.run(ClientLoadEvent, () => Vars.ui.showErrorMessage(str));
    };

    return cond;
  };
  exports.checkVersion = checkVersion;
