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


  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_unit = require("lovec/frag/FRAG_unit");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- component ----------> */


  function comp_init(utp) {
    FRAG_faci.comp_init_outline(utp);
  };


  function comp_setStats(utp) {
    utp.stats.remove(Stat.mineTier);

    if(MDL_cond._isNonRobot(utp)) utp.stats.add(TP_stat.utp_notRobot, true);

    var polTol = FRAG_faci._polTol(utp);
    if(!polTol.fEqual(500.0)) utp.stats.add(TP_stat.blk_polTol, polTol, TP_stat.blk_polUnits);
  };


  function comp_update(utp, unit) {
    FRAG_unit.comp_update_damaged(utp, unit);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- unit type ----------> */


    init: function(utp) {
      comp_init(utp);
    },


    setStats: function(utp) {
      comp_setStats(utp);
    },


    update: function(utp, unit) {
      comp_update(utp, unit);
    },


    killed: function(utp, unit) {

    },


    draw: function(utp, unit) {

    },


    /* <---------- unit type (specific) ----------> */


    /* <---------- unit type (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(utp) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["utp-lovec"],
    }),


  };


  TEMPLATE.init = function(utp) {
    let tup = DB_unit.db["map"]["entity"]["type"].read(utp.etpStr, [UnitEntity, null]);

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
      EntityMapping.nameMap.put(utp.etpStr, EntityMapping.idMap[tup[1]]);
      utp.constructor = EntityMapping.map(utp.etpStr);
    };
  };


  module.exports = TEMPLATE;
