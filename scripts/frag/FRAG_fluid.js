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


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const DB_fluid = require("lovec/db/DB_fluid");


  /* <---------- liquid module ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds liquid to {b}, with {b_f} as the source.
   * Set {returnFrac} to {true} for efficiency calculation.
   * ---------------------------------------- */
  const addLiquid = function(b, b_f, liq, rate, returnFrac) {
    let amtTrans = 0.0;
    if(b == null || liq == null) return amtTrans;
    if(b.liquids == null || !b.acceptLiquid(b_f, liq)) return amtTrans;

    if(rate == null) rate = 0.0;
    if(Math.abs(rate) < 0.0001) return amtTrans;

    amtTrans = rate > 0.0 ?
      Math.min(rate * b.edelta(), b.block.liquidCapacity - b.liquids.get(liq)) :
      -Math.min(-rate * b.edelta(), b.liquids.get(liq));
    b.handleLiquid(b_f, liq, amtTrans);

    return returnFrac ? Math.abs(amtTrans / rate) : amtTrans;
  };
  exports.addLiquid = addLiquid;


  /* ----------------------------------------
   * NOTE:
   *
   * Used when a large amount of liquid is produced at once.
   * ---------------------------------------- */
  const addLiquidBatch = function(b, b_f, liq, amt) {
    let amtTrans = 0.0;
    if(b == null || liq == null) return amtTrans;
    if(b.liquids == null || !b.acceptLiquid(b_f, liq)) return amtTrans;

    if(amt == null) amt = 0.0;
    if(Math.abs(amt) < 0.0001) return amtTrans;

    amtTrans = amt > 0.0 ?
      Math.min(amt, b.block.liquidCapacity - b.liquids.get(liq)) :
      -Math.min(-amt, b.liquids.get(liq));
    b.handleLiquid(b_f, liq, amtTrans);

    return amtTrans;
  };
  exports.addLiquidBatch = addLiquidBatch;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets {b} transfer liquid to {b_t}.
   * Uses edelta of {b} by default, set {isActiveTrans} to {true} to use {b_t}'s edelta instead.
   * ---------------------------------------- */
  const transLiquid = function(b, b_t, liq, rate, isActiveTrans) {
    let amtTrans = 0.0;
    if(b == null || b_t == null || liq == null) return amtTrans;
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
   * Moves liquid from {b} to {b_t} occasionally.
   * Mostly used for conduits.
   * Do not use this unless you understand everything here.
   * ---------------------------------------- */
  const moveLiquid = function(b, b_t, liq) {
    let amtTrans = 0.0;
    if(b == null || b_t == null || liq == null) return amtTrans;
    if(b.liquids == null) return amtTrans;

    // Called occasionally to update params in {b}
    if(TIMER.timerState_liq) {
      b.liqEnd = _liqEnd(b, b_t);
      if(b.liqEnd == null) {
        b.tmpFlow = 0.0;
      } else {
        b.tmpRate = MDL_flow._flow(
          b,
          b_t,
          b.liquids.get(liq) / b.block.liquidCapacity,
          b_t.liquids.get(liq) / b_t.block.liquidCapacity,
          b.ex_accPres("read"),
          liq.viscosity,
        );
      };
    };

    if(b.liqEnd == null || b.liqEnd.liquids == null) return amtTrans;

    if(b.team === b.liqEnd.team && b.liqEnd.acceptLiquid(b, liq)) {

      amtTrans = transLiquid(b, b_t, liq, b.tmpRate);

    } else if(!b.liqEnd.block.consumesLiquid(liq) && b.liqEnd.liquids.currentAmount() / b.liqEnd.block.liquidCapacity > 0.1 && b.liquids.currentAmount() / b.block.liquidCapacity > 0.1) {

      // TODO

    };

    return amtTrans;
  }
  .setTodo("{MDL_reaction} and reaction handler.");
  exports.moveLiquid = moveLiquid;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the transportation destination.
   * Any building with the tag {"blk-fjunc"} will be considered a junction.
   * ---------------------------------------- */
  const _liqEnd = function(b, b_t) {
    if(b == null || b_t == null) return;
    if(b.liquids == null) return;
    if(!(b_t.block instanceof LiquidJunction) || !MDL_cond._isFJunc(b_t.block)) return b_t;

    var rot_t = b.relativeTo(b_t);
    let end = "tmp";
    let t = b_t.tile;
    while(end === "tmp") {
      end = (t == null) ? null : t.build;
      if(end != null && (b_t.block instanceof LiquidJunction || MDL_cond._isFJunc(end.block)) && end.team == b.team) {
        t = end.tile.nearby(rot_t);
        end = "tmp";
      };
    };

    return end;
  };
  exports._liqEnd = _liqEnd;


  /* <---------- puddle ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a puddle spread and trigger something.
   * Use {boolF} to filter out tiles to spread to.
   * Use {scr} to set what will happen if tile (that can be spread to) is beneath the puddle.
   * ---------------------------------------- */
  const spreadPuddle = function(puddle, amtDepos, boolF, scr) {
    if(puddle == null) return;

    if(amtDepos == null) amtDepos = 0.5;

    MDL_pos._tsRect(puddle.tile, 1).forEach(ot => {
      if(boolF != null && boolF(ot)) {
        Puddles.deposit(ot, puddle.liquid, Time.delta * amtDepos);
        if(ot === puddle.tile && scr != null) scr(ot);
      };
    });
  };
  exports.spreadPuddle = spreadPuddle;


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
    if(!Mathf.chanceDelta(MDL_effect._p_frac(0.03, puddle.amount * 0.04))) return;
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
    if(PARAM.updateSuppressed || !Mathf.chanceDelta(0.1)) return;
    if(liq.gas || !MDL_cond._isConductiveLiq(liq)) return;

    let t = puddle.tile;
    spreadPuddle(puddle, 0.5, ot => {
      let ob = ot.build;
      return ob != null && ob.power != null && ob.power.status > 0.0 && MDL_cond._canShortCircuit(ob.block);
    }, ot => {
      let ob = ot.build;
      let dmg = Time.delta * ob.maxHealth * VAR.blk_shortCircuitDmgFrac / 60.0;
      ob.damagePierce(dmg);
      MDL_effect.showAtP(0.05, ob.x, ob.y, EFF.heatSmog);
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
    // TODO
  }
  .setTodo("How reaction happens in a puddle.");
  exports.comp_update_puddleReaction = comp_update_puddleReaction;


  /* ----------------------------------------
   * NOTE:
   *
   * The building will be destroyed if it contains abstract fluid.
   * This is not actually called in {updateTile}.
   * ---------------------------------------- */
  const comp_updateTile_aux = function(b) {
    if(b == null || b.liquids == null) return;
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
    if(b == null) return;
    if(b.liquids == null || !Mathf.chanceDelta(0.02)) return;

    var limit = VAR.ct_auxCap;
    b.liquids.each(liq => {
      if(MDL_cond._isAux(liq) && !MDL_cond._isNoCapAux(liq) && b.liquids.get(liq) > limit) b.liquids.set(liq, limit);
    });
  };
  exports.comp_updateTile_capAux = comp_updateTile_capAux;


  const comp_updateTile_flammable = function(b) {
    if(!Vars.state.rules.reactorExplosions) return;
    if(!Mathf.chanceDelta(0.004) || b.liquids == null) return;

    let liqCur = b.liquids.current();
    var cond1 = liqCur.explosiveness > 0.2999 || liqCur.flammability > 0.2999;
    if(!cond1) return;
    var cond2 = MDL_pos._tsEdge(b.tile, b.block.size).some(ot => Fires.get(ot.x, ot.y) != null);
    if(!cond2) return;

    FRAG_attack.apply_explosion(b.x, b.y, FRAG_attack._gasExploRad(b.block.size), FRAG_attack._gasExploDmg(b.block.size), 8.0);
  };
  exports.comp_updateTile_flammable = comp_updateTile_flammable;


  const comp_updateTile_pressure = function(b) {
    // TODO
  }
  .setTodo("Pressure, how to get pressure in a building generally, how it explodes.");
  exports.comp_updateTile_pressure = comp_updateTile_pressure;


  /* ----------------------------------------
   * NOTE:
   *
   * Deals corrosion damage to the building. See {DB_fluid} for parameters.
   * ---------------------------------------- */
  const comp_updateTile_corrosion = function(b) {
    if(PARAM.updateSuppressed) return;
    if(!Mathf.chanceDelta(0.02)) return;

    let liqCur = b.liquids.current();
    var amt = b.liquids.get(liqCur);
    if(amt < 0.05) return;
    var corPow = MDL_flow._corPow(liqCur);
    var corMtp = MDL_flow._corMtp(b.block, liqCur);
    if(corPow < 0.01 && corMtp > 1.0) corPow = 1.0;
    if(corPow < 0.01) return;
    var corRes = MDL_flow._corRes(b.block);

    var dmg = b.edelta() * (b.maxHealth * VAR.blk_corDmgFrac + VAR.blk_corDmgMin) * corPow * corMtp / corRes;
    b.damagePierce(dmg);

    if(Mathf.chance(0.5)) MDL_effect.showAt_corrosion(b.x, b.y, b.block.size, liqCur.color);
  };
  exports.comp_updateTile_corrosion = comp_updateTile_corrosion;


  /* ----------------------------------------
   * NOTE:
   *
   * Just another type of corrosion damage, but based on viscosity.
   * ---------------------------------------- */
  const comp_updateTile_cloggable = function(b) {
    if(PARAM.updateSuppressed) return;
    if(!Mathf.chanceDelta(0.02) || !MDL_cond._isCloggable(b.block)) return;

    let liqCur = b.liquids.current();
    var visc = liq.viscosity;
    var viscThr = VAR.blk_clogViscThr;
    if(visc < viscThr) return;
    var amt = b.liquids.get(liqCur);
    if(amt < 0.05) return;
    var cap = b.block.liquidCapacity;

    var dmg = b.edelta() * (b.maxHealth * VAR.blk_clogDmgFrac + VAR.blk_clogDmgMin) * Mathf.lerp(0.5, 1.0, amt / cap) * Mathf.lerp(0.5, 1.0, (visc / viscThr) / 0.25);
    b.damagePierce(dmg);

    if(Mathf.chance(0.5)) MDL_effect.showAt_corrosion(b.x, b.y, b.block.size, liqCur.color);
  };
  exports.comp_updateTile_cloggable = comp_updateTile_cloggable;


  /* ----------------------------------------
   * NOTE:
   *
   * Damages the building if fluid heat exceeds its heat resistence.
   * ---------------------------------------- */
  const comp_updateTile_fHeat = function(b) {
    if(!Mathf.chanceDelta(0.02)) return;

    var heatRes = MDL_flow._heatRes(b.block);
    if(!isFinite(heatRes)) return;
    var fHeat = MDL_flow._fHeat_b(b);
    if(fHeat < heatRes + 0.0001) return;

    var dmg = b.edelta() * 2.0 * fHeat / heatRes;
    b.damagePierce(dmg);

    MDL_effect.showAt(b.x, b.y, EFF.heatSmog, 0.0);
  };
  exports.comp_updateTile_fHeat = comp_updateTile_fHeat;


  const comp_draw_fHeat = function(b, reg) {
    var fHeat = MDL_flow._fHeat_b(b);
    if(fHeat < 0.01) return;
    var heatRes = MDL_flow._heatRes(b.block);
    if(!isFinite(heatRes)) return;

    MDL_draw.drawRegion_heat(b.x, b.y, Mathf.clamp(fHeat * 1.2 / heatRes), reg, b.block.size);
  };
  exports.comp_draw_fHeat = comp_draw_fHeat;


  const comp_setBars_fHeat = function(blk) {
    blk.addBar("lovec-fheat", b => new Bar(
      MDL_bundle._term("lovec", "fluid-heat"),
      Pal.lightOrange,
      () => Mathf.clamp(MDL_flow._fHeat(b) / MDL_flow._heatRes(blk)),
    ));
  };
  exports.comp_setBars_fHeat = comp_setBars_fHeat;
