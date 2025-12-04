/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles item multi-selector.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const EFF = require("lovec/glb/GLB_eff");
  const JAVA = require("lovec/glb/GLB_java");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.selectionColumns = 10;
    };

    blk.configurable = true;
    blk.saveConfig = false;
    blk.clearOnDoubleTap = false;

    blk.config(JAVA.STRING, (b, str) => {
      b.ex_accRsTgs(str, false);
      EFF.squareFadePack[b.block.size].at(b);
      b.ex_onSelectorUpdate();
    });

    blk.config(JAVA.OBJECT_ARRAY, (b, cfgArr) => {
      switch(cfgArr[0]) {
        case "selectorBlock" :
          let i = 1, iCap = cfgArr.iCap();
          while(i < iCap) {
            let rs = MDL_content._ct(nmRs, "rs");
            if(rs != null) b.ex_accRsTgs(rs, true);
            i++;
          };
          EFF.squareFadePack[b.block.size].at(b);
          b.ex_onSelectorConfigLoad(cfgArr);
          break;

        case "selector" :
          b.ex_accRsTgs(cfgArr[1], cfgArr[2]);
          EFF.squareFadePack[b.block.size].at(b);
          b.ex_onSelectorUpdate();
          break;
      };
    });
  };


  function comp_buildConfiguration(b, tb) {
    b.ex_buildSelector(tb);

    tb.row();
    MDL_table.__btnCfg(tb, b, b => {
      b.configure("clear");
      b.deselect();
    }, VARGEN.icons.cross).tooltip(MDL_bundle._info("lovec", "tt-clear-selection"), true)
  };


  function comp_ex_buildSelector(b, tb) {
    MDL_table.setSelector_ctMulti(
      tb, b.block, Vars.content.items().toArray(),
      () => b.ex_accRsTgs("read", false), val => b.configure(val), false,
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
        rsTgs: prov(() => []),
      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return ["selectorBlock"]
        .pushAll(this.rsTgs.map(rs => rs == null ? "null" : rs.name))
        .toJavaArr();
      }
      .setProp({
        noSuper: true,
      }),


      ex_accRsTgs: function(param, isAdd) {
        switch(param) {
          case "read" :
            return this.rsTgs;
          case "clear" :
            this.block.lastConfig = "clear";
            return this.rsTgs.clear();
          default :
            return isAdd ?
              this.rsTgs.pushUnique(param) :
              this.rsTgs.remove(param);
        };
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
      ex_onSelectorConfigLoad: function(cfgArr) {

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
            MDL_io._wr_cts(wr, this.rsTgs);
          },

          (rd, revi) => {
            MDL_io._rd_cts(rd, this.rsTgs);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
