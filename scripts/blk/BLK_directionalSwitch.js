/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Enables or disables the valid building in front of it.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * SwitchBlock
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * b.dirReg: null
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


  const PARENT = require("lovec/blk/BLK_baseLogicBlock");
  const EFF = require("lovec/glb/GLB_eff");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");


  /* <---------- auxiliay ----------> */


  function isValidTarget(blk) {
    return MDL_cond._isMiner(blk) || MDL_cond._isFactory(blk);
  };


  function toggleTarget(b, ob) {
    if(ob != null && ob.team === b.team && isValidTarget(ob.block)) {
      ob.enabled = !b.enabled;
      ob.enabled ? EFF.squareFadePack[ob.block.size].at(ob) : EFF.disableFadePack[ob.block.size].at(ob);
    };
  };


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rotate = true;
  };


  function comp_created(b) {
    b.dirReg = MDL_content._reg(b.block, "-dir");

    let ob = b.nearby(b.rotation);
    toggleTarget(b, ob);
  };


  function comp_draw(b) {
    b.drawTeamTop();

    Draw.rect(b.block.region, b.x, b.y);
    // NOTE: Drawn only when disabled... since it's meant to disable some buildings.
    if(b.enabled) Draw.rect(b.block.onRegion, b.x, b.y);
    Draw.rect(b.dirReg, b.x, b.y, b.drawrot());
    Draw.reset();
  };


  function comp_onRemoved(b) {
    if(b.enabled) {
      let ob = b.nearby(b.rotation);
      if(ob != null && ob.team === b.team && !ob.enabled) {
        ob.enabled = true;
        EFF.squareFadePack[ob.block.size].at(ob);
      };
    };
  };


  function comp_configTapped(b) {
    b.configure(!b.enabled);
    b.block.clickSound.at(b);

    let ob = b.nearby(b.rotation);
    toggleTarget(b, ob);

    return false;
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
    },


    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT.created(b);
      comp_created(b);
    },


    onDestroyed: function(b) {
      PARENT.onDestroyed(b);
    },


    updateTile: function(b) {
      PARENT.updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
    },


    // @NOSUPER
    draw: function(b) {
      PARENT.draw(b);
      comp_draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    // @NOSUPER
    icons: function(blk) {
      return [MDL_content._reg(blk, "-icon")];
    },


    /* <---------- build (specific) ----------> */


    onRemoved: function(b) {
      comp_onRemoved(b);
    },


    // @NOSUPER
    configTapped: function(b) {
      return comp_configTapped(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-log"],
    }),


    /* <---------- build (extended) ----------> */


  };
