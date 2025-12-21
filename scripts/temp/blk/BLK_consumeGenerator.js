/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla {ConsumeGenerator}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseGenerator");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(ConsumeGenerator)
    .setTags("blk-pow", "blk-pow0gen")
    .setParam({})
    .setParamAlias([
      "consEff", "consumeEffect", Fx.none,
    ])
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(ConsumeGenerator.ConsumeGeneratorBuild)
    .setParam({})
    .setMethod({}),


  ];
