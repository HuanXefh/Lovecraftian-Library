const db = {


  "param": {


    "color": {


      /* ----------------------------------------
       * NOTE:
       *
       * Generic color parameter for the block.
       * ---------------------------------------- */
      "base": [],


    },


    "amount": {

      /* ----------------------------------------
       * NOTE:
       *
       * Generic amount parameter for the block.
       * ---------------------------------------- */
      "base": [],

    },


    "range": {


      /* ----------------------------------------
       * NOTE:
       *
       * Generic range parameter for the block.
       * ---------------------------------------- */
      "base": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Range of impact wave.
       * ---------------------------------------- */
      "impact": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Range of EP detection.
       * ---------------------------------------- */
      "ep": [],


    },


    "speed": {


      /* ----------------------------------------
       * NOTE:
       *
       * Generic speed parameter for the block.
       * ---------------------------------------- */
      "base": [],


    },


    "multiplier": {


      /* ----------------------------------------
       * NOTE:
       *
       * Multiplier on fuel consumption speed.
       * ---------------------------------------- */
      "fuelCons": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Multiplier on fuel level used.
       * ---------------------------------------- */
      "fuelLvl": [],


    },


    "time": {


      /* ----------------------------------------
       * NOTE:
       *
       * Generic time parameter for the block.
       * ---------------------------------------- */
      "base": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Time used for duration like status duration.
       * ---------------------------------------- */
      "dur": [],


    },


    "heal": {


      /* ----------------------------------------
       * NOTE:
       *
       * Generic heal amount.
       * ---------------------------------------- */
      "amount": [],


      /* ----------------------------------------
       * NOTE:
       *
       * Generic heal percent.
       * ---------------------------------------- */
      "percent": [],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Diameter of the fluid pipe, independent of block size.
     * ---------------------------------------- */
    "pipeDiam": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Maximum pressure allowed in the block.
     * If unset, group parameter will be used.
     * ---------------------------------------- */
    "presRes": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Maximum vacuum allowed in the block.
     * Note that vacuum is set in negative values.
     * If unset, group parameter will be used.
     * ---------------------------------------- */
    "vacRes": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Corrosion resistence for the block.
     * If unset, group parameter will be used.
     * ---------------------------------------- */
    "corRes": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Heat resistence for the block.
     * If unset, group parameter will be used.
     * ---------------------------------------- */
    "heatRes": [],


    /* ----------------------------------------
     * NOTE:
     *
     * How many pollution points the block generates.
     * ---------------------------------------- */
    "pol": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Pollution tolerance.
     * Some buildings may halt.
     * ---------------------------------------- */
    "polTol": [],


    /* ----------------------------------------
     * NOTE:
     *
     * @DYNAMIC: b => {...}
     * Core energy points provided/used by a block.
     * Core block provides 5 points by default.
     * ---------------------------------------- */
    "cep": {


      "prov": [],


      "use": [],


    },


  },


  "map": {


    /* ----------------------------------------
     * NOTE:
     *
     * The only faction a block belongs to.
     * Format: {nmBlk, faction}.
     * ---------------------------------------- */
    "faction": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Factory family map. Factories included in the same processes belong to the same family.
     * For instance, jaw crusher and hammer crusher can be classified as rock crusher.
     * A factory can be included in multiple families.
     * Format: {nmBlk, facFami}.
     * ---------------------------------------- */
    "facFami": [],


  },


  "group": {


    /* ----------------------------------------
     * NOTE:
     *
     * When building recipe dictionary, these blocks will be ignored to allow customized modification.
     * Useful cauz it's javascript, no new classes.
     * ---------------------------------------- */
    "noRcDict": {


      "cons": [],


      "prod": [],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * Material groups, used mainly for corrosion.
     * ---------------------------------------- */
    "material": {


      "wood": [],


      "copper": [],


      "lead": [],


      "iron": [],


      "steel": [],


      "galvanized": [],


      "stainless": [],


      "glass": [],


      "cement": [],


      "rubber": [],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * These drills cannot mine items from sand group.
     * ---------------------------------------- */
    "nonSandMiner": [],


    /* ----------------------------------------
     * NOTE:
     *
     * These blocks will trigger item reaction.
     * Only works for item blocks.
     * ---------------------------------------- */
    "exposed": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Theses blocks will get damaged if containing viscous fluids.
     * ---------------------------------------- */
    "cloggable": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Theses blocks can short-circuit if soaked in water.
     * ---------------------------------------- */
    "shortCircuit": [],


    /* ----------------------------------------
     * NOTE:
     *
     * Theses fluid pipes will short-circuit if powered somehow.
     * ---------------------------------------- */
    "shortCircuitPipe": [],


    /* ----------------------------------------
     * NOTE:
     *
     * These blocks won't get involved in reaction at all.
     * No need to put core blocks here.
     * ---------------------------------------- */
    "noReac": [],


    /* ----------------------------------------
     * NOTE:
     *
     * These blocks won't drop loot when destroyed.
     * ---------------------------------------- */
    "noLoot": [],


    /* ----------------------------------------
     * NOTE:
     *
     * These blocks won't create remains upon destruction.
     * No need for 1-block sized blocks and core blocks.
     * ---------------------------------------- */
    "noRemains": [],


    /* ----------------------------------------
     * NOTE:
     *
     * If a mod has customized building debris, don't create extra remains.
     * ---------------------------------------- */
    "noRemainsMod": [

      "aquarion",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * These blocks have reload bars (long time of reloading).
     * ---------------------------------------- */
    "showReload": [

      "mass-driver",
      "payload-mass-driver",
      "large-payload-mass-driver",
      "shockwave-tower",

      "lancer",
      "ripple",
      "foreshadow",
      "meltdown",
      "titan",
      "afflict",
      "scathe",

      "new-horizon-hive",
      "new-horizon-ancient-artillery",
      "new-horizon-prism",
      "new-horizon-interferon",
      "new-horizon-eternity",
      "new-horizon-atom-separator",
      "new-horizon-blood-star",
      "new-horizon-multiple-launcher",
      "new-horizon-rail-gun",
      "new-horizon-end-of-era",
      "new-horizon-thermo-turret",
      "new-horizon-pulse",
      "new-horizon-bombard",
      "new-horizon-electro",

      "sfire-mod-gaosi",
      "sfire-mod-liebao",
      "sfire-mod-longjuan",
      "sfire-mod-qingning",
      "sfire-mod-chongchao",
      "sfire-mod-relang",
      "sfire-mod-sizhao",
      "sfire-mod-liemei",
      "sfire-mod-kuosan",
      "sfire-mod-poxiao",
      "sfire-mod-fenqing",
      "sfire-mod-zhulin",
      "sfire-mod-luolong",
      "sfire-mod-defense-platform-nuke",
      "sfire-mod-defense-platform-plasma",

    ],


  },


  "grpParam": {


    /* ----------------------------------------
     * NOTE:
     *
     * Color used for faction-related texts.
     * ---------------------------------------- */
    "factionColor": [

      "none", "999999",

      "carbonic", "67798e",
      "emerald-tide", "748e6b",
      "enclosure", "d4c0d8",
      "hexagram-steel", "bfbfbf",
      "other-world", "d1cb9e",
      "outpost-military", "8ca9e8",
      "rim-builder", "acacd8",
      "zeta-chemistry", "806c94",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Base pressure resistence for each material group.
     * ---------------------------------------- */
    "presRes": [

      "wood", 1.0,
      "copper", 7.0,
      "lead", 7.0,
      "iron", 5.0,
      "steel", 12.0,
      "galvanized", 12.0,
      "stainless", 12.0,
      "glass", 10.0,
      "cement", 5.0,
      "rubber", 3.0,

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Base vacuum resistence for each material group.
     * ---------------------------------------- */
    "vacRes": [

      "wood", 0.0,
      "copper", -3.0,
      "lead", -3.0,
      "iron", -3.0,
      "steel", -7.0,
      "galvanized", -7.0,
      "stainless", -7.0,
      "glass", -10.0,
      "cement", -3.0,
      "rubber", -7.0,

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Base corrosion resistence for each material group.
     * ---------------------------------------- */
    "corRes": [

      "wood", 1.0,
      "copper", 1.5,
      "lead", 1.5,
      "iron", 1.5,
      "steel", 2.0,
      "galvanized", 4.0,
      "stainless", 6.5,
      "glass", 12.5,
      "cement", 3.0,
      "rubber", 8.5,

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Base heat resistence for each material group.
     * ---------------------------------------- */
    "heatRes": [

      "wood", 60.0,
      "copper", 800.0,
      "lead", 300.0,
      "iron", 1400.0,
      "steel", 1000.0,
      "galvanized", 1000.0,
      "stainless", 1000.0,
      "glass", 250.0,
      "cement", 300.0,
      "rubber", 120.0,

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Maps a wire material to texture region name.
     * ---------------------------------------- */
    "wireMatReg": [

      "copper", "lovec-ast-wire-copper",

    ],


  },


  "class": {


    "reload": {


      /* ----------------------------------------
       * NOTE:
       *
       * These blocks have reload in (0.0, 1.0).
       * ---------------------------------------- */
      "frac": [],


      /* ----------------------------------------
       * NOTE:
       *
       * These blocks have reversed reload calculation (decreasing).
       * ---------------------------------------- */
      "rev": [

        LaserTurret,

      ],


      /* ----------------------------------------
       * NOTE:
       *
       * Combination.
       * ---------------------------------------- */
      "revFrac": [

        MassDriver,

      ],


    },


    /* ----------------------------------------
     * NOTE:
     *
     * These blocks by default cannot hold auxiliay fluids.
     * ---------------------------------------- */
    "nonAux": [

      LiquidBlock,

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Used to read drill speed for display.
     * ---------------------------------------- */
    "drillSpd": [

      Drill, (blk, boosted) => Math.pow(blk.size, 2) / blk.drillTime * 60.0 * (boosted ? Math.pow(blk.liquidBoostIntensity, 2) : 1.0),
      BeamDrill, (blk, boosted) => blk.size / blk.drillTime * 60.0 * (boosted ? blk.optionalBoostIntensity : 1.0),

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Used to read generalized craft time for blocks.
     * This affects calculation of consumption/production rates.
     * ---------------------------------------- */
    "craftTime": [

      Drill, blk => blk.drillTime,
      BeamDrill, blk => blk.drillTime,
      WallCrafter, (blk, isDrillTime) => isDrillTime ? blk.drillTime : blk.boostItemUseTime,

      Pump, blk => blk.consumeTime,
      Fracker, blk => blk.itemUseTime,

      ConsumeGenerator, blk => blk.itemDuration,
      NuclearReactor, blk => blk.itemDuration,
      ImpactReactor, blk => blk.itemDuration,

      GenericCrafter, blk => blk.craftTime,

      Reconstructor, blk => blk.constructTime,

      MendProjector, blk => blk.useTime,
      RegenProjector, blk => blk.optionalUseTime,
      OverdriveProjector, blk => blk.useTime,
      ForceProjector, blk => blk.phaseUseTime,

      LandingPad, blk => blk.cooldownTime,

    ],


  },


};


Object.mergeDB(db, "DB_block");


exports.db = db;
