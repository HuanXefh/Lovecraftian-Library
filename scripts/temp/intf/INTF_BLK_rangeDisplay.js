/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles retangular range display.
   * No stat is added.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");


  /* <---------- component ----------> */


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    blk.ex_getUseP3dRange() ?
      MDL_draw._p3d_roomFade(tx.toFCoord(blk.size), ty.toFCoord(blk.size), 1.0, blk.ex_getBlkR().toRectW(blk.size), blk.ex_getBlkR().toRectW(blk.size), blk.ex_getBlkRColor(valid)) :
      MDL_draw._d_rectPlace(blk, tx, ty, blk.ex_getBlkR(), blk.ex_getBlkRColor(valid), true);
  };


  function comp_draw(b) {
    if(b.block.ex_getUseP3dRange() && MDL_cond._posHoveredRect(b.x, b.y, 0, b.block.size)) {
      MDL_draw._p3d_roomFade(b.x, b.y, 1.0, b.block.ex_getBlkR().toRectW(b.block.size), b.block.ex_getBlkR().toRectW(b.block.size), b.block.ex_getBlkRColor(true), VAR.lay_p3dRange);
    };
  };


  function comp_drawSelect(b) {
    if(!b.block.ex_getUseP3dRange()) {
      MDL_draw._d_rectSelect(b, b.block.ex_getBlkR(), b.block.ex_getBlkRColor(true), true);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Range (in blocks) to show.
        blkR: 5,
        // @PARAM: See {INTF_BLK_radiusDisplay}.
        useP3dRange: true,
      }),
      __GETTER_SETTER__: () => [
        "blkR",
        "useP3dRange",
      ],


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      // @LATER
      ex_getBlkRColor: function(valid) {
        return Pal.accent;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


    // Building
    new CLS_interface({


      draw: function() {
        comp_draw(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


    }),


  ];
