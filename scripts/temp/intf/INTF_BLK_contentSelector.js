/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles item selector.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const JAVA = require("lovec/glb/GLB_java");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.selectionColumns = 10;
    };

    blk.selectionQueue.pushAll(blk.ex_findSelectionTgs());

    blk.configurable = true;
    blk.saveConfig = true;
    blk.clearOnDoubleTap = true;

    blk.config(JAVA.STRING, (b, nmCt) => {
      b.ex_accCtTg(MDL_content._ct(nmCt, null, true));
      b.ex_onSelectorUpdate();
    });

    blk.configClear(b => {
      b.ex_accCtTg(null);
      b.ex_onSelectorUpdate();
    });
  };


  function comp_buildConfiguration(b, tb) {
    b.ex_buildSelector(tb);
  };


  function comp_ex_buildSelector(b, tb) {
    MDL_table.setSelector_ct(
      tb, b.block, b.block.ex_getSelectionQueue(),
      () => b.ex_accCtTg("read"), val => b.configure(val == null ? null : val.name), false,
      b.block.selectionRows, b.block.selectionColumns,
    );
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
        selectionQueue: prov(() => []),
      }),
      __GETTER_SETTER__: () => [
        "selectionQueue",
      ],


      init: function() {
        comp_init(this);
      },


      ex_findSelectionTgs: function() {
        return Vars.content.items().toArray();
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        ctTg: null,
      }),
      __ACCESSOR_SETTER__: () => [
        "ctTg",
      ],


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return this.ctTg;
      }
      .setProp({
        noSuper: true,
      }),


      ex_buildSelector: function(tb) {
        comp_ex_buildSelector(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      // @LATER
      ex_onSelectorUpdate: function() {

      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, lovecRevi) {
        processData(
          wr0rd, lovecRevi,

          (wr, revi) => {
            MDL_io._wr_ct(wr, this.ctTg);
          },

          (rd, revi) => {
            this.ctTg = MDL_io._rd_ct(rd);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
