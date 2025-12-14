/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla attribute crafter.
   * To be honest I don't like this as a pure factory.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_pos = require("lovec/mdl/MDL_pos");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk0fac_prodSpd, blk.liqProdRate * 60.0, StatUnit.liquidSecond);
  };


  function comp_ex_findWeatherLiquid(blk) {
    let liq = null;
    if(PARAM.isCaveMap) return liq;

    Groups.weather.each(weaSta => weaSta.weather instanceof RainWeather, weaSta => liq = weaSta.weather.liquid);

    return liq;
  };


  const comp_updateTile = function thisFun(b) {
    if(TIMER.secFive) b.rsTg = b.block.ex_findWeatherLiquid();

    if(b.rsTg !== null {
      FRAG_fluid.addLiquid(b, b, b.rsTg, b.block.ex_getLiqProdRate(), true);
      // Spill liquid if full
      if(b.efficiency > 0.0 && Mathf.chanceDelta(0.04) && b.liquids.get(b.rsTg) > b.block.liquidCapacity * 0.98) {
        MDL_pos._tsEdge(b.tile, b.block.size, true, thisFun.tmpTs).forEachFast(ot => {
          if(Mathf.chance(0.5)) Puddles.deposit(ot, b.rsTg, 4.0);
        });
      };
    };
  }
  .setProp({
    tmpTs: [],
  });


  function comp_displayBars(b, tb) {
    if(b.rsTg != null && b.block.outputLiquids != null && !b.block.outputLiquids.some(liqStack => liqStack.liquid === b.rsTg)) {
      tb.add(new Bar(
        b.rsTg.localizedName,
        tryVal(b.rsTg.barColor, b.rsTg.color),
        () => b.liquids.get(liq) / b.block.liquidCapacity,
      )).growX();
      tb.row();
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({
      // @PARAM: Production rate for weather liquid output.
      liqProdRate: 0.1,
    })
    .setMethod({


      setStats: function() {
        comp_setStats(this);
      },


      ex_findWeatherLiquid: function() {
        return comp_ex_findWeatherLiquid(this);
      }
      .setProp({
        noSuper: true,
      }),


    })
    .setGetter("liqProdRate"),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({
      rsTg: null,
    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      displayBars: function(tb) {
        comp_displayBars(this, tb);
      },


    }),


  ];
