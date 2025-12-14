const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  param: {


    /* ----------------------------------------
     * NOTE:
     *
     * Fuel parameters for a fuel.
     * Format (item): {nm, [fuelPon, fuelLvl]}.
     * Format (fluid): {nm, [consRate, fuelLvl]}.
     * ---------------------------------------- */
    fuel: {


      item: [

        "coal", [8.0, 8.0],

      ],


      fluid: [],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Hardness of the item, mostly used for ore items.
     * Will overwrite the value defined anywhere else.
     * Required for proper recipe generation.
     * ---------------------------------------- */
    hardness: [],


    /* ----------------------------------------
     * NOTE:
     *
     * The temperature for sintering process, used for recipe generation.
     * Applied to ore items only.
     * ---------------------------------------- */
    sintTemp: [],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  map: {


    attr: {


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a bush harvester.
       * ---------------------------------------- */
      bush: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a depth liquid pump.
       * ---------------------------------------- */
      dpliq: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a quarry.
       * ---------------------------------------- */
      rock: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a tree tap.
       * ---------------------------------------- */
      tree: [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps an attribute to some resource obtained by a vent collector.
       * ---------------------------------------- */
      vent: [],


    },


    recipe: {


      alloying: [],


      brickBaking: [],


      casting: [],


      forging: [],


      mixing: [],


      ballMillMixing: [],


      purificationI: [],


      purificationII: [],


      purificationMagnetic: [],


      purificationFloat: [],


      roasting: [],


      concentrateRoasting: [],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  group: {


    fuel: {


      /* ----------------------------------------
       * NOTE:
       *
       * Biotic fuels like timber.
       * ---------------------------------------- */
      biotic: [],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Items here are not mineable by regular drills by default, a sand miner is required.
     * ---------------------------------------- */
    sand: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Items here can be crushed for aggregate.
     * Used for recipe generation.
     * Format: {nmItm, reqAmtMtp}.
     * ---------------------------------------- */
    aggregate: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Items considered acidic.
     * ---------------------------------------- */
    acidic: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Items considered basic.
     * ---------------------------------------- */
    basic: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Items like sodium, which react with water and explode.
     * ---------------------------------------- */
    sodium: [],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  /* ----------------------------------------
   * NOTE:
   *
   * These tags can have icon tag sprites, which will be shown over the resource icon.
   * Also, items or fluids with these tags will be categorized in {GLB_varGen.intmds}.
   * Icon tags will only be shown when the tag sprites are found.
   * For your own mod, you need create your own "sprites/icons/rs0tag" folder and put sprites there.
   * ---------------------------------------- */
  intmdTag: [

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


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


Object.mergeDB(db, "DB_item");


exports.db = db;
