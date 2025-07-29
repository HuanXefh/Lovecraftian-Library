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
   * "Mindustry/saves/mods".
   * ---------------------------------------- */
  const mod = (function() {
    return MDL_util._loadedMod("lovec").root.parent();
  })();
  exports.mod = mod;


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/saves".
   * ---------------------------------------- */
  const save = mod.parent();
  exports.save = save;


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/saves/maps".
   * ---------------------------------------- */
  const map = mod.sibling("maps");
  exports.map = map;


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/saves/saves".
   * ---------------------------------------- */
  const gameSave = mod.sibling("saves");
  exports.gameSave = gameSave;


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/saves/schematics".
   * ---------------------------------------- */
  const schematic = mod.sibling("schematics");
  exports.schematic = schematic;


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
   * Returns the "content" folder of a mod.
   * ---------------------------------------- */
  const _content = function(nmMod) {
    let dirRt = _root(nmMod);
    if(dirRt == null) return null;
    let dirCt = dirRt.child("content");

    return !dirCt.exists() ? null : dirCt;
  };
  exports._content = _content;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the "content/xxx" folder of a mod according to {ctType}.
   * ---------------------------------------- */
  const _subContent = function(nmMod, ctType) {
    if(ctType == null) return null;

    let dirCt = _content(nmMod);
    if(dirCt == null) return null;

    var str = ctType.name().toLowerCase(java.util.Locale.ROOT);
    let dirSubCt = dirCt.child(str + (str.endsWith("s") ? "" : "s"));

    return !dirSubCt.exists() ? null : dirSubCt;
  };
  exports._subContent = _subContent;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the "scripts" folder of a mod.
   * ---------------------------------------- */
  const _script = function(nmMod) {
    let dirRt = _root(nmMod);
    if(dirRt == null) return null;
    let dirScr = dirRt.child("scripts");

    return !dirScr.exists() ? null : dirScr;
  };
  exports._script = _script;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the "sprites" folder of a mod.
   * ---------------------------------------- */
  const _sprite = function(nmMod) {
    let dirRt = _root(nmMod);
    if(dirRt == null) return null;
    let dirSpr = dirRt.child("sprites");

    return !dirSpr.exists() ? null : dirSpr;
  };
  exports._sprite = _sprite;


  /* <---------- file ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a directory or file using relative path.
   * By default uses "Mindustry/saves" as the root directory.
   * ---------------------------------------- */
  const _fi = function(dirCur, path, writeMode) {
    const thisFun = _fi;

    if(dirCur == null) dirCur = save;
    if(path == null) path = "";

    var path_fi = path;
    if(!path.endsWith("/")) path_fi += "/";
    thisFun.funArr.clear();

    let tmp = "";
    let i = 0;
    let iCap = path_fi.iCap();
    while(i < iCap) {
      let l = path_fi[i];
      if(l === "." && tmp === "") {
        thisFun.funArr.push(".");
      } else if(l === "/") {
        thisFun.funArr.push(String(tmp));
        tmp = "";
      } else {
        tmp += l;
      };
      i++;
    };

    let dir = dirCur;
    thisFun.funArr.forEachFast(nm => {
      dir = nm === "." ?
        dir.parent() :
        dir.child(nm);
    });

    return writeMode ? dir : (!dir.exists() ? null : dir);
  }
  .setProp({
    "funArr": [],
  });
  exports._fi = _fi;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the string in a text file.
   * ---------------------------------------- */
  const _txt = function(fi) {
    if(fi == null || fi.extension() !== "txt") return "";

    return fi.readString();
  };
  exports._txt = _txt;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes {str} in a text file.
   * ---------------------------------------- */
  const __txt = function(fi, str, shouldAppend) {
    if(fi == null || fi.extension() !== "txt" || str == null) return;

    fi.writeString(str, Boolean(shouldAppend));
  };
  exports.__txt = __txt;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the json or hjson file of a content.
   * ---------------------------------------- */
  const _json_ct = function(nmMod, ctType, ct_gn) {
    if(nmMod == null || ctType == null || ct_gn == null) return null;

    let dirSubCt = _subContent(nmMod, ctType);
    if(dirSubCt == null) return null;

    var nmCt = ct_gn instanceof UnlockableContent ? String(ct_gn.name).replace(nmMod + "-", "") : ct_gn;
    let fiSeq = dirSubCt.findAll(fi => (fi.name() === nmCt + ".json") || (fi.name() === nmCt + ".hjson"));

    return fiSeq.size === 0 ? null : fiSeq.get(0);
  };
  exports._json_ct = _json_ct;
