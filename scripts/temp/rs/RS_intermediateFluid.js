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


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseFluid");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(liq) {
    liq.intmdParent = MDL_content._ct(liq.intmdParent, "rs");
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


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Liquid)
  .setTags("rs-intmd")
  .setParam({
    // @PARAM: See {RS_intermediateItem}.
    intmdParent: null,
    // @PARAM: See {RS_intermediateItem}.
    useParentReg: true,
    // @PARAM: See {RS_intermediateItem}.
    recolorRegStr: null,

    databaseTag: "lovec-intermediate",
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
