/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A block that reveals depth ores in range.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * GenericCrafter
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


  const PARENT = require("lovec/blk/BLK_baseMiner");
  const JAVA = require("lovec/glb/GLB_java");
  const PARAM = require("lovec/glb/GLB_param");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;

    blk.config(JAVA.BOOLEAN, (b, bool) => {
      if(b.team === Vars.player.team()) {
        Core.settings.put("lovec-draw0aux-scanner", bool);
        PARAM.forceLoadParam();
      };
    });
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.range, blk.scanR, StatUnit.blocks);
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw.drawCircle_normalPlace(blk, tx, ty, blk.scanR * Vars.tilesize, valid, true);
  };


  function comp_created(b) {
    b.revealTgs = MDL_pos._tsCircle(b.tile, b.block.ex_getScanR(), b.block.size).filter(ot => MDL_cond._isScannerTarget(ot.overlay()));
    Time.run(1.0, () => {
      b.revealQueue = b.revealTgs.slice().pullAll(b.revealedInts.map(int => Vars.world.tile(int)));
      b.ex_setRevealed(true);
    });
  };


  function comp_drawSelect(b) {
    MDL_draw.drawCircle_normalSelect(b, b.block.ex_getScanR() * Vars.tilesize, true, true);
  };


  function comp_onRemoved(b) {
    if(b.team !== Vars.player.team()) return;

    b.ex_setRevealed(false);
    MDL_pos._it_bs(b.x, b.y, b.block.ex_getScanR() * Vars.tilesize * 2.2, b.team, ob => MDL_cond._isOreScanner(ob.block), ob => ob.ex_setRevealed(true));
  };


  function comp_craft(b) {
    let ot = b.revealQueue.readRand();
    if(ot != null) {
      b.revealQueue.pull(ot);
      b.revealedInts.push(ot.pos());

      if(b.team === Vars.player.team()) {
        MDL_effect.showAt_click(ot.worldx(), ot.worldy(), Pal.techBlue);
        MDL_effect.showBetween_line(ot.worldx(), ot.worldy(), null, b, Pal.techBlue);
        if(ot.overlay().ex_setRevealed != null) ot.overlay().ex_setRevealed(ot, true);
      };
    };

    MDL_effect.playAt(b.x, b.y, b.craftSound, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
    if(Mathf.chance(0.2)) b.ex_setRevealed(true);
  };


  function comp_buildConfiguration(b, tb) {
    MDL_table.__btnCfg_toggle(tb, b, Icon.eyeOffSmall, Icon.eyeSmall, Core.settings.getBool("lovec-draw0aux-scanner", true));
  };


  function comp_ex_getScanFrac(b) {
    return (b.revealQueue.length === 0 ? 1.0 : (b.revealedInts.length / b.revealTgs.length)) * b.efficiency;
  };


  function comp_ex_setRevealed(b, bool) {
    if(b.team !== Vars.player.team()) return;

    let ot;
    b.revealedInts.forEachFast(int => {
      ot = Vars.world.tile(int);
      ot.overlay().ex_setRevealed(ot, bool);
    });
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
      comp_setStats(blk);
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
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
      comp_drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- build (specific) ----------> */


    onRemoved: function(b) {
      comp_onRemoved(b);
    },


    craft: function(b) {
      comp_craft(b);
    },


    // @NOSUPER
    buildConfiguration: function(b, tb) {
      comp_buildConfiguration(b, tb);
    },


    write: function(b, wr) {
      MDL_io._wr_ints(wr, b.revealedInts);
    },


    read: function(b, rd, revi) {
      MDL_io._rd_ints(rd, b.revealedInts);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-min", "blk-scan"],
    }),


    // @NOSUPER
    ex_getScanR: function(blk) {
      return blk.scanR;
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_getReloadFrac: function(b) {
      return b.progress;
    },


    // @NOSUPER
    ex_getWarmupFrac: function(b) {
      return b.ex_getScanFrac();
    },


    // @NOSUPER
    ex_getScanFrac: function(b) {
      return comp_ex_getScanFrac(b);
    },


    // @NOSUPER
    ex_setRevealed: function(b, bool) {
      comp_ex_setRevealed(b, bool);
    },


  };


  TEMPLATE._std = function(r, craftEff, updateEff, updateEffP) {
    return {
      scanR: Object.val(r, 0),
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
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getScanR() {
        return TEMPLATE.ex_getScanR(this);
      },
      // @SPEC
      craftEffect: Object.val(craftEff, Fx.none), updateEffect: Object.val(updateEff, Fx.none), updateEffectChance: Object.val(updateEffP, 0.02),
    };
  };


  TEMPLATE._std_b = function(craftSe) {
    return {
      craftSound: Object.val(craftSe, Sounds.none),
      revealedTgs: [], revealQueue: [], revealedInts: [],
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
      onRemoved() {
        this.super$onRemoved();
        TEMPLATE.onRemoved(this);
      },
      craft() {
        this.super$craft();
        TEMPLATE.craft(this);
      },
      buildConfiguration(tb) {
        TEMPLATE.buildConfiguration(this, tb);
      },
      write(wr) {
        this.super$write(wr);
        TEMPLATE.write(this, wr);
      },
      read(rd, revi) {
        this.super$read(rd, revi);
        TEMPLATE.read(this, rd, revi);
      },
      ex_getReloadFrac() {
        return TEMPLATE.ex_getReloadFrac(this);
      },
      ex_getWarmupFrac() {
        return TEMPLATE.ex_getWarmupFrac(this);
      },
      ex_getScanFrac() {
        return TEMPLATE.ex_getScanFrac(this);
      },
      ex_setRevealed(bool) {
        TEMPLATE.ex_setRevealed(this, bool);
      },
    };
  };


  module.exports = TEMPLATE;
