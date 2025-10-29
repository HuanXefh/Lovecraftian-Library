/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A loot hopper that actively pulls nearby loots to it.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * StorageBlock
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["amount"]["base"]    // @PARAM
   * DB_block.db["param"]["time"]["base"]    // @PARAM
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_lootHopper");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.add(Stat.range, blk.rPull, StatUnit.blocks);
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw.drawP3d_cylinderFade(tx.toFCoord(blk.size), ty.toFCoord(blk.size), 1.0, blk.rPull * Vars.tilesize, valid ? Pal.accent : Pal.remove);
  };


  function comp_created(b) {
    b.glowReg = MDL_texture._reg(b.block, "-glow");
  };


  function comp_updateTile(b) {
    if(!b.isPulling) {
      b.progWait += b.edelta();
      if(b.progWait > b.intvPull) {
        b.progWait %= b.intvPull;
        b.pullTgs.clear().pushAll(MDL_pos._loots(b.x, b.y, b.block.ex_getRPull() * Vars.tilesize).filter(loot => Mathf.dst(loot.x, loot.y, b.x, b.y) > b.block.size * 0.5 * Vars.tilesize));
        b.isPulling = b.pullTgs.length > 0;
      };
    } else {
      b.progPull += Time.delta;
      if(b.progPull > b.timePull) {
        b.progPull %= b.timePull;
        b.isPulling = false;
      } else {
        b.pullTgs.forEachFast(loot => {
          loot.impulse(Tmp.v2.set(loot).sub(b.x, b.y).nor().scl(-b.powPull * b.glowHeat));
        });
      };
    };

    b.glowHeat = Mathf.approachDelta(b.glowHeat, b.isPulling ? 1.0 : 0.0, b.isPulling ? 0.006 : 0.02);
  };


  function comp_draw(b) {
    MDL_draw.drawRegion_glow(b.x, b.y, b.glowReg, 0.0, Color.white, b.glowHeat * 0.7);

    if(b.glowHeat > 0.01) {
      Lines.stroke(2.0, Color.white);
      Draw.alpha(0.3 * b.glowHeat);
      b.pullTgs.forEachFast(loot => {
        if(loot.added) Lines.line(loot.x, loot.y, b.x, b.y);
      });
      Draw.reset();
    };

    if(MDL_cond._posHoveredRect(b.x, b.y, 0, b.block.size)) {
      MDL_draw.drawP3d_cylinderFade(b.x, b.y, 1.0, b.block.ex_getRPull() * Vars.tilesize, Pal.accent, VAR.lay_p3dRange);
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


    // @NOSUPER
    icons: function(blk) {
      return PARENT.icons(blk);
    },


    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
      comp_drawPlace(blk, tx, ty, rot, valid);
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
      comp_updateTile(b);
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


    // @NOSUPER
    outputsItems: function(blk) {
      return PARENT.outputsItems(blk);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm);
    },


    // @NOSUPER
    shouldAmbientSound: function(b) {
      return b.isPulling;
    },


    // @NOSUPER
    ambientVolume: function(b) {
      return PARENT.ambientVolume(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: [],
    }),


    // @NOSUPER
    ex_getTs: function(blk, tx, ty, rot) {
      return PARENT.ex_getTs(blk, tx, ty, rot);
    },


    // @NOSUPER
    ex_getRPull: function(blk) {
      return blk.rPull;
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_lootCall: function(b) {
      PARENT.ex_lootCall(b);
    },


  };


  TEMPLATE._std = function(rPull) {
    return {
      rPull: tryVal(rPull, 5),
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
      outputsItems() {
        return TEMPLATE.outputsItems(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getTs(tx, ty, rot) {
        return TEMPLATE.ex_getTs(this, tx, ty, rot);
      },
      ex_getRPull() {
        return TEMPLATE.ex_getRPull(this);
      },
    };
  };


  TEMPLATE._std_b = function(powPull, timePull, intvPull) {
    return {
      ts: [],
      timerCall: new Interval(1), amtRun: 0, intvRun: Infinity,
      powPull: tryVal(powPull, 8.0), timePull: tryVal(timePull, 240.0), intvPull: tryVal(intvPull, 240.0),
      pullTgs: [], isPulling: false, progPull: 0.0, progWait: 0.0,
      glowReg: null, glowHeat: 0.0,
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
        return TEMPLATE.acceptItem(this, b_f, itm);
      },
      shouldAmbientSound() {
        return TEMPLATE.shouldAmbientSound(this);
      },
      ambientVolume() {
        return TEMPLATE.ambientVolume(this);
      },
      ex_lootCall() {
        TEMPLATE.ex_lootCall(this);
      },
    };
  };


  module.exports = TEMPLATE;
