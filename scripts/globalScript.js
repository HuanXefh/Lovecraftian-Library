/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * globalScript.js is run BEFORE Lovec is loaded, and NOT in STRICT MODE. Don't explicitly {require} anything!
   * This is mostly intended for console and some generic methods.
   * For your own mod, simply create another globalScript.js in your "scripts" folder, it will be automatically loaded.
   * Beware of naming conflict!
   * ---------------------------------------- */


/*
  ========================================
  Section: Pre-load
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods defined here can be used anywhere, like {extend} and {prov}.
   * You can define more global methods likewise in your own globalScript.js.
   * Better use a prefix for compatibility.
   *
   * If you need temporary variables here, don't define them directly with something like {let a = 0.0}.
   * Any variables defined here are in the global scope, and will make its way to the console.
   * You should use {(function() {...})()} and define them inside the immediate function call.
   * ----------------------------------------
   * IMPORTANT:
   *
   * {RUN_methodExt} is not run yet, call native methods only!
   * Well seems that I'm the only one possible to screw it...
   * ---------------------------------------- */


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Requires a JS file (as Arc Fi instance), which will be run under global scope.
   * ---------------------------------------- */
  globalRequire = function(nmMod, fiGetter) {
    let fi = fiGetter(Vars.mods.locateMod(nmMod).file);
    if(fi == null || !fi.exists() || fi.extension() !== "js") throw new Error("Failed to require a script in global script for " + nmMod + "!");

    Vars.mods.scripts.context.evaluateString(Vars.mods.scripts.scope, fi.readString(), fi.name(), 0);
  };


  /* <---------- load ----------> */


  globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child("RUN_glbScr_base.js"));
  globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child("RUN_glbScr_data.js"));
  globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child("RUN_glbScr_draw.js"));
  globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child("RUN_glbScr_content.js"));
  globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child("RUN_glbScr_extend.js"));
  globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child("RUN_glbScr_net.js"));
  globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child("RUN_glbScr_util.js"));


  /* <---------- class map ----------> */


  SDL = fetchClass("arc.backend.sdl.jni.SDL");


/*
  ========================================
  Section: Client Load
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods defined here are only intended for console.
   * DO NOT use these in regular coding!
   * ---------------------------------------- */


  Events.run(ClientLoadEvent, () => Core.app.post(() => {


    lovec = global.lovec;
    lovecUtil = global.lovecUtil;


    /* <---------- debug ----------> */


    /* ----------------------------------------
     * NOTE:
     *
     * Prints liquid info for building at (tx, ty).
     * ---------------------------------------- */
    _cmd_printLiq = function(tx, ty) {
      lovec.mdl_test._i_liq(tx, ty);
    };


    /* ----------------------------------------
     * NOTE:
     *
     * Used to test some draw function in game quickly.
     * ---------------------------------------- */
    DRAW_TEST = {
      enabled: false, safe: false,
      xGetter: Function.airZero, yGetter: Function.airZero, radGetter: Function.airZero, colorGetter: Function.airWhite,
      drawF: Function.air,
      reset() {
        DRAW_TEST.enabled = false;
        DRAW_TEST.safe = false;
        DRAW_TEST.xGetter = Function.airZero;
        DRAW_TEST.yGetter = Function.airZero;
        DRAW_TEST.radGetter = Function.airZero;
        DRAW_TEST.colorGetter = Function.airWhite;
        DRAW_TEST.drawF = Function.air;
      },
      toggle(bool) {
        if(bool == null) {
          DRAW_TEST.enabled = !DRAW_TEST.enabled;
        } else {
          DRAW_TEST.enabled = Boolean(bool);
        };
      },
      setGetter(xGetter, yGetter, radGetter, colorGetter) {
        DRAW_TEST.safe = false;
        if(xGetter != null && typeof xGetter === "function") DRAW_TEST.xGetter = xGetter;
        if(yGetter != null && typeof yGetter === "function") DRAW_TEST.yGetter = yGetter;
        if(radGetter != null && typeof radGetter === "function") DRAW_TEST.radGetter = radGetter;
        if(colorGetter != null && typeof colorGetter === "function") DRAW_TEST.colorGetter = colorGetter;
      },
      setGetter_playerPos(radGetter, colorGetter) {
        DRAW_TEST.setGetter(
          () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().x,
          () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().y,
          radGetter,
          colorGetter,
        );
      },
      setDrawF(drawF) {
        if(drawF == null || typeof drawF !== "function") return;
        DRAW_TEST.safe = false;
        DRAW_TEST.drawF = drawF;
      },
      draw() {
        if(DRAW_TEST.safe) {
          DRAW_TEST.drawF(DRAW_TEST.xGetter(), DRAW_TEST.yGetter(), DRAW_TEST.radGetter(), DRAW_TEST.colorGetter());
        } else {
          // Try only once to save memory used
          try {
            DRAW_TEST.drawF(DRAW_TEST.xGetter(), DRAW_TEST.yGetter(), DRAW_TEST.radGetter(), DRAW_TEST.colorGetter());
          } catch(err) {
            DRAW_TEST.reset();
            Log.err("[LOVEC] Failed to implement the draw function: \n" + err);
            return;
          };
          DRAW_TEST.safe = true;
        };
      },
    };


    /* <---------- cheat ----------> */


    /* ----------------------------------------
     * NOTE:
     *
     * Whether cheat is allowed now.
     * I won't ban these for single player, you decide how to play.
     * ---------------------------------------- */
    checkCheatState = function() {
      return Groups.player.size() === 1 && !Vars.net.client();
    };


    /* ----------------------------------------
     * NOTE:
     *
     * Kills your unit or someone's instead.
     * ---------------------------------------- */
    _cmd_kill = function(nm) {
      if(!checkCheatState()) return;
      let unit = lovec.mdl_pos._unit_plNm(nm);
      if(unit == null) {
        Log.info("[LOVEC] No player found with name [$1].".format(nm));
        return;
      };

      Call.unitDestroy(unit.id);
    };


    /* ----------------------------------------
     * NOTE:
     *
     * Literally toggles invincibility.
     * ---------------------------------------- */
    _cmd_toggleInvincible = function() {
      if(!checkCheatState()) return;
      let unit = Vars.player.unit();
      if(unit == null) return;

      unit.hasEffect(StatusEffects.invincible) ?
        unit.unapply(StatusEffects.invincible) :
        unit.apply(StatusEffects.invincible, Number.fMax);
      Time.run(2.0, () => {
        Log.info("[LOVEC] Player invincibility: " + (unit.hasEffect(StatusEffects.invincible) ? "ON" : "OFF").color(Pal.accent));
      });
    };


    /* ----------------------------------------
     * NOTE:
     *
     * Toggles invincibility of cores.
     * ---------------------------------------- */
    _cmd_toggleCoreInvincible = function thisFun() {
      thisFun.isOn = !thisFun.isOn;
      Time.run(2.0, () => {
        Log.info("[LOVEC] Core invincibility: " + (thisFun.isOn ? "ON" : "OFF").color(Pal.accent));
      });
    }
    .setProp({
      isOn: (function() {
        Events.run(Trigger.update, () => {
          if(_cmd_toggleCoreInvincible.isOn) Vars.player.team().data().cores.each(ob => ob.iframes = Math.max(ob.iframes, 60.0));
        });
        return false;
      })(),
    });


    /* ----------------------------------------
     * NOTE:
     *
     * Changes your team.
     * ---------------------------------------- */
    _cmd_changeTeam = function(team) {
      if(!checkCheatState()) return;
      if(typeof team === "string") {
        try {
          team = Team[team];
        } catch(err) {
          team = null;
        };
      };
      if(!(team instanceof Team)) return;

      Vars.player.team(team);
    };


    /* ----------------------------------------
     * NOTE:
     *
     * Spawns some unit at your unit.
     * Internal units are banned, which may lead to crash.
     * ---------------------------------------- */
    _cmd_spawnUnit = function(utp_gn) {
      if(!checkCheatState()) return;
      let unit = Vars.player.unit();
      if(unit == null) return;
      if(typeof utp_gn === "string" && utp_gn.equalsAny(_cmd_spawnUnit.blacklist)) return;
      let utp = lovec.mdl_content._ct(utp_gn, "utp");

      lovec.mdl_call.spawnUnit(unit.x, unit.y, utp, unit.team);
    }
    .setProp({
      blacklist: [],
    });


  }));
