/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Fake fluids that cannot be transfered and stored by regular pipes, like heat.
   * These fluids are abbreviated as "AUX" (auxiliay fluid).
   * You have to put {gas: true} in the .json file by the way.
   *
   * The basic auxiliay fluid are named "aux0aux-xxx" instead of "aux-xxx", since "aux" is not allowed for folder name on Windows.
   * Holy fuk.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
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


  /* <---------- component ----------> */


  function comp_init(aux) {
    aux.incinerable = false;
    aux.coolant = false;
    aux.capPuddles = true;

    aux.lightColor = Color.black;
    aux.gasColor = Color.black;
    aux.vaporEffect = Fx.none;
  };


  function comp_setStats(aux) {
    aux.stats.remove(Stat.explosiveness);
    aux.stats.remove(Stat.flammability);
    aux.stats.remove(Stat.temperature);
    aux.stats.remove(Stat.heatCapacity);
    aux.stats.remove(Stat.viscosity);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- resource ----------> */


    init: function(aux) {
      PARENT.init(aux);
      comp_init(aux);
    },


    setStats: function(aux) {
      PARENT.setStats(aux);
      comp_setStats(aux);
    },


    update: function(aux, puddle) {

    },


    loadIcon: function(aux) {
      PARENT.loadIcon(aux);
    },


    createIcons: function(aux, packer) {
      PARENT.createIcons(aux, packer);
    },


    /* <---------- resource (specific) ----------> */


    /* <---------- resource (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(aux) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["rs-aux"],
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
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  module.exports = TEMPLATE;
