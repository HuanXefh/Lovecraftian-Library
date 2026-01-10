/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * This block is expected to be clicked to trigger something.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const JAVA = require("lovec/glb/GLB_java");


  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;

    blk.config(JAVA.STRING, (b, str) => {
      if(str === "start") {
        b.ex_manualTriggerCall();
        b.ex_accManualTriggerCd(blk.manualTriggerCooldown);
      };
    });
  };


  function comp_setStats(blk) {
    if(blk.manualTriggerCooldown > 0.0) blk.stats.add(TP_stat.blk_cd, blk.manualTriggerCooldown * 60.0, StatUnit.seconds)
    if(blk.manualTriggerCooldownInitial > 0.0) blk.stats.add(TP_stat.blk_cdInit, blk.manualTriggerCooldownInitial * 60.0, StatUnit.seconds)
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-cd", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-cd-amt", b.ex_getManualTriggerCdFrac().perc(0))),
      prov(() => Pal.accent),
      () => b.ex_getManualTriggerCdFrac(),
    ));
  };


  function comp_created(b) {
    b.manualTriggerCd = b.block.ex_getManualTriggerCooldownInitial();
  };


  function comp_updateTile(b) {
    b.manualTriggerCd -= b.edelta();
  };


  function comp_buildConfiguration(b, tb) {
    tb.row();
    b.ex_buildManualTriggerButton(tb);
  };


  function comp_ex_buildManualTriggerButton(b, tb) {
    tb.table(Styles.none, tb1 => {
      tb1.center();
      MDL_table.__btnCfg(tb1, b, () => {
        Vars.state.paused ?
          MDL_ui.show_fadeInfo("lovec", "paused-manual-click") :
          b.manualTriggerCd > 0.0 ?
            MDL_ui.show_fadeInfo("lovec", "in-cd") :
            !b.ex_checkManualTriggerValid() ?
              undefined :
              b.configure("start");
      }, b.block.ex_getManualTriggerIcon(), b.block.ex_getManualTriggerButtonSize());
    }).center();
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
        // @PARAM: Anything that can be drawn in a button.
        manualTriggerIcon: "?",
        // @PARAM: Size of the button used.
        manualTriggerButtonSize: 72.0,
        // @PARAM: Cooldown between each trigger.
        manualTriggerCooldown: 0.0,
        // @PARAM: Cooldown set when the building has just been placed.
        manualTriggerCooldownInitial: 0.0,
      }),
      __GETTER_SETTER__: () => [
        "manualTriggerIcon",
        "manualTriggerButtonSize",
        "manualTriggerCooldown",
        "manualTriggerCooldownInitial",
      ],


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        manualTriggerCd: 0.0,
      }),
      __ACCESSOR_SETTER__: () => [
        "manualTriggerCd",
      ],


      created: function() {
        comp_created(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * What happens when the button is clicked.
       * ---------------------------------------- */
      ex_manualTriggerCall: function() {

      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Extra condition to trigger this.
       * ---------------------------------------- */
      ex_checkManualTriggerValid: function() {
        return true;
      }
      .setProp({
        noSuper: true,
      }),


      ex_getManualTriggerCdFrac: function() {
        return 1.0 - Mathf.clamp(Mathf.maxZero(this.manualTriggerCd) / this.block.ex_getManualTriggerCooldown());
      }
      .setProp({
        noSuper: true,
      }),


      ex_buildManualTriggerButton: function(tb) {
        comp_ex_buildManualTriggerButton(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,
          (wr, revi) => {
            wr.f(this.manualTriggerCd);
          },

          (rd, revi) => {
            this.manualTriggerCd = rd.f();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
