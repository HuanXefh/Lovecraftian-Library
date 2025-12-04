/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles recipe selection, should be implemented before {INTF_BLK_recipeHandler}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const EFF = require("lovec/glb/GLB_eff");
  const JAVA = require("lovec/glb/GLB_java");


  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.selectionColumns = 10;
    };

    blk.configurable = true;
    blk.saveConfig = true;
    blk.clearOnDoubleTap = false;

    blk.config(JAVA.STRING, (b, str) => {
      b.ex_updateRcParam(blk.rcMdl, str, true);
      b.ex_resetRcParam();
      b.ex_accRcHeader(str);
      EFF.squareFadePack[b.block.size].at(b);
    });
  };


  function comp_buildConfiguration(b, tb) {
    MDL_table.setSelector_recipe(tb, b, () => b.rcHeader, val => b.configure(val), false, b.block.selectionColumns);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    new CLS_interface({


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb)
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return this.rcHeader;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
