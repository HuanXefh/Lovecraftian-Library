/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");
  const SAVE = require("lovec/glb/GLB_save");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_text = require("lovec/mdl/MDL_text");


  const TP_attr = require("lovec/tp/TP_attr");
  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");
  const DB_env = require("lovec/db/DB_env");
  const DB_fluid = require("lovec/db/DB_fluid");
  const DB_item = require("lovec/db/DB_item");
  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- core ----------> */


  const cepCapMap = new ObjectMap();
  const cepUseMap = new ObjectMap();
  const cepFracMap = new ObjectMap();
  const cepEffcMap = new ObjectMap();


  /* ----------------------------------------
   * NOTE:
   *
   * Gets amount of CEPs provided by {blk_gn}.
   * ---------------------------------------- */
  const _cepProv = function(blk_gn, b) {
    let blk = MDL_content._ct(blk_gn, "blk");
    var tmp = blk == null ? 0.0 : DB_block.db["param"]["cep"]["prov"].read(blk.name, MDL_cond._isCoreBlock(blk) ? 5.0 : 0.0);

    return tmp !== "function" ?
      tmp :
      (b == null ? 0.0 : tmp(b));
  };
  exports._cepProv = _cepProv;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets amount of CEPs used by {blk_gn}.
   * ---------------------------------------- */
  const _cepUse = function(blk_gn, b) {
    let blk = MDL_content._ct(blk_gn, "blk");
    var tmp = blk == null ? 0.0 : DB_block.db["param"]["cep"]["use"].read(blk.name, 0.0);

    return tmp !== "function" ?
      tmp :
      (b == null ? 0.0 : tmp(b));
  };
  exports._cepUse = _cepUse;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current amount of CEPs provided.
   * ---------------------------------------- */
  const _cepCapCur = function(team) {
    return cepCapMap.get(team, 0.0);
  };
  exports._cepCapCur = _cepCapCur;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current amount of CEPs used.
   * ---------------------------------------- */
  const _cepUseCur = function(team) {
    return cepUseMap.get(team, 0.0);
  };
  exports._cepUseCur = _cepUseCur;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current fraction of CEPs used.
   * ---------------------------------------- */
  const _cepFracCur = function(team) {
    return cepFracMap.get(team, 0.0);
  };
  exports._cepFracCur = _cepFracCur;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current efficiency of core energy.
   * ---------------------------------------- */
  const _cepEffcCur = function(team) {
    return cepEffcMap.get(team, 1.0);
  };
  exports._cepEffcCur = _cepEffcCur;


  const comp_setStats_cep = function(blk) {
    var cepProv = _cepProv(blk);
    if(cepProv > 0.0) blk.stats.add(TP_stat.blk0misc_cepProv, cepProv);

    var cepUse = _cepUse(blk);
    if(cepUse > 0.0) blk.stats.add(TP_stat.blk0misc_cepUse, cepUse);
  };
  exports.comp_setStats_cep = comp_setStats_cep;


  const comp_updateTile_cepEff = function(b) {
    if(b.efficiency > 0.0 && TIMER.timerState_coreSignal) MDL_effect.showAt_coreSignal(b.x, b.y, b.team, b.block.size * 0.6 * Vars.tilesize);
  };
  exports.comp_updateTile_cepEff = comp_updateTile_cepEff;


  const comp_drawSelect_cep = function(b, offTy) {
    MDL_draw.drawText_select(b, MDL_bundle._info("lovec", "text-cep") + " " + _cepUseCur(b.team) + " / " + _cepCapCur(b.team), _cepFracCur(b.team) < 1.0001, offTy);
  };
  exports.comp_drawSelect_cep = comp_drawSelect_cep;


  /* <---------- drill ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the drill speed for {blk}.
   * ---------------------------------------- */
  const _drillSpd = function(blk, boosted) {
    const arr = DB_block.db["class"]["drillSpd"];
    let getter = null;
    let i = 0;
    let iCap = arr.iCap();
    while(i < iCap) {
      if(blk instanceof arr[i]) getter = arr[i + 1];
      i += 2;
    };

    return getter(blk, Object.val(boosted, false));
  };
  exports._drillSpd = _drillSpd;


  /* <---------- fuel ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets fuel point of {rs_gn}.
   * If it's a fluid, this returns consumption rate.
   * ---------------------------------------- */
  const _fuelPon = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return 0.0;

    return DB_item.db["param"]["fuel"][rs instanceof Item ? "item" : "fluid"].read(rs.name, Array.airZero)[0];
  };
  exports._fuelPon = _fuelPon;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets fuel level of {rs_gn}.
   * ---------------------------------------- */
  const _fuelLvl = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return 0.0;

    return DB_item.db["param"]["fuel"][rs instanceof Item ? "item" : "fluid"].read(rs.name, Array.airZero)[1];
  };
  exports._fuelLvl = _fuelLvl;


  /* ----------------------------------------
   * NOTE:
   *
   * @METHOD: blk.ex_getFuelType, blk.ex_getBlockedFuels
   * Gets an array of available fuels for {blk}.
   * ---------------------------------------- */
  const _fuelArr = function(blk) {
    const arr = [];
    switch(blk.ex_getFuelType()) {

      case "item" :
        arr.pushAll(VARGEN.fuelItms);
        break;

      case "liquid" :
        arr.pushAll(VARGEN.fuelLiqs);
        break;

      case "gas" :
        arr.pushAll(VARGEN.fuelGases);
        break;

      default :
        arr.pushAll(VARGEN.fuelItms);
        arr.pushAll(VARGEN.fuelLiqs);
        arr.pushAll(VARGEN.fuelGases);

    };

    return arr.filter(rs => !blk.ex_getBlockedFuels().includes(rs.name));
  };
  exports._fuelArr = _fuelArr;


  /* ----------------------------------------
   * NOTE:
   *
   * @METHOD: blk.ex_getFuelType, blk.ex_getBlockedFuels
   * Gets the fuel tuple for a furnace.
   * Format: {fuelRs, fuelPon, fuelLvl}.
   * ---------------------------------------- */
  const _fuelTup = function(b) {
    let fuelType = b.block.ex_getFuelType();
    let blockedFuels = b.block.ex_getBlockedFuels();
    let rsTg = null;
    let fuelLvl = 0.0;
    let rsTgSpare = null;
    let fuelLvlSpare = 0.0;

    if(b.items != null && fuelType.equalsAny(["item", "any"])) {
      VARGEN.fuelItms.forEach(itm => {
        if(!b.items.has(itm) || blockedFuels.includes(itm.name)) return;

        let tmpLvl = _fuelLvl(itm);
        if(tmpLvl > fuelLvl) {
          rsTg = itm;
          fuelLvl = tmpLvl;
          rsTgSpare = rsTg;
          fuelLvlSpare = fuelLvl;
        };
      });
    };

    if(b.liquids != null && fuelType.equalsAny(["liquid", "any"])) {
      VARGEN.fuelLiqs.forEach(liq => {
        if(b.liquids.get(liq) < 0.01 || blockedFuels.includes(liq.name)) return;

        let tmpLvl = _fuelLvl(liq);
        if(tmpLvl > fuelLvl) {
          rsTg = liq;
          fuelLvl = tmpLvl;
          rsTgSpare = rsTg;
          fuelLvlSpare = fuelLvl;
        };
      });
    };

    if(b.liquids != null && fuelType.equalsAny(["gas", "any"])) {
      VARGEN.fuelGases.forEach(gas => {
        if(b.liquids.get(gas) < 0.01 || blockedFuels.includes(gas.name)) return;

        let tmpLvl = _fuelLvl(gas);
        if(tmpLvl > fuelLvl) {
          rsTg = gas;
          fuelLvl = tmpLvl;
          rsTgSpare = rsTg;
          fuelLvlSpare = fuelLvl;
        };
      });
    };

    if(rsTg != null && MDL_recipeDict._prodAmt(rsTg, b.block) > 0.0 && rsTgSpare != null) {
      rsTg = rsTgSpare;
      fuelLvl = fuelLvlSpare;
    };

    return rsTg == null ? null : [rsTg, _fuelPon(rsTg), fuelLvl];
  };
  exports._fuelTup = _fuelTup;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: b.fuelPonCur
   * Returns the fraction used in {Mathf.lerp}.
   * ---------------------------------------- */
  const _tempTgFrac = function(b, fuelRs) {
    if(fuelRs == null || b.fuelPonCur < 0.0001) return 0.0;

    if(fuelRs instanceof Item) {
      if(b.items == null || !b.items.has(fuelRs)) return 0.0;
    } else {
      if(b.liquids == null || b.liquids.get(fuelRs) < 0.01) return 0.0;
    };

    return 1.0;
  };
  exports._tempTgFrac = _tempTgFrac;


  /* <---------- pollution ----------> */


  var blkPol = 0.0;
  var dynaPol = 0.0;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets pollution produced/reduced by {blk_gn}.
   * ---------------------------------------- */
  const _pol = function(blk_gn) {
    var pol = 0.0;
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return pol;

    pol = DB_block.db["param"]["pol"].read(blk.name, 0.0);

    return pol;
  };
  exports._pol = _pol;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the pollution of a fluid.
   * If not defined, pollution of the parent will be used (if found).
   * ---------------------------------------- */
  const _liqPol = function(liq_gn) {
    const thisFun = _liqPol;

    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return 0.0;

    let pol = thisFun.funMap.get(liq.name);
    if(pol != null) return pol;

    pol = DB_fluid.db["param"]["pol"].read(liq.name);
    if(pol == null && liq.ex_getParent != null) {
      let parent = liq.ex_getParent();
      if(parent) pol = DB_fluid.db["param"]["pol"].read(parent);
    };

    if(pol == null) pol = 0.0;
    thisFun.funMap.put(liq.name, pol);

    return pol;
  }
  .setProp({
    "funMap": new ObjectMap(),
  });
  exports._liqPol = _liqPol;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets pollution tolerance of {blk_gn} or {utp_gn}.
   * ---------------------------------------- */
  const _polTol = function(blk0utp_gn) {
    var polTol = 0.0;
    let blk0utp = MDL_content._ct(blk0utp_gn, null, true);
    if(blk0utp == null) return polTol;

    polTol = ((blk0utp instanceof UnitType) ? DB_unit.db["param"]["polTol"] : DB_block.db["param"]["polTol"]).read(blk0utp.name, 500.0);

    return polTol;
  };
  exports._polTol = _polTol;


  /* ----------------------------------------
   * NOTE:
   *
   * Increase (or decrease if negative) the dynamic pollution point.
   * ---------------------------------------- */
  const addDynaPol = function(amt) {
    return dynaPol = Mathf.maxZero(dynaPol + Object.val(amt, 0.0));
  };
  exports.addDynaPol = addDynaPol;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the global pollution point of the map.
   * ---------------------------------------- */
  const _glbPol = function() {
    return blkPol + dynaPol;
  };
  exports._glbPol = _glbPol;


  const comp_setStats_pol = function(blk) {
    let pol = _pol(blk);
    if(!pol.fEqual(0.0)) blk.stats.add(pol > 0.0 ? TP_stat.blk_pol : TP_stat.blk_polRed, Math.abs(pol), TP_stat.blk_polUnits);
  };
  exports.comp_setStats_pol = comp_setStats_pol;


  /* <---------- power ----------> */


  const comp_setBars_powGen = function(blk) {
    blk.addBar("poweroutput", b => new Bar(
      prov(() => Core.bundle.format("bar.poweroutput", Strings.fixed(b.getPowerProduction() * 60.0 * b.timeScale(), 1))),
      prov(() => Pal.powerBar),
      () => b.efficiency,
    ));
    blk.addBar("power", b => new Bar(
      prov(() => Core.bundle.format("bar.powerbalance", (b.power.graph.getPowerBalance() >= 0.0 ? "+" : "") + UI.formatAmount(b.power.graph.getPowerBalance() * 60.0))),
      prov(() => Pal.powerBar),
      () => Mathf.clamp(b.power.graph.getLastPowerProduced() / b.power.graph.getLastPowerNeeded()),
    ));
  };
  exports.comp_setBars_powGen = comp_setBars_powGen;


  const comp_onProximityUpdate_powGen = function(b) {
    if(!b.allowUpdate()) b.enabled = false;
  };
  exports.comp_onProximityUpdate_powGen = comp_onProximityUpdate_powGen;


  /* <---------- terrain ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Terrain type is internal, it's hard to implement customized terrain calculation.
   * You can call it biome.
   * ---------------------------------------- */
  const ters = [
    "dirt",
    "lava",
    "grass",
    "gravel",
    "puddle",
    "river",
    "rock",
    "salt",
    "sand",
    "sea",
  ];


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the terrain at {t}.
   * ---------------------------------------- */
  const _ter = function(t, size) {
    if(t == null) return null;

    if(size == null) size = 1;

    let ts = MDL_pos._tsRect(t, 5, size, true);
    let count = ts.iCap();
    if(count === 0) return null;

    let countObj = {};
    ters.forEach(ter => countObj[ter] = 0);
    ts.forEach(ot => {
      let ter = Function.tryFun(ot.floor().ex_getMatGrp, null, ot.floor());
      if(ter != null) countObj[ter] += 1;
    });

    let thr = VAR.blk_terFlrThr;
    let ter = null;

    if((countObj["dirt"] + countObj["grass"]) / count > thr) ter = "dirt";
    if(countObj["lava"] / count > thr) ter = "lava";
    if(countObj["puddle"] / count > thr) ter = "puddle";
    if(countObj["river"] / count > thr) ter = "river";
    if((countObj["gravel"] + countObj["rock"]) / count > thr) ter = "rock";
    if(countObj["salt"] / count > thr) ter = "salt";
    if((countObj["gravel"] + countObj["sand"]) / count > thr) ter = "sand";
    if(countObj["sea"] / count > thr) ter = "sea";

    if(countObj["river"] / count > thr * 0.7 && (countObj["dirt"] + countObj["grass"] + countObj["gravel"] + countObj["rock"] + countObj["sand"]) / count > thr * 0.3) ter = "bank";
    if(countObj["beach"] / count > thr * 0.7 && (countObj["gravel"] + countObj["rock"] + countObj["sand"]) / count > thr * 0.3) ter = "beach";

    return ter;
  };
  exports._ter = _ter;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the name for terrain from the bundle.
   * ---------------------------------------- */
  const _terB = function(ter) {
    return Vars.headless ? "" : MDL_bundle._term("lovec", "ter-" + (Object.val(ter, "transition")));
  };
  exports._terB = _terB;


  const comp_setStats_ter = function(blk, ters, mode) {
    const thisFun = comp_setStats_ter;

    if(ters == null || ters.length === 0) return;

    if(mode == null) mode = "enable";
    if(!mode.equalsAny(thisFun.modes)) return;

    let terBs = ters.map(ter => _terB(ter));
    blk.stats.add(
      mode === "enable" ? TP_stat.blk_terReq : TP_stat.blk_terBan,
      (mode === "enable" ? "[green]" : "[red]") + MDL_text._tagText(terBs) + "[]",
    );
  }
  .setProp({
    "modes": ["enable", "disable"],
  });
  exports.comp_setStats_ter = comp_setStats_ter;


  const comp_canPlaceOn_ter = function(blk, t, team, rot, ters, mode, offTy) {
    const thisFun = comp_canPlaceOn_ter;

    if(t == null) return false;

    if(mode == null) mode = "enable";
    if(!mode.equalsAny(thisFun.modes)) return false;

    let terCur;
    let terCurB;
    if(thisFun.funTup.length === 0 || t !== thisFun.funTup[0]) {

      terCur = _ter(t, blk.size);
      terCurB = _terB(terCur);

      thisFun.funTup[0] = t;
      thisFun.funTup[1] = terCur;
      thisFun.funTup[2] = terCurB;

    } else {

      terCur = thisFun.funTup[1];
      terCurB = thisFun.funTup[2];

    };
    let cond = true;

    if(mode === "enable") {

      if(terCur == null || !ters.includes(terCur)) {
        MDL_draw.drawText_place(blk, t.x, t.y, MDL_bundle._info("lovec", "text-terrain-enabled") + " " + terCurB, false, offTy);
        cond = false;
      };

    } else {

      if(terCur != null && ters.includes(terCur)) {
        MDL_draw.drawText_place(blk, t.x, t.y, MDL_bundle._info("lovec", "text-terrain-disabled") + " " + terCurB, false, offTy);
        cond = false;
      };

    };

    return cond;
  }
  .setProp({
    "modes": ["enable", "disable"],
    "funTup": [],
  });
  exports.comp_canPlaceOn_ter = comp_canPlaceOn_ter;


  /* <---------- tree ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * @METHOD: blk.ex_getTreeGrp
   * Gets resource level of a tree (or mushroom).
   * See {DB_env.db["grpParam"]["tree"]}.
   * ---------------------------------------- */
  const _treeRsLvl = function(blk) {
    if(!MDL_cond._isTreeBlock(blk)) return 0.0;

    let treeGrp = blk.ex_getTreeGrp();
    let rsLvl = 0.0;
    let attrs = DB_env.db["grpParam"]["tree"].read([treeGrp, "attrsGetter"], Function.airArr)();

    if(attrs.length !== 0) {
      rsLvl = Math.max.apply(null, attrs.map(nmAttr => blk.attributes.get(Attribute.get(nmAttr))));
    };

    return rsLvl;
  }
  .setTodo("Sets up bush map in {DB_block.db['map']['attrMap']['bush']}.");
  exports._treeRsLvl = _treeRsLvl;


  /* <---------- turret ----------> */


  const comp_init_outline = function(ct) {
    let tup = DB_unit.db["grpParam"]["outline"].read(MDL_content._mod(ct));
    if(tup == null) return;

    if(tup[0] < 1) {
      if(ct.outlines != null) ct.outlines = false;
    } else {
      ct.outlineRadius = tup[0];
      ct.outlineColor = MDL_color._color(tup[1], "new");
    };
  };
  exports.comp_init_outline = comp_init_outline


  /* <---------- wire ----------> */


  const comp_updateTile_wireTouch = function(b, b_t, dmg, color) {
    if(b_t == null || b.power == null || b.power.status < 0.01) return;
    if(dmg < 0.0001 || !Mathf.chance(0.08)) return;

    let ounit = MDL_pos._rayGet_unit(b.x, b.y, b_t.x, b_t.y, unit => MDL_cond._isBoosting(unit));
    if(ounit == null) return;

    FRAG_attack.apply_lightning(ounit.x, ounit.y, null, dmg, 3, 7, 8, color);
  };
  exports.comp_updateTile_wireTouch = comp_updateTile_wireTouch;


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onWorldLoad(() => {


    Time.run(25.0, () => {
      dynaPol = SAVE.get("dynamic-pollution");
    });


  }, 49520302);


  MDL_event._c_onUpdate(() => {


    if(!PARAM.modded) return;


    if(Vars.state.isGame()) {
      if(TIMER.timerState_sec) dynaPol *= 0.984;
      if(TIMER.timerState_paramLarge) SAVE.set("dynamic-pollution", dynaPol);
    } else {
      dynaPol = 0.0;
    };


    if(Vars.state.isGame() && TIMER.timerState_paramLarge) {


      blkPol = 0.0;


      VARGEN.mainTeams.forEach(team => {


        // Team cores
        let cepCap = 0.0;
        team.cores().each(b => {

          cepCap += _cepProv(b.block, b);

        });
        cepCapMap.put(team, cepCap);


        // Team buildings
        let cepUse = 0.0;
        team.data().buildings.each(b => {

          if(b.liquids != null && b.liquids.currentAmount() > 0.0 && DB_block.db["class"]["nonAux"].hasIns(b.block)) FRAG_fluid.comp_updateTile_aux(b);

          if(MDL_cond._isBuildingActive(b)) {
            cepUse += _cepUse(b.block, b);
            if(Mathf.chance(VAR.p_polUpdateP)) blkPol += _pol(b.block);
          };

        });
        cepUseMap.put(team, cepUse);


        // Team units
        team.data().units.each(unit => {

        });


        let cepFrac = cepCap < 0.0001 ? 1.0 : cepUse / cepCap;
        cepFracMap.put(team, cepFrac);
        let cepEffc = cepFrac < 1.0001 ? 1.0 : Mathf.maxZero((2.0 * cepCap - cepUse) / cepCap);
        cepEffcMap.put(team, cepEffc);


      });


      blkPol /= VAR.p_polUpdateP;


    };


  }, 22468922);
