/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Items that are not final products and by default hidden in planet database.
   * Intermediate items can have parent items, and possible to get generated icons based on the parents.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseItem");


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


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Item)
  .setTags("rs-intmd")
  .setParam({
    // @PARAM: The parent of this intermediate.
    intmdParent: null,
    // @PARAM: Whether to generate icons based on parent. Set this to {false} if you have sprite for the intermediate.
    useParentRegion: true,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },
    

  })
  .setGetter("intmdParent");
