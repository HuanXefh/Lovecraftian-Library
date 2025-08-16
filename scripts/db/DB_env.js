const MDL_content = require("lovec/mdl/MDL_content");


const db = {


  "param": {


    "pla": {


      /* ----------------------------------------
       * NOTE:
       *
       * Wind attribute multiplier for a planet.
       * Format: {nmPla, num}.
       * ---------------------------------------- */
      "wind": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Global heat for a planet.
       * 1.0 here equals 100.0 HU.
       * Format: {nmPla, num}.
       * ---------------------------------------- */
      "heat": [],


    },


    "map": {


      /* ----------------------------------------
       * NOTE:
       *
       * Weather entries for a map (always permanent), used for campaign maps but works for any map.
       * No need to set weathers for those maps in editor.
       * No weathers from vanilla game or other mods for now.
       * Format: {nmMap, nmWeas}.
       * ---------------------------------------- */
      "we": [

        // For weather test only
        "test-001-blocks", [
          "loveclab-wea0amb-anthymist-normal",
          "loveclab-wea0deco-heavy-rain",
          "loveclab-wea0deco-steam-flow",
          "loveclab-wea0deco-fog-black",
        ],

      ],


      /* ----------------------------------------
       * NOTE:
       *
       * Wind attribute multiplier for a map.
       * Format: {nmMap, num}.
       * ---------------------------------------- */
      "wind": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Global heat for a map.
       * Format: {nmMap, num}.
       * ---------------------------------------- */
      "heat": [],


    },


  },


  "map": {


    /* ----------------------------------------
     * NOTE:
     *
     * Maps a random region tag to a region array getter function.
     * Format: {tag, regsGetter}.
     * ---------------------------------------- */
    "randRegTag": [

      "rock", MDL_content._randRegs_rock,
      "rock-sand", MDL_content._randRegs_rockSand,

    ],


  },


  /* ----------------------------------------
   * NOTE:
   *
   * Maps name of a node root to the localized name of a content.
   *
   * Example:
   * "core-shard", "serpulo",    // Sets the name of root with {Blocks.coreShard} to localized name of {Planets.serpulo}
   * ---------------------------------------- */
  "nodeRootNameMap": [],


  /* ----------------------------------------
   * NOTE:
   *
   * Extra teams to be added into {VARGEN.mainTeams}.
   * This affects team-based mechanics like CEP and corrosion.
   * ---------------------------------------- */
  "extraMainTeam": [],


};


Object.mergeDB(db, "DB_env");


exports.db = db;
