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


    "entity": {


      /* ----------------------------------------
       * NOTE:
       *
       * Maps type to a unit class and extra id if possible.
       * Make sure the id here is not used by vanilla game!
       * ---------------------------------------- */
      "type": [

        "flying", [UnitEntity, null],
        "mech", [MechUnit, null],
        "legs", [LegsUnit, null],
        "naval", [UnitWaterMove, null],
        "payload", [PayloadUnit, null],
        "missile", [TimedKillUnit, null],
        "tank", [TankUnit, null],
        "hover", [ElevationMoveUnit, null],
        "tether", [BuildingTetherPayloadUnit, null],
        "crawl", [CrawlUnit, null],

        "lovec-mech", [MechUnit, 81],

      ],


      /* ----------------------------------------
       * NOTE:
       *
       * Used to define new entity types.
       * Format: {id, obj}.
       * ---------------------------------------- */
      "entityDef": [

        // lovec-mech
        81, {
          validMine(t, checkDst) {
            if(t == null) return false;
            if(global.lovecUtil.fun._hasTag(t.overlay(), "blk-dpore")) return false;
            if(this.isPlayer()) {
              let blk = t.overlay() != null && t.overlay().itemDrop != null ? t.overlay() : (t.block() !== Blocks.air ? t.block() : t.floor());
              if(blk.playerUnmineable) return false;
            };
            return this.super$validMine(t, Object.val(checkDst, true));
          },
        },

      ],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Faction for unit type. See {DB_block.db["map"]["faction"]}.
     * ---------------------------------------- */
    "faction": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Used to add abilities to some unit types.
     * The ability setter function must be registered first!
     * See {TP_ability} where {nmAbi} and the function is added to {global.lovecUtil.db.abilitySetter}.
     * Format: {nmUtp, nmAbi, args}.
     * ---------------------------------------- */
    "ability": [],


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


  "grpParam": {


    /* ----------------------------------------
     * NOTE:
     *
     * Outline parameters used for units & turrets.
     * ---------------------------------------- */
    "outline": [

      "loveclab", [2, "373a4d"],
      "projreind", [2, "373a4d"],

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
