/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Base template for most vegetation.
   * No variants!
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseProp");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");


  const MATH_geometry = require("lovec/math/MATH_geometry");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_test = require("lovec/mdl/MDL_test");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_env = require("lovec/db/DB_env");


  /* <---------- auxiliay ----------> */


  const treeParams = DB_env.db["grpParam"]["tree"];


  /* <---------- component ----------> */


  function comp_init(blk) {
    let treeGrp = blk.ex_getTreeGrp();
    blk.drawTup = [
      Mathf.clamp(blk.layTree, 76.0, 80.0),
      treeParams.read([treeGrp, "scl"], 1.0),
      treeParams.read([treeGrp, "mag"], 1.0),
      treeParams.read([treeGrp, "wob"], 1.0),
    ];

    MDL_event._c_onLoad(() => {
      if(!blk.shadow.found()) MDL_test._w_noCusSha(blk);
    });
  };


  function comp_setStats(blk) {
    let treeGrp = blk.ex_getTreeGrp();
    if(treeGrp !== "none") blk.stats.add(TP_stat.blk0env_treeType, MDL_bundle._term("lovec", treeGrp));

    let rsLvl = FRAG_faci._treeRsLvl(blk);
    if(rsLvl > 0.0) blk.stats.add(TP_stat.blk0env_rsLvl, rsLvl.perc());
  };


  function comp_drawBase(blk, t) {
    let a = PARAM.treeAlpha;
    if(a < 0.0001) return;

    let ang = Mathf.randomSeed(t.pos(), 0.0, 360.0);
    if(PARAM.checkTreeDst && Mathf.dst(t.worldx(), t.worldy(), MDL_pos._playerX(), MDL_pos._playerY()) < blk.region.width * VAR.rad_treeScl) {
      a *= 0.37;
    };

    let z = Draw.z();
    if(blk.shadow.found()) {
      Draw.z(blk.drawTup[0] - 0.0005);
      Draw.rect(blk.shadow, t.worldx() + blk.shadowOffset, t.worldy() + blk.shadowOffset, ang);
    };
    Draw.alpha(a);
    !PARAM.drawWobble ?
      Draw.rect(blk.region, t.worldx(), t.worldy(), ang) :
      Draw.rectv(
        blk.region, t.worldx(), t.worldy(),
        blk.region.width * blk.region.scl(), blk.region.height * blk.region.scl(),
        ang + Mathf.sin(Time.time + t.worldx(), 50.0, 0.5) + Mathf.sin(Time.time - t.worldy(), 65.0, 0.9) + Mathf.sin(Time.time + t.worldy() - t.worldx(), 85.0, 0.9),
        vec2 => vec2.add(
          (Mathf.sin(vec2.y * 3.0 + Time.time, 60.0 * blk.drawTup[1], 0.5 * blk.drawTup[2]) + Mathf.sin(vec2.x * 3.0 - Time.time, 70.0 * blk.drawTup[1], 0.8 * blk.drawTup[2])) * 1.5 * blk.drawTup[3],
          (Mathf.sin(vec2.x * 3.0 + Time.time + 8.0, 66.0 * blk.drawTup[1], 0.55 * blk.drawTup[2]) + Mathf.sin(vec2.y * 3.0 - Time.time, 50.0 * blk.drawTup[1], 0.2 * blk.drawTup[2])) * 1.5 * blk.drawTup[3],
        ),
      );
    Draw.color();
    Draw.z(z);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(null)
  .setTags("blk-env")
  .setParam({
    // @PARAM: Z-value of the tree.
    layTree: 76.0,
    // @PARAM: Whether this tree can hide units.
    hidable: false,

    treeGrp: "none",
    drawTup: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


    drawBase: function(t) {
      comp_drawBase(this, t);
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  })
  .setGetter("layTree", "hidable", "treeGrp");
