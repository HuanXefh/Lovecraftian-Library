/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VARGEN = require("lovec/glb/GLB_varGen");


  const MATH_base = require("lovec/math/MATH_base");


  const FRAG_recipe = require("lovec/frag/FRAG_recipe");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the recipe module for a block.
   * Use this in {CT_BLK_recipeFactory} or something alike.
   * You should NEVER call this after the game is loaded. {require} finds nothing then.
   * ---------------------------------------- */
  const _rcMdl = function(nmMod, nmBlk) {
    let rcMdl;
    try {
      rcMdl = require(nmMod + "/aux/rc/" + nmBlk);
    } catch(err) {
      rcMdl = null;
    };

    return rcMdl;
  };
  exports._rcMdl = _rcMdl;


  /* ----------------------------------------
   * NOTE:
   *
   * Fetches the base object in {rcMdl}.
   * Returns an empty object if errored.
   * ---------------------------------------- */
  const _rcBase = function(rcMdl) {
    if(rcMdl == null) return Object.air;

    return Object.val(rcMdl.rc["base"], Object.air);
  };
  exports._rcBase = _rcBase;


  /* ----------------------------------------
   * NOTE:
   *
   * Fetches a key value in the recipe base.
   * ---------------------------------------- */
  const _rcBaseVal = function(rcMdl, key, def) {
    const rcBase = _rcBase(rcMdl);

    return Object.val(rcBase[key], def);
  };
  exports._rcBaseVal= _rcBaseVal;


  /* ----------------------------------------
   * NOTE:
   *
   * Fetches the recipe array in {rcMdl}.
   * Returns an empty array if errored.
   * ---------------------------------------- */
  const _rcLi = function(rcMdl) {
    if(rcMdl == null) return Array.air;

    return Object.val(rcMdl.rc["recipe"], Array.air);
  };
  exports._rcLi = _rcLi;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the amount of recipe objects.
   * ---------------------------------------- */
  const _rcSize = function(rcMdl) {
    return _rcLi(rcMdl).iCap() / 2;
  };
  exports._rcSize = _rcSize;


  /* ----------------------------------------
   * NOTE:
   *
   * Fetches an recipe object in {rcMdl}, with the header string matching {rcHeader}.
   * Returns {null} if no object is found.
   * ---------------------------------------- */
  const _rcObj = function(rcMdl, rcHeader) {
    return _rcLi(rcMdl).read(rcHeader);
  };
  exports._rcObj = _rcObj;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of headers found in {rcMdl}.
   * ---------------------------------------- */
  const _rcHeaders = function(rcMdl) {
    return _rcLi(rcMdl).readCol(2, 0);
  };
  exports._rcHeaders = _rcHeaders;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of recipe objects found in {rcMdl}.
   * ---------------------------------------- */
  const _rcObjs = function(rcMdl) {
    return _rcLi(rcMdl).readCol(2, 1);
  };
  exports._rcObjs = _rcObjs;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the header exists in {rcMdl}.
   * ---------------------------------------- */
  const _hasHeader = function(rcMdl, rcHeader) {
    var cond = false;
    const rcLi = _rcLi(rcMdl);
    var i = 0;
    var iCap = rcLi.iCap();
    while(i < iCap) {
      let tmpHeader = rcLi[i];
      if(tmpHeader === rcHeader) cond = true;
      i += 2;
    };

    return cond;
  };
  exports._hasHeader = _hasHeader;


  const _firstHeader = function(rcMdl) {
    const rcLi = _rcLi(rcMdl);
    let rcHeader = rcLi[0];

    return Object.val(rcHeader, "");
  };
  exports._firstHeader = _firstHeader;


  /* ----------------------------------------
   * NOTE:
   *
   * Fetches a key value in the matching recipe object.
   * ---------------------------------------- */
  const _rcVal = function(rcMdl, rcHeader, key, def) {
    const rcObj = _rcObj(rcMdl, rcHeader);
    if(rcObj == null) return def;

    return Object.val(rcObj[key], def);
  };
  exports._rcVal = _rcVal;


  const _hasInput = function(rs_gn, rcMdl) {
    var cond = false;
    _rcHeaders(rcMdl).forEach(rcHeader => {
      let ci = _ci(rcMdl, rcHeader);
      let bi = _bi(rcMdl, rcHeader);
      let aux = _aux(rcMdl, rcHeader);
      let opt = _opt(rcMdl, rcHeader);
      if(FRAG_recipe._hasInput(rs_gn, ci, bi, aux, opt)) {
        cond = true;
        return;
      };
    });

    return cond;
  };
  exports._hasInput = _hasInput;


  const _hasOutput = function(rs_gn, rcMdl) {
    var cond = false;
    _rcHeaders(rcMdl).forEach(rcHeader => {
      let co = _co(rcMdl, rcHeader);
      let bo = _bo(rcMdl, rcHeader);
      let fo = _fo(rcMdl, rcHeader);
      if(FRAG_recipe._hasOutput(rs_gn, co, bo, fo)) {
        cond = true;
        return;
      };
    });

    return cond;
  };
  exports._hasOutput = _hasOutput;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there's any item output in the recipe module.
   * ---------------------------------------- */
  const _hasAnyOutput_itm = function(rcMdl) {
    var cond = false;
    _rcHeaders(rcMdl).forEach(rcHeader => {
      let bo = _bo(rcMdl, rcHeader);
      let fo = _fo(rcMdl, rcHeader);
      if(FRAG_recipe._hasOutput_itm(bo, fo)) {
        cond = true;
        return;
      };
    });

    return cond;
  };
  exports._hasAnyOutput_itm = _hasAnyOutput_itm;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there's any fluid output in the recipe module.
   * ---------------------------------------- */
  const _hasAnyOutput_liq = function(rcMdl, includeAux) {
    var cond = false;
    _rcHeaders(rcMdl).forEach(rcHeader => {
      let co = _co(rcMdl, rcHeader);
      let bo = _bo(rcMdl, rcHeader);
      if(FRAG_recipe._hasOutput_liq(includeAux, co, bo)) {
        cond = true;
        return;
      };
    });

    return cond;
  };
  exports._hasAnyOutput_liq = _hasAnyOutput_liq;


  /* <---------- recipe ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the icon string.
   * ---------------------------------------- */
  const _iconNm = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "icon", "null");
  };
  exports._iconNm = _iconNm;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the icon for a recipe.
   * By default it should be the {uiIcon} of a content, use {notContent} to get something else.
   * ---------------------------------------- */
  const _icon = function(rcMdl, rcHeader, notContent) {
    let iconNm = _iconNm(rcMdl, rcHeader);
    if(notContent) return new TextureRegionDrawable(Core.atlas.find(iconNm));

    let ct = MDL_content._ct(iconNm, null, true);
    return ct == null ? Icon.cross : new TextureRegionDrawable(ct.uiIcon);
  };
  exports._icon = _icon;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the category of a recipe.
   * Recipes in the same category will be displayed together.
   * If not set, {"uncategorized"} is used.
   * ---------------------------------------- */
  const _categ = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "category", "uncategorized");
  };
  exports._categ = _categ;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of all found categories in {rcMdl}.
   * {"uncategorized"} will always appear at the end.
   * ---------------------------------------- */
  const _categs = function(rcMdl) {
    const arr = [];
    const rcLi = _rcLi(rcMdl);
    let i = 0;
    let iCap = rcLi.iCap();
    while(i < iCap) {
      let categ = rcLi[i + 1]["category"];
      if(categ != null && !arr.includes(categ)) arr.push(categ);
      i += 2;
    };

    // Make "uncategorized" appear at the last
    if(arr.includes("uncategorized")) {
      arr.pull("uncategorized");
      arr.push("uncategorized");
    };

    return arr;
  };
  exports._categs = _categs;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an object of categories and their recipe headers.
   * ---------------------------------------- */
  const _categHeaderObj = function(rcMdl) {
    const obj = {};
    const rcHeaders = _rcHeaders(rcMdl);
    _categs(rcMdl).forEach(categ => {
      obj[categ] = [];
      rcHeaders.forEach(rcHeader => {
        if(_categ(rcMdl, rcHeader) === categ) obj[categ].push(rcHeader);
      });
    });

    return obj;
  };
  exports._categHeaderObj = _categHeaderObj;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the name of a category from the bundle.
   * Format: {term.common-term-categ-*category name*.name}.
   * ---------------------------------------- */
  const _categB = function(categ) {
    return MDL_bundle._term("common", "categ-" + categ);
  };
  exports._categB = _categB;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the recipe is generated instead of manually set.
   * You shouldn't touch this field.
   * ---------------------------------------- */
  const _isGen = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "isGenerated", false);
  };
  exports._isGen = _isGen;


  /* ----------------------------------------
   * NOTE:
   *
   * A function to check whether the recipe is allowed now.
   * ---------------------------------------- */
  const _validGetter = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "validGetter", Function.airTrue);
  };
  exports._validGetter = _validGetter;


  /* ----------------------------------------
   * NOTE:
   *
   * Contents that is required to be unlocked for the recipe the be available.
   * ---------------------------------------- */
  const _lockedBy = function(rcMdl, rcHeader, toCts) {
    const arr = _rcVal(rcMdl, rcHeader, "lockedBy", Array.air);
    if(!toCts) return arr;

    const cts = [];
    arr.forEach(nmCt => {
      let ct = MDL_content._ct(nmCt, null, true);
      if(ct != null) cts.pushUnique(ct);
    });

    return cts;
  };
  exports._lockedBy = _lockedBy;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the final {validGetter} used in multi-crafters.
   * ---------------------------------------- */
  const _validGetter_fi = function(rcMdl, rcHeader) {
    const validGetter = _validGetter(rcMdl, rcHeader);
    const cts = _lockedBy(rcMdl, rcHeader, true);

    return b => {
      if(!validGetter(b)) return false;
      if(cts.some(ct => !ct.unlockedNow())) return false;

      return true;
    };
  };
  exports._validGetter_fi = _validGetter_fi;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets crafting time scale of the recipe.
   * ---------------------------------------- */
  const _timeScl = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "timeScl", 1.0);
  };
  exports._timeScl = _timeScl;


  /* ----------------------------------------
   * NOTE:
   *
   * Wether the crafter consumes even when full of output.
   * ---------------------------------------- */
  const _ignoreItemFullness = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "ignoreItemFullness", false);
  };
  exports._ignoreItemFullness = _ignoreItemFullness;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the tooltip bundle piece.
   * Can return {null} if not found!
   * ---------------------------------------- */
  const _tt = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "tooltip", null);
  };
  exports._tt = _tt;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the full text for recipe tooltip.
   * ---------------------------------------- */
  const _ttStr = function(rcMdl, rcHeader, valid) {
    if(Vars.headless) return "";

    if(valid) {

      let strCateg = _categB(_categ(rcMdl, rcHeader));

      let ct = MDL_content._ct(_iconNm(rcMdl, rcHeader), null, true);
      let strCt = ct == null ? "-" : ct.localizedName;

      let failP = _failP(rcMdl, rcHeader);
      let strFail = failP < 0.0001 ? null : MDL_text._statText(MDL_bundle._term("lovec", "chance-to-fail"), Number(failP).perc(1));

      let tempReq = _tempReq(rcMdl, rcHeader);
      let strTempReq = tempReq < 0.0001 ? null : MDL_text._statText(MDL_bundle._term("lovec", "temperature-required"), Strings.fixed(tempReq, 2), TP_stat.rs_heatUnits.localized());

      let tempAllowed = _tempAllowed(rcMdl, rcHeader);
      let strTempAllowed = !isFinite(tempAllowed) ? null : MDL_text._statText(MDL_bundle._term("lovec", "temperature-allowed"), Strings.fixed(tempAllowed, 2), TP_stat.rs_heatUnits.localized());

      let durabDecMtp = _durabDecMtp(rcMdl, rcHeader);
      let strDurabDecMtp = MATH_base.fEqual(durabDecMtp, 1.0) ? null : MDL_text._statText(MDL_bundle._term("lovec", "abrasion-multiplier"), Number(durabDecMtp).perc());

      let strIsGen = _isGen(rcMdl, rcHeader) ? MDL_bundle._term("lovec", "generated-recipe") : null;

      let tt = _tt(rcMdl, rcHeader);
      let strTt = tt == null ? null : MDL_bundle._info("common", "tt-" + tt);

      let strStat = "\n"
        + (strIsGen == null ? "" : ("\n" + strIsGen).color(Color.gray))
        + (strFail == null ? "" : ("\n" + strFail))
        + (strTempReq == null ? "" : ("\n" + strTempReq))
        + (strTempAllowed == null ? "" : ("\n" + strTempAllowed))
        + (strDurabDecMtp == null ? "" : ("\n" + strDurabDecMtp))
        + (strTt == null ? "" : ("\n\n" + strTt).color(Color.gray));

      return ("<" + strCateg + ">").color(Pal.accent)
        + "\n" + strCt
        + (strStat === "\n" ? "" : strStat);

    } else {

      let lockedByCts = _lockedBy(rcMdl, rcHeader, true);
      let strLockedBy = null;
      if(lockedByCts.length > 0) {
        strLockedBy = MDL_text._statText(MDL_bundle._term("lovec", "locked"), "");
        lockedByCts.forEach(ct => {
          strLockedBy += ("\n- " + ct.localizedName).color(Pal.remove);
        });
      };

      let strStat = "\n"
        + (strLockedBy == null ? "" : ("\n" + strLockedBy));

      return MDL_bundle._info("lovec", "recipe-unavailable")
        + (strStat === "\n" ? "" : strStat);

    };
  };
  exports._ttStr = _ttStr;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds data to recipe dictionary.
   * Called in {init}.
   * ---------------------------------------- */
  const initRc = function(rcMdl, blkInit) {
    _rcHeaders(rcMdl).forEach(rcHeader => {
      let timeSclInit = _timeScl(rcMdl, rcHeader);
      _ci(rcMdl, rcHeader, blkInit);
      _bi(rcMdl, rcHeader, blkInit, timeSclInit);
      _aux(rcMdl, rcHeader, blkInit);
      _opt(rcMdl, rcHeader, blkInit);
      _co(rcMdl, rcHeader, blkInit);
      let failP = _failP(rcMdl, rcHeader);
      _bo(rcMdl, rcHeader, blkInit, timeSclInit, failP);
      _fo(rcMdl, rcHeader, blkInit, timeSclInit, failP);
    });
  };
  exports.initRc = initRc;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the continuous input list from a recipe object.
   * ---------------------------------------- */
  const _ci = function(rcMdl, rcHeader, blkInit) {
    const arr = [];
    let raw = _rcVal(rcMdl, rcHeader, "ci", Array.air).concat(_rcBaseVal(rcMdl, "baseCi", Array.air));
    let i = 0;
    let iCap = raw.iCap();
    while(i < iCap) {
      let ct = MDL_content._ct(raw[i], "rs");
      if(ct != null) {
        let amt = raw[i + 1];
        arr.push(ct, amt);
        if(blkInit != null) {
          FRAG_recipe.addFldConsTerm(
            blkInit,
            ct,
            amt,
            {"ct": _iconNm(rcMdl, rcHeader)},
          );
        };
      };
      i += 2;
    };

    return arr;
  };
  exports._ci = _ci;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the batch input list from a recipe object.
   * ---------------------------------------- */
  const _bi = function(rcMdl, rcHeader, blkInit, timeSclInit) {
    const arr = [];
    let raw = _rcVal(rcMdl, rcHeader, "bi", Array.air).concat(_rcBaseVal(rcMdl, "baseBi", Array.air));
    let i = 0;
    let iCap = raw.iCap();
    while(i < iCap) {
      let tmp = raw[i];
      if(!(tmp instanceof Array)) {
        let ct = MDL_content._ct(raw[i], "rs");
        if(ct != null) {
          let amt = raw[i + 1];
          let p = raw[i + 2];
          arr.push(ct, amt, p);
          if(blkInit != null) {
            ct instanceof Item ?
              FRAG_recipe.addItmConsTerm(
                blkInit,
                ct,
                amt / Object.val(timeSclInit, 1.0),
                p,
                {"ct": _iconNm(rcMdl, rcHeader)},
              ) :
              FRAG_recipe.addFldConsTerm(
                blkInit,
                ct,
                amt / blkInit.craftTime / Object.val(timeSclInit, 1.0),
                {"ct": _iconNm(rcMdl, rcHeader)},
              );
          };
        };
      } else {
        let tmpArr = [];
        let j = 0;
        let jCap = tmp.iCap();
        while(j < jCap) {
          let ct = MDL_content._ct(tmp[j], "rs");
          if(ct != null) {
            let amt = tmp[j + 1];
            let p = tmp[j + 2];
            tmpArr.push(ct, amt, p);
            if(blkInit != null) {
              ct instanceof Item ?
                FRAG_recipe.addItmConsTerm(
                  blkInit,
                  ct,
                  amt / Object.val(timeSclInit, 1.0),
                  p,
                  {"ct": _iconNm(rcMdl, rcHeader)},
                ) :
                FRAG_recipe.addFldConsTerm(
                  blkInit,
                  ct,
                  amt / blkInit.craftTime / Object.val(timeSclInit, 1.0),
                  {"ct": _iconNm(rcMdl, rcHeader)},
                );
            };
          };
          j += 3;
        };
        if(tmpArr.length > 0) arr.push(tmpArr, -1.0, -1.0);
      };
      i += 3;
    };

    return arr;
  };
  exports._bi = _bi;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the auxilliary list from a recipe object.
   * It's just another CI.
   * ---------------------------------------- */
  const _aux = function(rcMdl, rcHeader, blkInit) {
    const arr = [];
    let raw = _rcVal(rcMdl, rcHeader, "aux", Array.air).concat(_rcBaseVal(rcMdl, "baseAux", Array.air));
    let i = 0;
    let iCap = raw.iCap();
    while(i < iCap) {
      let ct = MDL_content._ct(raw[i], "rs");
      if(ct != null) {
        let amt = raw[i + 1];
        arr.push(ct, amt);
        if(blkInit != null) {
          FRAG_recipe.addFldConsTerm(
            blkInit,
            ct,
            amt,
            {"ct": _iconNm(rcMdl, rcHeader)},
          );
        };
      };
      i += 2;
    };

    return arr;
  };
  exports._aux = _aux;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there should be at least one optional input present for the recipe.
   * ---------------------------------------- */
  const _reqOpt = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "reqOpt", false);
  };
  exports._reqOpt = _reqOpt;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the optional input list from a recipe object.
   * ---------------------------------------- */
  const _opt = function(rcMdl, rcHeader, blkInit, timeSclInit) {
    const arr = [];
    let raw = _rcVal(rcMdl, rcHeader, "opt", Array.air).concat(_rcBaseVal(rcMdl, "baseOpt", Array.air));
    let i = 0;
    let iCap = raw.iCap();
    while(i < iCap) {
      let ct = MDL_content._ct(raw[i], "rs");
      if(ct != null) {
        let amt = raw[i + 1];
        let p = raw[i + 2];
        let mtp = raw[i + 3];
        arr.push(ct, amt, p, mtp);
        if(blkInit != null) {
          FRAG_recipe.addItmConsTerm(
            blkInit,
            ct,
            amt / Object.val(timeSclInit, 1.0),
            p,
            {"ct": _iconNm(rcMdl, rcHeader), "icon": "lovec-icon-optional"},
          );
        };
      };
      i += 4;
    };

    return arr;
  };
  exports._opt = _opt;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the continuous output list from a recipe object.
   * ---------------------------------------- */
  const _co = function(rcMdl, rcHeader, blkInit) {
    const arr = [];
    let raw = _rcVal(rcMdl, rcHeader, "co", Array.air).concat(_rcBaseVal(rcMdl, "baseCo", Array.air));
    let i = 0;
    let iCap = raw.iCap();
    while(i < iCap) {
      let ct = MDL_content._ct(raw[i], "rs");
      if(ct != null) {
        let amt = raw[i + 1];
        arr.push(ct, amt);
        if(blkInit != null) {
          FRAG_recipe.addFldProdTerm(
            blkInit,
            ct,
            amt,
            {"ct": _iconNm(rcMdl, rcHeader)},
          );
        };
      };
      i += 2;
    };

    return arr;
  };
  exports._co = _co;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the batch output list from a recipe object.
   * ---------------------------------------- */
  const _bo = function(rcMdl, rcHeader, blkInit, timeSclInit, failPInit) {
    const arr = [];
    let raw = _rcVal(rcMdl, rcHeader, "bo", Array.air).concat(_rcBaseVal(rcMdl, "baseBo", Array.air));
    let i = 0;
    let iCap = raw.iCap();
    while(i < iCap) {
      let ct = MDL_content._ct(raw[i], "rs");
      if(ct != null) {
        let amt = raw[i + 1];
        let p = raw[i + 2];
        arr.push(ct, amt, p);
        if(blkInit != null) {
          FRAG_recipe.addItmProdTerm(
            blkInit,
            ct,
            amt / Object.val(timeSclInit, 1.0),
            p * (failPInit == null ? 1.0 : (1.0 - failPInit)),
            {"ct": _iconNm(rcMdl, rcHeader)},
          );
        };
      };
      i += 3;
    };

    return arr;
  };
  exports._bo = _bo;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the chance to fail a recipe.
   * Hmmmmm... it's kinda overcooked.
   * ---------------------------------------- */
  const _failP = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "failP", 0.0);
  };
  exports._failP = _failP;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the failure output list from a recipe object.
   * ---------------------------------------- */
  const _fo = function(rcMdl, rcHeader, blkInit, timeSclInit, failPInit) {
    const arr = [];
    let raw = _rcVal(rcMdl, rcHeader, "fo", Array.air).concat(_rcBaseVal(rcMdl, "baseFo", Array.air));
    let i = 0;
    let iCap = raw.iCap();
    while(i < iCap) {
      let ct = MDL_content._ct(raw[i], "rs");
      if(ct != null) {
        let amt = raw[i + 1];
        let p = raw[i + 2];
        arr.push(ct, amt, p);
        if(blkInit != null) {
          FRAG_recipe.addItmProdTerm(
            blkInit,
            ct,
            amt / Object.val(timeSclInit, 1.0),
            p * (failPInit == null ? 0.0 : failPInit),
            {"ct": _iconNm(rcMdl, rcHeader)},
          );
        };
      };
      i += 3;
    };

    return arr;
  };
  exports._fo = _fo;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the script called whenever the building updates.
   * ---------------------------------------- */
  const _updateScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "updateScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseUpdateScr", Function.air)(b);
    };
  };
  exports._updateScr = _updateScr;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the script called every frame when the building is running.
   * ---------------------------------------- */
  const _runScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "runScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseRunScr", Function.air)(b);
    };
  };
  exports._runScr = _runScr;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the script called when the building finishes crafting.
   * ---------------------------------------- */
  const _craftScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "craftScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseCraftScr", Function.air)(b);
    };
  };
  exports._craftScr = _craftScr;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the script called when the building is no longer running.
   * Won't be called if the building has never been active.
   * ---------------------------------------- */
  const _stopScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "stopScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseStopScr", Function.air)(b);
    };
  };
  exports._stopScr = _stopScr;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a 4-tuple of recipe scripts for storage.
   * ---------------------------------------- */
  const _scrTup = function(rcMdl, rcHeader) {
    return [
      _updateScr(rcMdl, rcHeader),
      _runScr(rcMdl, rcHeader),
      _craftScr(rcMdl, rcHeader),
      _stopScr(rcMdl, rcHeader),
    ];
  };
  exports._scrTup = _scrTup;


  /* <---------- specific ----------> */


  /* BLK_furnaceFactory */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the temperature required for a recipe.
   * ---------------------------------------- */
  const _tempReq = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "tempReq", 0.0);
  };
  exports._tempReq = _tempReq;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the temperature allowed for a recipe, beyond which failure occurs more frequently.
   * ---------------------------------------- */
  const _tempAllowed = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "tempAllowed", Infinity);
  };
  exports._tempAllowed = _tempAllowed;


  /* BLK_durabilityFactory */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the multiplier on durability decrease rate.
   * ---------------------------------------- */
  const _durabDecMtp = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "durabDecMtp", 1.0);
  };
  exports._durabDecMtp = _durabDecMtp;


  /* <---------- generator ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Generates a recipe header.
   * ---------------------------------------- */
  const genRcHeader = function(nmCt, categ) {
    return categ.toUpperCase() + ": <" + nmCt + ">";
  };
  exports.genRcHeader = genRcHeader;


  /* ----------------------------------------
   * NOTE:
   *
   * Used in recipe generator, adds recipe to the recipe object.
   * Recipe generators should be called on client load.
   * ---------------------------------------- */
  const addRc = function(rc, nmCt, categ, objF, ci, bi, aux, reqOpt, opt, co, bo, failP, fo) {
    let rcObj = {
      "icon": nmCt,
      "category": categ,
      "isGenerated": true,
    };

    if(ci != null) rcObj["ci"] = ci;
    if(bi != null) rcObj["bi"] = bi;
    if(aux != null) rcObj["aux"] = aux;
    if(reqOpt != null) rcObj["reqOpt"] = reqOpt;
    if(opt != null) rcObj["opt"] = opt;
    if(co != null) rcObj["co"] = co;
    if(bo != null) rcObj["bo"] = bo;
    if(failP != null) rcObj["failP"] = failP;
    if(fo != null) rcObj["fo"] = fo;

    if(objF != null) objF(rcObj);

    rc["recipe"].push(genRcHeader(nmCt, categ), rcObj);
  };
  exports.addRc = addRc;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: rock crusher.
   * Converts ore items into chunks.
   * ---------------------------------------- */
  const _gen_rockCrusher = function(rc, objF, amtI, pI, amtO, pO, minHardness, maxHardness, abrasionFactor, boolF) {
    if(amtI == null) amtI = 1;
    if(pI == null) pI = 1.0;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(minHardness == null) minHardness = 0;
    if(maxHardness == null) maxHardness = Infinity;
    if(abrasionFactor == null) abrasionFactor = 1.0;
    if(boolF == null) boolF = (itm, itmParent) => true;

    VARGEN.intmds["rs-chunks"].forEach(itm => {
      let itmParent = itm.ex_getParent();
      let hardness = itmParent.hardness;
      if(hardness > minHardness && hardness < maxHardness && boolF(itm, itmParent)) {
        addRc(rc, itm.name, "rock-crushing", obj => {
          if(objF != null) objF(obj);
          obj["durabDecMtp"] = Mathf.lerp(1.0, 2.0 * abrasionFactor, Math.max(hardness - minHardness, 0) / 10.0);
        }, null, [itmParent.name, amtI, pI], null, null, null, null, [itm.name, amtO, pO], null, null);
      };
    });
  };
  exports._gen_rockCrusher = _gen_rockCrusher;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: pulverizer.
   * Converts ore items into dust.
   * ---------------------------------------- */
  const _gen_pulverizer = function(rc, objF, amtI, pI, amtO, pO, minHardness, maxHardness, abrasionFactor, boolF) {
    if(amtI == null) amtI = 1;
    if(pI == null) pI = 1.0;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(minHardness == null) minHardness = 0;
    if(maxHardness == null) maxHardness = Infinity;
    if(abrasionFactor == null) abrasionFactor = 1.0;
    if(boolF == null) boolF = (itm, itmParent) => true;

    VARGEN.intmds["rs-dust"].forEach(itm => {
      let itmParent = itm.ex_getParent();
      let hardness = itmParent.hardness;
      if(hardness > minHardness && hardness < maxHardness && boolF(itm, itmParent)) {
        addRc(rc, itm.name, "pulverization", obj => {
          if(objF != null) objF(obj);
          obj["durabDecMtp"] = Mathf.lerp(1.0, 1.5 * abrasionFactor, Math.max(hardness - minHardness, 0) / 10.0);
        }, null, [itmParent.name, amtI, pI], null, null, null, null, [itm.name, amtO, pO], null, null);
      };
    });
  };
  exports._gen_pulverizer = _gen_pulverizer;
