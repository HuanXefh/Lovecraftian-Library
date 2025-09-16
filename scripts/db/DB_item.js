const db = {


  "param": {


    /* ----------------------------------------
     * NOTE:
     *
     * Fuel parameters for a fuel.
     * Format (item): {nm, [fuelPon, fuelLvl]}.
     * Format (fluid): {nm, [consRate, fuelLvl]}.
     * ---------------------------------------- */
    "fuel": {


      "item": [],


      "fluid": [],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Hardness of the item, mostly used for ore items.
     * Will overwrite the value defined anywhere else.
     * Required for proper recipe generation.
     * ---------------------------------------- */
    "hardness": [],


    /* ----------------------------------------
     * NOTE:
     *
     * The temperature for sintering process, used for recipe generation.
     * Can be applied to ore items only.
     * ---------------------------------------- */
    "sintTemp": [],


  },


  "map": {


    "attr": {


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a bush harvester.
       * ---------------------------------------- */
      "bush": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a depth liquid pump.
       * ---------------------------------------- */
      "dpliq": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a quarry.
       * ---------------------------------------- */
      "rock": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a tree tap.
       * ---------------------------------------- */
      "tree": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a vent collector.
       * ---------------------------------------- */
      "vent": [],


    },


    "recipe": {


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an item together with temperature to its alloying ingredents, ratios and final probability.
       * Supports alternative inputs.
       * ---------------------------------------- */
      "alloying": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an item to its brick baking recipe target and the temperature required.
       * ---------------------------------------- */
      "brickBaking": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an item to its casting ingredent array and the temperature required.
       * ---------------------------------------- */
      "casting": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an item to its forging ingredent array and the temperature required.
       * ---------------------------------------- */
      "forging": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an item to its mixing ingredents, ratios and final probability.
       * Supports alternative inputs.
       * ---------------------------------------- */
      "mixing": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Like {"mixing"} but carried out in a ball mill.
       * ---------------------------------------- */
      "ballMillMixing": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an ore item to its possible side products and chances.
       * ---------------------------------------- */
      "purificationI": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Like {"purificationI"} but used for advanced separation (like a classifier).
       * ---------------------------------------- */
      "purificationII": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Like {"purificationI"} but for magnetic separators only.
       * ---------------------------------------- */
      "purificationMagnetic": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Variant of {"purificationII"} used for floatation.
       * TODO: Define the format.
       * ---------------------------------------- */
      "purificationFloat": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an item to its roasting recipe target and the temperature required.
       * ---------------------------------------- */
      "roasting": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Variant of {"roasting"} used for concentrate items.
       * ---------------------------------------- */
      "concentrateRoasting": [],


    },


  },


  "group": {


    /* ----------------------------------------
     * NOTE:
     *
     * Items here are not mineable by regular drills by default, a sand miner is required.
     * ---------------------------------------- */
    "sand": [

      "sand",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Items here can be crushed for aggregate.
     * Used for recipe generation.
     * Format: {nmItm, reqAmtMtp}.
     * ---------------------------------------- */
    "aggregate": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Items considered acidic.
     * ---------------------------------------- */
    "acidic": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Items considered basic.
     * ---------------------------------------- */
    "basic": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Items like sodium, which react with water and explode.
     * ---------------------------------------- */
    "sodium": [],


  },


  /* ----------------------------------------
   * NOTE:
   *
   * These tags can have icon tag sprites, which will be shown over the resource icon.
   * Also, items or fluids with these tags will be categorized in {GLB_varGen.intmds}.
   * Icon tags will only be shown when the tag sprites are found.
   * For your own mod, you need create your own "sprites/icons/rs0tag" folder and put sprites there.
   * ---------------------------------------- */
  "intmdTag": [

    "rs-p1",
    "rs-p2",

    "rs-chunks",
    "rs-dust",
    "rs-blend",
    "rs-clinker",
    "rs-ore0conc",
    "rs-crd",

    "rs-conc",

    "rs-clean",
    "rs-crdg",

  ],


};


Object.mergeDB(db, "DB_item");


exports.db = db;
