/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles fluid type restriction.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  /* <---------- component ----------> */


  function comp_acceptLiquid(b, b_f, liq) {
    switch(b.block.ex_getFldTp()) {
      case "liquid" : return !liq.gas && !liq.willBoil();
      case "gas" : return liq.gas || liq.willBoil();
      default : return true;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    // @FIELD: fldTp(GET)
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Fluid type this block accepts. Possible values: "any", "liquid", "gas".
        fldTp: "any",
      }),
      __GETTER_SETTER__: () => [
        "fldTp",
      ],


    }),


    // Building
    new CLS_interface({

      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
      }
      .setProp({
        boolMode: "and",
      }),

    }),


  ];
