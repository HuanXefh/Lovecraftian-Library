const db = {


  "param": {


    /* ----------------------------------------
     * NOTE:
     *
     * Pollution tolerance.
     * Units will gain debuffs when current pollution point exceeds this.
     * ---------------------------------------- */
    "polTol": [],


    /* ----------------------------------------
     * NOTE:
     *
     * A list of mount ids. Those mounts are used for reload bar display.
     * For flipped weapons, using the same offset group is recommended.
     * For different type of weapons, put them in different groups.
     * ---------------------------------------- */
    "reloadBarIds": {


      "off0": [

        "vela", [0],
        "corvus", [0],

        "toxopid", [2],

        "omura", [0],

        "conquer", [0],

        "anthicus", [0, 1],
        "collaris", [0, 1],

        "obviate", [0],

        "new-horizon-longinus", [0],
        "new-horizon-hurricane", [7],

        "new-horizon-saviour", [0],

        "new-horizon-declining", [0, 1, 2],

        "new-horizon-collapser", [7],

        "new-horizon-restriction-enzyme", [0],
        "new-horizon-macrophage", [0],
        "new-horizon-laugra", [4],
        "new-horizon-pester", [6],

      ],


      "off1": [


        "new-horizon-macrophage", [3],


      ],


      "off2": [],



    },


  },


  "map": {


    /* ----------------------------------------
     * NOTE:
     *
     * Faction for unit type. See {DB_block.db["map"]["faction"]}.
     * ---------------------------------------- */
    "faction": [],


  },


  "group": {


    /* ----------------------------------------
     * NOTE:
     *
     * These units are related to core in some way.
     * ---------------------------------------- */
    "coreUnit": [],


    /* ----------------------------------------
     * NOTE:
     *
     * These units are not robots, and they don't create remains upon death.
     * ---------------------------------------- */
    "nonRobot": [

      "renale", "latum",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * These units are rare exceptions that don't create remains.
     * ---------------------------------------- */
    "noRemains": [

      "new-horizon-nucleoid",

      "new-horizon-guardian",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * If a mod has customized unit debris, don't create extra remains now.
     * ---------------------------------------- */
    "noRemainsMod": [

      "aquarion",

    ],


  },


  "class": {


    "btp": {


      /* ----------------------------------------
       * NOTE:
       *
       * These bullets can deal damage remotely.
       * ---------------------------------------- */
      "remote": [

        ContinuousBulletType,
        LaserBulletType, ShrapnelBulletType,
        PointBulletType, RailBulletType, PointLaserBulletType, SapBulletType,
        InterceptorBulletType,

      ],


    },


  },


};


Object.mergeDB(db, "DB_unit");


exports.db = db;
