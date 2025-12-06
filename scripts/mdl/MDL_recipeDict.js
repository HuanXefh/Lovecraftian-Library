/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_block = require("lovec/db/DB_block");
  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  const rcDict = {
    hasInit: false,
    cons: {},
    prod: {},
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Possible fields for {data} used in recipe dictionary terms:
   * icon: str                @PARAM: Arbitrary texture region used.
   * ct: str                @PARAM: Content button used.
   * time: f                @PARAM: Craft time used.
   * ---------------------------------------- */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds an item consumption term to recipe dictionary.
   * ---------------------------------------- */
  const addItmConsTerm = function(blk_gn, itm_gn, amt, p, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.recipeDictionaryNotInitialized();

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;
    if(amt == null) amt = 0;
    if(amt < 1) return;
    if(p == null) p = 1.0;
    if(p < 0.0001) return;

    rcDict.cons.item[itm.id].push(
      blk,
      amt * p,
      tryVal(data, Object.air),
    );
  };
  exports.addItmConsTerm = addItmConsTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a fluid consumption term to recipe dictionary.
   * ---------------------------------------- */
  const addFldConsTerm = function(blk_gn, liq_gn, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.recipeDictionaryNotInitialized();

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return;
    if(amt == null) amt = 0.0;
    if(amt < 0.0001) return;

    rcDict.cons.fluid[liq.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addFldConsTerm = addFldConsTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds an item production term to recipe dictionary.
   * ---------------------------------------- */
  const addItmProdTerm = function(blk_gn, itm_gn, amt, p, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.recipeDictionaryNotInitialized();

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;
    if(amt == null) amt = 0;
    if(amt < 1) return;
    if(p == null) p = 1.0;
    if(p < 0.0001) return;

    rcDict.prod.item[itm.id].push(
      blk,
      amt * p,
      tryVal(data, Object.air),
    );
  };
  exports.addItmProdTerm = addItmProdTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a fluid production term to recipe dictionary.
   * ---------------------------------------- */
  const addFldProdTerm = function(blk_gn, liq_gn, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.recipeDictionaryNotInitialized();

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return;
    if(amt == null) amt = 0.0;
    if(amt < 0.0001) return;

    rcDict.prod.fluid[liq.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addFldProdTerm = addFldProdTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets consumption amount of {rs_gn} by {blk_gn}.
   * ---------------------------------------- */
  const _consAmt = function(rs_gn, blk_gn) {
    let val = 0.0;
    let rs = MDL_content._ct(rs_gn, "rs");
    let blk = MDL_content._ct(blk_gn, "blk");
    if(rs == null || blk == null) return val;

    const arr = rcDict.cons[rs instanceof Item ? "item" : "fluid"][rs.id];
    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      if(arr[i] === blk) val = Math.max(arr[i + 1], val);
      i += 3;
    };

    return val;
  }
  .setCache();
  exports._consAmt = _consAmt;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets production amount of {rs_gn} by {blk_gn}.
   * ---------------------------------------- */
  const _prodAmt = function(rs_gn, blk_gn) {
    let val = 0.0;
    let rs = MDL_content._ct(rs_gn, "rs");
    let blk = MDL_content._ct(blk_gn, "blk");
    if(rs == null || blk == null) return val;

    const arr = rcDict.prod[rs instanceof Item ? "item" : "fluid"][rs.id];
    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      if(arr[i] === blk) val = Math.max(arr[i + 1], val);
      i += 3;
    };

    return val;
  }
  .setCache();
  exports._prodAmt = _prodAmt;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array or 3-array of all blocks that consume the resource.
   * ---------------------------------------- */
  const _consumers = function(rs_gn, appendData) {
    const arr = [];

    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return arr;

    const arr1 = rcDict.cons[rs instanceof Item ? "item" : "fluid"][rs.id];
    let i = 0, iCap = arr1.iCap();
    while(i < iCap) {
      let blk = arr1[i];
      if(!appendData) {
        arr.push(blk);
      } else {
        let amt = arr1[i + 1];
        let data = arr1[i + 2];
        arr.push(blk, amt, data);
      };
      i += 3;
    };

    return arr;
  }
  .setCache();
  exports._consumers = _consumers;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array or 3-array of all blocks that produce the resource.
   * ---------------------------------------- */
  const _producers = function(rs_gn, appendData) {
    const arr = [];

    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return arr;

    const arr1 = rcDict.prod[rs instanceof Item ? "item" : "fluid"][rs.id];
    let i = 0, iCap = arr1.iCap();
    while(i < iCap) {
      let blk = arr1[i];
      if(!appendData) {
        arr.push(blk);
      } else {
        let amt = arr1[i + 1];
        let data = arr1[i + 2];
        arr.push(blk, amt, data);
      };
      i += 3;
    };

    return arr;
  }
  .setCache();
  exports._producers = _producers;


/*
  ========================================
  Section: application
  ========================================
*/


  MDL_event._c_onLoad(() => {


    // Initialize
    rcDict.cons.item = {};
    rcDict.cons.fluid = {};
    rcDict.prod.item = {};
    rcDict.prod.fluid = {};
    Vars.content.items().each(itm => {
      rcDict.cons.item[itm.id] = [];
      rcDict.prod.item[itm.id] = [];
    });
    Vars.content.liquids().each(liq => {
      rcDict.cons.fluid[liq.id] = [];
      rcDict.prod.fluid[liq.id] = [];
    });
    rcDict.hasInit = true;


    /* ----------------------------------------
     * NOTE:
     *
     * Reads consumers and output lists of blocks to build the recipe dictionary.
     * Methods used for each block class are defined in {DB_misc.db["recipe"]}.
     * This only works for java mods, since js mods don't create classes.
     * ----------------------------------------
     * IMPORTANT:
     *
     * Use {Core.app.post} or {Time.run} for methods that modify recipe dictionary, after CLIENT LOAD.
     * ---------------------------------------- */
    Core.app.post(() => Vars.content.blocks().each(blk => {
      let arr, cls, i, iCap;

      if(!DB_block.db["group"]["noRcDict"]["cons"].includes(blk.name)) {
        arr = DB_misc.db["recipe"]["consumeReader"];
        blk.consumers.forEachFast(cons => {
          let dictCaller = null;
          i = 0, iCap = arr.iCap();
          while(i < iCap) {
            cls = arr[i];
            if(cons instanceof cls) {
              dictCaller = arr[i + 1];
            };
            i += 2;
          };
          if(dictCaller != null) dictCaller(blk, cons, rcDict.cons.item, rcDict.cons.fluid);
        });
      };

      if(!DB_block.db["group"]["noRcDict"]["prod"].includes(blk.name)) {
        arr = DB_misc.db["recipe"]["produceReader"];
        let dictCaller = null;
        i = 0, iCap = arr.iCap();
        while(i < iCap) {
          cls = arr[i];
          if(blk instanceof cls) {
            dictCaller = arr[i + 1];
          };
          i += 2;
        };
        if(dictCaller != null) dictCaller(blk, rcDict.prod.item, rcDict.prod.fluid);
      };

    }));



  }, 49527117);
