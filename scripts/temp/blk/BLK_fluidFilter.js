/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Unlike item filter gate, fluid filter has no side output since it's meant for blocks with multiple fluid outputs.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_fluidJunction");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentSelector");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_io = require("lovec/mdl/MDL_io");


  /* <---------- component ----------> */


  function comp_load(blk) {
    blk.liqReg = fetchRegion(blk, "-liquid");
  };


  function comp_getLiquidDestination(b, b_f, liq) {
    return !b.enabled || liq !== b.liqTg || MDL_cond._isAuxilliaryFluid(liq) ?
      b :
      b.super$getLiquidDestination(b_f, liq);
  };


  function comp_draw(b) {
    if(b.ctTg == null) return;

    Draw.color(b.ctTg.color);
    Draw.rect(b.block.ex_getLiqReg(), b.x, b.y);
    Draw.color();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(LiquidJunction)
    .setTags("blk-liq", "blk-gate")
    .setParam({
      liqReg: null,
    })
    .setMethod({


      load: function() {
        comp_load(this);
      },


      ex_findSelectionTgs: function() {
        return Vars.content.liquids().select(liq => !MDL_cond._isAuxilliaryFluid(liq)).toArray();
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    })
    .setGetter("liqReg"),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(LiquidJunction.LiquidJunctionBuild)
    .setParam({})
    .setMethod({


      getLiquidDestination: function(b_f, liq) {
        return comp_getLiquidDestination(this, b_f, liq);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      draw: function() {
        comp_draw(this);
      },


      write: function(wr) {
        let lovecRevi = processRevision(wr);
        this.ex_processData(wr, lovecRevi);
        MDL_io._wr_ct(wr, this.liqTg);
      }
      .setProp({
        override: true,
      }),


      read: function(rd, revi) {
        let lovecRevi = processRevision(rd);
        this.ex_processData(rd, lovecRevi);
        this.liqTg = MDL_io._rd_ct(rd);
      }
      .setProp({
        override: true,
      }),


    }),


  ];
