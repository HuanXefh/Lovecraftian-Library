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


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseMiner");
  const INTF = require("lovec/temp/intf/INTF_BLK_radiusDisplay");
  const JAVA = require("lovec/glb/GLB_java");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    resetBlockFlag(blk, []);

    blk.configurable = true;
    // I'm lazy to do more for this
    blk.canPickup = false;

    blk.config(JAVA.BOOLEAN, (b, bool) => {
      if(b.team !== Vars.player.team()) return;
      Core.settings.put("lovec-draw0aux-scanner", bool);
      PARAM.forceLoadParam();
    });
  };


  function comp_load(blk) {
    blk.craftSe = fetchSound(blk.craftSe);
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.range, blk.blkRad / Vars.tilesize, StatUnit.blocks);
  };


  function comp_ex_getRevealTgs(blk, tx, ty, rot) {
    return MDL_pos._tsCircle(Vars.world.tile(tx, ty), blk.blkRad / Vars.tilesize, blk.size).filter(ot => MDL_cond._isScannerTarget(ot.overlay()));
  };


  function comp_created(b) {
    b.offConeAng = Mathf.range(180.0);
    b.revealTgs.clear().pushAll(b.block.ex_getRevealTgs(b.tileX(), b.tileY(), b.rotation));
    Time.run(1.0, () => {
      b.revealQueue.clear().pushAll(b.revealTgs);
      b.revealedInts.forEachFast(int => {
        let ot = Vars.world.tile(int);
        if(ot != null) b.revealQueue.pull(ot);
      });
      b.ex_setRevealed(true);
    });
  };


  function comp_onRemoved(b) {
    if(b.team !== Vars.player.team()) return;

    b.ex_setRevealed(false);
    MDL_pos._it_bs(b.x, b.y, b.block.ex_getBlkRad() * 2.2, b.team, ob => MDL_cond._isOreScanner(ob.block), ob => ob.ex_setRevealed(true));
  };


  function comp_craft(b) {
    let ot = b.revealQueue.readRand();
    if(ot != null) {
      b.revealQueue.pull(ot);
      b.revealedInts.push(ot.pos());

      if(b.team === Vars.player.team()) {
        MDL_effect.showAt_click(ot.worldx(), ot.worldy(), b.block.ex_getScanColor());
        MDL_effect.showBetween_line(ot.worldx(), ot.worldy(), null, b, b.block.ex_getScanColor());
        ot.overlay().ex_accRevealed(ot, true);
      };
    };

    MDL_effect.playAt(b.x, b.y, b.block.ex_getCraftSe(), Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
    if(Mathf.chance(0.2)) b.ex_setRevealed(true);
  };


  function comp_buildConfiguration(b, tb) {
    MDL_table.__btnCfgToggle(tb, b, Icon.eyeOffSmall, Icon.eyeSmall, Core.settings.getBool("lovec-draw0aux-scanner", true));
  };


  function comp_draw(b) {
    let z = Draw.z();
    Draw.z(VAR.lay_effFlr + 0.01);
    Draw.color(Pal.accent, b.warmup * 0.2);
    Fill.arc(b.x, b.y, b.block.ex_getBlkRad(), 0.125, b.offConeAng + b.totalProgress * 2.0);
    Draw.color();
    Draw.z(z);
  };


  function comp_ex_setRevealed(b, bool) {
    if(b.team !== Vars.player.team()) return;

    let ot;
    b.revealedInts.forEachFast(int => {
      ot = Vars.world.tile(int);
      ot.overlay().ex_accRevealed(ot, bool);
    });
  };


  function comp_ex_getScanFrac(b) {
    return b.efficiency * ((b.revealTgs.length === 0 || b.revealQueue.length === 0) ? 1.0 : (b.revealedInts.length / b.revealTgs.length));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-min", "blk-scan")
    .setParam({
      // @PARAM: Color used for scan effects.
      scanColor: Pal.techBlue,
      // @PARAM: Sound played when the scanner scans (crafts).
      craftSe: Sounds.none,

      useP3dRange: true,
    })
    .setParamAlias([
      // @PARAM: Radius parameter of the scanner.
      "scanRad", "blkRad", 40.0,

      "craftEff", "craftEffect", Fx.none,
      "updateEff", "updateEffect", Fx.none,
      "updateEffP", "updateEffectChance", 0.02,
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      ex_getRevealTgs: function(tx, ty, rot) {
        return comp_ex_getRevealTgs(this, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


    })
    .setGetter("scanColor", "craftSe", "useP3dRange", "blkRad"),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({
      offConeAng: 0.0,
      revealTgs: prov(() => []),
      revealQueue: prov(() => []),
      revealedInts: prov(() => []),
    })
    .setMethod({


      created: function() {
        comp_created(this);
      },


      onRemoved: function() {
        comp_onRemoved(this);
      },


      craft: function() {
        comp_craft(this);
      },


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      },


      write: function(wr) {
        processRevision(wr);
        MDL_io._wr_ints(wr, this.revealedInts);
      },


      read: function(rd, revi) {
        processRevision(rd);
        MDL_io._rd_ints(rd, this.revealedInts);
      },


      ex_getReloadFrac: function() {
        return this.progress;
      }
      .setProp({
        noSuper: true,
      }),


      ex_getWarmupFrac: function() {
        return this.ex_getScanFrac();
      }
      .setProp({
        noSuper: true,
      }),


      ex_setRevealed: function(bool) {
        comp_ex_setRevealed(this, bool);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getScanFrac: function() {
        return comp_ex_getScanFrac(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
