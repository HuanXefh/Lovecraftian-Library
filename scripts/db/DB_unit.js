const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  param: {


    /* ----------------------------------------
     * NOTE:
     *
     * Pollution tolerance.
     * Units will gain debuffs when current pollution point exceeds this.
     * ---------------------------------------- */
    polTol: [],


    /* ----------------------------------------
     * NOTE:
     *
     * A list of mount ids. Those mounts are used for reload bar display.
     * For flipped weapons, using the same offset group is recommended.
     * For different type of weapons, put them in different groups.
     * ---------------------------------------- */
    reloadBarIds: {


      off0: [

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

        "asthosus-14n-01-shiv", [2],
        "asthosus-14n-04-apex", [0, 1],
        "asthosus-14n-05-crest", [2],
        "asthosus-15o-02-trigon", [0],
        "asthosus-15o-03-aprotodon", [0],
        "asthosus-15o-04-aphelops", [4],
        "asthosus-15o-05-annectodon", [0],
        "asthosus-16a-04-tequant", [0],
        "asthosus-16p-03-illuminate", [2],
        "asthosus-16p-04-elucidate", [2],
        "asthosus-16p-05-expound", [2, 3],
        "asthosus-17q-06-clitelle", [0],
        "asthosus-barite-elder", [0],
        "asthosus-barite-stalker", [0],

        "aquarion-cyprin", [0, 1],
        "aquarion-bulwark", [0],
        "aquarion-weld", [0],
        "aquarion-pugnate", [0],
        "aquarion-reave", [0],
        "aquarion-soar", [0, 1],
        "aquarion-shatter", [0],
        "aquarion-retaliate", [0],
        "aquarion-castellan", [0],
        "aquarion-parasphendale", [0],
        "aquarion-verglas", [0],

        "sfire-mod-knocker", [0],
        "sfire-mod-partiality-B", [0],
        "sfire-mod-blade", [0, 1],
        "sfire-mod-vast", [0],
        "sfire-mod-libra", [2],
        "sfire-mod-agelenid", [0, 1],
        "sfire-mod-sundown", [6, 7],
        "sfire-mod-dorudon", [4],
        "sfire-mod-striker", [0],
        "sfire-mod-skyfire", [0],
        "sfire-mod-flanker", [0],
        "sfire-mod-executioner", [1],
        "sfire-mod-enforcer", [0],
        "sfire-mod-cirrus", [3],
        "sfire-mod-stratosphere", [0, 1, 2, 3],
        "sfire-mod-alnitak", [2],
        "sfire-mod-regulus", [7],
        "sfire-mod-alioth", [6],
        "sfire-mod-farmer", [0],
        "sfire-mod-thunder", [1],
        "sfire-mod-banisher", [4],
        "sfire-mod-hammer", [0],
        "sfire-mod-UTV-Artillery", [0],

        "sapphirium-snowstorm", [0, 1],
        "sapphirium-cold-blood", [2],
        "sapphirium-shadow", [0],
        "sapphirium-void", [0],
        "sapphirium-nihil", [5],
        "sapphirium-prophecy", [0],
        "sapphirium-shriek", [1, 2],
        "sapphirium-whirlpool", [2],
        "sapphirium-tornado", [3],
        "sapphirium-war", [0],
        "sapphirium-hunt", [0],
        "sapphirium-raptor", [1],
        "sapphirium-maw", [5],
        "sapphirium-penance", [2],
        "sapphirium-milestone", [4],
        "sapphirium-ooze", [0, 1],
        "sapphirium-gaze", [5, 6],
        "sapphirium-epitaph", [0],
        "sapphirium-fatum", [1],

        "exogenesis-T-atlas", [1, 2],
        "exogenesis-T-nemesis", [0, 1],
        "exogenesis-T-prometheus", [0],
        "exogenesis-apotheosis", [12, 13],
        "exogenesis-assault", [0],
        "exogenesis-b03-kentaurus", [0],
        "exogenesis-b04-oort", [4],
        "exogenesis-b06-eros", [4],
        "exogenesis-b07-universalis", [6, 7, 8, 9],
        "exogenesis-balaenoptera", [6],
        "exogenesis-battle", [3, 4],
        "exogenesis-collapse", [1, 2],
        "exogenesis-eruption", [0],
        "exogenesis-lava", [0],
        "exogenesis-magnapinna", [0, 1],
        "exogenesis-nadir", [9],
        "exogenesis-orca", [4],
        "exogenesis-overgrowth-sentinel", [2, 3],
        "exogenesis-sagittarius", [16],
        "exogenesis-toxicity", [0],
        "exogenesis-war", [0],
        "exogenesis-xenoct", [4, 5],

        "ve-conscript", [0],
        "ve-capture", [0, 1],
        "ve-mist", [0, 1],
        "ve-haze", [2, 3, 4],
        "ve-hurricane", [2, 3],
        "ve-meteorology", [0],
        "ve-hovopid", [0, 1, 2],
        "ve-firelock", [0, 1],
        "ve-solar", [0, 1],
        "ve-thorium-rocketeer", [0],
        "ve-alev", [0],
        "ve-toxorpion", [0],
        "ve-sunrise", [0],
        "ve-soar", [0, 1],
        "ve-hover", [0, 1],
        "ve-thunder", [0],
        "ve-md", [2],

      ],


      off1: [

        "new-horizon-macrophage", [3],

        "asthosus-16p-05-expound", [4],

        "aquarion-reave", [1],

        "sapphirium-snowstorm", [2],
        "sapphirium-shriek", [0],
        "sapphirium-tornado", [0],
        "sapphirium-raptor", [2],
        "sapphirium-maw", [2],
        "sapphirium-ooze", [4],
        "sapphirium-gaze", [2],
        "sapphirium-fatum", [0],

        "exogenesis-T-atlas", [0],
        "exogenesis-apotheosis", [10],
        "exogenesis-b06-eros", [2, 3],
        "exogenesis-battle", [5],
        "exogenesis-collapse", [0],
        "exogenesis-magnapinna", [2, 3],
        "exogenesis-xenoct", [6, 7],

      ],


      off2: [

        "sapphirium-raptor", [0],

        "exogenesis-apotheosis", [11],

      ],



    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  map: {


    entity: {


      /* ----------------------------------------
       * NOTE:
       *
       * Maps type to a unit class and extra id if possible.
       * Make sure the id here is not used by vanilla game!
       * ---------------------------------------- */
      type: [

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

        "lovec-air", [UnitEntity, 80],
        "lovec-mech", [MechUnit, 81],

      ],


      /* ----------------------------------------
       * NOTE:
       *
       * Used to define new entity types.
       * Format: {id, obj}.
       * ---------------------------------------- */
      entityDef: [

        // lovec-air
        80, {
          solidity() {
            return global.lovec.frag_unit.comp_solidity_flying(this);
          },
          validMine(t, checkDst) {
            return global.lovec.frag_unit.comp_validMine_miner(this, t, checkDst);
          },
        },

        // lovec-mech
        81, {
          solidity() {
            return global.lovec.frag_unit.comp_solidity_flying(this);
          },
          validMine(t, checkDst) {
            return global.lovec.frag_unit.comp_validMine_miner(this, t, checkDst);
          },
        },

      ],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Faction for unit type. See {DB_block.db["map"]["faction"]}.
     * ---------------------------------------- */
    faction: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Used to add abilities to some unit types.
     * The ability setter function must be registered first!
     * See {TP_ability} where {nmAbi} and the function is added to {global.lovecUtil.db.abilitySetter}.
     * Format: {nmUtp, nmAbi, paramObj}.
     * ---------------------------------------- */
    ability: [],


    /* ----------------------------------------
     * NOTE:
     *
     * Used to add ai controllers to some unit types.
     * Similar to {"ability"}.
     * ---------------------------------------- */
    ai: [],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  group: {


    /* ----------------------------------------
     * NOTE:
     *
     * These units are related to core in some way.
     * ---------------------------------------- */
    coreUnit: [],


    /* ----------------------------------------
     * NOTE:
     *
     * These units are not robots, and they don't create remains upon death.
     * ---------------------------------------- */
    nonRobot: [

      "renale", "latum",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * These units are rare exceptions that don't create remains.
     * No need to add biotic units here.
     * ---------------------------------------- */
    noRemains: [

      "new-horizon-nucleoid",
      "new-horizon-guardian",

      "sfire-mod-knocker",

      "sapphirium-shielder",
      "sapphirium-jerk",
      "sapphirium-glaive",
      "sapphirium-absorption",
      "sapphirium-abyss-spawn",
      "sapphirium-diamond-drone",
      "sapphirium-ice-bomb",
      "sapphirium-fight",
      "sapphirium-second-chance",
      "sapphirium-curbing-phase1",
      "sapphirium-curbing-phase2",
      "sapphirium-obedience-phase1",
      "sapphirium-obedience-phase2",
      "sapphirium-subordination-phase1",
      "sapphirium-subordination-phase2",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * If a mod has customized unit debris, don't create extra remains.
     * ---------------------------------------- */
    noRemainsMod: [

      "aquarion",

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  grpParam: {


    /* ----------------------------------------
     * NOTE:
     *
     * Outline parameters used for units & turrets.
     * ---------------------------------------- */
    outline: [

      "loveclab", [2, "373a4d"],
      "projreind", [2, "373a4d"],

    ],


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  class: {


    btp: {


      /* ----------------------------------------
       * NOTE:
       *
       * These bullets can deal damage remotely.
       * ---------------------------------------- */
      remote: [

        ContinuousBulletType,
        LaserBulletType, ShrapnelBulletType,
        PointBulletType, RailBulletType, PointLaserBulletType, SapBulletType,
        InterceptorBulletType,

      ],


    },


  },


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


Object.mergeDB(db, "DB_unit");


exports.db = db;
