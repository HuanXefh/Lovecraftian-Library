/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The most basic items that have no features.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseResource");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_fuel = require("lovec/mdl/MDL_fuel");


  const DB_item = require("lovec/db/DB_item");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(itm) {
    if(itm.overwriteVanillaProp) {
      itm.hardness = DB_item.db["param"]["hardness"].read(itm.name, itm.hardness);
    };
  };


  function comp_setStats(itm) {
    if(itm.overwriteVanillaStat) {
      itm.stats.remove(Stat.explosiveness);
      itm.stats.remove(Stat.flammability);
      itm.stats.remove(Stat.radioactivity);
      itm.stats.remove(Stat.charge);
      if(itm.explosiveness > 0.0) itm.stats.addPercent(Stat.explosiveness, itm.explosiveness);
      if(itm.flammability > 0.0) itm.stats.addPercent(Stat.flammability, itm.flammability);
      if(itm.radioactivity > 0.0) itm.stats.addPercent(Stat.radioactivity, itm.radioactivity);
      if(itm.charge > 0.0) itm.stats.addPercent(Stat.charge, itm.charge);

      if(itm.buildable) itm.stats.add(TP_stat.rs_buildable, true);
      if(itm.hardness > 0) itm.stats.add(TP_stat.rs_hardness, itm.hardness);
    };

    if(VARGEN.fuelItms.includes(itm)) {
      itm.stats.add(TP_stat.rs0fuel_point, MDL_fuel._fuelPon(itm));
      itm.stats.add(TP_stat.rs0fuel_level, MDL_fuel._fuelLvl(itm));
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Item)
  .setTags()
  .setParam({})
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
