/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_net = require("lovec/mdl/MDL_net");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- setting ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Reads the settings. See {DB_misc}.
   * ---------------------------------------- */
  const _cfg = function(nmCfg, useScl) {
    return DB_misc.db["config"].read(nmCfg, Function.airNull)(useScl);
  };
  exports._cfg = _cfg;


  /* <---------- input ----------> */


  let mouseMoveX = 0.0;
  let mouseMoveY = 0.0;
  let mouseMoveStartX = 0.0;
  let mouseMoveStartY = 0.0;


  /* ----------------------------------------
   * NOTE:
   *
   * Mouse movement velocity in pixels per second.
   * LMB must be pressed.
   * ---------------------------------------- */
  const _mouseVel = function() {
    return Math.sqrt(Math.pow(mouseMoveX, 2) + Math.pow(mouseMoveY, 2));
  };
  exports._mouseVel = _mouseVel;


  /* <---------- mod ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a loaded mod by name.
   * ---------------------------------------- */
  const _loadedMod = function(nmMod) {
    if(nmMod === "vanilla") return null;

    return Vars.mods.locateMod(nmMod);
  };
  exports._loadedMod = _loadedMod;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the latest version (tag) of a repository on GitHub.
   * If errored, the version will be {undefined}.
   * ---------------------------------------- */
  const _latestVer = function(owner, repo, caller) {
    MDL_net._h_obj("https://api.github.com/repos/" + owner + "/" + repo + "/releases/latest", obj => {
      caller(obj.tag_name);
    });
  };
  exports._latestVer = _latestVer;


  /* ----------------------------------------
   * NOTE:
   *
   * Localizes the mod stats.
   * Put {info.modname-info-mod} in your bundle.
   * ---------------------------------------- */
  const localizeModMeta = function(nmMod) {
    let mod = _loadedMod(nmMod);
    if(mod == null) return;

    mod.meta.displayName = MDL_bundle._info(nmMod, "mod");
    mod.meta.description = MDL_bundle._info(nmMod, "mod", true);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.localizeModMeta = localizeModMeta;


  /* ----------------------------------------
   * NOTE:
   *
   * Locks contents from some mod, for testing purpose.
   * If {cts} is given, this only locks mod contents in the array (NOT SEQ).
   * ---------------------------------------- */
  const lockModContents = function(nmMod, cts, isUnlocking) {
    const thisFun = lockModContents;

    if(cts != null) {
      cts.forEachFast(ct => {
        if(thisFun.checkTg(ct, nmMod)) isUnlocking ? ct.unlock() : ct.clearUnlock();
      });
      TechTree.all.each(node => cts.includes(node.content) && thisFun.checkTg(node.content, nmMod), node => node.reset());
    } else {
      thisFun.defSeqs.forEachFast(seq => seq.each(
        ct => thisFun.checkTg(ct, nmMod),
        ct => {isUnlocking ? ct.unlock() : ct.clearUnlock(); Log.info("[LOVEC] Cleared unlock state for " + ct.name.color(Pal.accent) + ".")},
      ));
      TechTree.all.each(node => thisFun.checkTg(node.content, nmMod), node => node.reset());
    };
  }
  .setAnno(ANNO.__DEBUG__)
  .setProp({
    defSeqs: [
      Vars.content.items(),
      Vars.content.liquids(),
      Vars.content.blocks(),
      Vars.content.units(),
      Vars.content.statusEffects(),
      Vars.content.sectors(),
    ],
    checkTg: (ct, nmMod) => ct.minfo.mod != null && ct.minfo.mod.name === nmMod,
  });
  exports.lockModContents = lockModContents;


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onDrag((dx, dy, x_f, y_f) => {
    mouseMoveX = dx;
    mouseMoveY = dy;
    mouseMoveStartX = x_f;
    mouseMoveStartY = y_f;
  }, 42885962);
