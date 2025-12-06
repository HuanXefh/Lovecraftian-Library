/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Fluid without any feature.
   * You should set {liq.gas} in their Json files.
   * No {RS_oreFluid} since every fluid can be ore in some way.
   * Fluid groups and some universal properties are assigned in {DB_fluid}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseResource");
  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_puddle = require("lovec/frag/FRAG_puddle");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_fuel = require("lovec/mdl/MDL_fuel");
  const MDL_reaction = require("lovec/mdl/MDL_reaction");
  const MDL_table = require("lovec/mdl/MDL_table");


  const DB_fluid = require("lovec/db/DB_fluid");


  const TP_effect = require("lovec/tp/TP_effect");
  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(liq) {
    if(liq.overwriteVanillaProp) {
      liq.incinerable = false;
      liq.coolant = false;
      liq.capPuddles = true;

      if(liq.temperature.fEqual(0.5)) liq.temperature = MDL_flow._tempWrap(liq);
      if(liq.viscosity.fEqual(0.5)) liq.viscosity = MDL_flow._viscWrap(liq);

      if(liq.vaporEffect === Fx.vapor) {
        liq.vaporEffect = TP_effect._ventSmog({
          size: 10.0,
          rad: 30.0,
          color: liq.color,
          scl: 1.5,
        });
      };
      if(liq.gas) {
        liq.gasColor = Color.valueOf("bfbfbf");
      } else {
        liq.boilPoint = MDL_flow._boilPon(liq) / 50.0;
      };
    };

    liq.isConductive = MDL_cond._isConductiveLiquid(liq);
    liq.shouldFume = DB_fluid.db["group"]["fuming"].includes(liq.name);
    liq.dens = MDL_flow._dens(liq);
    liq.fHeat = MDL_flow._fHeat(liq);
    liq.eleGrp = MDL_flow._eleGrp(liq);
    liq.fTags = MDL_flow._fTags(liq);
    liq.corPow = MDL_flow._corPow(liq);
  };


  function comp_setStats(liq) {
    if(liq.overwriteVanillaStat) {
      liq.stats.remove(Stat.explosiveness);
      liq.stats.remove(Stat.flammability);
      liq.stats.remove(Stat.temperature);
      liq.stats.remove(Stat.heatCapacity);
      liq.stats.remove(Stat.viscosity);
      if(liq.explosiveness > 0.0) liq.stats.addPercent(Stat.explosiveness, liq.explosiveness);
      if(liq.flammability > 0.0) liq.stats.addPercent(Stat.flammability, liq.flammability);
      if(!liq.temperature.fEqual(0.5)) liq.stats.add(Stat.temperature, liq.temperature.perc());
      if(!liq.heatCapacity.fEqual(0.5)) liq.stats.add(Stat.viscosity, liq.viscosity.perc());
    };

    if(liq.effect !== StatusEffects.none) liq.stats.add(TP_stat.rs_fluidStatus, StatValues.content([liq.effect].toSeq()));
    if(!liq.gas && MDL_cond._isConductiveLiquid(liq)) liq.stats.add(TP_stat.rs_conductiveLiq, true);
    let dens = MDL_flow._dens(liq);
    liq.stats.add(TP_stat.rs_dens, liq.gas ? dens.sci(-3) : Strings.fixed(dens, 2));
    let fHeat = MDL_flow._fHeat(liq);
    if(!fHeat.fEqual(26.0)) liq.stats.add(TP_stat.rs_fHeat, fHeat, TP_stat.rs_heatUnits);
    let eleGrpB = MDL_flow._eleGrpB(liq);
    if(eleGrpB !== "!ERR") liq.stats.add(TP_stat.rs_eleGrp, eleGrpB);
    let fTagsB = MDL_flow._fTagsB(liq);
    if(fTagsB !== "!NOTAG") liq.stats.add(TP_stat.rs_fTags, fTagsB);
    let corPow = MDL_flow._corPow(liq);
    if(corPow > 0.0) liq.stats.add(TP_stat.rs_corPow, corPow.perc());

    let oreblks = MDL_content._oreBlks(liq);
    if(oreblks.length > 0) {
      liq.stats.add(TP_stat.rs_isOre, true);
      liq.stats.add(TP_stat.rs_blockRelated, newStatValue(tb => {
        tb.row();
        MDL_table.setDisplay_ctLi(tb, oreblks, 48.0);
      }));
    };

    if(Array.someIncludes(liq, VARGEN.fuelLiqs, VARGEN.fuelGases)) {
      liq.stats.add(TP_stat.rs0fuel_level, MDL_fuel._fuelLvl(liq));
    };
  };


  function comp_update(liq, puddle) {
    let t = puddle.tile;
    let ot, ob, opuddle, dmg;

    if(isNaN(puddle.amount)) puddle.remove();

    // Fume if possible
    if(!liq.gas && liq.shouldFume && Mathf.chance(MDL_effect._p_frac(0.03, puddle.amount * 0.04))) {
      MDL_effect.showAt(puddle.x, puddle.y, EFF.heatSmog);
    };

    // Cause short circuit if possible
    if(!PARAM.updateSuppressed && !liq.gas && liq.isConductive && Mathf.chanceDelta(0.1)) {
      FRAG_puddle.spreadPuddle(puddle, 0.5, ot => {
        ob = ot.build;
        return ob != null && ob.power != null && ob.power.status > 0.0 && tryFun(ob.block.ex_getCanShortCircuit, ob.block, false);
      }, ot => {
        ob = ot.build;
        dmg = ob.maxHealth * VAR.blk_shortCircuitDmgFrac / 60.0;
        ob.damagePierce(dmg);
        if(Mathf.chance(0.15)) MDL_effect.showAt(ob.x, ob.y, EFF.heatSmog);
        if(Mathf.chance(0.05)) FRAG_attack._a_lightning(ob.x, ob.y, null, null, null, 6, 4);
      });
    };

    // Apply puddle reaction if possible
    if(!Vars.net.client() && Mathf.chance(0.05)) {
      for(let i = 0; i < 8; i++) {
        ot = t.nearby(Geometry.d8[i]);
        if(ot == null) continue;

        ob = ot.build;
        if(ob != null && !tryFun(ob.block.ex_getNoReac, ob.block, false)) {
          if(ob.items != null) ob.items.each(itm => MDL_reaction.handleReaction(itm, liq, 20.0, ob));
          if(ob.liquids != null) MDL_reaction.handleReaction(ob.liquids.current(), liq, 20.0, ob);
        };

        opuddle = Puddles.get(ot);
        if(opuddle != null) {
          MDL_reaction.handleReaction(opuddle.liquid, liq, 20.0, ot);
        };
      };
    };
  };


  function comp_willBoil(liq) {
    return liq.gas || liq.boilPoint * 50.0 < PARAM.glbHeat;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Liquid)
  .setTags()
  .setParam({
    isConductive: false,
    shouldFume: false,
    dens: 1.0,
    fHeat: 26.0,
    eleGrp: null,
    fTags: Array.air,
    corPow: 0.0,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


    update: function(puddle) {
      comp_update(this, puddle);
    },


    willBoil: function() {
      return comp_willBoil(this);
    }
    .setProp({
      noSuper: true,
    }),


  })
  .setGetter("isConductive", "eleGrp", "fTags", "corPow");
