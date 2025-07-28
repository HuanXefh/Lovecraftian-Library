/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Fluids as intermediates.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Liquid
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * liq.alts: 0
   * liq.intmdParent: rs_gn    // @PARAM, @NULL: The parent of this intermediate.
   * liq.useParentRegion: bool    // @PARAM: Whether to copy the parent's sprite, in case that you don't draw a new one.
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


  const PARENT = require("lovec/rs/RS_baseFluid");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(liq) {
    liq.intmdParent = MDL_content._ct(liq.intmdParent, "rs");

    MDL_event._c_onLoad(() => {
      liq.shownPlanets.add(Vars.content.planet("lovec-pla0sun-veibrus"));
    });
  };


  function comp_setStats(liq) {
    liq.stats.add(TP_stat.rs_isIntermediate, true);
    if(liq.intmdParent != null) liq.stats.add(TP_stat.rs0int_parent, extend(StatValue, {display(tb) {
      tb.row();
      MDL_table.setDisplay_ctRow(tb, liq.intmdParent);
    }}));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- resource ----------> */


    init: function(liq) {
      PARENT.init(liq);
      comp_init(liq);
    },


    setStats: function(liq) {
      PARENT.setStats(liq);
      comp_setStats(liq);
    },


    loadIcon: function(liq) {
      PARENT.loadIcon(liq);
    },


    createIcons: function(liq, packer) {
      PARENT.createIcons(liq, packer);
    },


    /* <---------- resource (specific) ----------> */


    /* <---------- resource (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(liq) {
      return ["rs-intmd"];
    },


    // @NOSUPER
    ex_getParent: function(liq) {
      return liq.intmdParent;
    },


  };
