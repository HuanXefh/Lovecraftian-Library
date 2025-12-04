/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The root of all units.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");


  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_unit = require("lovec/frag/FRAG_unit");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_pollution = require("lovec/mdl/MDL_pollution");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- component ----------> */


  function comp_init(utp) {
    FRAG_faci.comp_init_outline(utp);
  };


  function comp_setStats(utp) {
    if(utp.overwriteVanillaStat) {
      utp.stats.remove(Stat.mineTier);
    };

    if(MDL_cond._isNonRobot(utp)) utp.stats.add(TP_stat.utp_notRobot, true);
    let polTol = MDL_pollution._polTol(utp);
    if(!polTol.fEqual(500.0)) utp.stats.add(TP_stat.blk_polTol, polTol, TP_stat.blk_polUnits);
  };


  function comp_update(utp, unit) {
    if(utp.useLovecDamagePenalty) FRAG_unit.comp_update_damaged(utp, unit);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(null)
  .setTags()
  .setParam({
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaStat: true,
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaProp: true,
    // @PARAM: Whether to enable health-based status effects.
    useLovecDamagePenalty: true,

    entityName: "flying",
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


    update: function(unit) {
      comp_update(this, unit);
    },


  });


  // Resolves entity mapping for the unit type
  module.exports.initUnit = function(utp) {
    let tup = DB_unit.db["map"]["entity"]["type"].read(utp.entityName, [UnitEntity, null]);

    if(tup[1] == null) {
      utp.constructor = () => extend(tup[0], {});
    } else {
      if(EntityMapping.idMap[tup[1]] == null) {
        let lambda = prov(() => extend(tup[0], (function() {
          let obj = Object.create(DB_unit.db["map"]["entity"]["entityDef"].read(tup[1], Object.air));
          obj.classId = function() {return tup[1]};
          return obj;
        })()));
        EntityMapping.idMap[tup[1]] = lambda;
      };
      EntityMapping.nameMap.put(utp.entityName, EntityMapping.idMap[tup[1]]);
      utp.constructor = EntityMapping.map(utp.entityName);
    };
  };
