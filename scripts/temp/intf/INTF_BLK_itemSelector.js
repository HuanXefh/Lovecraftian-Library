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


  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.selectionColumns = 10;
    };

    blk.configurable = true;
    blk.saveConfig = true;
    blk.clearOnDoubleTap = true;

    blk.config(Item, (b, itm) => {
      b.ex_accRsTg(itm);
      b.ex_onSelectorUpdate();
    });

    blk.configClear(b => {
      b.ex_accRsTg("null");
      b.ex_onSelectorUpdate();
    });
  };


  function comp_buildConfiguration(b, tb) {
    b.ex_buildSelector(tb);
  };


  function comp_ex_buildSelector(b, tb) {
    MDL_table.setSelector_ct(
      tb, b.block, Vars.content.items().toArray(),
      () => b.ex_accRsTg("read"), val => b.configure(val), false,
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


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        rsTg: null,
      }),
      __ACCESSOR_SETTER__: () => [
        "rsTg",
      ],


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return this.rsTg;
      }
      .setProp({
        noSuper: true,
      }),


      ex_accRsTg: function(param) {
        return param == "read" ?
          this.rsTg :
          (this.rsTg = param);
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
            MDL_io._wr_ct(wr, this.rsTg);
          },

          (rd, revi) => {
            this.rsTg = MDL_io._rd_ct(rd);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
