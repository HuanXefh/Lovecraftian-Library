/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: chunks.
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


  const PARENT = require("lovec/rs/RS_intermediateItem");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(itm) {
    if(itm.intmdParent != null) {
      itm.flammability = itm.intmdParent.flammability * 1.25;
      itm.explosiveness = itm.intmdParent.explosiveness * 1.25;

      MDL_content.rename(
        itm,
        MDL_bundle._term("common", "intmd-chunks") + MDL_text._space() + "(" + itm.intmdParent.localizedName + ")",
      );
    };
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
      tempTags: ["rs-intmd", "rs-chunks"],
    }),


    // @NOSUPER
    ex_getParent: function(itm) {
      return PARENT.ex_getParent(itm);
    },


  };


  TEMPLATE._std = function(intmdParent, hasReg) {
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
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getParent() {
        return TEMPLATE.ex_getParent(this);
      },
    };
  };


  module.exports = TEMPLATE;
