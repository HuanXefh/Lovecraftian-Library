/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  // NOTE: Keep these at top!
  const RUN_methodExt = require("lovec/run/RUN_methodExt");
  const CLS_annotation = require("lovec/cls/struct/CLS_annotation");
  const RUN_methodPostExt = require("lovec/run/RUN_methodPostExt");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const PARAM = require("lovec/glb/GLB_param");
  const SAVE = require("lovec/glb/GLB_save");


  const RUN_event = require("lovec/run/RUN_event");
  const RUN_input = require("lovec/run/RUN_input");
  const RUN_memMonitor = require("lovec/run/RUN_memMonitor");
  const RUN_rule = require("lovec/run/RUN_rule");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_util = require("lovec/mdl/MDL_util");


  const DB_env = require("lovec/db/DB_env");
  const DB_status = require("lovec/db/DB_status");


  const TP_dial = require("lovec/tp/TP_dial");
  const TP_stat = require("lovec/tp/TP_stat");
  const TP_table = require("lovec/tp/TP_table");


  // NOTE: Keep this at bottom!
  const RUN_global = require("lovec/run/RUN_global");


  /* <---------- load ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_util.setMod_localization("lovec");


  MDL_event._c_onLoad(() => {


    // Set name colors
    if(!Vars.headless && MDL_util._cfg("load-colored-name")) {
      Core.app.post(() => {
        let fetchColor = rs => {
          let tmp = (rs.color.r + rs.color.g + rs.color.b) / 3.0;
          return tmp < 0.1 ?
            Tmp.c1.set(Color.white) :
            Tmp.c1.set(rs.color).mul(tmp < 0.45 ? VAR.ct_colorMtpHigh : VAR.ct_colorMtp);
        };
        Vars.content.items().each(itm => {
          itm.localizedName = String(itm.localizedName).color(fetchColor(itm));
        });
        Vars.content.liquids().each(liq => {
          liq.localizedName = String(liq.localizedName).color(fetchColor(liq));
        });
        let factions = VARGEN.factions;
        for(let faction in factions) {
          factions[faction].forEach(ct => {
            ct.localizedName = String(ct.localizedName).color(Tmp.c1.set(MDL_content._factionColor(faction)));
          });
        };
      });
    };


    // Set recipe dictionary stat
    Vars.content.items().each(itm => {
      itm.stats.add(TP_stat.spec_fromTo, extend(StatValue, {display(tb) {
        tb.row();
        MDL_table.__btnSmallBase(tb, "?", () => TP_dial.rcDict.ex_show(itm.localizedName, itm)).left().padLeft(28.0).row();
      }}));
    });
    Vars.content.liquids().each(liq => {
      liq.stats.add(TP_stat.spec_fromTo, extend(StatValue, {display(tb) {
        tb.row();
        MDL_table.__btnSmallBase(tb, "?", () => TP_dial.rcDict.ex_show(liq.localizedName, liq)).left().padLeft(28.0).row();
      }}));
    });


    // Set node root names
    if(!Vars.headless) {
      TechTree.roots.each(rt => {
        let nmCt = DB_env.db["nodeRootNameMap"].read(rt.name);
        if(nmCt != null) {
          let ct = MDL_content._ct(nmCt, null, true);
          if(ct != null) rt.name = ct.localizedName;
        };
      });
    };


    // Set robot only status
    DB_status.db["group"]["robotOnly"].map(nmSta => MDL_content._ct(nmSta, "sta", true)).forEach(sta => {
      if(sta != null) {
        sta.stats.add(TP_stat.sta_robotOnly, true);
        VARGEN.bioticUtps.forEach(utp => utp.immunities.add(sta));
      };
    });


    // Set oceanic status
    DB_status.db["group"]["oceanic"].map(nmSta => MDL_content._ct(nmSta, "sta", true)).forEach(sta => {
      if(sta != null) {
        VARGEN.navalUtps.forEach(utp => utp.immunities.add(sta));
      };
    });


    // Set missile immunities
    DB_status.db["group"]["missileImmune"].map(nmSta => MDL_content._ct(nmSta, "sta", true)).concat(VARGEN.deathStas).forEach(sta => {
      if(sta != null) {
        VARGEN.missileUtps.forEach(utp => utp.immunities.add(sta))
      };
    });


    // Set faction and factory family
    Vars.content.blocks().each(blk => {
      if(MDL_content._faction(blk) !== "none") blk.stats.add(TP_stat.spec_faction, extend(StatValue, {display(tb) {
        tb.row();
        MDL_table.setDisplay_faction(tb, blk);
      }}));
    });
    Vars.content.units().each(utp => {
      if(MDL_content._faction(utp) !== "none") utp.stats.add(TP_stat.spec_faction, extend(StatValue, {display(tb) {
        tb.row();
        MDL_table.setDisplay_faction(tb, utp);
      }}));
    });


    // Set settings
    // NOTE: I don't think there's need to create a module for this. Just check {MDL_util._cfg}.
    Vars.ui.settings.addCategory(MDL_bundle._term("lovec", "settings"), tb => {

      if(PARAM.debug) {
        tb.checkPref("lovec-test-draw", false);
        tb.checkPref("lovec-test-todo", false);
        tb.checkPref("lovec-test-memory", false);
      };

      tb.checkPref("lovec-load-colored-name", true);
      tb.checkPref("lovec-load-force-modded", false);

      tb.sliderPref("lovec-interval-efficiency", 5, 1, 15, val => Strings.fixed(val * 0.1, 2) + "s");

      tb.checkPref("lovec-draw-wobble", false);
      tb.checkPref("lovec-draw0loot-static", true);
      tb.checkPref("lovec-draw0loot-amount", true);
      tb.sliderPref("lovec-draw0tree-alpha", 10, 0, 10, val => Strings.fixed(val * 10.0, 0) + "%");
      tb.checkPref("lovec-draw0tree-player", true);
      tb.checkPref("lovec-draw0aux-extra-info", true);
      tb.checkPref("lovec-draw0aux-bridge", true);
      tb.checkPref("lovec-draw0aux-router", true);
      tb.checkPref("lovec-draw0aux-fluid-heat", true);

      tb.checkPref("lovec-icontag-show", true);
      tb.sliderPref("lovec-icontag-interval", 4, 1, 12, val => Strings.fixed(val * 0.33333333, 2) + "s");

      tb.checkPref("lovec-damagedisplay-show", true);
      tb.sliderPref("lovec-damagedisplay-min", 0, 0, 50, val => Strings.fixed(val * 20.0, 0));
      tb.checkPref("lovec-unit0stat-show", true);
      tb.checkPref("lovec-unit0stat-player", true);
      tb.checkPref("lovec-unit0stat-reload", true);
      tb.checkPref("lovec-unit0stat-missile", false);
      tb.checkPref("lovec-unit0stat-build", true);
      tb.checkPref("lovec-unit0stat-mouse", true);
      tb.sliderPref("lovec-unit0remains-lifetime", 12, 0, 60, val => Strings.fixed(val * 5.0, 0) + "s");

      tb.areaTextPref("lovec-misc-secret-code", "");

    });


    if(!PARAM.modded && MDL_util._loadedMod("projreind") != null) {
      throw new Error("PARAM.modded is broken again, WTF D:");
    };


  }, 12563333);
