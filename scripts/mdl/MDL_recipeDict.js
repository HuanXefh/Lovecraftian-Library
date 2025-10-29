/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_block = require("lovec/db/DB_block");
  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  const rcDictCons = {};
  const rcDictProd = {};


  /* ----------------------------------------
   * NOTE:
   *
   * Possible fields for {data} used in terms:
   * icon: str    // @PARAM: Arbitrary texture region used.
   * ct: str    // @PARAM: Content button used.
   * time: f    // @PARAM: Craft time used.
   * ---------------------------------------- */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds an item consumption term to recipe dictionary.
   * ---------------------------------------- */
  const addItmConsTerm = function(blk_gn, itm_gn, amt, p, data) {
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;
    if(amt == null) amt = 0;
    if(amt < 1) return;
    if(p == null) p = 1.0;
    if(p < 0.0001) return;

    rcDictCons["item"][itm.id].push(
      blk,
      amt * p,
      tryVal(data, Object.air),
    );
  }
  .setAnno(ANNO.__ARGTYPE__, [[
    null, null, "number", "number", null,
  ]]);
  exports.addItmConsTerm = addItmConsTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a fluid consumption term to recipe dictionary.
   * ---------------------------------------- */
  const addFldConsTerm = function(blk_gn, liq_gn, amt, data) {
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return;
    if(amt == null) amt = 0.0;
    if(amt < 0.0001) return;

    rcDictCons["fluid"][liq.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  }
  .setAnno(ANNO.__ARGTYPE__, [[
    null, null, "number", null,
  ]]);
  exports.addFldConsTerm = addFldConsTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds an item production term to recipe dictionary.
   * ---------------------------------------- */
  const addItmProdTerm = function(blk_gn, itm_gn, amt, p, data) {
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;
    if(amt == null) amt = 0;
    if(amt < 1) return;
    if(p == null) p = 1.0;
    if(p < 0.0001) return;

    rcDictProd["item"][itm.id].push(
      blk,
      amt * p,
      tryVal(data, Object.air),
    );
  }
  .setAnno(ANNO.__ARGTYPE__, [[
    null, null, "number", "number", null,
  ]]);
  exports.addItmProdTerm = addItmProdTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a fluid production term to recipe dictionary.
   * ---------------------------------------- */
  const addFldProdTerm = function(blk_gn, liq_gn, amt, data) {
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return;
    if(amt == null) amt = 0.0;
    if(amt < 0.0001) return;

    rcDictProd["fluid"][liq.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  }
  .setAnno(ANNO.__ARGTYPE__, [[
    null, null, "number", null,
  ]]);
  exports.addFldProdTerm = addFldProdTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets consumption amount of {rs_gn} by {blk_gn}.
   * ---------------------------------------- */
  const _consAmt = function(rs_gn, blk_gn) {
    var val = 0.0;
    let rs = MDL_content._ct(rs_gn, "rs");
    let blk = MDL_content._ct(blk_gn, "blk");
    if(rs == null || blk == null) return val;

    const arr = rcDictCons[rs instanceof Item ? "item" : "fluid"][rs.id];
    let i = 0;
    let iCap = arr.iCap();
    while(i < iCap) {
      if(arr[i] === blk) val = Math.max(arr[i + 1], val);
      i += 3;
    };

    return val;
  };
  exports._consAmt = _consAmt;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets production amount of {rs_gn} by {blk_gn}.
   * ---------------------------------------- */
  const _prodAmt = function(rs_gn, blk_gn) {
    var val = 0.0;
    let rs = MDL_content._ct(rs_gn, "rs");
    let blk = MDL_content._ct(blk_gn, "blk");
    if(rs == null || blk == null) return val;

    const arr = rcDictProd[rs instanceof Item ? "item" : "fluid"][rs.id];
    let i = 0;
    let iCap = arr.iCap();
    while(i < iCap) {
      if(arr[i] === blk) val = Math.max(arr[i + 1], val);
      i += 3;
    };

    return val;
  };
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

    const arr1 = rcDictCons[rs instanceof Item ? "item" : "fluid"][rs.id];
    let i = 0;
    let iCap = arr1.iCap();
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
  };
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

    const arr1 = rcDictProd[rs instanceof Item ? "item" : "fluid"][rs.id];
    let i = 0;
    let iCap = arr1.iCap();
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
  };
  exports._producers = _producers;


/*
  ========================================
  Section: application
  ========================================
*/


  MDL_event._c_onLoad(() => {


    // Initialize
    rcDictCons["item"] = {};
    rcDictCons["fluid"] = {};
    rcDictProd["item"] = {};
    rcDictProd["fluid"] = {};
    Vars.content.items().each(itm => {
      rcDictCons["item"][itm.id] = [];
      rcDictProd["item"][itm.id] = [];
    });
    Vars.content.liquids().each(liq => {
      rcDictCons["fluid"][liq.id] = [];
      rcDictProd["fluid"][liq.id] = [];
    });


    /* ----------------------------------------
     * NOTE:
     *
     * Reads consumers and output lists of blocks to build the recipe dictionary.
     * Methods used for each block class are defined in {DB_misc.db["recipe"]}.
     * This only works for java mods, since js mods don't create classes.
     * ----------------------------------------
     * IMPORTANT:
     *
     * Use {Core.app.post} for methods that modify recipe dictionary, after client load.
     * ---------------------------------------- */
    Core.app.post(() => Vars.content.blocks().each(blk => {

      if(!DB_block.db["group"]["noRcDict"]["cons"].includes(blk.name)) {
        blk.consumers.forEachFast(cons => {
          let arr = DB_misc.db["recipe"]["consumeReader"];
          let dictCaller = null;
          let i = 0;
          let iCap = arr.iCap();
          while(i < iCap) {
            let cls = arr[i];
            if(cons instanceof cls) {
              dictCaller = arr[i + 1];
            };
            i += 2;
          };
          if(dictCaller != null) dictCaller(blk, cons, rcDictCons["item"], rcDictCons["fluid"]);
        });
      };

      if(!DB_block.db["group"]["noRcDict"]["prod"].includes(blk.name)) {
        let arr = DB_misc.db["recipe"]["produceReader"];
        let dictCaller = null;
        let i = 0;
        let iCap = arr.iCap();
        while(i < iCap) {
          let cls = arr[i];
          if(blk instanceof cls) {
            dictCaller = arr[i + 1];
          };
          i += 2;
        };
        if(dictCaller != null) dictCaller(blk, rcDictProd["item"], rcDictProd["fluid"]);
      };

    }));



  }, 49527117);
