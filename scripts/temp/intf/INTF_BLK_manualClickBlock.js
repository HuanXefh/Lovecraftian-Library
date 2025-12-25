/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The block only operates when a player keeps clicking it.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const JAVA = require("lovec/glb/GLB_java");
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;

    let scr = b => {
      b.ex_accManualClickFrac(Mathf.lerp(b.ex_accManualClickFrac("read"), 1.25, 0.125));
      MDL_effect.showAt_click(b.x, b.y, b.team);
      Sounds.click.at(b);
    };
    switch(blk.manualClickCfgTp) {
      case "boolean" :
        blk.config(JAVA.BOOLEAN, (b, bool) => {
          if(bool) scr(b);
          b.ex_onManualClickConfigured(bool);
        });
        break;
      case "string" :
        blk.config(JAVA.STRING, (b, str) => {
          if(str === "start") scr(b);
          b.ex_onManualClickConfigured(str);
        });
        break;
      case "float" :
        blk.config(JAVA.FLOAT, (b, f) => {
          scr(b);
          b.ex_onManualClickConfigured(f);
        });
        break;
      default :
        throw new Error("Unsupported config type: " + blk.manualClickCfgTp);
    };
  };


  function comp_updateTile(b) {
    if(TIMER.secQuarter) {
      b.manualClickFrac = Mathf.maxZero(b.manualClickFrac - 0.03);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= Math.min(b.manualClickFrac, 1.0);
  };


  function comp_configTapped(b) {
    if(b.block.ex_getSkipTapConfig()) return true;

    Vars.state.paused ?
      MDL_ui.show_fadeInfo("lovec", "paused-manual-click") :
      b.ex_configureClick();

    return false;
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


  function comp_ex_configureClick(b) {
    let cfgVal = null;
    switch(b.block.ex_getManualClickCfgTp()) {
      case "boolean" :
        cfgVal = true;
        break;
      case "string" :
        cfgVal = "start";
        break;
      case "float" :
        cfgVal = -Number.n8;
        break;
    };
    if(cfgVal != null) b.configure(cfgVal);
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
        // @PARAM: Type of parameter used for config.
        manualClickCfgTp: "boolean",
        // @PARAM: Change this if you have a button to click.
        skipTapConfig: false,
      }),
      __GETTER_SETTER__: () => [
        "manualClickCfgTp",
        "skipTapConfig",
      ],


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        manualClickFrac: 0.0,
      }),
      __ACCESSOR_SETTER__: () => [
        "manualClickFrac",
      ],


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      configTapped: function() {
        return comp_configTapped(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /* ----------------------------------------
      * NOTE:
      *
      * @LATER
      * Called whenever this building is configured.
      * ---------------------------------------- */
      ex_onManualClickConfigured: function(val) {

      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * Call this to apply one click.
       * ---------------------------------------- */
      ex_configureClick: function() {
        comp_ex_configureClick(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,
          (wr, revi) => {
            // Do nothing
          },

          (rd, revi) => {
            if(revi < 1) {
              rd.s();
            };
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
