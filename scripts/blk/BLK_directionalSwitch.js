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
  const MDL_texture = require("lovec/mdl/MDL_texture");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rotate = true;
  };


  function comp_created(b) {
    b.dirReg = MDL_texture._reg(b.block, "-dir");

    let ob = b.nearby(b.rotation);
    b.ex_toggle(ob);
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
    b.ex_toggle(ob);

    return false;
  };


  function comp_ex_isValidTg(blk, oblk) {
    return MDL_cond._isMiner(oblk) || MDL_cond._isFactory(oblk);
  };


  function comp_ex_toggle(b, ob) {
    if(ob != null && ob.team === b.team && b.block.ex_isValidTg(ob.block)) {
      ob.enabled = !b.enabled;
      ob.enabled ? EFF.squareFadePack[ob.block.size].at(ob) : EFF.disableFadePack[ob.block.size].at(ob);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


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
      return [MDL_texture._reg(blk, "-icon")];
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
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-log", "blk-switch"],
    }),


    // @NOSUPER
    ex_isValidTg: function(blk, oblk) {
      return comp_ex_isValidTg(blk, oblk);
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_toggle: function(b, ob) {
      comp_ex_toggle(b, ob);
    },


  };


  TEMPLATE._std = function() {
    return {
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      drawPlace(tx, ty, rot, valid) {
        this.super$drawPlace(tx, ty, rot, valid);
        TEMPLATE.drawPlace(this, tx, ty, rot, valid);
      },
      icons() {
        return TEMPLATE.icons(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_isValidTg(oblk) {
        return TEMPLATE.ex_isValidTg(this, oblk);
      },
    };
  };


  TEMPLATE._std_b = function() {
    return {
      created() {
        this.super$created();
        TEMPLATE.created(this);
      },
      onDestroyed() {
        this.super$onDestroyed();
        TEMPLATE.onDestroyed(this);
      },
      updateTile() {
        this.super$updateTile();
        TEMPLATE.updateTile(this);
      },
      onProximityUpdate() {
        this.super$onProximityUpdate();
        TEMPLATE.onProximityUpdate(this);
      },
      draw() {
        TEMPLATE.draw(this);
      },
      drawSelect() {
        this.super$drawSelect();
        TEMPLATE.drawSelect(this);
      },
      onRemoved() {
        this.super$onRemoved();
        TEMPLATE.onRemoved(this);
      },
      configTapped() {
        TEMPLATE.configTapped(this);
      },
      ex_toggle(ob) {
        TEMPLATE.ex_toggle(this, ob);
      },
    };
  };


  module.exports = TEMPLATE;
