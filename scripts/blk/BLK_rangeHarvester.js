/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A harvester that has a rectangular range.
   * Setting {rotate} to {true} is recommended if the block outputs loot.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * AttributeCrafter
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


  const PARENT = require("lovec/blk/BLK_baseHarvester");
  const PARENT_A = require("lovec/blk/BLK_rangeAttributeFactory");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.baseEfficiency = 0.0;
    blk.maxBoost = 9999.0;
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw.drawBuffer_place(blk, tx, ty, rot, () => MDL_pos._tsRect(Vars.world.tile(tx, ty), blk.attrR, blk.size).filter(ot => MDL_attr._sum_ts([ot], blk.attribute, blk.attrMode) > 0.0), () => valid, (blk, tx, ty, rot, ts, valid) => {
      if(!(ts instanceof Array)) return;
      ts.forEachFast(ot => MDL_draw.drawArea_tShrink(ot, blk.attrMode === "blk" ? ot.block().size : 1, valid));
    });
  };


  function comp_onProximityUpdate(b) {
    MDL_pos.setCoord_back(b.x, b.y, b.block.size, b.rotation, val => b.lootBackX = val, val => b.lootBackY = val);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-prog", b => new Bar(
      MDL_bundle._term("lovec", "progress"),
      Pal.ammo,
      () => Mathf.clamp(b.ex_getProg()),
    ));
  };


  function comp_offload(b, itm) {
    FRAG_faci.comp_offload_loot(b, itm);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- block ----------> */


    init: function(blk) {
      PARENT_A.init(blk);
      comp_init(blk);
    },


    setStats: function(blk) {
      PARENT_A.setStats(blk);
    },


    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT_A.drawPlace(blk, tx, ty, rot, valid);
      comp_drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT.created(b);
    },


    onDestroyed: function(b) {
      PARENT.onDestroyed(b);
    },


    updateTile: function(b) {
      PARENT.updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT_A.onProximityUpdate(b);
      comp_onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
    },


    drawSelect: function(b) {
      PARENT_A.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    // @NOSUPER
    setBars: function(blk) {
      comp_setBars(blk);
    },


    // @NOSUPER
    sumAttribute: function(blk, attr, tx, ty) {
      return PARENT_A.sumAttribute(blk, attr, tx, ty);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    offload: function(b, itm) {
      comp_offload(b, itm);
    },


    write: function(b, wr) {
      wr.i(b.lootCharge);
    },


    read: function(b, rd, revi) {
      b.lootCharge = rd.i();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-min", "blk-harv"],
    }),


    // @NOSUPER
    ex_getAttrMode: function(blk) {
      return PARENT_A.ex_getAttrMode(blk);
    },


    // @NOSUPER
    ex_getAttrSum: function(blk, tx, ty, rot) {
      return PARENT_A.ex_getAttrSum(blk, tx, ty, rot);
    },


    // @NOSUPER
    ex_getAttrR: function(blk) {
      return PARENT_A.ex_getAttrR(blk);
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_getProg : function(b) {
      return !b.outputsLoot ?
        b.progress :
        (b.lootCharge + b.progress) / b.block.itemCapacity;
    },


  };


  TEMPLATE._std = function(attrMode, attrR, craftEff, updateEff, updateEffP) {
    return {
      attrMode: Object.val(attrMode, "flr"), attrR: Object.val(attrR, 0),
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
      setBars() {
        this.super$setBars();
        TEMPLATE.setBars(this);
      },
      sumAttribute(attr, tx, ty) {
        return TEMPLATE.sumAttribute(this, attr, tx, ty);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getAttrMode() {
        return TEMPLATE.ex_getAttrMode(this);
      },
      ex_getAttrSum(tx, ty, rot) {
        return TEMPLATE.ex_getAttrSum(this, tx, ty, rot);
      },
      ex_getAttrR() {
        return TEMPLATE.ex_getAttrR(this);
      },
      // @SPEC
      craftEffect: Object.val(craftEff, Fx.none), updateEffect: Object.val(updateEff, Fx.none), updateEffectChance: Object.val(updateEffP, 0.02),
    };
  };


  TEMPLATE._std_b = function(outputsLoot) {
    return {
      outputsLoot: Object.val(outputsLoot, false),
      lootCharge: 0,
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
      offload(itm) {
        TEMPLATE.offload(this, itm);
      },
      write(wr) {
        this.super$write(wr);
        TEMPLATE.write(this, wr);
      },
      read(rd, revi) {
        this.super$read(rd, revi);
        TEMPLATE.read(this, rd, revi);
      },
      ex_getProg() {
        return TEMPLATE.ex_getProg(this);
      },
    };
  };


  module.exports = TEMPLATE;
