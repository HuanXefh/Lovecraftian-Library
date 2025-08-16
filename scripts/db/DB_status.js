const db = {


  "group": {


    /* ----------------------------------------
     * NOTE:
     *
     * These status effects can't be applied to biotic units.
     * ---------------------------------------- */
    "robotOnly": [

      "loveclab-sta-haste",
      "loveclab-sta0liq-sea-water-corrosion",
      "loveclab-sta0liq-brine-corrosion",
      "loveclab-sta0death-recycle-mark",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * These status effects are related to sea, naval units will gain immunity to these.
     * ---------------------------------------- */
    "oceanic": [

      "wet",

      "loveclab-sta0liq-sea-water-corrosion",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Missile units will be immune to these.
     * By default missiles are immune to {STA_deathStatus}.
     * ---------------------------------------- */
    "missileImmune": [

      "loveclab-sta-haste",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Loot unit should be immune to these status effects.
     * A loot is a collectable stack of items on the ground.
     * ---------------------------------------- */
    "lootImmune": [

      "loveclab-sta-haste",
      "loveclab-sta-hidden-well",
      "loveclab-sta0liq-sea-water-corrosion",
      "loveclab-sta0liq-brine-corrosion",
      "loveclab-sta0death-recycle-mark",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * These status effects are related to high temperature.
     * ---------------------------------------- */
    "hot": [

      "burning",
      "melting",

      "loveclab-sta0bur-overheated",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * These status effects are related to being soaked in aqueous liquids.
     * ---------------------------------------- */
    "wet": [

      "wet",

      "loveclab-sta0liq-sea-water-corrosion",
      "loveclab-sta0liq-brine-corrosion",

    ],


  },


};


Object.mergeDB(db, "DB_status");


exports.db = db;
