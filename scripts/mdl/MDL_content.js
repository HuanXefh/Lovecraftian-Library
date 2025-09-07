/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_test = require("lovec/mdl/MDL_test");


  const DB_block = require("lovec/db/DB_block");
  const DB_item = require("lovec/db/DB_item");
  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a content from generalized content (mostly names).
   * Use {mode} to specify the category, for better performance.
   * This will print a warning to console if content not found, use {suppressWarning} to disable it.
   *
   * Example:
   * _ct("copper");    // Returns vanilla copper item
   * _ct("water");    // Returns vanilla water liquid
   * _ct("shallow-water");    // Returns shallow water floor
   * _ct(Blocks.router);    // Returns router block
   * _ct("router", "rs", true);    // Returns null since there's no item or liquid named router, but warning is suppressed
   *
   * Don't do stupid things like naming something "null".
   * ---------------------------------------- */
  const _ct = function(ct_gn, mode, suppressWarning) {
    if(ct_gn == null || ct_gn === "null") return null;
    if(ct_gn instanceof UnlockableContent) return ct_gn;

    let ct = null;
    if(mode != null) {
      // Try finding content in specific categories
      _ct.funMap.get(mode, Array.air).forEachFast(ctTpStr => {
        if(ct != null) return;
        ct = Vars.content.getByName(ContentType[ctTpStr], ct_gn);
      });
    } else {
      // Try finding content in all categories, can be costy
      if(!suppressWarning) MDL_test._w_costySearch(ct_gn);
      ct = Vars.content.byName(ct_gn);
    };

    if(ct == null && !suppressWarning) MDL_test._w_ctNotFound(ct_gn);

    return ct;
  }
  .setProp({
    "funMap": ObjectMap.of(
      "rs", ["item", "liquid"],
      "blk", ["block"],
      "utp", ["unit"],
      "sta", ["status"],
      "wea", ["weather"],
      "sec", ["sector"],
      "pla", ["planet"],
    ),
  });
  exports._ct = _ct;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this content has name in bundle.
   * ---------------------------------------- */
  const _hasBundle = function(ct_gn) {
    let ct = _ct(ct_gn);
    if(ct == null) return false;

    return Core.bundle.has(ct.contentType.toString() + "." + ct.name + ".name");
  };
  exports._hasBundle = _hasBundle;


  /* ----------------------------------------
   * NOTE:
   *
   * Renames a content on client load.
   * Only called if bundle is not provided.
   * ---------------------------------------- */
  const rename = function(ct_gn, nm) {
    let ct = _ct(ct_gn);
    if(ct == null || _hasBundle(ct)) return;

    MDL_event._c_onLoad(() => {
      ct.localizedName = nm;
    });
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.rename = rename;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the mod that adds the content.
   * Returns name by default.
   * Will return {"vanilla"} or {null} if it's vanilla content.
   * ---------------------------------------- */
  const _mod = function(ct_gn, returnMod) {
    let ct = _ct(ct_gn);
    if(ct == null) return null;

    let mod = ct.minfo.mod;
    return mod == null ? (returnMod ? null : "vanilla") : (returnMod ? mod : mod.name);
  };
  exports._mod = _mod;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the content name without mod name prefix.
   * ---------------------------------------- */
  const _nmCtNoPrefix = function(ct) {
    return ct.name.replace(_mod(ct) + "-", "");
  };
  exports._nmCtNoPrefix = _nmCtNoPrefix;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the content has some tag.
   * ---------------------------------------- */
  const _hasTag = function(ct, tag) {
    if(ct == null) return false;

    return Function.tryFun(ct.ex_getTags, Array.air, ct).includes(tag);
  };
  exports._hasTag = _hasTag;


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: ct, tag1, tag2, tag3, ...
   * Whether the content has any of given tags.
   * ---------------------------------------- */
  const _hasAnyTag = function() {
    if(arguments[0] == null) return false;

    let arr = Array.from(arguments).splice(0, 1);

    return arr.some(tag => Function.tryFun(arguments[0].ex_getTags, Array.air, arguments[0]).includes(tag));
  };
  exports._hasAnyTag = _hasAnyTag;


  /* <---------- resource ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of blocks that is built with the resource.
   * ---------------------------------------- */
  const _reqBlks = function(rs_gn, appendAmt) {
    const arr = [];
    let rs = _ct(rs_gn, "rs");
    if(rs == null || !(rs instanceof Item)) return arr;

    Vars.content.blocks().each(blk => blk.placeablePlayer, blk => {
      blk.requirements.forEach(itmStack => {
        if(itmStack.item === rs && itmStack.amount > 0) !appendAmt ? arr.push(blk) : arr.push(blk, itmStack.amount);
      });
    });

    return arr;
  };
  exports._reqBlks = _reqBlks;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of blocks that drop the resource.
   * ---------------------------------------- */
  const _oreBlks = function(rs_gn) {
    const arr = [];
    let rs = _ct(rs_gn, "rs");
    if(rs == null) return arr;

    let li = Vars.content.blocks();
    if(rs instanceof Item) li.each(blk => {if(blk.itemDrop === rs) arr.push(blk)});
    if(rs instanceof Liquid) li.each(blk => {if(blk.liquidDrop === rs) arr.push(blk)});

    return arr;
  };
  exports._oreBlks = _oreBlks;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns sintering temperature for the resource.
   * This is not only used for sintering.
   * ---------------------------------------- */
  const _sintTemp = function(rs_gn) {
    let rs = _ct(rs_gn, "rs");
    if(rs == null) return 100.0;

    if(_hasTag(rs, "rs-intmd")) rs = rs.ex_getParent();

    return DB_item.db["param"]["sintTemp"].read(rs.name, 100.0);
  };
  exports._sintTemp = _sintTemp;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {_sintTemp} that internally calculates maximum/minimum.
   * ---------------------------------------- */
  const _exSintTemp = function(rss_gn, mode) {
    const thisFun = _exSintTemp;

    if(mode == null) mode = "max";
    if(!mode.equalsAny(thisFun.modes)) return 100.0;

    const temps = [];
    rss_gn.forEach(rs_gn => temps.push(_sintTemp(rs_gn)));

    return (mode === "max" ? Math.max : Math.min).apply(null, temps);
  }
  .setProp({
    "modes": ["max", "min"],
  });
  exports._exSintTemp = _exSintTemp;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of intermediate tags from a resource.
   * Intermediate tags are listed in DB_item.db["intmdTag"].
   * ---------------------------------------- */
  const _intmdTags = function(rs) {
    let tags = Function.tryFun(rs.ex_getTags, null, rs);
    return tags == null ? [] : tags.filter(tag => DB_item.db["intmdTag"].includes(tag));
  };
  exports._intmdTags = _intmdTags;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the intermediate of {rs_gn} with a specific tag.
   * {rs_gn} can be an intermediate, will use its parent instead.
   * ---------------------------------------- */
  const _intmd = function(rs_gn, intmdTag) {
    let rs = _ct(rs_gn, "rs");
    if(rs == null) return null;
    if(rs.ex_getParent != null) rs = rs.ex_getParent();

    let arr = VARGEN.intmds[intmdTag];
    if(arr == null) return null;

    return arr.find(ors => irs.ex_getParent() === rs);
  };
  exports._intmd = _intmd;


  /* <---------- block ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns generalized craft time for the block. See {DB_misc}.
   * ---------------------------------------- */
  const _craftTime = function(blk_gn, isDrillTime) {
    const arr = DB_block.db["class"]["craftTime"];
    var val = Infinity;

    let blk = _ct(blk_gn, "blk");
    if(blk == null) return val;

    let valCaller = null;
    let i = 0;
    let iCap = arr.iCap();
    while(i < iCap) {
      let cls = arr[i];
      if(blk instanceof cls) valCaller = arr[i + 1];
      i += 2;
    };
    if(valCaller != null) val = valCaller(blk, isDrillTime);

    return val;
  };
  exports._craftTime = _craftTime;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns power consumption of {blk_gn}.
   * ---------------------------------------- */
  const _powConsAmt = function(blk_gn) {
    let blk = _ct(blk_gn, "blk");
    if(blk == null || !blk.hasPower) return 0.0;

    let powCons = blk.consumers.find(cons => cons instanceof ConsumePower);

    return powCons == null ? 0.0 : powCons.usage;
  };
  exports._powConsAmt = _powConsAmt;


  /* <---------- faction ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the faction of a block or unit type.
   * Returns {"none"} if not set.
   * ---------------------------------------- */
  const _faction = function(blk0utp_gn) {
    let ct = _ct(blk0utp_gn, null, true);
    if(ct == null) {

      return "none";

    } else if(ct instanceof Block) {

      return DB_block.db["map"]["faction"].read(ct.name, "none");

    } else if(ct instanceof UnitType) {

      return DB_unit.db["map"]["faction"].read(ct.name, "none");

    };

    return "none";
  };
  exports._faction = _faction;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the name for a faction from the bundle.
   * Format: {term.common-term-faction-*faction name*.name}.
   * ---------------------------------------- */
  const _factionB = function(faction) {
    return MDL_bundle._term("common", "faction-" + faction);
  };
  exports._factionB = _factionB;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the color of a faction.
   * Returns white by default.
   * ---------------------------------------- */
  const _factionColor = function(faction) {
    return Color.valueOf(DB_block.db["grpParam"]["factionColor"].read(faction, "ffffff"));
  };
  exports._factionColor = _factionColor;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a list of all blocks and unit types in the faction.
   * ---------------------------------------- */
  const _factionCts = function(faction) {
    const arr = [];
    const li1 = DB_block.db["map"]["faction"];
    const li2 = DB_unit.db["map"]["faction"];
    let i = 0;
    let iCap1 = li1.iCap();
    let iCap2 = li2.iCap();
    while(i < iCap1) {
      if(li1[i + 1] === faction) arr.push(_ct(li1[i], "blk"));
      i += 2;
    };
    i = 0;
    while(i < iCap2) {
      if(li2[i + 1] === faction) arr.push(_ct(li2[i], "utp"));
      i += 2;
    };

    return arr;
  };
  exports._factionCts = _factionCts;


  /* <---------- factory ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of factory families the block is in.
   * ---------------------------------------- */
  const _facFamis = function(blk_gn) {
    let blk = _ct(blk_gn, "blk");
    if(blk == null) return [];

    return DB_block.db["map"]["facFami"].readList(blk.name);
  };
  exports._facFamis = _facFamis;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the name for a factory family from the bundle.
   * Format: {term.common-term-fami-*factory family name*.name}.
   * ---------------------------------------- */
  const _facFamiB = function(facFami) {
    return MDL_bundle._term("common", "fami-" + facFami);
  };
  exports._facFamiB = _facFamiB;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of all defined factory families.
   * ---------------------------------------- */
  const _facFamisDefined = function() {
    return DB_block.db["map"]["facFami"].readCol(2, 1).unique();
  };
  exports._facFamisDefined = _facFamisDefined;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of blocks in the family.
   * ---------------------------------------- */
  const _facFamiBlks = function(facFami) {
    const arr = [];
    const arr1 = DB_block.db["map"]["facFami"];
    let i = 0;
    let iCap = arr1.iCap();
    while(i < iCap) {
      if(arr1[i + 1] === facFami) {
        let blk = _ct(arr1[i], "blk");
        if(blk != null) arr.push(blk);
      };
      i += 2;
    };

    return arr;
  };
  exports._facFamiBlks = _facFamiBlks;
