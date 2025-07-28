/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- text ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a space character or not, based on current locale.
   * ---------------------------------------- */
  const arr_noSpaceLocale = [
    "zh_CN",
    "zh_TW",
    "ja",
    "ko",
  ];
  const _space = function() {
    return arr_noSpaceLocale.includes(Core.settings.getString("locale")) ? "" : " ";
  };
  exports._space = _space;


  /* <---------- format (stat) ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns what you have seen a lot in the database, but in string.
   * Mostly used in {addStats(tb)} in abilities. It kinda sucks to write the format every time.
   *
   * Example:
   * _statText(Stat.range.localized(), 8, StatUnit.blocks.localized());    // Returns {"Range: 8 blocks"} with proper colors
   * ---------------------------------------- */
  const _statText = function(strStat, strVal, strUnit) {
    var str1 = (strStat == null) ? "" : ("[lightgray]" + strStat + ": []");
    var str2 = (strVal == null) ? "" : strVal;
    var str3 = (strUnit == null) ? "" : (" " + strUnit);

    return str1 + str2 + str3;
  };
  exports._statText = _statText;


  /* ----------------------------------------
   * NOTE:
   *
   * Used for multipliers with color.
   * By default, it's red for less than 100%, green for the other case.
   * Use {isRev} to invert that.
   * ---------------------------------------- */
  const _statText_mtp = function(strStat, mtp, isRev) {
    return _statText(
      strStat,
      (mtp < 1.0 ? (isRev ? "[green]" : "[red]") : (isRev ? "[red]" : "[green]")) + Strings.autoFixed(mtp * 100.0, 2) + "%[]",
    );
  };
  exports._statText_mtp = _statText_mtp;


  /* <---------- format ----------> */


  const _dmgText = function(dmg, dmgPerc) {
    var str = Strings.autoFixed(dmg, 2);
    if(dmgPerc != null && dmgPerc > 0.0) str += " + " + Number(dmgPerc).perc().color(Pal.accent);

    return str;
  };
  exports._dmgText = _dmgText;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a list of strings to a tag string.
   *
   * Example:
   * _tagText(["chloric", "fluoric", "oxidative"]);    // Returns {"chloric; fluoric; oxidative; "}
   * ---------------------------------------- */
  const _tagText = function(strs) {
    var str_fi = "";
    strs.forEach(str => str_fi += str + "; ");

    return str_fi === "" ? "!NOTAG" : str_fi;
  };
  exports._tagText = _tagText;
