const db = {


  "param": {


    "fuel": {


      /* ----------------------------------------
       * NOTE:
       *
       * Fuel points a fuel item can add.
       * ---------------------------------------- */
      "point": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Fuel power level, used for recipe generation.
       * For reference it's approximately 1% of flame temperature in real life.
       * ---------------------------------------- */
      "level": [],


      /* ----------------------------------------
       * NOTE:
       *
       * The consumption rate for fluid fuels.
       * ---------------------------------------- */
      "fCons": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Fuel power level for fluids.
       * ---------------------------------------- */
      "fLevel": [],


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
     * Items that will denature if explosed to air.
     * ---------------------------------------- */
    "denaturing": [],


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

    "rs-blend",
    "rs-chunks",
    "rs-clean",
    "rs-conc",
    "rs-crude0gas",
    "rs-dust",

  ],


};


Object.mergeDB(db, "DB_item");


exports.db = db;
