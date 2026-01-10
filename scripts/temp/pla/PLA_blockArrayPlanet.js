/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Uses the nightmare of blocks to define planet generator.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/pla/PLA_solidPlanet");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Planet)
  .setTags("pla-sol")
  .setParam({
    // @PARAM: Equivalent of the heap of blocks used in {SerpuloPlanetGenerator} you see in the source code.
    blkMatArr: prov(() => [
      [Blocks.water, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.iceSnow, Blocks.snow, Blocks.water],
      [Blocks.water, Blocks.water, Blocks.ice, Blocks.ice, Blocks.iceSnow, Blocks.snow, Blocks.water],
      [Blocks.water, Blocks.water, Blocks.water, Blocks.ice, Blocks.iceSnow, Blocks.water, Blocks.water],
      [Blocks.water, Blocks.water, Blocks.water, Blocks.ice, Blocks.ice, Blocks.water, Blocks.water],
      [Blocks.water, Blocks.water, Blocks.ice, Blocks.water, Blocks.water, Blocks.water, Blocks.water],
      [Blocks.water, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.iceSnow, Blocks.snow, Blocks.water],
      [Blocks.water, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.iceSnow, Blocks.snow, Blocks.water],
    ]),
    // @PARAM: Divisions in the {HexMesh}.
    hexDiv: 6,

    skipMeshParse: true,
  })
  .setParamParser([
    "blkMatArr", function(val) {
      let plaGen = extend(SerpuloPlanetGenerator, {
        getBlock(p) {
          this.arr = val;
          this.super$getBlock(p);
        },
      });
      plaGen.arr = val;

      this.generator = plaGen;
    },
  ])
  .setMethod({})
  .setGetter("hexDiv");


  module.exports.initPlanet = function(pla) {
    this.super("initPlanet", pla);
    pla.meshLoader = prov(() => new HexMesh(pla, pla.ex_getHexDiv()));
  };
