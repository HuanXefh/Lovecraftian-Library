/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla asteroid.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Planet
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


  const PARENT = require("lovec/pla/PLA_basePlanet");


  /* <---------- component ----------> */


  function comp_load(pla) {
    pla.drawOrbit = false;
    pla.hasAtmosphere = false;
    pla.bloom = false;
    pla.updateLighting = false;

    pla.camRadius = pla.radius * 5.6;
    pla.clipRadius = pla.radius * 16.6;

    pla.meshLoader = prov(() => {
      let meshes = [];
      let rand = new Rand(pla.id + 2);
      let colorBase = pla.blkBase.mapColor;
      let colorTint = (function() {
        let color = pla.blkTint.mapColor.cpy();
        color.a = 1.0 - pla.blkTint.mapColor.a;
        return color;
      })()
      meshes.push(new NoiseMesh(
        pla, pla.seed, 2, pla.radius, 2, 0.55, 0.45, 14.0,
        colorBase, colorTint, 3, 0.6, 0.38, pla.tintThr,
      ));
      pla.amt._it(1, i => {
        meshes.push(new MatMesh(
          new NoiseMesh(
            pla, pla.seed + i + 1, 1, 0.022 + rand.random(0.039) * pla.plaScl, 2, 0.6, 0.38, 20.0,
            colorBase, colorTint, 3, 0.6, 0.38, pla.tintThr,
          ),
          new Mat3D().setToTranslation(Tmp.v31.setToRandomDirection(rand).setLength(rand.random(0.44, 1.4) * pla.plaScl))
        ));
      });

      return new MultiMesh(meshes);
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- planet ----------> */


    load: function(pla) {
      PARENT.load(pla);
      comp_load(pla);
    },


    init: function(pla) {
      PARENT.init(pla);
    },


    /* <---------- planet (specific) ----------> */


    /* <---------- planet (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["pla-ast"],
    }),


  };


  TEMPLATE.init = PARENT.init;


  TEMPLATE._std = function(blkBase, blkTint, seed, tintThr, amt, plaScl) {
    return {
      blkBase: tryVal(blkBase, Blocks.stoneWall), blkTint: tryVal(blkTint, Blocks.iceWall), seed: tryVal(seed, -1),
      tintThr: tryVal(tintThr, 0.5), amt: tryVal(amt, 12), plaScl: tryVal(plaScl, 1.0),
      load() {
        this.super$load();
        TEMPLATE.load(this);
      },
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  module.exports = TEMPLATE;
