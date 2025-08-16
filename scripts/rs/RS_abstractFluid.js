/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Fake fluids that cannot be transfered and stored by regular pipes, like heat.
   * These fluids are abbreviated as "AUX" (auxilliary fluid).
   * You have to put {gas: true} in the json file by the way.
   *
   * The basic auxilliary fluid are named "aux0aux-xxx" instead of "aux-xxx", since "aux" is not allowed for folder name on Windows.
   * Holy fuk.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * rs.alts: 0
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


  module.exports = {


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
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["rs-aux"],
    }),


  };
