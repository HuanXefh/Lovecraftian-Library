/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Similar to {ENV_depthOre}, but for liquid.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseOverlay");
  const INTF = require("lovec/temp/intf/INTF_ENV_depthOverlay");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- auxilliary ----------> */


  const dynaAttrMap = DB_item.db["map"]["attr"]["dpliq"];


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rsDrop = MDL_attr._dynaAttrRs(dynaAttrMap, blk);
    if(blk.rsDrop == null) ERROR_HANDLER.noLiquidDrop(blk);
    MDL_content.rename(
      blk,
      blk.rsDrop.localizedName + MDL_text._space() + "(" + MDL_bundle._term("lovec", "depth-liquid") + ")",
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).implement(INTF).initClass()
  .setParent(OverlayFloor)
  .setTags("blk-env", "blk-dpliq")
  .setParam({
    rsDrop: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


  })
  .setGetter("rsDrop");
