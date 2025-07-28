/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const EFF = require("lovec/glb/GLB_eff");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");
  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");


  const DB_block = require("lovec/db/DB_block");
  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- dictionary ----------> */


  const rcDictCons = {};
  const rcDictProd = {};


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
      Object.val(data, Object.air),
    );
  };
  exports.addItmConsTerm = addItmConsTerm;


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
      Object.val(data, Object.air),
    );
  };
  exports.addFldConsTerm = addFldConsTerm;


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
      Object.val(data, Object.air),
    );
  };
  exports.addItmProdTerm = addItmProdTerm;


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
      Object.val(data, Object.air),
    );
  };
  exports.addFldProdTerm = addFldProdTerm;


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


  /* <---------- condition ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {rs_gn} is an input in the multi-crafter.
   * ---------------------------------------- */
  const _hasInput = function(rs_gn, ci, bi, aux, opt) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return false;
    var cond = false;

    // CI
    var i = 0;
    var iCap = ci.iCap();
    while(i < iCap) {
      let tmp = ci[i];
      if(tmp === rs) cond = true;
      i += 2;
    };

    // BI
    var i = 0;
    var iCap = bi.iCap();
    while(i < iCap) {
      let tmp = bi[i];
      if(tmp === rs) {
        cond = true;
      } else if(tmp instanceof Array) {
        let j = 0;
        let jCap = tmp.iCap();
        while(j < jCap) {
          let tmp1 = tmp[j];
          if(tmp1 === rs) cond = true;
          j += 3;
        };
      };
      i += 3;
    };

    // AUX
    var i = 0;
    var iCap = aux.iCap();
    while(i < iCap) {
      let tmp = aux[i];
      if(tmp === rs) cond = true;
      i += 2;
    };

    // OPT
    var i = 0;
    var iCap = opt.iCap();
    while(i < iCap) {
      let tmp = opt[i];
      if(tmp === rs) cond = true;
      i += 4;
    };

    return cond;
  };
  exports._hasInput = _hasInput;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {rs_gn} is an output in the multi-crafter.
   * ---------------------------------------- */
  const _hasOutput = function(rs_gn, co, bo, fo) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return false;
    var cond = false;

    // CO
    var i = 0;
    var iCap = co.iCap();
    while(i < iCap) {
      let tmp = co[i];
      if(tmp === rs) cond = true;
      i += 2;
    };

    // BO
    var i = 0;
    var iCap = bo.iCap();
    while(i < iCap) {
      let tmp = bo[i];
      if(tmp === rs) cond = true;
      i += 3;
    };

    // FO
    var i = 0;
    var iCap = fo.iCap();
    while(i < iCap) {
      let tmp = fo[i];
      if(tmp === rs) cond = true;
      i += 3;
    };

    return cond;
  };
  exports._hasOutput = _hasOutput;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the multi-crafter has any item output.
   * ---------------------------------------- */
  const _hasOutput_itm = function(bo, fo) {
    var cond = false;

    // BO
    var i = 0;
    var iCap = bo.iCap();
    while(i < iCap) {
      if(bo[i] instanceof Item) cond = true;
      i += 3;
    };

    // FO
    if(fo.length > 0) cond = true;

    return cond;
  };
  exports._hasOutput_itm = _hasOutput_itm;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the multi-crafter has any fluid output.
   * ---------------------------------------- */
  const _hasOutput_liq = function(includeAux, co, bo) {
    var cond = false;

    // CO
    var i = 0;
    var iCap = co.iCap();
    while(i < iCap) {
      let tmp = co[i];
      if(!MDL_cond._isAux(tmp)) {
        cond = true;
      } else {
        if(includeAux) cond = true;
      };
      i += 2;
    };

    // BO
    var i = 0;
    var iCap = bo.iCap();
    while(i < iCap) {
      let tmp = bo[i];
      if(tmp instanceof Liquid) {
        if(!MDL_cond._isAux(tmp)) {
          cond = true;
        } else {
          if(includeAux) cond = true;
        };
      };
      i += 3;
    };

    return cond;
  };
  exports._hasOutput_liq = _hasOutput_liq;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the multi-crafter can add resource any more.
   * ---------------------------------------- */
  const _canAdd = function(b, ignoreItemFullness, co, bo, fo) {
    var cond = true;
    let noItm = b.items == null;
    let noLiq = b.liquids == null;

    // CO
    if(!noLiq) {
      let allFull = true;
      let i = 0;
      let iCap = co.iCap();
      while(i < iCap) {
        let tmp = co[i];
        let amt = co[i + 1];
        if(b.liquids.get(tmp) < b.block.liquidCapacity) {
          allFull = false;
        } else if(!b.block.ignoreLiquidFullness && !b.block.dumpExtraLiquid) {
          cond = false;
        };
        i += 2;
      };
      if(allFull && _hasOutput_liq(true, co, bo) && !b.block.ignoreLiquidFullness) cond = false;
    };

    // BO
    var i = 0;
    var iCap = bo.iCap();
    while(i < iCap) {
      let tmp = bo[i];
      let amt = bo[i + 1];
      let p = bo[i + 2];
      if(!noItm && tmp instanceof Item) {
        if(!ignoreItemFullness && b.items.get(tmp) > b.block.itemCapacity - amt * p) cond = false;
      };
      if(!noLiq && tmp instanceof Liquid) {
        if(!b.block.ignoreLiquidFullness && b.liquids.get(tmp) / b.block.liquidCapacity > 0.98) cond = false;
      };
      i += 3;
    };

    // FO
    if(!noItm) {
      let i = 0;
      let iCap = fo.iCap();
      while(i < iCap) {
        let tmp = fo[i];
        let amt = fo[i + 1];
        // No probability for failed output
        if(!ignoreItemFullness && b.items.get(tmp) > b.block.itemCapacity - amt) cond = false;
        i += 3;
      };
    };

    return cond;
  };
  exports._canAdd = _canAdd;


  /* <---------- calculation ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a 2-tuple of items and fluids to dump.
   * {co} is called in dump method for output direction.
   * ---------------------------------------- */
  const _dumpTup = function(b, bo, fo) {
    const itms = [];
    const liqs = [];
    let noItm = b.items == null;
    let noLiq = b.liquids == null;

    // BO
    var i = 0;
    var iCap = bo.iCap();
    while(i < iCap) {
      let tmp = bo[i];
      if(!noItm && tmp instanceof Item) itms.pushUnique(tmp);
      if(!noLiq && tmp instanceof Liquid) liqs.pushUnique(tmp);
      i += 3;
    };

    // FO
    if(!noItm) {
      let i = 0;
      let iCap = fo.iCap();
      while(i < iCap) {
        let tmp = fo[i];
        itms.pushUnique(tmp);
        i += 3;
      };
    };

    return [itms, liqs];
  };
  exports._dumpTup = _dumpTup;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a 4-tuple for currently used optional input.
   * Returns {null} if no optional input.
   * ---------------------------------------- */
  const _optTup = function(b, opt) {
    if(b.items == null) return null;

    let tup = [];
    var tmpMtp = 0.0;

    var i = 0;
    var iCap = opt.iCap();
    while(i < iCap) {
      let tmp = opt[i];
      let amt = opt[i + 1];
      let p = opt[i + 2];
      let mtp = opt[i + 3];
      if(b.items.get(tmp) >= amt && mtp >= tmpMtp) {
        tmpMtp = mtp;
        tup.clear().push(tmp, amt, p, mtp);
      };
      i += 4;
    };

    return tup.length === 0 ? null : tup;
  };
  exports._optTup = _optTup;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns current efficiency of the multi-crafter.
   * ---------------------------------------- */
  const _effc = function(b, ci, bi, aux, reqOpt, opt) {
    var effc = 1.0;
    var mtp = 1.0;
    let noItm = b.items == null;
    let noLiq = b.liquids == null;

    if(b.power != null) effc *= b.power.status;

    // CI
    if(!noLiq) {
      let i = 0;
      let iCap = ci.iCap();
      while(i < iCap) {
        if(effc < 0.0001) break;
        let tmp = ci[i];
        let amt = ci[i + 1];
        mtp = b.efficiencyScale() < 0.0001 ?
          0.0 :
          Math.min(b.liquids.get(tmp) / amt * b.delta() * b.efficiencyScale(), 1.0);
        effc *= mtp;
        i += 2;
      };
    };

    // BI
    var i = 0;
    var iCap = bi.iCap();
    while(i < iCap) {
      if(effc < 0.0001) break;
      let tmp = bi[i];
      if(!(tmp instanceof Array)) {
        let amt = bi[i + 1];
        if(!noItm && tmp instanceof Item) {
          if(b.items.get(tmp) < amt) effc = 0.0;
        };
        if(!noLiq && tmp instanceof Liquid) {
          if(b.liquids.get(tmp) < amt) effc = 0.0;
        };
      } else {
        let allAbsent = true;
        let j = 0;
        let jCap = tmp.iCap();
        while(j < jCap) {
          let tmp1 = tmp[j];
          let amt = tmp[j + 1];
          if(!noItm && tmp1 instanceof Item) {
            if(b.items.get(tmp1) >= amt) allAbsent = false;
          };
          if(!noLiq && tmp1 instanceof Liquid) {
            if(b.liquids.get(tmp1) > amt - 0.0001) allAbsent = false;
          };
          j += 3;
        };
        if(allAbsent) effc = 0.0;
      };
      i += 3;
    };

    // AUX
    if(!noLiq) {
      let i = 0;
      let iCap = aux.iCap();
      while(i < iCap) {
        if(effc < 0.0001) break;
        let tmp = aux[i];
        let amt = aux[i + 1];
        mtp = b.efficiencyScale() < 0.0001 ?
          0.0 :
          Math.min(b.liquids.get(tmp) / amt * b.delta() * b.efficiencyScale(), 1.0);
        effc *= mtp;
        i += 2;
      };
    };

    // OPT
    if(effc > 0.0) {
      let optTup = _optTup(b, opt);
      if(reqOpt && optTup == null) effc = 0.0;
      if(optTup != null) effc *= optTup[3];
    };

    if(effc < 0.0) effc = 0.0;
    return effc;
  };
  exports._effc = _effc;


  /* <---------- application ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a multi-crafter consume items.
   * ---------------------------------------- */
  const consume_itm = function(b, bi, opt) {
    let noItm = b.items == null;
    let noLiq = b.liquids == null;

    // BI
    var i = 0;
    var iCap = bi.iCap();
    while(i < iCap) {
      let tmp = bi[i];
      if(!(tmp instanceof Array)) {
        let amt = bi[i + 1];
        let p = bi[i + 2];
        if(!noItm && tmp instanceof Item) {
          FRAG_item.consumeItem(b, tmp, amt, p);
        };
        if(!noLiq && tmp instanceof Liquid) {
          FRAG_fluid.addLiquidBatch(b, b, tmp, -amt);
        };
      } else {
        let j = 0;
        let jCap = tmp.iCap();
        while(j < jCap) {
          let tmp1 = tmp[j];
          let amt = tmp[j + 1];
          let p = tmp[j + 2];
          if(!noItm && tmp1 instanceof Item) {
            FRAG_item.consumeItem(b, tmp1, amt, p);
            break;
          };
          if(!noLiq && tmp1 instanceof Liquid) {
            FRAG_fluid.addLiquidBatch(b, b, tmp1, -amt);
            break;
          };
          j += 3;
        };
      };
      i += 3;
    };

    // OPT
    let optTup = _optTup(b, opt);
    if(optTup != null) {
      let tmp = optTup[0];
      let amt = optTup[1];
      let p = optTup[2];
      FRAG_item.consumeItem(b, tmp, amt, p);
    };
  };
  exports.consume_itm = consume_itm;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a multi-crafter consume liquids.
   * ---------------------------------------- */
  const consume_liq = function(b, progIncLiq, timeScl, ci, aux) {
    if(b.liquids == null) return;

    // CI
    var i = 0;
    var iCap = ci.iCap();
    while(i < iCap) {
      let tmp = ci[i];
      let amt = ci[i + 1];
      b.liquids.remove(tmp, Math.min(amt * progIncLiq, timeScl, b.liquids.get(tmp)));
      i += 2;
    };

    // AUX
    var i = 0;
    var iCap = aux.iCap();
    while(i < iCap) {
      let tmp = aux[i];
      let amt = aux[i + 1];
      b.liquids.remove(tmp, Math.min(amt * progIncLiq, timeScl, b.liquids.get(tmp)));
      i += 2;
    };
  };
  exports.consume_liq = consume_liq;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a multi-crafter produce items.
   * ---------------------------------------- */
  const produce_itm = function(b, bo, failP, fo) {
    let noItm = b.items == null;
    let noLiq = b.liquids == null;
    let failed = Mathf.chance(failP);

    // BO
    if(!failed) {
      let i = 0;
      let iCap = bo.iCap();
      while(i < iCap) {
        let tmp = bo[i];
        let amt = bo[i + 1];
        let p = bo[i + 2];
        if(!noItm && tmp instanceof Item && b.items.get(tmp) < b.block.itemCapacity) {
          FRAG_item.produceItem(b, tmp, amt, p);
        };
        if(!noLiq && tmp instanceof Liquid) {
          FRAG_fluid.addLiquidBatch(b, b, tmp, amt);
        };
        i += 3;
      };
    };

    // FO
    if(!noItm && failed) {
      let i = 0;
      let iCap = fo.iCap();
      for(let j = 0; j < 3; j++) {EFF.blackSmog.at(b)};
      while(i < iCap) {
        let tmp = fo[i];
        let amt = fo[i + 1];
        let p = fo[i + 2];
        if(b.items.get(tmp) < b.block.itemCapacity) {
          FRAG_item.produceItem(b, tmp, amt, p);
        };
        i += 3;
      };
    };
  };
  exports.produce_itm = produce_itm;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a multi-crafter produce liquids.
   * ---------------------------------------- */
  const produce_liq = function(b, progIncLiq, timeScl, co) {
    if(b.liquids == null) return;

    // CO
    var i = 0;
    var iCap = co.iCap();
    while(i < iCap) {
      let tmp = co[i];
      let amt = co[i + 1];
      b.handleLiquid(b, tmp, Math.min(amt * progIncLiq * timeScl, b.block.liquidCapacity - b.liquids.get(tmp)));
      i += 2;
    };
  };
  exports.produce_liq = produce_liq;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a multi-crafter dump some resource in it.
   * ---------------------------------------- */
  const dump = function(b, co, dumpTup) {
    if(dumpTup == null) return;

    if(b.liquids != null) {
      let i = 0;
      let iCap = co.iCap();
      while(i < iCap) {
        let tmp = co[i];
        let dir = (b.block.liquidOutputDirections.length > i / 2) ? b.block.liquidOutputDirections[i / 2] : -1;
        b.dumpLiquid(tmp, 2.0, dir);
        i += 2;
      };
    };

    dumpTup[0].forEach(itm => b.dump(itm));
    dumpTup[1].forEach(liq => b.dumpLiquid(liq, 2.0));
  };
  exports.dump = dump;


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
     * IMPORTANT:
     *
     * Use {Core.app.post} for methods that modify recipe dictionary, after client load.
     * Or some parameters are still not correctly loaded.
     * ---------------------------------------- */
    Core.app.post(() => Vars.content.blocks().each(blk => {

      if(!DB_block.db["group"]["noRcDict"]["cons"].includes(blk.name)) {
        blk.consumers.forEach(cons => {
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
