/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  const DB_block = require("lovec/db/DB_block");
  const DB_env = require("lovec/db/DB_env");
  const DB_fluid = require("lovec/db/DB_fluid");


  /* <---------- auxilliary ----------> */


  function halfLogWrap(val, val_hf, val_max, base) {
    return base == null ? (
      1.0 - 0.5 * (Math.log(val_max + 1.0) - Math.log(val + 1.0)) / (Math.log(val_max + 1.0) - Math.log(val_hf + 1.0))
    ) : (
      1.0 - 0.5 * (Mathf.log(base, val_max + 1.0) - Mathf.log(base, val + 1.0)) / (Mathf.log(base, val_max + 1.0) - Mathf.log(base, val_hf + 1.0))
    );
  };


  /* <---------- base (group) ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the elementary group of a fluid.
   * An elementary group is a collection of fluids similiar in properties.
   * ---------------------------------------- */
  const _eleGrp = function(liq_gn) {
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return;

    let obj = DB_fluid.db["group"]["elementary"];
    for(let key in obj) {
      if(obj[key].includes(liq.name)) return key;
    };
  };
  exports._eleGrp = _eleGrp;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the name of elementary group from the bundle.
   * For {"acidAq"}, this will read {"term.common-term-grp-acidaq.name"}.
   * The same for other groups.
   * ---------------------------------------- */
  const _eleGrpB = function(liq_gn) {
    let eleGrp = _eleGrp(liq_gn);
    if(eleGrp == null) return "!ERR";

    return MDL_bundle._term("common", "grp-" + eleGrp);
  };
  exports._eleGrpB = _eleGrpB;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the material group of a block, mostly for corrosion calculation.
   * This is not floor material, which is related to terrain instead.
   * ---------------------------------------- */
  const _matGrp = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;

    let obj = DB_block.db["group"]["material"];
    for(let key in obj) {
      if(obj[key].includes(blk.name)) return key;
    };
  };
  exports._matGrp = _matGrp;


  const _matGrpB = function(blk_gn) {
    let matGrp = _matGrp(blk_gn);
    if(matGrp == null) return "!ERR";

    return MDL_bundle._term("common", "grp-" + matGrp);
  };
  exports._matGrpB = _matGrpB;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a list of fluid tags of the fluid.
   * Fluid tags provide extra multipliers to corrosion damage.
   * ---------------------------------------- */
  const _fTags = function(liq_gn) {
    const arr = [];
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return arr;

    let obj = DB_fluid.db["group"]["fTag"];
    for(let key in obj) {
      if(obj[key].includes(liq.name)) arr.push(key);
    };

    return arr;
  };
  exports._fTags = _fTags;


  const _fTagsB = function(liq_gn) {
    let arr = _fTags(liq_gn).substitute(tag => MDL_bundle._term("common", "grp-" + tag));

    return MDL_text._tagText(arr);
  };
  exports._fTagsB = _fTagsB;


  /* <---------- base (param) ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets density of a fluid.
   * ---------------------------------------- */
  const _dens = function(liq_gn) {
    var dens = 1.0;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return dens;

    var dens_def = liq.gas ? 0.00121 : 1.0;
    dens = DB_fluid.db["param"]["dens"].read(liq.name);
    if(dens == null) {
      let eleGrp = _eleGrp(liq);
      dens = eleGrp == null ? dens_def : DB_fluid.db["grpParam"]["dens"].read(eleGrp, dens_def);
    };

    return dens;
  };
  exports._dens = _dens;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets boiling point of a fluid.
   * ---------------------------------------- */
  const _boilPon = function(liq_gn) {
    var boilPon = 100.0;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return boilPon;

    boilPon = DB_fluid.db["param"]["boil"].read(liq.name);
    if(boilPon == null) {
      let eleGrp = _eleGrp(liq);
      if(eleGrp == null) {boilPon = 100.0} else {
        boilPon = DB_fluid.db["grpParam"]["boil"].read(eleGrp, 100.0);
      };
    };

    return boilPon;
  };
  exports._boilPon = _boilPon;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets fluid heat of a fluid.
   * This will affect temperature.
   * ---------------------------------------- */
  const _fHeat = function(liq_gn) {
    var fHeat = 26.0;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return fHeat;

    fHeat = DB_fluid.db["param"]["fHeat"].read(liq.name, 26.0);

    return fHeat;
  };
  exports._fHeat = _fHeat;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets wrapped temperature.
   * ---------------------------------------- */
  const _tempWrap = function(liq_gn) {
    return halfLogWrap(_fHeat(liq_gn), 26.0, 1500.0);
  };
  exports._tempWrap  = _tempWrap;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets wrapped viscosity.
   * ---------------------------------------- */
  const _viscWrap = function(liq_gn) {
    var viscWrap = 0.5;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return viscWrap;

    var visc = DB_fluid.db["param"]["visc"].read(liq.name);
    if(visc != null) {

      viscWrap = halfLogWrap(visc, 0.98, 2800.0);

    } else {

      if(liq.gas) {
        viscWrap = 0.15;
      } else {
        let eleGrp = _eleGrp(liq);
        viscWrap = eleGrp == null ? 0.5 : DB_fluid.db["grpParam"]["viscWrap"].read(eleGrp, 0.5);
      };

    };

    return viscWrap;
  };
  exports._viscWrap = _viscWrap;


  /* <---------- flow ----------> */


  const _flow = function(b, b_t, liqFrac, liqFrac_t, pres, visc) {
    let flow = (frac_f - frac_t) * b_f.liquidCapacity;

    // TODO: Pressure

    // Viscosity
    flow *= (1.0 - Mathf.clamp(visc)) * 2.0;

    // TODO: Conduit diameter

    // Corner
    flow *= (b_f.rotation !== b_t.rotation) ? 0.8 : 1.0;

    if(flow < 0.0) flow = 0.0;
    return flow;
  }
  .setTodo("Pipe pressure and pipe diameter, and their effects on flow rate.");
  exports._flow = _flow;


  /* <---------- corrosion ----------> */


  const _corPow = function(liq_gn) {
    var corPow = 0.0;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return corPow;

    corPow = DB_fluid.db["param"]["corrosion"].read(liq.name);
    if(corPow == null) {
      let eleGrp = _eleGrp(liq);
      if(eleGrp == null) {corPow = 0.0} else {
        corPow = DB_fluid.db["grpParam"]["corrosion"].read(eleGrp, 0.0);
      };
    };

    return corPow;
  };
  exports._corPow = _corPow;


  const _corMtp = function(blk_gn, liq_gn) {
    var corMtp = 1.0;
    let blk = MDL_content._ct(blk_gn, "blk");
    let liq = MDL_content._ct(liq_gn, "rs");
    if(blk == null || liq == null) return corMtp;

    let eleGrp = _eleGrp(liq);
    let matGrp = _matGrp(blk);
    if(eleGrp == null || matGrp == null) return corMtp;

    let matEleSclArr = DB_fluid.db["grpParam"]["matEleScl"][matGrp];
    corMtp = matEleSclArr == null ? 1.0 : matEleSclArr.read(eleGrp, 1.0);

    var tagMtp;
    _fTags(liq).forEach(tag => {
      let matFTagSclArr = DB_fluid.db["grpParam"]["matFTagScl"][matGrp];
      tagMtp = matFTagSclArr == null ? 1.0 : matFTagSclArr.read(tag, 1.0);
      corMtp *= tagMtp;
    });

    return corMtp;
  };
  exports._corMtp = _corMtp;


  const _corRes = function(blk_gn) {
    var corRes = 1.0;
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return corRes;

    corRes = DB_block.db["param"]["corRes"].read(blk.name);
    if(corRes == null) {
      let matGrp = _matGrp(blk);
      corRes = matGrp == null ? 1.0 : DB_block.db["grpParam"]["corRes"].read(matGrp, 1.0);
    };

    return corRes;
  };
  exports._corRes = _corRes;


  /* <---------- heat ----------> */


  const _heatRes = function(blk_gn) {
    var heatRes = Infinity;
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return heatRes;

    heatRes = DB_block.db["param"]["heatRes"].read(blk.name);
    if(heatRes == null) {
      let matGrp = _matGrp(blk);
      heatRes = matGrp == null ? 1.0 : DB_block.db["grpParam"]["heatRes"].read(matGrp, Infinity);
    };

    return heatRes;
  };
  exports._heatRes = _heatRes;


  const _fHeat_b = function(b) {
    if(b.liquids == null) return 0.0;

    let liqCur = b.liquids.current();
    var amt = b.liquids.get(liqCur);
    if(amt < 0.01) return 0.0;
    var cap = b.block.liquidCapacity;
    var fHeatBase = DB_fluid.db["param"]["fHeat"].read(liqCur.name, 0.0);

    return fHeatBase * (amt / cap * 0.75 + 0.75) * (cap / 300.0 * 0.15 + 0.75);
  };
  exports._fHeat_b = _fHeat_b;


  const _glbHeat = function() {
    let pla = Vars.state.planet;
    if(pla == null) return 0.0;

    let nmPla = pla.name;
    let nmMap = Vars.state.map.plainName();

    return DB_env.db["param"]["map"]["heat"].read(nmMap, DB_env.db["param"]["pla"]["heat"].read(nmPla, 0.26)) * 100.0;
  };
  exports._glbHeat = _glbHeat;
