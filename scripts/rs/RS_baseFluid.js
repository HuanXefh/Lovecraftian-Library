/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Fluids without features.
   * There is nothing named {RS_oreFluid}, since every liquid can be ore in some way.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Liquid
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * !NOTHING
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/rs/RS_baseResource");
  const PARAM = require("lovec/glb/GLB_param");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_table = require("lovec/mdl/MDL_table");


  const DB_fluid = require("lovec/db/DB_fluid");


  const TP_effect = require("lovec/tp/TP_effect");
  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(liq) {
    liq.incinerable = false;
    liq.coolant = false;
    liq.capPuddles = true;

    if(liq.vaporEffect === Fx.vapor) {
      liq.vaporEffect = TP_effect._ventSmog(10.0, 30.0, liq, 1.5);
    };

    if(liq.gas) {
      liq.gasColor = Color.valueOf("bfbfbf")
    } else {
      liq.boilPoint = MDL_flow._boilPon(liq) / 50.0;
    };

    if(liq.temperature.fEqual(0.5)) liq.temperature = MDL_flow._tempWrap(liq);
    if(liq.viscosity.fEqual(0.5)) liq.viscosity = MDL_flow._viscWrap(liq);
  };


  function comp_setStats(liq) {
    liq.stats.remove(Stat.explosiveness);
    liq.stats.remove(Stat.flammability);
    liq.stats.remove(Stat.temperature);
    liq.stats.remove(Stat.heatCapacity);
    liq.stats.remove(Stat.viscosity);

    if(liq.explosiveness > 0.0) liq.stats.addPercent(Stat.explosiveness, liq.explosiveness);
    if(liq.flammability > 0.0) liq.stats.addPercent(Stat.flammability, liq.flammability);
    if(!liq.temperature.fEqual(0.5)) liq.stats.add(Stat.temperature, liq.temperature.perc());
    if(!liq.heatCapacity.fEqual(0.5)) liq.stats.addPercent(Stat.heatCapacity, liq.heatCapacity);
    if(!liq.gas && !liq.viscosity.fEqual(0.5)) liq.stats.add(Stat.viscosity, liq.viscosity.perc());

    if(liq.effect !== StatusEffects.none) liq.stats.add(TP_stat.rs_fluidStatus, StatValues.content([liq.effect].toSeq()));

    if(!liq.gas && MDL_cond._isConductiveLiq(liq)) liq.stats.add(TP_stat.rs_conductiveLiq, true);

    var dens = MDL_flow._dens(liq);
    liq.stats.add(TP_stat.rs_dens, liq.gas ? dens.sci(-3) : Strings.fixed(dens, 2));

    var fHeat = MDL_flow._fHeat(liq);
    if(!fHeat.fEqual(26.0)) liq.stats.add(TP_stat.rs_fHeat, fHeat, TP_stat.rs_heatUnits);

    var eleGrpB = MDL_flow._eleGrpB(liq);
    if(eleGrpB !== "!ERR") liq.stats.add(TP_stat.rs_eleGrp, eleGrpB);
    var fTagsB = MDL_flow._fTagsB(liq);
    if(fTagsB !== "!NOTAG") liq.stats.add(TP_stat.rs_fTags, fTagsB);
    var corPow = MDL_flow._corPow(liq);
    if(corPow > 0.0) liq.stats.add(TP_stat.rs_corPow, corPow.perc());

    let oreblks = MDL_content._oreBlks(liq);
    if(oreblks.length > 0) {
      liq.stats.add(TP_stat.rs_isOre, true);
      liq.stats.add(TP_stat.rs_blockRelated, extend(StatValue, {display(tb) {
        tb.row();
        MDL_table.setDisplay_ctRow(tb, oreblks);
      }}));
    };

    if(VARGEN.fuelLiqs.includes(liq) || VARGEN.fuelGases.includes(liq)) {
      liq.stats.add(TP_stat.rs0fuel_level, FRAG_faci._fuelLvl(liq));
    };
  };


  function comp_update(liq, puddle) {
    FRAG_fluid.comp_update_fix(liq, puddle);
    FRAG_fluid.comp_update_shortCircuit(liq, puddle);
    FRAG_fluid.comp_update_puddleReaction(liq, puddle);
  };


  function comp_willBoil(liq) {
    return liq.gas || liq.boilPoint * 50.0 < PARAM.glbHeat - 0.0001;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- resource ----------> */


    init: function(liq) {
      PARENT.init(liq);
      comp_init(liq);
    },


    setStats: function(liq) {
      PARENT.setStats(liq);
      comp_setStats(liq);
    },


    update: function(liq, puddle) {
      comp_update(liq, puddle)
    },


    loadIcon: function(liq) {
      PARENT.loadIcon(liq);
    },


    createIcons: function(liq, packer) {
      PARENT.createIcons(liq, packer);
    },


    /* <---------- resource (specific) ----------> */


    // @NOSUPER
    willBoil: function(liq) {
      return comp_willBoil(liq);
    },


    /* <---------- resource (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(liq) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


  };


  TEMPLATE._std = function() {
    return {
      alts: 0,
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      update(puddle) {
        this.super$update(puddle);
        TEMPLATE.update(this, puddle);
      },
      loadIcon() {
        this.super$loadIcon();
        TEMPLATE.loadIcon(this);
      },
      createIcons(packer) {
        this.super$createIcons(packer);
        TEMPLATE.createIcons(this, packer);
      },
      willBoil() {
        return TEMPLATE.willBoil(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  module.exports = TEMPLATE;
