/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Internal fluid used for non-square buildings.
   * Expected to be loaded after blocks.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_abstractFluid");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(aux) {
    if(aux.producedIn == null) {
      throw new Error("Producer block for [$1] has not been initialized yet! Are you loading the link fluid before blocks?".format(aux.name));
    };

    MDL_content.rename(
      aux,
      MDL_bundle._term("lovec", "link-fluid") + MDL_text._colon() + this.producedIn.localizedName,
    );

    MDL_event._c_onLoad(() => {
      if(!Vars.headless && !aux.uiIcon.found()) aux.fullIcon = aux.uiIcon = Core.atlas.find("lovec-gen-link-fluid");
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Liquid)
  .setTags("rs-aux", "rs-link")
  .setParam({
    producedIn: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


  })
  .setAccessor("producedIn");
