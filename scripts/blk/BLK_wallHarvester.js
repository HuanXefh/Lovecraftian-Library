/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Simply {WallCrafter}.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * WallCrafter
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


  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk_attrReq, MDL_attr._attrB(blk.attribute));
  };


  const comp_drawPlace = function(blk, tx, ty, rot, valid) {
    const thisFun = comp_drawPlace;

    let t = Vars.world.tile(tx, ty);
    if(t == null) return;

    let ts;
    if(thisFun.funTup.length === 0 || thisFun.funTup[0] !== t) {

      ts = MDL_pos._tsRect(t, 5, blk.size);

      thisFun.funTup[0] = t;
      thisFun.funTup[1] = ts;

    } else {

      ts = thisFun.funTup[1];

    };

    ts.forEach(ot => {
      if(ot.block().attributes.get(blk.attribute) > 0.0) MDL_draw.drawArea_tShrink(ot, 1, Pal.accent);
    });
  }
  .setProp({
    "funTup": [],
  });


  function comp_onProximityUpdate(b) {
    MDL_pos.setCoord_back(b.x, b.y, b.block.size, b.rotation, val => b.backX = val, val => b.backY = val);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-prog", b => new Bar(
      MDL_bundle._term("lovec", "progress"),
      Pal.ammo,
      () => Mathf.clamp(b.ex_getProg()),
    ));
  };


  function comp_offload(b, itm) {
    if(!b.outputsLoot) {b.super$offload(itm)} else {
      b.lootCharge++;
      let cap = b.block.itemCapacity;
      if(b.lootCharge >= cap) {
        b.lootCharge = 0;
        FRAG_item.produceLootAt(b.backX, b.backY, b, itm, cap, true);
      };
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
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
      comp_setStats(blk);
    },


    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
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
      PARENT.onProximityUpdate(b);
      comp_onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    setBars: function(blk) {
      comp_setBars(blk);
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


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_getProg : function(b) {
      return !b.outputsLoot ?
        b.time / b.block.drillTime :
        (b.lootCharge * b.block.drillTime + b.time) / (b.block.itemCapacity * b.block.drillTime);
    },


  };


  TEMPLATE._std = function(updateEff, updateEffP) {
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
      setBars() {
        this.super$setBars();
        TEMPLATE.setBars(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      // @SPEC
      updateEffect: Object.val(updateEff, Fx.none), updateEffectChance: Object.val(updateEffP, 0.02),
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
