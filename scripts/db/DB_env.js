const MDL_texture = require("lovec/mdl/MDL_texture");


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
       * Noise layer drawn for each map.
       * Format: {nmMap, args}.
       * Format for {args}: {nmTex, color, noiseScl, opac, spd, intens, windX, windY, off}.
       * ---------------------------------------- */
      "noise": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Weather entries for a map (always permanent), used for campaign maps but works for any map.
       * No need to set weathers for those maps in editor.
       * No weathers from vanilla game or other mods for now.
       * Format: {nmMap, nmWeas}.
       * ---------------------------------------- */
      "weaEn": [],


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


    "rule": {


      /* ----------------------------------------
       * NOTE:
       *
       * Default values for campaign rules assigned to some planet.
       * Check {CampaignRules} class.
       * Format: {nmPla, ruleSetter}.
       * ---------------------------------------- */
      "campaignRule": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Maps a planet to a rule setter function.
       * Fog should be set in campaign rules too, you should ask Anuke why.
       * Format: {nmPla, ruleSetter}.
       * ---------------------------------------- */
      "planetRule": [],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Maps a random region tag to a region array getter function.
     * Format: {tag, regsGetter}.
     * ---------------------------------------- */
    "randRegTag": [

      "rock", MDL_texture._randRegsGetter("lovec-ov0rand-rock"),
      "rock-sand", MDL_texture._randRegsGetter("lovec-ov0rand-rock-sand"),
      "rock-sand-dark", MDL_texture._randRegsGetter("lovec-ov0rand-rock-sand-dark"),

    ],


  },


  "grpParam": {


    /* ----------------------------------------
     * NOTE:
     *
     * Tree parameters used for tree types.
     * See {ENV_baseTree}.
     * ---------------------------------------- */
    "tree": [

      "tree", "scl", 1.0,
      "tree", "mag", 1.0,
      "tree", "wob", 1.0,
      "tree", "attrsGetter", () => ["lovec-attr0blk-tree", "lovec-attr0blk-hard-tree"],

      "bush", "scl", 0.5,
      "bush", "mag", 1.5,
      "bush", "wob", 0.7,
      "bush", "attrsGetter", () => [/*TODO*/],

      "fungi", "scl", 3.0,
      "fungi", "mag", 0.4,
      "fungi", "wob", 0.3,
      "fungi", "attrsGetter", () => ["lovec-attr0blk-fungi", "lovec-attr0blk-hard-fungi"]

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
