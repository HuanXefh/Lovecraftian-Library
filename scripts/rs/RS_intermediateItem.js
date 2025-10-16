/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Items that are not products and by default hidden in planet database.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Item
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


  const PARENT = require("lovec/rs/RS_baseItem");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(itm) {
    itm.intmdParent = MDL_content._ct(itm.intmdParent, "rs");

    MDL_event._c_onLoad(() => {
      itm.shownPlanets.add(Vars.content.planet("lovec-pla0sun-veibrus"));
    });
  };


  function comp_setStats(itm) {
    itm.stats.add(TP_stat.rs_isIntermediate, true);
    if(itm.intmdParent != null) itm.stats.add(TP_stat.rs0int_parent, newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_ctRow(tb, itm.intmdParent);
    }));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- resource ----------> */


    init: function(itm) {
      PARENT.init(itm);
      comp_init(itm);
    },


    setStats: function(itm) {
      PARENT.setStats(itm);
      comp_setStats(itm);
    },


    loadIcon: function(itm) {
      PARENT.loadIcon(itm);
    },


    createIcons: function(itm, packer) {
      PARENT.createIcons(itm, packer);
    },


    /* <---------- resource (specific) ----------> */


    /* <---------- resource (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(itm) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["rs-intmd"],
    }),


    // @NOSUPER
    ex_getParent: function(itm) {
      return itm.intmdParent;
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
      loadIcon() {
        this.super$loadIcon();
        TEMPLATE.loadIcon(this);
      },
      createIcons(packer) {
        this.super$createIcons(packer);
        TEMPLATE.createIcons(this, packer);
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
