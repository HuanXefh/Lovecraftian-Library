/* ----------------------------------------
 * NOTE:
 *
 * globalScript.js is run BEFORE Lovec is loaded, and NOT in STRICT MODE. Don't explicitly {require} anything!
 * This is mostly intended for console and some generic methods.
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
   * You should use {(function() {...})()} and define them inside the function.
   * ----------------------------------------
   * IMPORTANT:
   *
   * Methods below should only be called after {RUN_methodExt} is called!
   * Well seems that I'm the only one possible to break it...
   * ---------------------------------------- */


  /* <---------- revision ----------> */


  LOVEC_REVISION = 0;


  /* ----------------------------------------
   * NOTE:
   *
   * Used for read & write.
   * ---------------------------------------- */
  processRevision = function(wr0rd) {
    const thisFun = processRevision;

    if(wr0rd instanceof Writes) {
      wr0rd.s(LOVEC_REVISION);
    } else {
      return wr0rd.s();
    };
  };


  /* <---------- debug ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {print} used for printing multiple arguments.
   *
   * These will print {1, 2, 1, 2}:
   * printAll(1, 2, 1, 2)
   * printAll([1, 2, 1, 2])
   * printAll(1, [2], [1, 2])
   * ---------------------------------------- */
  printAll = function() {
    print(Array.from(arguments).flatten());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {print} that prints all possible keys of the object.
   * ---------------------------------------- */
  printKeys = function(obj) {
    Object.printKeys(obj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Collection of some errors that may frequently occur.
   * ---------------------------------------- */
  (function() {
    ERROR_HANDLER = {};

    ERROR_HANDLER.debug = info => {throw new Error("[$1] sucks.").format(tryVal(info, "JavaScript").firstUpperCase())};

    ERROR_HANDLER.arrLenMismatch = (arr1, arr2) => {throw new Error("Array arguments are expected to have same length!\n[$1]\n[$2]".format(JSON.stringify(arr1), JSON.stringify(arr2)))};
    ERROR_HANDLER.notClass = () => {throw new Error("Parent class argument is not a function class!")};
    ERROR_HANDLER.noSuperClass = () => {throw new Error("Can't call super when there's no parent class!")};
    ERROR_HANDLER.noSuperMethod = nmFun => {throw new Error("Method [$1] is not defined in super class!".format(nmFun))};
    ERROR_HANDLER.abstractInstance = () => {throw new Error("Cannot create instances of an abstract class.")};
    ERROR_HANDLER.abstractSuper = () => {throw new Error("Calling super methods from an abstract class is not allowed.")};
    ERROR_HANDLER.notAnno = () => {throw new Error("Annotation argument is not an annotation!")};
    ERROR_HANDLER.notInterface = () => {throw new Error("Interface argument is not an interface!")};
    ERROR_HANDLER.duplicateInterface = () => {throw new Error("Don't implement the same interface twice!")};
    ERROR_HANDLER.interfaceMethodConflict = nmFun => {throw new Error("Can't implement interface on a class due to name conflict: " + nmFun)};
    ERROR_HANDLER.headerConfict = (header, tp) => {throw new Error("A header name [$1]conflicts with existing headers: ".format(tp == null ? "" : "(type: [$1]) ".format(tp)) + header)};

    ERROR_HANDLER.noCt = nm => {throw new Error("Content is not found for [$1]!".format(nm))};
    ERROR_HANDLER.noItm = blk => {throw new Error(blk.name + " has no item module!")};
    ERROR_HANDLER.noLiq = blk => {throw new Error(blk.name + " has no liquid module!")};
    ERROR_HANDLER.noMethod = (blk, nmFun) => {throw new Error("[$1] is not defined for [$2]!").format(nmFun, blk.name)};
    ERROR_HANDLER.evenCog = blk => {throw new Error("Size of a cogwheel ([$1]) cannot be even!").format(blk.name)};
    ERROR_HANDLER.plaMeshFail = (pla, tp) => {throw new Error("Failed to load mesh [$1]for [$2].").format(tp == null ? "" : "(type: [$1]) ".format(tp), pla.name)};
  })();


  /* <---------- modification ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a fixed property for {obj}.
   * ---------------------------------------- */
  setFinal = function(obj, nmProp, val) {
    Object.defineProperty(obj, nmProp, {value: val, writable: false});
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set drawers of some block in JS.
   * Format for {drawerGetter}: {drawers => newDrawers}.
   * ---------------------------------------- */
  setDrawer = function(blk, drawerGetter) {
    global.lovec.mdl_event._c_onInit(() => {
      if(blk.drawer == null) {
        Log.warn("[LOVEC] Can't find field [$1] in [$2]!".format("drawer".color(Pal.accent), blk.name.color(Pal.accent)));
        return;
      };
      let drawers = blk.drawer instanceof DrawMulti ? blk.drawer.drawers.slice() : [blk.drawer];
      try {
        blk.drawer = new DrawMulti(drawerGetter(drawers).flatten().toSeq());
      } catch(err) {
        Log.err("[LOVEC] Failed to set drawers for [$1]:\n".format(blk.name.color(Pal.accent)) + err);
        blk.drawer = new DrawMulti(drawers.toSeq());
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: obj1, obj2, obj3, ...
   * Simply merges a series of objects.
   * Properties defined later will overwrite the ones defined before.
   * Mostly used in CT files to further modify the template.
   *
   * This method is different from {Object.mergeObj} which is used for layered objects.
   * ---------------------------------------- */
  mergeObj = function() {
    let obj0 = {};
    for(let obj of arguments) {
      for(let key in obj) {
        obj0[key] = obj[key];
      };
    };

    return obj0;
  };


  /* <---------- util ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * If {val} is {null}, returns default value.
   * Don't use {return val | def}, you know, double equality.
   * ---------------------------------------- */
  tryVal = function(val, def) {
    return val == null ? def : val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: fun, def, caller, arg1, arg2, arg3, ...
   * Tries to call a function, returns the default value if not found or not function.
   * Don't use {try} & {catch}, it's costy.
   * ---------------------------------------- */
  tryFun = function(fun, def, caller) {
    if(fun == null || typeof fun !== "function") return def;

    return arguments.length <= 3 ?
      fun.call(caller) :
      fun.apply(caller, Array.from(arguments).splice(0, 3));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used when there's a field and another method bearing the same name.
   * {b.warmup} and {b.warmup()}, in java it's fine, in javascript it's crash.
   * ---------------------------------------- */
  tryProp = function(prop0fun, caller) {
    if(prop0fun == null || typeof prop0fun !== "function") return prop0fun;

    return prop0fun.call(caller);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to get Java classes by path, e.g. "aquarion.AquaItems" from Aquarion.
   * Will return {null} if not found.
   * Do not include this in main loops!
   * ---------------------------------------- */
  fetchClass = function(nmCls) {
    let cls;
    try {
      cls = Packages.rhino.NativeJavaClass(
        Vars.mods.scripts.scope,
        java.net.URLClassLoader(
          [Vars.mods.getMod("lovec").file.file().toURI().toURL()],
          Vars.mods.mainLoader(),
        ).loadClass(nmCls),
      );
    } catch(err) {
      cls = null;
      Log.warn("[LOVEC] Failed to fetch class:\n" + err);
    };

    return cls;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used for stat value, where JavaScript arrow functions won't work.
   * ---------------------------------------- */
  newStatValue = function(tableF) {
    return {
      display(tb) {
        tableF(tb);
      },
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts an array into Json string for packets.
   * The array should only contain primitive values.
   * ---------------------------------------- */
  packPayload = function(arr) {
    return JSON.stringify(Object.arrToObj(arr));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a Json string back into an array of primitive values.
   * ---------------------------------------- */
  unpackPayload = function(payload) {
    return Object.objToArr(JSON.parse(payload));
  };


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


    /* <---------- debug ----------> */


    /* ----------------------------------------
     * NOTE:
     *
     * Prints liquid info for building at (tx, ty).
     * ---------------------------------------- */
    printLiq = function(tx, ty) {
      lovec.mdl_test._i_liq(tx, ty);
    };


    /* ----------------------------------------
     * NOTE:
     *
     * Used to test some draw function in game quickly.
     * ---------------------------------------- */
    drawTest = {
      enabled: false, safe: false,
      xGetter: Function.airZero, yGetter: Function.airZero, radGetter: Function.airZero, colorGetter: Function.airWhite,
      drawF: Function.air,
      reset() {
        drawTest.enabled = false;
        drawTest.safe = false;
        drawTest.xGetter = Function.airZero;
        drawTest.yGetter = Function.airZero;
        drawTest.radGetter = Function.airZero;
        drawTest.colorGetter = Function.airWhite;
        drawTest.drawF = Function.air;
      },
      toggle(bool) {
        if(bool == null) {
          drawTest.enabled = !drawTest.enabled;
        } else {
          drawTest.enabled = Boolean(bool);
        };
      },
      setGetter(xGetter, yGetter, radGetter, colorGetter) {
        drawTest.safe = false;
        if(xGetter != null && typeof xGetter === "function") drawTest.xGetter = xGetter;
        if(yGetter != null && typeof yGetter === "function") drawTest.yGetter = yGetter;
        if(radGetter != null && typeof radGetter === "function") drawTest.radGetter = radGetter;
        if(colorGetter != null && typeof colorGetter === "function") drawTest.colorGetter = colorGetter;
      },
      setGetter_playerPos(radGetter, colorGetter) {
        drawTest.setGetter(
          () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().x,
          () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().y,
          radGetter,
          colorGetter,
        );
      },
      setDrawF(drawF) {
        if(drawF == null || typeof drawF !== "function") return;
        drawTest.safe = false;
        drawTest.drawF = drawF;
      },
      draw() {
        if(drawTest.safe) {
          drawTest.drawF(drawTest.xGetter(), drawTest.yGetter(), drawTest.radGetter(), drawTest.colorGetter());
        } else {
          try {
            drawTest.drawF(drawTest.xGetter(), drawTest.yGetter(), drawTest.radGetter(), drawTest.colorGetter());
          } catch(err) {
            drawTest.reset();
            Log.err("[LOVEC] Failed to implement the draw function: \n" + err);
            return;
          };
          drawTest.safe = true;
        };
      },
    };


    /* <---------- cheat ----------> */


    /* ----------------------------------------
     * NOTE:
     *
     * I won't ban these for single player, you decide how to play.
     * ---------------------------------------- */


    /* ----------------------------------------
     * NOTE:
     *
     * Kills your unit or someone's instead.
     * ---------------------------------------- */
    kill = function(nm) {
      if(Vars.net.client()) return;
      let unit = lovec.mdl_pos._unit_plNm(nm);
      if(unit == null) return;

      Call.unitDestroy(unit.id);
    };


    /* ----------------------------------------
     * NOTE:
     *
     * Literally toggles invincibility.
     * ---------------------------------------- */
    toggleInvincible = function() {
      if(Vars.net.client()) return;
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
     * Changes your team.
     * ---------------------------------------- */
    changeTeam = function(nmTeam) {
      if(Vars.net.client()) return;
      // Just in case
      if(nmTeam instanceof Team) {
        Vars.player.team(nmTeam);
        return;
      };

      let team;
      switch(nmTeam) {
        case "yellow" :
          team = Team.sharded;
          break;
        case "red" :
          team = Team.crux;
          break;
        case "purple" :
          team = Team.malis;
          break;
        default :
          try {
            team = Team[nmTeam]
          } catch(err) {
            team = null;
          };
      };
      if(team == null) return;

      Vars.player.team(team);
    };


    /* ----------------------------------------
     * NOTE:
     *
     * Spawns some unit at your unit.
     * Internal units are banned, which may lead to crash.
     * ---------------------------------------- */
    spawnUnit = function(nmUtp) {
      if(Vars.net.client()) return;
      if(typeof nmUtp !== "string" || nmUtp.equalsAny(spawnUnit.blacklist)) return;
      let unit = Vars.player.unit();
      if(unit == null) return;
      let utp = lovec.mdl_content._ct(nmUtp, "utp");
      if(utp == null || utp.internal) return;

      lovec.mdl_call.spawnUnit(unit.x, unit.y, utp, unit.team);
    }
    .setProp({
      blacklist: [],
    });


  }));
