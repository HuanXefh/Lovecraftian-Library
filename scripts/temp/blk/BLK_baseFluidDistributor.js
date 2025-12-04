/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Blocks that transport fluids.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFluidBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_fluidTypeFilter");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_corrosionAcceptor");
  const INTF_B = require("lovec/temp/intf/INTF_BLK_fluidHeatAcceptor");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.priority = Math.min(blk.priority, TargetPriority.transport);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).implement(INTF_A[0]).implement(INTF_B[0]).initClass()
    .setParent(null)
    .setTags("blk-liq")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).implement(INTF_A[1]).implement(INTF_B[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      write: function(wr) {
        let lovecRevi = processRevision(wr);
        this.ex_processData(wr, lovecRevi);
      },


      read: function(rd, revi) {
        let lovecRevi = processRevision(rd, revi);
        this.ex_processData(rd, lovecRevi);

        if(lovecRevi < 1) {
          rd.s();
        };
      },


    }),


  ];
