/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A loot hopper that actively pulls nearby loots to it.
   * Nah I won't do regular radius loot collector.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_lootHopper");
  const INTF = require("lovec/temp/intf/INTF_BLK_radiusDisplay");


  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  function comp_load(blk) {
    blk.glowReg = fetchRegion(blk, "-glow");
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.range, blk.blkRad / Vars.tilesize, StatUnit.blocks);
  };


  function comp_updateTile(b) {
    if(!b.isPulling) {
      b.progWait += b.edelta();
      if(b.progWait > b.block.ex_getIntvPull()) {
        b.progWait %= b.block.ex_getIntvPull();
        MDL_pos._loots(b.x, b.y, b.block.ex_getBlkRad(), null, b.pullTgs).inSituFilter(loot => Mathf.dst(loot.x, loot.y, b.x, b.y) > b.block.size * 0.5 * Vars.tilesize);
        b.isPulling = b.pullTgs.length > 0;
      };
    } else {
      b.progPull += Time.delta;
      if(b.progPull > b.block.ex_getDurPull()) {
        b.progPull %= b.block.ex_getDurPull();
        b.isPulling = false;
      } else {
        b.pullTgs.forEachFast(loot => {
          loot.impulse(Tmp.v2.set(loot).sub(b.x, b.y).nor().scl(-b.block.ex_getPowPull() * b.glowHeat));
        });
      };
    };

    b.glowHeat = Mathf.approachDelta(b.glowHeat, b.isPulling ? 1.0 : 0.0, b.isPulling ? 0.006 : 0.02);
  };


  function comp_draw(b) {
    MDL_draw._reg_glow(b.x, b.y, b.block.ex_getGlowReg(), 0.0, Color.white, b.glowHeat * 0.7);

    if(b.glowHeat > 0.01) {
      Lines.stroke(2.0, Color.white);
      Draw.alpha(0.3 * b.glowHeat);
      b.pullTgs.forEachFast(loot => {
        if(loot.added) Lines.line(loot.x, loot.y, b.x, b.y);
      });
      Draw.reset();
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(StorageBlock)
    .setTags()
    .setParam({
      // @PARAM: Pull power.
      powPull: 8.0,
      // @PARAM: Duration of each pull.
      durPull: 240.0,
      // @PARAM: Interval between each pull.
      intvPull: 240.0,

      glowReg: null,
    })
    .setParamAlias([
      // @PARAM: Maximum radius to pull nearby loots.
      "pullRad", "blkRad", 5 * 8.0,
    ])
    .setMethod({


      load: function() {
        comp_load(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


    })
    .setGetter("powPull", "durPull", "intvPull", "glowReg"),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(StorageBlock.StorageBuild)
    .setParam({
      isPulling: false,
      pullTgs: prov(() => []),
      progPull: 0.0,
      progWait: 0.0,
      glowHeat: 0.0,
    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      shouldAmbientSound: function() {
        return this.isPulling;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      draw: function() {
        comp_draw(this);
      },


    }),


  ];
