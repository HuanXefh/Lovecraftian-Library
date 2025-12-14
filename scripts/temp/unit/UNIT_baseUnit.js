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
    //utp.entityTemplate = utp.entityTemplate();

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

    entityName: "flying",                // Entity used by the type, do not change unless you know it well
    entityTemplate: null,
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
    let entityVal = DB_unit.db["map"]["entity"]["type"].read(utp.entityName, UnitEntity);
    if(typeof entityVal !== "number") {
      utp.constructor = () => extend(entityVal, {});
    } else {
      if(EntityMapping.idMap[entityVal] == null) {
        let templateGetter = DB_unit.db["map"]["entity"]["entityDef"].read(entityVal);
        if(templateGetter == null) throw new Error("Entity ([$1]) is not defined yet!".format(entityVal));
        utp.entityTemplate = templateGetter();

        let entityProv = prov(() => extend(utp.entityTemplate.getParent(), mergeObj(utp.entityTemplate.build(), {
          classId: function() {
            return entityVal;
          },
        })));
        EntityMapping.idMap[entityVal] = entityProv;
      };
      EntityMapping.nameMap.put(utp.entityName, EntityMapping.idMap[entityVal]);
      utp.constructor = EntityMapping.map(utp.entityName);
    };
  };
