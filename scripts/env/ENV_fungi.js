/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Mushroom but tree-sized.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * TreeBlock
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


  const PARENT = require("lovec/env/ENV_baseTree");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- block ----------> */


    init: function(blk) {
      PARENT.init(blk);
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
    },


    // @NOSUPER
    drawBase: function(blk, t) {
      PARENT.drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-env", "blk-tree"],
    }),


    // @NOSUPER
    ex_getTreeGrp: function(blk) {
      return "fungi";
    },


    // @NOSUPER
    ex_getHidable: function(blk) {
      return blk.hidable;
    },


};


TEMPLATE._std = function(treeLay, hidable) {
  return {
    armor: treeLay == null ? 76.0 : treeLay, hidable: hidable == null ? false : hidable, drawTup: null,
    init() {
      this.super$init();
      TEMPLATE.init(this);
    },
    setStats() {
      this.super$setStats();
      TEMPLATE.setStats(this);
    },
    drawBase(t) {
      TEMPLATE.drawBase(this, t);
    },
    ex_getTags() {
      return TEMPLATE.ex_getTags(this);
    },
    ex_getTreeGrp() {
      return TEMPLATE.ex_getTreeGrp(this);
    },
    ex_getHidable() {
      return TEMPLATE.ex_getHidable(this);
    },
  };
};


module.exports = TEMPLATE;
