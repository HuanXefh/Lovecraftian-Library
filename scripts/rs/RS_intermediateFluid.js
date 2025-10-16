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


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(liq) {
    liq.intmdParent = MDL_content._ct(liq.intmdParent, "rs");

    MDL_event._c_onLoad(() => {
      if(MDL_cond._isIntmd(liq)) liq.shownPlanets.add(Vars.content.planet("lovec-pla0sun-veibrus"));
    });
  };


  function comp_setStats(liq) {
    liq.stats.add(TP_stat.rs_isIntermediate, true);
    if(liq.intmdParent != null) liq.stats.add(TP_stat.rs0int_parent, newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_ctRow(tb, liq.intmdParent);
    }));
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
      PARENT.update(liq, puddle)
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
      return PARENT.willBoil(liq);
    },


    /* <---------- resource (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(liq) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["rs-intmd"],
    }),


    // @NOSUPER
    ex_getParent: function(liq) {
      return liq.intmdParent;
    },


  };


  TEMPLATE._std = function(intmdParent, hasReg, intmdTags_p) {
    return {
      alts: 0,
      intmdParent: intmdParent, useParentRegion: !hasReg,
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
      ex_getParent() {
        return TEMPLATE.ex_getParent(this);
      },
      // @SPEC
      ex_getTags: intmdTags_p == null ?
        function() {return TEMPLATE.ex_getTags(this)} :
        function() {return TEMPLATE.ex_getTags(this).pushAll(intmdTags_p)},
    };
  };


  module.exports = TEMPLATE;
