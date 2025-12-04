/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods related to loot unit.
   * Stats not included.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  /* <---------- component ----------> */


  function comp_onProximityUpdate(b) {
    b.ex_updateLootTs();
  };


  function comp_pickedUp(b) {
    b.lootTs.clear();
  };


  function comp_updateTile(b) {
    if(b.block.ex_getLootCallIntv() < 1.0) return;

    if(b.timerLootCall.get(b.block.ex_getLootCallIntv() / Math.max(b.efficiency, 0.000001))) {
      b.ex_updateLootQueue(b.lootTs);
      b.ex_lootCall(b.LootQueue, b.block.ex_getLootCallAmt());
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    // @FIELD: lootCallIntv(GET), lootCallAmt(GET)
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Craft time of this loot block. Loot call is ignored if this is less than 1.0.
        lootCallIntv: 0.0,
        // @PARAM: Amount parameter of this loot block.
        lootCallAmt: 0,
      }),
      __GETTER_SETTER__: () => [
        "lootCallIntv",
        "lootCallAmt",
      ],


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        lootTs: prov(() => []),
        lootQueue: prov(() => []),
        timerLootCall: prov(() => new Interval(1)),
      }),


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Push target tiles to {b.lootTs} here.
       * ---------------------------------------- */
      ex_updateLootTs: function() {

      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Push target loots to {b.LootQueue} here.
       * Don't modify {ts}.
       * ---------------------------------------- */
      ex_updateLootQueue: function(ts) {

      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Called occasionally, process loots here.
       * ---------------------------------------- */
      ex_lootCall: function(loots, amtCall) {

      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
