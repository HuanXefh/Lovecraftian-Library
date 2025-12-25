/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Used only to fake a non-square building, works as inlets for the center building.
   * Not expected to consume anything!
   * This block is technically not rotatable, I'm too lazy to deal with more math and sprites.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rotate = false;
    blk.liquidOutputDirections = [blk.linkRot];

    blk.linkFld = MDL_content._ct(blk.linkFld, "rs");
    if(blk.linkFld == null) ERROR_HANDLER.throw("nullArgument", "linkFld");
    blk.outputLiquids = [new LiquidStack(blk.linkFld, blk.linkFldProdRate)];
    blk.outputsLiquid = true;
    blk.linkFld.ex_accProducedIn(blk);
  };


  function comp_onProximityUpdate(b) {
    MDL_pos._tsRot(b.tile, b.block.liquidOutputDirections[0], b.block.size, b.linkComponentTmpTs);
  };


  function comp_updateTile(b) {
    if(TIMER.sec) {
      b.linkComponentTmpBs.clear();
      b.linkB = null;
      // Check whether the factory is properly linked to another part
      b.isLinkComponentValid = !b.linkComponentTmpTs.some(ot => {
        if(ot.build == null || b.linkComponentTmpBs.includes(ot.build)) return true;
        b.linkComponentTmpBs.push(ot.build);
        b.linkB = ot.build;
        return false;
      });
      if(!b.isLinkComponentValid) {
        // Not linked
        b.linkB = null;
        b.linkCenter = null;
      } else {
        // Tries to fetch center of the entire structure
        b.linkCenter = tryFun(b.linkB.ex_getLinkCenter, b.linkB, null);
        if(b.linkCenter == null) {
          let ob = b.linkB;
          while(ob != null && MDL_cond._isLinkComponent(ob.block) && ob.ex_getLinkB() != null) {
            ob = ob.ex_getLinkB();
          };
          b.linkCenter = ob;
        };
      };
    };

    if(b.linkCenter != null) {
      // For sync only
      b.totalProgress = b.linkCenter.totalProgress;
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(!b.isLinkComponentValid) b.efficiency = 0.0;
  };


  function comp_drawStatus(b) {
    if(!b.block.enableDrawStatus) return;
    MDL_draw._reg_blkStatus(b.x, b.y, b.block.size, b.status().color);
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
    .setTags("blk-fac", "blk-link0fac")
    .setParam({
      // @PARAM: The rotation used to check link validity.
      linkRot: 0,
      // @PARAM: The link fluid used for this block.
      linkFld: null,
      // @PARAM: Rate at which link fluid is produced.
      linkFldProdRate: 1.0 / 60.0,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({
      isLinkComponentValid: false,
      linkB: null,
      linkCenter: null,
      linkComponentTmpTs: prov(() => []),
      linkComponentTmpBs: prov(() => []),
    })
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      handleItem: function(b_f, itm) {
        if(this.linkCenter != null) this.linkCenter.handleItem(b_f, itm);
      }
      .setProp({
        noSuper: true,
      }),


      handleStack: function(itm, amt, e_f) {
        if(this.linkCenter != null) this.linkCenter.handleStack(itm, amt, e_f);
      }
      .setProp({
        noSuper: true,
      }),


      handleLiquid: function(b_f, liq, amt) {
        if(this.linkCenter != null) this.linkCenter.handleLiquid(b_f, liq, amt);
      }
      .setProp({
        noSuper: true,
      }),


      acceptItem: function(b_f, itm) {
        return this.linkCenter == null ? false : this.linkCenter.acceptItem(b_f, itm);
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      acceptLiquid: function(b_f, liq) {
        return this.linkCenter == null ? false : this.linkCenter.acceptLiquid(b_f, liq);
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      status: function() {
        return this.linkCenter == null ? BlockStatus.noInput : this.linkCenter.status();
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      drawStatus: function() {
        comp_drawStatus(this);
      }
      .setProp({
        noSuper: true,
      }),


    })
    .setGetter("linkB", "linkCenter"),


  ];
