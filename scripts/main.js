/*
  ========================================
  Section: Definition
  ========================================
*/


  // Loads global scripts before everything
  (function() {
    let findGlbScr = mod => {
      let dir = mod.root.child("scripts");
      if(!dir.exists()) return null;
      let fiSeq = dir.findAll(fi => fi.name() === "globalScript.js");
      return fiSeq.size === 0 ? null : fiSeq.get(0);
    };
    let runGlbScr = mod => {
      let fi = findGlbScr(mod);
      if(fi == null) return;
      try {
        Vars.mods.scripts.context.evaluateString(Vars.mods.scripts.scope, fi.readString(), fi.name(), 0);
      } catch(err) {
        Log.err("[LOVEC] Error loading global script for " + mod.meta.name + ":\n" + err);
      };
    };

    // Lovec globalScript.js should always get loaded first
    runGlbScr(Vars.mods.locateMod("lovec"));
    Vars.mods.eachEnabled(mod => {
      if(mod.meta.name === "lovec") return;
      runGlbScr(mod);
    });
  })();


  /* <---------- import ----------> */


  // NOTE: Keep these at top!
  const RUN_methodExt = require("lovec/run/RUN_methodExt");
  const CLS_annotation = require("lovec/cls/struct/CLS_annotation");
  const RUN_methodPostExt = require("lovec/run/RUN_methodPostExt");
  const RUN_globalInternal = require("lovec/run/RUN_globalInternal");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const PARAM = require("lovec/glb/GLB_param");
  const SAVE = require("lovec/glb/GLB_save");


  const RUN_event = require("lovec/run/RUN_event");
  const RUN_input = require("lovec/run/RUN_input");
  const RUN_memMonitor = require("lovec/run/RUN_memMonitor");
  const RUN_render = require("lovec/run/RUN_render");
  const RUN_rule = require("lovec/run/RUN_rule");


  const CLS_dragButton = require("lovec/cls/ui/CLS_dragButton");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_file = require("lovec/mdl/MDL_file");
  const MDL_json = require("lovec/mdl/MDL_json");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_util = require("lovec/mdl/MDL_util");


  const TP_ability = require("lovec/tp/TP_ability");
  const TP_dial = require("lovec/tp/TP_dial");
  const TP_stat = require("lovec/tp/TP_stat");


  const DB_env = require("lovec/db/DB_env");
  const DB_misc = require("lovec/db/DB_misc");
  const DB_status = require("lovec/db/DB_status");
  const DB_unit = require("lovec/db/DB_unit");


  // NOTE: Keep this at bottom!
  const RUN_global = require("lovec/run/RUN_global");


  /* <---------- load ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_util.localizeModMeta("lovec");


  MDL_event._c_onInit(() => {


    // Set up ore dictionary
    if(PARAM.modded && MDL_util._cfg("load-ore-dict")) (function() {
      Log.info("[LOVEC] " + "Ore dictionary".color(Pal.accent) + " is enabled.");
      if(!MDL_util._cfg("load-ore-dict-def")) Log.info("[LOVEC] Skipped default lists for ore dictionary.");

      let dir = MDL_file.sharedData.child("ore-dict").child("default");
      let verCur = MDL_util._loadedMod("lovec").meta.version;
      let oreDict = global.lovecUtil.db.oreDict;
      // Create default files
      if(!dir.exists() || dir.list().length === 0 || (function() {
        let fi = dir.child("meta.json");
        if(!fi.exists()) return true;
        let jsonVal = MDL_json.parse(fi);

        return MDL_json.fetch(jsonVal, "version") !== verCur;
      })()) {
        DB_misc.db["recipe"]["oreDictDef"].forEachRow(2, (nmRs, arr) => {
          let fi = dir.child(nmRs + ".csv");
          MDL_file.__csv(fi, arr, 1);
        });
        MDL_json.write(dir.child("meta.json"), {
          version: verCur,
        });
        MDL_file.__txt(dir.child("README.txt"), "Do not put files here, which may get overwritten!\nCustomized lists should be in ./saves/mods/data/sharedData/ore-dict!");
      };

      let fiSeq = dir.parent().findAll(fi => fi.extension() === "csv" && (MDL_util._cfg("load-ore-dict-def") ? true : fi.parent() !== dir));
      fiSeq.each(fi => {
        let ct = Vars.content.byName(fi.nameWithoutExtension());
        if(ct == null) return;
        let arr = MDL_file._csv(fi);
        arr.forEachFast(nmRs => {
          let rs = Vars.content.byName(nmRs);
          if(rs == null) return;
          oreDict.put(rs, ct);
        });
      });

      Vars.content.items().each(itm => {
        let itmRedir = oreDict.get(itm);
        if(itmRedir == null) return;
        itm.stats.add(TP_stat.spec_oreDict, newStatValue(tb => {
          tb.row();
          MDL_table.setDisplay_ctRow(tb, itmRedir);
        }));
        itmRedir.shownPlanets.addAll(itm.shownPlanets);
        itmRedir.databaseTabs.addAll(itm.databaseTabs);
      });
      Vars.content.liquids().each(liq => {
        let liqRedir = oreDict.get(liq);
        if(liqRedir == null) return;
        liq.stats.add(TP_stat.spec_oreDict, newStatValue(tb => {
          tb.row();
          MDL_table.setDisplay_ctRow(tb, liqRedir);
        }));
        liqRedir.shownPlanets.addAll(liq.shownPlanets);
        liqRedir.databaseTabs.addAll(liq.databaseTabs);
      });

      Vars.content.blocks().each(blk => {
        blk.requirements.forEachFast(itmStack => {
          itmStack.item = oreDict.get(itmStack.item, itmStack.item);
        });
        Vars.content.planets().each(pla => pla.accessible && pla.isLandable(), pla => {
          // No {every} here, or too many blocks hidden
          if(blk.requirements.some(itmStack => itmStack.item.isOnPlanet(pla))) blk.shownPlanets.add(pla);
        });
        blk.databaseTabs.addAll(blk.shownPlanets);

        if(blk.itemDrop != null) blk.itemDrop = oreDict.get(blk.itemDrop, blk.itemDrop);
        if(blk.liquidDrop != null) blk.liquidDrop = oreDict.get(blk.liquidDrop, blk.liquidDrop);

        blk.consumers.forEachFast(cons => {
          let arr = DB_misc.db["recipe"]["oreDictConsSetter"];
          let dictCaller = null;
          let i = 0;
          let iCap = arr.iCap();
          while(i < iCap) {
            let cls = arr[i];
            if(cons instanceof cls) {
              dictCaller = arr[i + 1];
            };
            i += 2;
          };
          if(dictCaller != null) {
            dictCaller(blk, cons, oreDict);
            cons.apply(blk);
          };
        });

        (function() {
          let arr = DB_misc.db["recipe"]["oreDictProdSetter"];
          let dictCaller = null;
          let i = 0;
          let iCap = arr.iCap();
          while(i < iCap) {
            let cls = arr[i];
            if(blk instanceof cls) {
              dictCaller = arr[i + 1];
            };
            i += 2;
          };
          if(dictCaller != null) dictCaller(blk, oreDict);
        })();
      });
    })();


  }, 42110360);


  MDL_event._c_onLoad(() => {


    // Something
    if(PARAM.modded && !MDL_util._cfg("load-vanilla-flyer")) {
      Reflect.set(MenuRenderer, Reflect.get(Vars.ui.menufrag, "renderer"), "flyerType", Vars.content.unit(DB_misc.db["mod"]["menuFlyer"].readRand()));
    };


    // Load extra sounds
    DB_misc.db["mod"]["extraSound"].forEachFast(seStr => Vars.tree.loadSound(seStr));
    Time.run(3.0, () => {
      if(PARAM.secret_fireInTheHole) {
        let pitchBase;
        let fireInTheHole = wp => {
          wp.shootSound = Vars.tree.loadSound("se-meme-fith");
          pitchBase = Mathf.lerp(1.8, 0.5, Interp.pow2Out.apply(Mathf.clamp(wp.reload / 100.0)));
          wp.soundPitchMin = pitchBase - 0.1;
          wp.soundPitchMax = pitchBase + 0.1;
        };
        Vars.content.units().each(utp => utp.weapons.each(wp => !wp.noAttack, wp => fireInTheHole(wp)));
        Vars.content.blocks().each(blk => blk instanceof Turret, blk => fireInTheHole(blk));
      };
    });


    // Set up name colors
    if(!Vars.headless && MDL_util._cfg("load-colored-name")) {
      Core.app.post(() => {
        let fetchColor = rs => {
          let tmp = (rs.color.r + rs.color.g + rs.color.b) / 3.0;
          return tmp < 0.1 ?
            Tmp.c1.set(Color.white) :
            Tmp.c1.set(rs.color).mul(tmp < 0.45 ? VAR.ct_colorMtpHigh : VAR.ct_colorMtp);
        };

        VARGEN.rss.forEachFast(rs => rs.localizedName = rs.localizedName.color(fetchColor(rs)));
        Object._it(VARGEN.factions, (faction, cts) => cts.forEachFast(ct => ct.localizedName = ct.localizedName.color(MDL_content._factionColor(faction))));
      });
    };


    // Set up recipe dictionary stat
    VARGEN.rss.forEachFast(rs => {
      rs.stats.add(TP_stat.spec_fromTo, newStatValue(tb => {
        tb.row();
        MDL_table.__btnSmallBase(tb, "?", () => TP_dial.rcDict.ex_show(rs.localizedName, rs)).left().padLeft(28.0).row();
      }));
    });


    // Set up node root names
    if(!Vars.headless) {
      TechTree.roots.each(rt => {
        let nmCt = DB_env.db["nodeRootNameMap"].read(rt.name);
        if(nmCt != null) {
          let ct = MDL_content._ct(nmCt, null, true);
          if(ct != null) rt.name = ct.localizedName;
        };
      });
    };


    // Set up status effects
    (function() {
      // Robot-only status
      DB_status.db["group"]["robotOnly"].map(nmSta => MDL_content._ct(nmSta, "sta", true)).forEachCond(sta => sta != null, sta => {
        sta.stats.add(TP_stat.sta_robotOnly, true);
        VARGEN.bioticUtps.forEachFast(utp => utp.immunities.add(sta));
      });
      // Oceanic status
      DB_status.db["group"]["oceanic"].map(nmSta => MDL_content._ct(nmSta, "sta", true)).forEachCond(sta => sta != null, sta => {
        VARGEN.navalUtps.forEachFast(utp => utp.immunities.add(sta));
      });
      // Missile immunities
      DB_status.db["group"]["missileImmune"].map(nmSta => MDL_content._ct(nmSta, "sta", true)).concat(VARGEN.deathStas).forEachCond(sta => sta != null, sta => {
        VARGEN.missileUtps.forEachFast(utp => utp.immunities.add(sta));
      });
    })();


    // Set up faction
    (function() {
      let setFaction = ct => {
        if(MDL_content._faction(ct) !== "none") ct.stats.add(TP_stat.spec_faction, newStatValue(tb => {
          tb.row();
          MDL_table.setDisplay_faction(tb, ct);
        }));
      };
      Vars.content.blocks().each(blk => setFaction(blk));
      Vars.content.units().each(utp => setFaction(utp));
    })();


    // Set up abilities/ai controllers
    DB_unit.db["map"]["ability"].forEachRow(3, (nmUtp, nmAbi, args) => {
      let utp = MDL_content._ct(nmUtp, "utp");
      if(utp == null) return;
      let abiSetter = global.lovecUtil.db.abilitySetter.read(nmAbi);
      if(abiSetter == null) return;

      utp.abilities.add(abiSetter.apply(null, args));
    });
    DB_unit.db["map"]["ai"].forEachRow(3, (nmUtp, nmAi, args) => {
      let utp = MDL_content._ct(nmUtp, "utp");
      if(utp == null) return;
      let aiSetter = global.lovecUtil.db.aiSetter.read(nmAi);
      if(aiSetter == null) return;

      utp.controller = aiSetter.apply(null, args);
    });


    // Set up planet rules
    DB_env.db["map"]["rule"]["campaignRule"].forEachRow(2, (nmPla, ruleSetter) => {
      let pla = MDL_content._ct(nmPla, "pla");
      if(pla == null) return;
      let campaignRules = new CampaignRules();
      ruleSetter(campaignRules);
      pla.campaignRules = campaignRules;
    });
    DB_env.db["map"]["rule"]["planetRule"].forEachRow(2, (nmPla, ruleSetter) => {
      let pla = MDL_content._ct(nmPla, "pla");
      if(pla == null) return;
      pla.ruleSetter = cons(ruleSetter);
    });


    // Set up settings
    (function() {
      Core.settings.put("lovec-window-show", true);

      let settings = Vars.ui.settings;

      // Debug settings
      if(PARAM.debug) settings.addCategory(MDL_bundle._term("lovec", "settings-debug"), tb => {
        tb.checkPref("lovec-test-draw", false);
        tb.checkPref("lovec-test-todo", false);
        tb.checkPref("lovec-test-memory", false);
        tb.checkPref("lovec-test0error-shader", false);

        tb.checkPref("lovec-load-ore-dict", false);
        tb.checkPref("lovec-load-ore-dict-def", true);
      });
      // Visual settings
      settings.addCategory(MDL_bundle._term("lovec", "settings-visual"), tb => {
        tb.checkPref("lovec-load-colored-name", true);

        tb.checkPref("lovec-draw-wobble", false);
        tb.checkPref("lovec-draw0loot-static", true);
        tb.checkPref("lovec-draw0loot-amount", true);
        tb.sliderPref("lovec-draw0tree-alpha", 10, 0, 10, val => Strings.fixed(val * 10.0, 0) + "%");
        tb.checkPref("lovec-draw0tree-player", true);
        tb.checkPref("lovec-draw0aux-bridge", true);
        tb.checkPref("lovec-draw0aux-router", true);
        tb.checkPref("lovec-draw0aux-fluid-heat", true);
      });
      // Misc settings
      settings.addCategory(MDL_bundle._term("lovec", "settings-misc"), tb => {
        tb.checkPref("lovec-load-vanilla-flyer", false);
        tb.checkPref("lovec-load-force-modded", false);

        tb.sliderPref("lovec-interval-efficiency", 5, 1, 15, val => Strings.fixed(val * 0.1, 2) + "s");

        tb.checkPref("lovec-draw0aux-extra-info", true);

        tb.checkPref("lovec-icontag-flicker", true);
        tb.sliderPref("lovec-icontag-interval", 4, 1, 12, val => Strings.fixed(val * 0.33333333, 2) + "s");

        tb.checkPref("lovec-damagedisplay-show", true);
        tb.sliderPref("lovec-damagedisplay-min", 0, 0, 50, val => Strings.fixed(val * 20.0, 0));

        tb.checkPref("lovec-unit0stat-show", true);
        tb.checkPref("lovec-unit0stat-range", true);
        tb.checkPref("lovec-unit0stat-player", true);
        tb.checkPref("lovec-unit0stat-reload", true);
        tb.checkPref("lovec-unit0stat-missile", false);
        tb.checkPref("lovec-unit0stat-build", true);
        tb.checkPref("lovec-unit0stat-mouse", true);
        tb.checkPref("lovec-unit0stat-minimalistic", false);
        tb.sliderPref("lovec-unit0remains-lifetime", 36, 0, 120, val => Strings.fixed(val * 5.0, 0) + "s");
        tb.checkPref("lovec-unit0remains-building", true);

        tb.areaTextPref("lovec-misc-secret-code", "");
      });
    })();


    new CLS_dragButton().add();


    if(!PARAM.modded && MDL_util._loadedMod("projreind") != null) {
      throw new Error("PARAM.modded is broken again, WTF D:");
    };


    // In case that I forget to remove the outdated zip file
    if(MDL_file._root("lovec").parent().parent() == null) {
      Log.info("[LOVEC] Lovec is loaded from a " + "zip file".color(Pal.remove) + ".");
    };


  }, 12563333);
