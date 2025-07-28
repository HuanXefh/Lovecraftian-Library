/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: dust.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Item
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * itm.alts: 0
   * itm.intmdParent: rs_gn    // @PARAM, @NULL
   * itm.useParentRegion: bool    // @PARAM
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


  const PARENT = require("lovec/rs/RS_intermediateItem");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(itm) {
    if(itm.intmdParent != null) {
      MDL_content.rename(
        itm,
        MDL_bundle._term("common", "intmd-dust") + MDL_text._space() + "(" + itm.intmdParent.localizedName + ")",
      );
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- resource ----------> */


    init: function(itm) {
      PARENT.init(itm);
      comp_init(itm);
    },


    setStats: function(itm) {
      PARENT.setStats(itm);
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
      return ["rs-intmd", "rs-dust"];
    },


    // @NOSUPER
    ex_getParent: function(itm) {
      return itm.intmdParent;
    },


  };
