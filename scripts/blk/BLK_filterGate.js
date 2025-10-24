/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Basically {Sorter}, but can be configured to switch mode.
   * You don't need {invert}.
   * {filterScr} is used for customization, use {(b, itm, b_f) => itm === b.sortItem} for vanilla filter.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * Sorter
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


  const PARENT = require("lovec/blk/BLK_baseItemGate");
  const EFF = require("lovec/glb/GLB_eff");
  const JAVA = require("lovec/glb/GLB_java");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.selectionColumns = 10;

    blk.config(JAVA.BOOLEAN, (b, bool) => {
      b.ex_accIsInv(bool);
      EFF.squareFadePack[b.block.size].at(b);
    });

    blk.config(JAVA.OBJECT_ARRAY, (b, cfgArr) => {

      if(cfgArr[0] === "BLK_filterGate") {
        b.sortItem = MDL_content._ct(cfgArr[1], "rs");
        b.ex_accIsInv(cfgArr[2]);
        EFF.squareFadePack[b.block.size].at(b);
      };

    });
  };


  function comp_created(b) {
    b.invReg = MDL_texture._reg(b.block, "-inv");
  };


  function comp_draw(b) {
    if(b.isInv) MDL_draw.drawRegion_normal(b.x, b.y, b.invReg);
  };


  function comp_setBars(blk) {
    blk.removeBar("items");
  };


  function comp_getTileTarget(b, itm, b_f, isFlip) {
    var rot = b_f.relativeTo(b);
    let b_t = b.nearby(rot);
    let tg = null;

    if((b.filterScr(b, b_f, itm) !== b.isInv) === b.enabled) {

      if(b.isSame(b_f) && b.isSame(b_t)) return tg;
      tg = b_t;

    } else {

      let b_s1 = b.nearby(Mathf.mod(rot - 1, 4));
      let b_s2 = b.nearby(Mathf.mod(rot + 1, 4));
      let cond1 = b_s1 != null && b_s1.team === b.team && !(b_s1.block.instantTransfer && b_f.block.instantTransfer) && b_s1.acceptItem(b, itm);
      let cond2 = b_s2 != null && b_s2.team === b.team && !(b_s2.block.instantTransfer && b_f.block.instantTransfer) && b_s2.acceptItem(b, itm);

      if(cond1 && !cond2) {tg = b_s1}
      else if(!cond1 && cond2) {tg = b_s2}
      else if(!cond2) {return tg}
      else {
        tg = (b.rotation & (1 << rot)) === 0 ? b_s1 : b_s2;
        if(isFlip) b.rotation ^= (1 << rot);
      };

    };

    return tg;
  };


  function comp_buildConfiguration(b, tb) {
    if(!b.noSelect) MDL_table.setSelector_ct(tb, b.block, Vars.content.items().toArray(), () => b.sortItem, val => b.configure(val), false, b.block.selectionRows, b.block.selectionColumns);

    tb.row();
    MDL_table.__btnCfg_toggle(tb, b, VARGEN.icons.swap, VARGEN.icons.swap, b.isInv);
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


    // @NOSUPER
    icons: function(blk) {
      return PARENT.icons(blk);
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


    draw: function(b) {
      PARENT.draw(b);
      comp_draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    setBars: function(blk) {
      comp_setBars(blk);
    },


    /* <---------- build (specific) ----------> */


    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm);
    },


    // @NOSUPER
    getTileTarget: function(b, itm, b_f, isFlip) {
      return comp_getTileTarget(b, itm, b_f, isFlip);
    },


    // @NOSUPER
    buildConfiguration: function(b, tb) {
      comp_buildConfiguration(b, tb);
    },


    // @NOSUPER
    config: function(b) {
      return ["BLK_filterGate", b.sortItem == null ? "null" : b.sortItem.name, b.isInv].toJavaArr();
    },


    write: function(b, wr) {
      processRevision(wr);
      MDL_io._wr_ct(wr, b.sortItem);
      wr.bool(b.isInv);
    },


    read: function(b, rd, revi) {
      processRevision(rd);
      b.sortItem = MDL_io._rd_ct(rd);
      b.isInv = rd.bool();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-dis", "blk-gate"],
    }),


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accIsInv: function(b, param) {
      return param === "read" ? b.isInv : (b.isInv = param);
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
      icons() {
        return TEMPLATE.icons(this);
      },
      drawPlace(tx, ty, rot, valid) {
        this.super$drawPlace(tx, ty, rot, valid);
        TEMPLATE.drawPlace(this, tx, ty, rot, valid);
      },
      setBars() {
        this.super$setBars();
        TEMPLATE.setBars(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  TEMPLATE._std_b = function(filterScr, noSelect) {
    return {
      filterScr: tryVal(filterScr, function(b, b_f, itm) {return true}),
      noSelect: tryVal(noSelect, false),
      invReg: null, isInv: false,
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
        this.super$draw();
        TEMPLATE.draw(this);
      },
      drawSelect() {
        this.super$drawSelect();
        TEMPLATE.drawSelect(this);
      },
      acceptItem(b_f, itm) {
        if(!this.super$acceptItem(b_f, itm)) return false;
        if(!TEMPLATE.acceptItem(this, b_f, itm)) return false;
        return true;
      },
      getTileTarget(itm, b_f, isFlip) {
        return TEMPLATE.getTileTarget(this, itm, b_f, isFlip);
      },
      buildConfiguration(tb) {
        TEMPLATE.buildConfiguration(this, tb);
      },
      config() {
        return TEMPLATE.config(this);
      },
      write(wr) {
        this.super$write(wr);
        TEMPLATE.write(this, wr);
      },
      read(rd, revi) {
        this.super$read(rd, revi);
        TEMPLATE.read(this, rd, revi);
      },
      ex_accIsInv(param) {
        return TEMPLATE.ex_accIsInv(this, param);
      },
    };
  };


  module.exports = TEMPLATE;
