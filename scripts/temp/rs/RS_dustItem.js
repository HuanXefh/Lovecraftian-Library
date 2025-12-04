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


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_intermediateItem");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(itm) {
    if(itm.intmdParent != null) {
      if(itm.flammability < 0.0001) itm.flammability = itm.intmdParent.flammability * 1.5;
      if(itm.explosiveness < 0.0001) itm.explosiveness = itm.intmdParent.explosiveness * 1.5;

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


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Item)
  .setTags("rs-intmd", "rs-dust")
  .setParam({})
  .setMethod({


    init: function() {
      comp_init(this);
    },
    

  });
