/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_text = require("lovec/mdl/MDL_text");


  const TP_attr = require("lovec/tp/TP_attr");
  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");
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
   * If it's a fluid, this returns consumption speed.
   * ---------------------------------------- */
  const _fuelPon = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return 0.0;

    return DB_item.db["param"]["fuel"][rs instanceof Item ? "point" : "fCons"].read(rs.name, 0.0);
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

    return DB_item.db["param"]["fuel"][rs instanceof Item ? "level" : "fLevel"].read(rs.name, 0.0);
  };
  exports._fuelLvl = _fuelLvl;


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

    if(b.items != null && fuelType.equalsAny(["item", "any"])) {
      VARGEN.fuelItms.forEach(itm => {
        if(!b.items.has(itm) || blockedFuels.includes(itm.name)) return;

        let tmpLvl = _fuelLvl(itm);
        if(tmpLvl > fuelLvl) {
          rsTg = itm;
          fuelLvl = tmpLvl;
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
        };
      });
    };

    if(b.liquids != null && fuelType.equalsAny(["gas", "any"])) {
      VARGEN.fuelGas.forEach(gas => {
        if(b.liquids.get(gas) < 0.01 || blockedFuels.includes(gas.name)) return;

        let tmpLvl = _fuelLvl(gas);
        if(tmpLvl > fuelLvl) {
          rsTg = gas;
          fuelLvl = tmpLvl;
        };
      });
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


  var glbPol = 0.0;


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
   * Gets the global pollution point of the map.
   * ---------------------------------------- */
  const _glbPol = function() {
    return glbPol;
  };
  exports._glbPol = _glbPol;


  const comp_setStats_pol = function(blk) {
    let pol = _pol(blk);
    if(!Number(pol).fEqual(0.0)) blk.stats.add(pol > 0.0 ? TP_stat.blk_pol : TP_stat.blk_polRed, Math.abs(pol), TP_stat.blk_polUnits);
  };
  exports.comp_setStats_pol = comp_setStats_pol;


  /* <---------- terrain ----------> */


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


  /* <---------- torque ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Calculates RPM that can be gained from other buildings.
   * ---------------------------------------- */
  const _rpmSpare = function(b, applyCons) {
    var val = 0.0;
    b.proximity.each(ob => {
      if((!ob.block.rotate ?
        true :
        ob.relativeTo(b) === b.rotation
      ) && ob.liquids != null) {
        let rate = MDL_recipeDict._prodAmt(VARGEN.auxTor, ob.block) * 60.0;
        !applyCons ?
          val += rate :
          val += FRAG_fluid.addLiquid(ob, b, VARGEN.auxTor, -rate);
      };
    });

    return val;
  };
  exports._rpmSpare = _rpmSpare;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: b.rotBool
   * @METHOD: b.ex_getRpmCur, b.ex_getRotBool
   * Calculates the desired RPM for {b} now, for cogwheels only.
   * This does not include spared RPM.
   * ---------------------------------------- */
  const _rpmTg_cogwheel = function(b, setRotBool) {
    const thisFun = _rpmTg_cogwheel;

    var val = 0.0;
    let tmpB = null;
    let sizeCheck = b.block.size;
    if(sizeCheck % 2 === 0) throw new Error("Size of a cogwheel cannot be an even number!");
    while(sizeCheck > 0) {
      for(let i = 0; i < 4; j++) {
        let ob = thisFun.funScr(b, sizeCheck, i);
        if(ob == null) continue;

        let oval = ob.ex_getRpmCur() * ob.block.size / b.block.size;
        if(oval > val) {
          if(ob.ex_getRotBool() !== b.rotBool) val = oval;
          tmpB = ob;
        };
      };
      sizeCheck -= 2;
    };

    if(setRotBool && tmpB != null) {
      b.rotBool = !tmpB.ex_getRotBool();
    };

    return val;
  }
  .setProp({
    "funScr": (b, sizeCheck, ind) => {
      let pon2;
      let dstT = (sizeCheck + 1) / 2;
      switch(ind) {
        case 0 :
          pon2 = new Point2(-dstT, 0);
          break;
        case 1 :
          pon2 = new Point2(0, -dstT);
          break;
        case 2 :
          pon2 = new Point2(dstT, 0);
          break;
        case 3 :
          pon2 = new Point2(0, dstT);
          break;
      };

      let ot = b.tile.nearby(pon2);
      if(ot == null) return null;
      let ob = ot.build;
      if(ob == null || !MDL_cond._isCog(ob.block) || ob.block.size) return null;

      return ob;
    },
  });
  exports._rpmTg_cogwheel = _rpmTg_cogwheel;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: b.rpmCur, b.rotBool
   * Cogwheels will sync RPM with other cogwheels.
   * Only 1-block cogwheels can interact with torque consumers/producers.
   * ---------------------------------------- */
  const comp_updateTile_cogwheel = function(b) {
    // Slow down
    let rpmDecRate = 0.025 / b.block.size;
    b.rpmCur -= rpmDecRate * b.edelta();
    b.totalProgress += b.rpmCur;

    // Supply torque
    if(b.block.size === 1 && TIMER.timerState_liq) {
      let rate = b.rpmCur / 60.0 * b.edelta() * VAR.time_liqIntv;
      b.proximity.each(ob => {
        FRAG_fluid.addLiquid(ob, b, VARGEN.auxTor, rate);
        // For test
        if(ob.block instanceof LiquidSource && ob.source === VARGEN.auxTor) b.rpmCur = 999.0;
      });
    };

    if(TIMER.timerState_param) {
      let rpmSpare = b.block.size !== 1 ? 0.0 : _rpmSpare(b, true);
      if(rpmSpare > 0.0) {
        // Gain RPM from torque producers
        b.rpmCur = rpmSpare + rpmDecRate * VAR.time_paramIntv;
        b.rotBool = true;
      } else {
        // Gain RPM from fastest cogwheel
        b.rpmCur = _rpmTg_cogwheel(b, true);
      };
    };
  };
  exports.comp_updateTile_cogwheel = comp_updateTile_cogwheel;


  /* <---------- tree ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * @METHOD: blk.ex_getTreeGrp
   * Gets resource level of a tree (or mushroom).
   * ---------------------------------------- */
  const _treeRsLvl = function(blk) {
    if(!MDL_cond._isTreeBlock(blk)) return 0.0;

    var treeGrp = blk.ex_getTreeGrp();
    var rsLvl = 0.0;
    switch(treeGrp) {

      case "tree" :
        rsLvl = Math.max(blk.attributes.get(TP_attr.attr0blk_tree), blk.attributes.get(TP_attr.attr0blk_hardTree));
        break;

      case "fungi" :
        rsLvl = Math.max(blk.attributes.get(TP_attr.attr0blk_fungi), blk.attributes.get(TP_attr.attr0blk_hardFungi));
        break;

      case "bush" :
        // TODO
        break;

    };

    return rsLvl;
  }
  .setTodo("Sets up bush map in {DB_block.db['map']['attrMap']['bush']}.");
  exports._treeRsLvl = _treeRsLvl;


  /* <---------- wire ----------> */


  const comp_updateTile_wireTouch = function(b, b_t, dmg, color) {
    if(b_t == null || b.power == null || b.power.status < 0.01) return;
    if(dmg < 0.0001 || !Mathf.chanceDelta(0.08)) return;

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


  // Param update
  MDL_event._c_onUpdate(() => {


    if(!PARAM.modded) return;


    if(Vars.state.isGame() && TIMER.timerState_paramLarge) {


      glbPol = 0.0;


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
            if(Mathf.chance(VAR.p_polUpdateP)) glbPol += _pol(b.block);
          };

        });
        cepUseMap.put(team, cepUse);


        // Team units
        team.data().units.each(unit => {

        });


        let cepFrac = cepCap < 0.0001 ? 1.0 : cepUse / cepCap;
        cepFracMap.put(team, cepFrac);
        let cepEffc = cepFrac < 1.0001 ? 1.0 : Math.max((2.0 * cepCap - cepUse) / cepCap, 0.0);
        cepEffcMap.put(team, cepEffc);


      });


      glbPol /= VAR.p_polUpdateP;


    };


  }, 22468922);
