/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The root of all man-made blocks.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");
  const INTF = require("lovec/temp/intf/INTF_BLK_coreEnergyConsumer");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_pollution = require("lovec/mdl/MDL_pollution");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.noLoot = blk.noLoot || DB_block.db["group"]["noLoot"].includes(blk.name);
    blk.noReac = blk.noReac || blk instanceof CoreBlock || DB_block.db["group"]["noReac"].includes(blk.name);
    blk.canShortCircuit = blk.canShortCircuit || DB_block.db["group"]["shortCircuit"].includes(blk.name);
  };


  function comp_setStats(blk) {
    if(blk.canShortCircuit) blk.stats.add(TP_stat.blk_shortCircuit, true);

    if(DB_block.db["map"]["facFami"].colIncludes(blk.name, 2, 0)) {
      blk.stats.add(TP_stat.spec_facFami, newStatValue(tb => {
        tb.row();
        MDL_table.setDisplay_facFami(tb, blk);
      }));
    };

    MDL_pollution.comp_setStats_pol(blk);
  };


  function comp_icons(blk) {
    return Core.atlas.has(blk.name + "-full") ? [Core.atlas.find(blk.name + "-full")] : blk.super$icons();
  };


  function comp_onDestroyed(b) {
    if(b.block.ex_getNoLoot()) return;

    if(b.items != null) {
      let amt;
      b.items.each(itm => {
        amt = !(b.block instanceof CoreBlock) ?
          b.items.get(itm) :
          (b.items.get(itm) / Math.max(b.team.cores().size, 1));
        if(amt >= 20) MDL_call.spawnLoot_server(b.x, b.y, itm, amt.randFreq(0.3), b.block.size * Vars.tilesize * 0.7);
      });
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT).implement(INTF[0]).initClass()
    .setParent(null)
    .setTags()
    .setParam({
      // @PARAM: See {RS_baseResource}.
      overwriteVanillaStat: true,
      // @PARAM: See {RS_baseResource}.
      overwriteVanillaProp: true,
      // @PARAM: Whether to skip loot spawning when destroyed. Can be set in {DB_block.db["group"]["noLoot"]}.
      noLoot: false,
      // @PARAM: Whether to ignore reactions. Can be set in {DB_block.db["group"]["noReac"]}.
      noReac: false,
      // @PARAM: Whether this block will short-circuit when soaked in aqueous liquid. Can be set in {DB_block.db["group"]["shortCircuit"]}.
      canShortCircuit: false,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      icons: function() {
        return comp_icons(this);
      }
      .setProp({
        noSuper: true,
      }),


    })
    .setGetter("noLoot", "noReac", "canShortCircuit"),


    // Building
    newClass().extendClass(PARENT).implement(INTF[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


    }),


  ];
