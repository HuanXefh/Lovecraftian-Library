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
     * Note that {BLK_sandMiner} is defined in Lovec Lab.
     * ---------------------------------------- */
    "sand": [

      "sand",

      "loveclab-item0ore-sand",
      "loveclab-item0ore-sand-river",
      "loveclab-item0ore-sand-sea",

    ],


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
   * Also, items or fluids with these tags will be categorized in {GLB_varGen}.
   * Icon tags will only be shown when the tag sprites are found.
   * For your own mod, you need create your own "sprites/icons/rs0tag" folder and put sprites there.
   * ---------------------------------------- */
  "intmdTag": [

    "rs-p1",
    "rs-p2",

    "rs-chunks",
    "rs-clean",
    "rs-conc",
    "rs-crude0gas",
    "rs-dust",

  ],


};


Object.mergeDB(db, "DB_item");


exports.db = db;
