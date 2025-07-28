/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Base for most vegetation.
   * I'm calling mushroom a tree and you can't stop me.
   * Shadow is generated so you don't need a sprite for that.
   * This is not the template for creating trees! Check something like {ENV_tree} instead.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * blk.armor: f    // @PARAM: Layer of the tree, should fall in (76.0, 80.0).
   * blk.hidable: bool    // @PARAM: Whether the tree can hide units.
   * blk.drawTup: null
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


  const PARENT = require("lovec/env/ENV_baseProp");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");


  const MATH_geometry = require("lovec/math/MATH_geometry");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- auxilliary ----------> */


  const params = [
    "tree", "scl", 1.0,
    "tree", "mag", 1.0,
    "tree", "wob", 1.0,
    "bush", "scl", 0.5,
    "bush", "mag", 1.5,
    "bush", "wob", 0.7,
    "fungi", "scl", 3.0,
    "fungi", "mag", 0.4,
    "fungi", "wob", 0.3,
  ];


  /* <---------- component ----------> */


  function comp_init(blk) {
    let treeGrp = blk.ex_getTreeGrp();
    blk.drawTup = [
      Mathf.clamp(blk.armor, 76.0, 80.0),
      params.read([treeGrp, "scl"], 1.0),
      params.read([treeGrp, "mag"], 1.0),
      params.read([treeGrp, "wob"], 1.0),
    ];
  };


  function comp_setStats(blk) {
    let treeGrp = blk.ex_getTreeGrp();
    if(treeGrp !== "") {
      blk.stats.add(TP_stat.blk0env_treeType, MDL_bundle._term("lovec", treeGrp));
    };

    var rsLvl = FRAG_faci._treeRsLvl(blk);
    if(rsLvl > 0.0) blk.stats.add(TP_stat.blk0env_rsLvl, Number(rsLvl).perc());
  };


  function comp_drawBase(blk, t) {
    var a = PARAM.treeAlpha;
    if(a < 0.0001) return;

    let reg = MDL_content._regVari(blk, t);
    var ang = Mathf.randomSeed(t.pos(), 0.0, 360.0);
    var offAng = Mathf.randomSeed(t.pos(), 45.0, 75.0);
    var regScl = Mathf.randomSeed(t.pos(), 0.75, 1.5);

    // Transparentization
    if(PARAM.checkTreeDst) {
      let dst = MATH_geometry._dst(t.worldx(), t.worldy(), MDL_pos._playerX(), MDL_pos._playerY());
      if(dst < reg.width * VAR.rad_treeScl) a *= 0.37;
    };

    PARAM.drawCircleShadow ?
      Drawf.shadow(t.worldx(), t.worldy(), reg.width * 0.225 * regScl, a * 0.6) :
      MDL_draw.drawRegion_blurredShadow(t.worldx() + blk.shadowOffset, t.worldy() + blk.shadowOffset, reg, ang, regScl * 1.1, a, blk.drawTup[0] - 0.0005);
    MDL_draw.drawRegion_wobble(t.worldx(), t.worldy(), reg, ang, regScl, blk.drawTup[1], blk.drawTup[2], blk.drawTup[3], blk.drawTup[3], Color.white, a, blk.drawTup[0]);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- block ----------> */


    init: function(blk) {
      PARENT.init(blk);
      comp_init(blk);
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
      comp_setStats(blk);
    },


    // @NOSUPER
    drawBase: function(blk, t) {
      comp_drawBase(blk, t);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return ["blk-env", "blk-tree"];
    },


    // @NOSUPER
    ex_getTreeGrp: function(blk) {
      return "";
    },


    // @NOSUPER
    ex_getHidable: function(blk) {
      return blk.hidable;
    },


  };
