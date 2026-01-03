/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Vanilla stack conveyor I guess.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.size !== 1) ERROR_HANDLER.throw("notSingleSized", blk.name);

    if(blk.overwriteVanillaProp) {
      blk.conductivePower = true;
      blk.connectedPower = false;
      blk.unloadable = true;
      // Because it looks like a mess
      blk.enableDrawStatus = false;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(StackConveyor)
    .setTags("blk-dis", "blk-conv")
    .setParam({
      // @PARAM: Whether this conveyor only accepts inputs from other item distributors.
      disInputOnly: true,
    })
    .setParamAlias([
      "loadEff", "loadEffect", Fx.conveyorPoof,
      "unloadEff", "unloadEffect", Fx.conveyorPoof,
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


    })
    .setGetter("disInputOnly"),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(StackConveyor.StackConveyorBuild)
    .setParam({})
    .setMethod({


      acceptItem: function(b_f, itm) {
        return !this.block.ex_getDisInputOnly() ?
          true :
          MDL_cond._isItemDistributor(b_f.block);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


  ];
