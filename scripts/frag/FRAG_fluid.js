/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_puddle = require("lovec/frag/FRAG_puddle");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_reaction = require("lovec/mdl/MDL_reaction");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_fluid = require("lovec/db/DB_fluid");


  /* <---------- liquid module ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds liquid to {b}, with {b_f} as the source.
   * Set {returnFrac} to {true} for efficiency calculation.
   * Use negative {rate} for reduction.
   * ---------------------------------------- */
  const addLiquid = function(b, b_f, liq, rate, forced, returnFrac) {
    let amtTrans = 0.0;
    if(b.liquids == null || (!forced && rate > 0.0 && !b.acceptLiquid(b_f, liq))) return amtTrans;
    if(rate == null) rate = 0.0;
    if(Math.abs(rate) < 0.0001) return amtTrans;

    let delta = b_f == null ? Time.delta : b_f.edelta();
    amtTrans = rate > 0.0 ?
      Math.min(rate * delta, b.block.liquidCapacity - b.liquids.get(liq)) :
      -Math.min(-rate * delta, b.liquids.get(liq));
    b.handleLiquid(b_f, liq, amtTrans);

    return returnFrac ? Math.abs(amtTrans / rate) : Math.abs(amtTrans);
  };
  exports.addLiquid = addLiquid;


  /* ----------------------------------------
   * NOTE:
   *
   * Used when a large amount of liquid is produced at once.
   * Use negative {amt} for reduction.
   * ---------------------------------------- */
  const addLiquidBatch = function(b, b_f, liq, amt, forced) {
    let amtTrans = 0.0;
    if(b.liquids == null || (!forced && amt > 0.0 && !b.acceptLiquid(b_f, liq))) return amtTrans;
    if(amt == null) amt = 0.0;
    if(Math.abs(amt) < 0.0001) return amtTrans;

    amtTrans = amt > 0.0 ?
      Math.min(amt, b.block.liquidCapacity - b.liquids.get(liq)) :
      -Math.min(-amt, b.liquids.get(liq));
    b.handleLiquid(b_f, liq, amtTrans);

    return Math.abs(amtTrans);
  };
  exports.addLiquidBatch = addLiquidBatch;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets {b} transfer liquid to {b_t}.
   * Uses {edelta} of {b} by default, set {isActiveTrans} to {true} to use {b_t}'s edelta instead.
   * ---------------------------------------- */
  const transLiquid = function(b, b_t, liq, rate, isActiveTrans) {
    let amtTrans = 0.0;
    if(b_t == null) return amtTrans;
    if(b.liquids == null || b_t.liquids == null || !b_t.acceptLiquid(b, liq)) return amtTrans;
    if(rate == null) rate = 0.0;
    if(Math.abs(rate) < 0.0001) return amtTrans;

    let amtCur = b.liquids.get(liq);
    if(amtCur < 0.0001) return amtTrans;
    let amtCur_t = b_t.liquids.get(liq);
    let cap_t = b_t.block.liquidCapacity;
    amtTrans = Math.min(Mathf.clamp((isActiveTrans ? b_t.edelta() : b.edelta()) * rate, 0.0, cap_t - amtCur_t), amtCur);

    b_t.handleLiquid(b, liq, amtTrans);
    b.liquids.remove(liq, amtTrans);

    return amtTrans;
  };
  exports.transLiquid = transLiquid;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a block that contains pressure/vacuum dump it, which affects {presBase}.
   * Not regular {dumpLiquid}.
   * ---------------------------------------- */
  const dumpPres = function(b, rate, isVac, splitAmt, fluidType) {
    let amtTrans = 0.0;
    if(b.liquids == null) return amtTrans;
    if(splitAmt == null) splitAmt = 1;
    if(fluidType == null) fluidType = "both";

    let liqCur = b.liquids.current();
    b.proximity.each(ob => {
      ob = ob.getLiquidDestination(b, liqCur);
      if(ob.ex_accPresBase == null || MDL_cond._isPump(ob.block)) return;
      if(fluidType !== "both" && ob.block.ex_getFluidType != null && ob.block.ex_getFluidType() !== fluidType) return;

      let amt = addLiquid(b, b, isVac ? VARGEN.auxVac : VARGEN.auxPres, -rate / splitAmt);
      if(amt < 0.0001) return;

      ob.ex_accPresBase(ob.ex_accPresBase("read") + amt * (isVac ? -1.0 : 1.0));
      amtTrans += amt;
    });

    return amtTrans;
  };
  exports.dumpPres = dumpPres;


  /* <---------- component ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Puddles will exist even when {NaN} occurs, they are invisible and break the save permanently somehow.
   * ---------------------------------------- */
  const comp_update_fix = function(liq, puddle) {
    if(isNaN(puddle.amount)) puddle.remove();
  };
  exports.comp_update_fix = comp_update_fix;


  /* ----------------------------------------
   * NOTE:
   *
   * The puddle fumes, that's it.
   * ---------------------------------------- */
  const comp_update_fuming = function(liq, puddle) {
    if(liq.gas) return;
    if(!Mathf.chance(MDL_effect._p_frac(0.03, puddle.amount * 0.04))) return;
    if(!DB_fluid.db["group"]["fuming"].includes(liq.name)) return;

    MDL_effect.showAt(puddle.x, puddle.y, EFF.heatSmog);
  };
  exports.comp_update_fuming = comp_update_fuming;


  /* ----------------------------------------
   * NOTE:
   *
   * If a block can short-circuit and it's soaked in a condutive puddle...
   * Check {DB_block.db["group"]["shortCircuit"]}.
   * ---------------------------------------- */
  const comp_update_shortCircuit = function(liq, puddle) {
    if(PARAM.updateSuppressed || !Mathf.chance(0.1)) return;
    if(liq.gas || !MDL_cond._isConductiveLiq(liq)) return;

    let t = puddle.tile;
    let ob, dmg;
    FRAG_puddle.spreadPuddle(puddle, 0.5, ot => {
      ob = ot.build;
      return ob != null && ob.power != null && ob.power.status > 0.0 && MDL_cond._canShortCircuit(ob.block);
    }, ot => {
      ob = ot.build;
      dmg = Time.delta * ob.maxHealth * VAR.blk_shortCircuitDmgFrac / 60.0;
      ob.damagePierce(dmg);
      if(Mathf.chance(0.05)) MDL_effect.showAt(ob.x, ob.y, EFF.heatSmog);
      if(Mathf.chanceDelta(0.01)) FRAG_attack.apply_lightning(ob.x, ob.y, null, null, null, 6, 4);
    });
  };
  exports.comp_update_shortCircuit = comp_update_shortCircuit;


  const comp_canPlaceOn_shortCircuit = function(blk, t, team, rot, offTy) {
    const thisFun = comp_canPlaceOn_shortCircuit;

    let cond;
    if(thisFun.funTup.length === 0 || t !== thisFun.funTup[0]) {
      cond = MDL_cond._canShortCircuit(blk)
        && t != null
        && t.floor().liquidDrop != null
        && MDL_cond._isConductiveLiq(t.floor().liquidDrop);

      thisFun.funTup[0] = t;
      thisFun.funTup[1] = cond;
    } else {
      cond = thisFun.funTup[1];
    };

    if(cond) {
      MDL_draw.drawText_place(blk, t.x, t.y, MDL_bundle._info("lovec", "text-short-circuit"), false, offTy);
      return false;
    } else return true;
  }
  .setProp({
    "funTup": [],
  });
  exports.comp_canPlaceOn_shortCircuit = comp_canPlaceOn_shortCircuit;


  /* ----------------------------------------
   * NOTE:
   *
   * How puddles call {MDL_reaction}.
   * ---------------------------------------- */
  const comp_update_puddleReaction = function(liq, puddle) {
    if(!Mathf.chance(0.05)) return;

    let t = puddle.tile;
    let ot, ob, opuddle;
    for(let i = 0; i < 8; i++) {
      ot = t.nearby(Geometry.d8[i]);
      if(ot == null) continue;

      ob = ot.build;
      if(ob != null && !MDL_cond._isNoReacBlk(ob.block)) {
        if(ob.items != null) ob.items.each(itm => MDL_reaction.handleReaction(itm, liq, 20.0, ob));
        if(ob.liquids != null) MDL_reaction.handleReaction(ob.liquids.current(), liq, 20.0, ob);
      };

      opuddle = Puddles.get(ot);
      if(opuddle != null) {
        MDL_reaction.handleReaction(opuddle.liquid, liq, 20.0, ot);
      };
    };
  };
  exports.comp_update_puddleReaction = comp_update_puddleReaction;


  /* ----------------------------------------
   * NOTE:
   *
   * The building will be destroyed if it contains abstract fluid.
   * This is not actually called in {updateTile}.
   * ---------------------------------------- */
  const comp_updateTile_aux = function(b) {
    if(b.liquids == null) return;
    if(MDL_cond._isAuxBlk(b.block)) return;

    if(MDL_cond._isAux(b.liquids.current())) {
      b.kill();
      MDL_effect.showAt_regFade(b.x, b.y, Icon.cancel, Color.scarlet);
      MDL_ui.show_fadeInfo("lovec", "trans-abstract-fluid");
    };
  };
  exports.comp_updateTile_aux = comp_updateTile_aux;


  /* ----------------------------------------
   * NOTE:
   *
   * Prevents the building from storing a large amount of abstract fluid.
   * If the abstract fluid is an exception (e.g. heat), it should have the tag {"rs-nocap0aux"}.
   * ---------------------------------------- */
  const comp_updateTile_capAux = function(b) {
    if(b.liquids == null || !Mathf.chance(0.02)) return;

    let limit = VAR.ct_auxCap;
    b.liquids.each(liq => {
      if(MDL_cond._isAux(liq) && !MDL_cond._isNoCapAux(liq) && b.liquids.get(liq) > limit) b.liquids.set(liq, limit);
    });
  };
  exports.comp_updateTile_capAux = comp_updateTile_capAux;


  /* ----------------------------------------
   * NOTE:
   *
   * If the building contains flammable fluids and there's fire nearby, detonate it.
   * ---------------------------------------- */
  const comp_updateTile_flammable = function(b) {
    if(!Vars.state.rules.reactorExplosions) return;
    if(!Mathf.chance(0.004) || b.liquids == null) return;

    let liqCur = b.liquids.current();
    var cond1 = liqCur.explosiveness > 0.2999 || liqCur.flammability > 0.2999;
    if(!cond1) return;
    var cond2 = MDL_pos._tsEdge(b.tile, b.block.size).some(ot => Fires.get(ot.x, ot.y) != null);
    if(!cond2) return;

    FRAG_attack.apply_explosion_global(b.x, b.y, FRAG_attack._presExploRad(b.block.size), FRAG_attack._presExploDmg(b.block.size), 8.0);
  };
  exports.comp_updateTile_flammable = comp_updateTile_flammable;


  /* ----------------------------------------
   * NOTE:
   *
   * @METHOD: b.ex_getPresTmp
   * ---------------------------------------- */
  const comp_setBars_pres = function(blk) {
    if(MDL_cond._isPump(blk)) return;

    blk.addBar("lovec-pressure", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-pressure-amt", Strings.fixed(b.ex_getPresTmp(), 2))),
      prov(() => b.ex_getPresTmp() > 0.0 ? Color.valueOf("b8d3e0") : Color.valueOf("6992aa")),
      () => Mathf.clamp(b.ex_getPresTmp() / (b.ex_getPresTmp() > 0.0 ? MDL_flow._presRes(blk) : MDL_flow._vacRes(blk))),
    ));
  };
  exports.comp_setBars_pres = comp_setBars_pres;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: b.presTmp, b.presBase, b.presRes, b.vacRes
   * Used in a liquid block, controls the pressure/vacuum transfered.
   * ---------------------------------------- */
  const comp_updateTile_pres = function(b) {
    if(PARAM.updateSuppressed || MDL_cond._isPump(b.block)) return;

    // Damage the building if over limit
    if(!PARAM.updateDeepSuppressed && Mathf.chance(0.02) && (b.presTmp > (b.presRes + 0.5) || b.presTmp < (b.vacRes - 0.5))) {
      let dmg = b.edelta() * (b.maxHealth * VAR.blk_presDmgFrac + VAR.blk_presDmgMin) * (b.presTmp > 0.0 ? (b.presTmp / b.presRes) : (b.presTmp / b.vacRes));
      b.damagePierce(dmg);
    };

    // Base pressure gradually drops to zero
    b.presBase -= b.presBase * 0.01666667 * b.edelta();
    if(b.presBase.fEqual(0.0, 0.005)) b.presBase = 0.0;

    if(!TIMER.timerState_liq || b.presTmp.fEqual(0.0, 0.005)) return;

    if(b.block.rotate) {
      // If rotatable, supply the building in front of this
      let ob = b.front();
      if(ob != null && ob.team === b.team) {
        addLiquid(ob, b, b.presTmp > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, Math.abs(b.presTmp.roundFixed(1)) / 60.0 * VAR.time_liqIntv);
      };
    } else {
      // If not, supply all possible consumers around this
      let div = 0;
      let aux = b.presTmp > 0.0 ? VARGEN.auxPres : VARGEN.auxVac;
      let ob_fi;
      b.proximity.each(ob => {
        ob_fi = ob.getLiquidDestination(b, aux);
        if(ob_fi.acceptLiquid(b, aux)) div++;
      });
      if(div !== 0) b.proximity.each(ob => {
        ob_fi = ob.getLiquidDestination(b, aux);
        addLiquid(ob_fi, b, aux, b.presTmp.roundFixed(1) / div * VAR.time_liqIntv);
      });
    };
  };
  exports.comp_updateTile_pres = comp_updateTile_pres;


  /* ----------------------------------------
   * NOTE:
   *
   * If a building containing pressure/vacuum is severely damaged, it has chance to explode.
   * ---------------------------------------- */
  const comp_updateTile_pressuredBuilding = function(b) {
    // TODO
  }
  .setTodo("Pressure, how to get pressure in a building generally, how it explodes.");
  exports.comp_updateTile_pressuredBuilding = comp_updateTile_pressuredBuilding;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: b.corRes
   * Deals corrosion damage to the building. See {DB_fluid} for parameters.
   * ---------------------------------------- */
  const comp_updateTile_corrosion = function(b) {
    const thisFun = comp_updateTile_corrosion;

    if(PARAM.updateSuppressed) return;
    if(!Mathf.chance(0.02)) return;

    let liqCur = b.liquids.current();
    let amt = b.liquids.get(liqCur);
    if(amt < 0.05) return;
    let corPow = thisFun.funMap.get(liqCur.id);
    if(corPow == null) {
      corPow = MDL_flow._corPow(liqCur);
      thisFun.funMap.put(liqCur.id, corPow);
    };
    let corMtp = MDL_flow._corMtp(b.block, liqCur);
    if(corPow < 0.01 && corMtp > 1.0) corPow = 1.0;
    if(corPow < 0.01) return;
    let corRes = b.corRes;

    let dmg = b.edelta() * (b.maxHealth * VAR.blk_corDmgFrac + VAR.blk_corDmgMin) * corPow * corMtp / corRes;
    b.damagePierce(dmg);

    if(Mathf.chance(0.5)) MDL_effect.showAt_corrosion(b.x, b.y, b.block.size, liqCur.color);
  }
  .setProp({
    "funMap": new ObjectMap(),
  });
  exports.comp_updateTile_corrosion = comp_updateTile_corrosion;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: b.cloggable
   * Just another type of corrosion damage, but based on viscosity.
   * ---------------------------------------- */
  const comp_updateTile_cloggable = function(b) {
    if(PARAM.updateSuppressed) return;
    if(!Mathf.chance(0.02) || !b.cloggable) return;

    let liqCur = b.liquids.current();
    let visc = liqCur.viscosity;
    let viscThr = VAR.blk_clogViscThr;
    if(visc < viscThr) return;
    let amt = b.liquids.get(liqCur);
    if(amt < 0.05) return;
    let cap = b.block.liquidCapacity;

    let dmg = b.edelta() * (b.maxHealth * VAR.blk_clogDmgFrac + VAR.blk_clogDmgMin) * Mathf.lerp(0.5, 1.0, amt / cap) * Mathf.lerp(0.5, 1.0, (visc / viscThr) / 0.25);
    b.damagePierce(dmg);

    if(Mathf.chance(0.5)) MDL_effect.showAt_corrosion(b.x, b.y, b.block.size, liqCur.color, true);
  };
  exports.comp_updateTile_cloggable = comp_updateTile_cloggable;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: b.heatRes
   * Damages the building if fluid heat exceeds its heat resistence.
   * ---------------------------------------- */
  const comp_updateTile_fHeat = function(b) {
    if(PARAM.updateSuppressed) return;
    if(!Mathf.chance(0.02)) return;

    let heatRes = b.heatRes;
    if(!isFinite(heatRes)) return;
    let fHeat = MDL_flow._fHeat_b(b);
    if(fHeat < heatRes + 0.0001) return;

    let dmg = b.edelta() * 2.0 * fHeat / heatRes;
    b.damagePierce(dmg);

    MDL_effect.showAt(b.x, b.y, EFF.heatSmog, 0.0);
  };
  exports.comp_updateTile_fHeat = comp_updateTile_fHeat;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: b.heatRes
   * ---------------------------------------- */
  const comp_draw_fHeat = function(b, reg, ang) {
    if(!PARAM.drawFluidHeat) return;
    if(!VARGEN.hotFlds.includes(b.liquids.current())) return;

    let fHeat = MDL_flow._fHeat_b(b);
    let heatRes = b.heatRes;
    if(!isFinite(heatRes)) return;

    MDL_draw.drawRegion_heat(b.x, b.y, Math.pow(Mathf.clamp(fHeat * 0.75 / heatRes), 3), reg, ang, b.block.size);
  };
  exports.comp_draw_fHeat = comp_draw_fHeat;


  const comp_setBars_fHeat = function(blk) {
    blk.addBar("lovec-fheat", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-fluid-heat-amt", Strings.fixed(MDL_flow._fHeat_b(b), 2) + " " + TP_stat.rs_heatUnits.localized())),
      prov(() => Pal.lightOrange),
      () => Mathf.clamp(MDL_flow._fHeat_b(b) / MDL_flow._heatRes(blk)),
    ));
  };
  exports.comp_setBars_fHeat = comp_setBars_fHeat;
