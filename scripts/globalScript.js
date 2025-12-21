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


  /* <---------- revision ----------> */


  LOVEC_REVISION = 2;


  /* ----------------------------------------
   * NOTE:
   *
   * Used for read & write.
   * ---------------------------------------- */
  processRevision = function(wr0rd) {
    if(wr0rd instanceof Writes) {
      wr0rd.s(LOVEC_REVISION);
      return LOVEC_REVISION;
    } else {
      return global.lovec.param.secret_revisionFix ? 0 : wr0rd.s();
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * For quick definition of {ex_processData}.
   * ---------------------------------------- */
  processData = function(wr0rd, lovecRevi, wrArrowFun, rdArrowFun) {
    wr0rd instanceof Writes ?
      wrArrowFun(wr0rd, lovecRevi) :
      rdArrowFun(wr0rd, lovecRevi);
  };


  /* <---------- rhino ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {obj} is a native object.
   * ---------------------------------------- */
  isNativeObject = function(obj) {
    return typeof obj === "object" && !(obj instanceof java.lang.Object);
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
   * Variant of {print} that prints the entire object.
   * ---------------------------------------- */
  printObj = function(obj) {
    Object.printObj(obj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Collection of some errors that may frequently occur.
   * Errors are registered in {TP_error}.
   * ---------------------------------------- */
  ERROR_HANDLER = {


    __ERR_MAP__: new ObjectMap(),


    add(nm, str) {
      ERROR_HANDLER.__ERR_MAP__.put(nm, str);
    },


    throw(nm) {
      let str = ERROR_HANDLER.__ERR_MAP__.get(nm);
      if(str == null) return;

      if(arguments.length === 1) {
        throw new Error(str);
      } else {
        throw new Error(str.format(Array.from(arguments).splice(1)));
      };
    },


  };


  /* <---------- modification ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used for function overloading (definition of one function with different sets of arguments).
   * Mostly for class or instance methods, as {obj} is required.
   * If {tps} is used the method also checks types.
   * ---------------------------------------- */
  addMethod = function(obj, nmFun, tps, fun) {
    let lastFun = obj[nmFun];

    obj[nmFun] = function() {
      if(fun.length === arguments.length && (tps == null ? true : checkArgType(arguments, tps))) {
        return fun.apply(this, arguments);
      } else if(typeof lastFun === "function") {
        return lastFun.apply(this, arguments);
      };
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: fun1, fun2, fun3, ...
   * @ARGS: tps1, fun1, tps2, fun2, tps3, fun3, ...
   * Used to define a function that behaves differently for varied argument length or types of arguments.
   * This is betrayal to the Lord of JavaScript, be careful.
   *
   * Example:
   * let fun = newMultiFunction(
   *   ["number"], num => print("number"),
   *   ["string"], str => print("string"),
   *   ["boolean"], bool => print("boolean"),
   *   [Array], arr => print("array"),
   *   ["number", "number"], (num1, num2) => print("number & number"),
   *   ["number", Array], (num, arr) => print("number & array"),
   * );
   *
   * fun(1.0)          // Prints "number"
   * fun("ohno")          // Prints "string"
   * fun(true)          // Prints "boolean"
   * fun([])          // Prints "array"
   * fun(0.0, 0.0)          // Prints "number & number"
   * fun(0.0, [])          // Prints "number & array"
   * ---------------------------------------- */
  newMultiFunction = function() {
    let fun = function() {
      return fun.__OVERLOADING_CONTAINER__[""].apply(this, arguments);
    };
    fun.__OVERLOADING_CONTAINER__ = {};

    let i = 0, iCap = arguments.length;
    if(arguments[0] instanceof Array && typeof arguments[1] === "function") {
      while(i < iCap) {
        addMethod(fun.__OVERLOADING_CONTAINER__, "", arguments[i], arguments[i + 1]);
        i += 2;
      };
    } else {
      while(i < iCap) {
        addMethod(fun.__OVERLOADING_CONTAINER__, "", null, arguments[i]);
        i++;
      };
    };

    return fun;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: fun1, fun2, fun3, ...
   * Used to defined a generator (as object).
   * {this} in the argument methods is always the generator, you can use it to define an infinite loop.
   *
   * Example:
   * let gen = newGenerator(
   *   function() {
   *     return 0;
   *   },
   *   function() {
   *     return 1;
   *   },
   *   function() {
   *     this.__STEP__ = 0;
   *     return 2;
   *   },
   * );
   *
   * let arr = [];
   * for(let i = 0; i < 10; i++) {
   *   arr.push(gen.next());
   * };
   * print(arr);                // Prints 0, 1, 2, 0, 1, 2, 0, 1, 2
   * ---------------------------------------- */
  newGenerator = function() {
    let genObj = {


      __STEP__: 0,
      __FUNS__: Array.from(arguments).filter(arg => typeof arg === "function"),


      next() {
        let obj = {};
        if(genObj.__STEP__ < genObj.__FUNS__.length) {
          obj.value = genObj.__FUNS__[genObj.__STEP__].apply(genObj, arguments);
        };
        obj.done = genObj.__STEP__ >= (genObj.__FUNS__.length - 1);
        genObj.__STEP__++;

        return obj;
      },


      return(val) {
        genObj.__STEP__ = Math.max(genObj.__STEP__, genObj.__FUNS__.length - 1);

        return {value: val, done: true};
      },


    };

    return genObj;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used for function class definition.
   * {initClass} is required to complete the class.
   * {init} on the prototype is required, or it throws an error when creating an instance.
   *
   * Example:
   * const CLS_myClass = newClass().extendClass(CLS_someClass).initClass();
   * CLS_myClass.prototype.init = function() {...};
   * ---------------------------------------- */
  newClass = function() {
    return function() {
      this.init != null ?
        this.init.apply(this, arguments) :
        ERROR_HANDLER.throw("noInitForClassPrototype");
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: obj1, obj2, obj3, ...
   * {Object.mergeObj}.
   * ---------------------------------------- */
  mergeObj = function() {
    return Object.mergeObj.apply(this, arguments);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: obj1, obj2, obj3, ...
   * {Object.mergeObjMixin}.
   * ---------------------------------------- */
  mergeObjMixin = function() {
    return Object.mergeObjMixin.apply(this, arguments);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a fixed property for {obj}.
   * ---------------------------------------- */
  setFinalProp = function(obj, nmProp, val) {
    Object.defineProperty(obj, nmProp, {value: val, writable: false, enumerable: true, configurable: false});
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a hidden property for {obj}.
   * ---------------------------------------- */
  setHiddenProp = function(obj, nmProp, val) {
    Object.defineProperty(obj, nmProp, {value: val, writable: true, enumerable: false, configurable: true});
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set weapons for some unit in JS.
   * Format for {getter}: {wpsOld => wpsNew}.
   * ---------------------------------------- */
  setWeapon = function(utp, getter) {
    Events.run(ContentInitEvent, () => {
      let wps = utp.weapons.toArray();
      try{
        utp.weapons = getter(wps).pullAll(null).flatten().toSeq();
      } catch(err) {
        Log.err("[LOVEC] Failed to set weapons for [$1]\n".format(utp.name.color(Pal.accent)) + err);
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set abilities of some unit in JS.
   * Format for {getter}: {abisOld => abisNew}.
   * ---------------------------------------- */
  setAbility = function(utp, getter) {
    Events.run(ClientLoadEvent, () => {
      let abis = utp.abilities.toArray();
      try{
        utp.abilities = getter(abis).pullAll(null).flatten().toSeq();
      } catch(err) {
        Log.err("[LOVEC] Failed to set abilities for [$1]:\n".format(utp.name.color(Pal.accent)) + err);
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set AI controller of some unit in JS.
   * Format for {getter}: {unit => ai}.
   * ---------------------------------------- */
  setAi = function(utp, getter) {
    Events.run(ClientLoadEvent, () => {
      try{
        utp.controller = func(getter);
      } catch(err) {
        Log.err("[LOVEC] Failed to set AI controller for [$1]:\n".format(utp.name.color(Pal.accent)) + err);
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set drawers of some block in JS.
   * Format for {getter}: {drawersOld => drawersNew}.
   * ---------------------------------------- */
  setDrawer = function(blk, getter) {
    Events.run(ClientLoadEvent, () => {
      if(blk.drawer == null) {
        Log.warn("[LOVEC] Can't find field [$1] in [$2]!".format("drawer".color(Pal.accent), blk.name.color(Pal.accent)));
        return;
      };

      let drawers = blk.drawer instanceof DrawMulti ? blk.drawer.drawers.slice() : [blk.drawer];
      try {
        blk.drawer = new DrawMulti(getter(drawers).pullAll(null).flatten().toSeq());
        if(!Vars.headless) blk.drawer.load(blk);
      } catch(err) {
        Log.err("[LOVEC] Failed to set drawers for [$1]:\n".format(blk.name.color(Pal.accent)) + err);
      };
    });
  };


  /* <---------- util ----------> */


  TMP_Z = 0;
  TMP_Z_A = 0;
  TMP_Z_B = 0;
  TMP_REG = new TextureRegion();
  TRIGGER_BACKGROUND = false;
  TRIGGER_MUSIC = false;


  /* ----------------------------------------
   * NOTE:
   *
   * For argument type check.
   * For JavaScript data types, use string instead (e.g. "number" for {Number}).
   * Definitely not TypeScript reference.
   * ---------------------------------------- */
  checkArgType = function(args, tps) {
    if(!(args instanceof Array)) args = Array.from(args);

    let i = 0, iCap = args.iCap();
    while(i < iCap) {
      if(tps[i] == null || args[i] == null) {
        // Do nothing
      } else if(typeof tps[i] !== "string") {
        if(!(args[i] instanceof tps[i])) return false;
      } else {
        if(typeof args[i] !== tps[i]) return false;
      };
      i++;
    };

    return true;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a version string to an array of integers.
   * This implies that the string should not contain letters.
   * ---------------------------------------- */
  verStrToInts = function(verStr) {
    const arr = [];

    let tmp = "", l, i, iCap;

    i = 0, iCap = verStr.length;
    while(i < iCap) {
      l = verStr[i];
      if(l === ".") {
        arr.push(String(tmp));
        tmp = "";
      } else {
        tmp += l;
      };
      i++;
    };
    arr.push(tmp);

    i = 0, iCap = arr.length;
    while(i < iCap) {
      arr[i] = parseInt(arr[i], 10);
      if(isNaN(arr[i])) {
        arr[i] = 0;
      };
      i++;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * 1. Whether {verStrCur} is newer or equal to {verStrReq}.
   * 2. Whether all version requirements defined in {minVerArr} are met.
   * ---------------------------------------- */
  checkVersion = newMultiFunction(
    ["string", "string"], function(verStrReq, verStrCur) {
      let
        ints1 = verStrToInts(verStrReq),
        ints2 = verStrToInts(verStrCur),
        i = 0,
        iCap = Math.max(ints1.length, ints2.length);

      while(i < iCap) {
        if(ints1[i] == null && ints2[i] != null) return true;
        if(ints1[i] > ints2[i]) return false;
        i++;
      };

      return true;
    },
    ["string", Array], function(nmMod, minVerArr) {
      let str = "[gray]Unmet dependency for [accent]" + nmMod + "[]!\n";
      let errored = false;

      let i = 0, iCap = minVerArr.length;
      let nmDepend, minVer, ver, mod;
      str += "\n----------------------------------------------------";
      while(i < iCap) {
        nmDepend = minVerArr[i];
        minVer = minVerArr[i + 1];
        ver = "!PENDING";
        mod = Vars.mods.locateMod(nmDepend);
        if(mod != null) {
          ver = String(mod.meta.version);
        };
        if(ver === "!PENDING" || !checkVersion(minVer, ver)) {
          errored = true;
          str += "\n" + nmDepend + "        " + minVer + "        " + (ver === "!PENDING" ? "!NOTFOUND" : "!OUTDATED");
        };
        i += 2;
      };
      str += "\n----------------------------------------------------";
      str += "\n[]";

      if(errored) {
        Events.run(ClientLoadEvent, () => Vars.ui.showErrorMessage(str));
      };

      return !errored;
    },
    // In case someone forgot version is a string
    ["number", "number"], function(num1, num2) {return checkVersion(String(num1), String(num2))},
    ["number", "string"], function(num, str) {return checkVersion(String(num), str)},
    ["string", "number"], function(str, num) {return checkVersion(str, String(num))},
  );


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
   * A variant of {tryVal} where default value is given by a {Prov}.
   * Used when {def} is very costy to get.
   * ---------------------------------------- */
  tryValProv = function(val, defProv) {
    if(!(defProv instanceof Prov)) ERROR_HANDLER.throw("notProv", defProv);

    return val == null ? defProv.get() : val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: fun, def, caller, arg1, arg2, arg3, ...
   * Tries to call a function, returns the default value if not found or not function.
   * Don't use {try} & {catch}, it's costy.
   * ---------------------------------------- */
  tryFun = function(fun, caller, def) {
    if(fun == null || typeof fun !== "function") return def;

    return arguments.length <= 3 ?
      fun.call(caller) :
      fun.apply(caller, Array.from(arguments).splice(3));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used when there's a field and another method bearing the same name.
   * {b.warmup} and {b.warmup()}, in Java it's fine, in JavaScript it's crash.
   * ---------------------------------------- */
  tryProp = function(prop0fun, caller) {
    if(prop0fun == null || typeof prop0fun !== "function") return prop0fun;

    return prop0fun.call(caller);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used when setting up a lot of properties.
   * Don't use arrow function here!
   * ---------------------------------------- */
  batchCall = function(thisVal, fun) {
    return fun.apply(thisVal, Array.from(arguments).splice(2));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {tryVal} but used for parameter objects.
   * ---------------------------------------- */
  readParam = function(paramObj, nmProp, def) {
    return (paramObj == null || paramObj[nmProp] == null) ? def : paramObj[nmProp];
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {readParam} but the value returned is immediately used if found.
   * ---------------------------------------- */
  readParamAndCall = function(paramObj, nmProp, scr, def) {
    let val = readParam(paramObj, nmProp);
    if(val !== undefined) {
      scr(val);
    } else if(def !== undefined) {
      scr(def);
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to get Java classes by path, e.g. "aquarion.AquaItems" from Aquarion.
   * Will return {null} if not found.
   * Do not include this in main loops!
   * ---------------------------------------- */
  fetchClass = function(nmCls, suppressWarning) {
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
      if(!suppressWarning) Log.warn("[LOVEC] Failed to fetch class:\n" + err);
    };

    return cls;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to read any 2-array of classes and functions.
   * ---------------------------------------- */
  readClassFunMap = function(arr, ins, def) {
    let fun = def;
    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      if(ins instanceof arr[i]) fun = arr[i + 1];
      i += 2;
    };

    return fun;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a mod by name, by default it should be a loaded one.
   * ---------------------------------------- */
  fetchMod = function(nmMod, ignoreEnabled) {
    return nmMod === "vanilla" ?
      null :
      ignoreEnabled ?
        Vars.mods.getMod(nmMod) :
        Vars.mods.locateMod(nmMod);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to load texture region.
   * ---------------------------------------- */
  fetchRegion = function(ct_gn, suffix, suffixFallback) {
    let nm = ct_gn instanceof Content ? ct_gn.name : ct_gn;
    if(suffix == null) suffix = "";
    if(suffixFallback == null) suffixFallback = "";

    return Vars.headless ?
      null :
      Core.atlas.find(nm + suffix, Core.atlas.find(nm + suffixFallback));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to load sound.
   * ---------------------------------------- */
  fetchSound = function(se_gn) {
    return se_gn instanceof Sound ?
      se_gn :
      typeof se_gn === "string" ?
        Vars.tree.loadSound(se_gn) :
        Sounds.none;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to load music.
   * ---------------------------------------- */
  fetchMusic = function(mus_gn) {
    return mus_gn instanceof Music ?
      mus_gn :
      typeof mus_gn === "string" ?
        Vars.tree.loadMusic(mus_gn) :
        Musics.none;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a weapon from registered weapon templates.
   * ---------------------------------------- */
  fetchWeapon = function(nm, paramObj) {
    let temp = global.lovecUtil.db.weaponTemplate.read(nm);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", nm);
    return temp.build(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a bullet type from registered bullet templates.
   * ---------------------------------------- */
  fetchBullet = function(nm, paramObj) {
    let temp = global.lovecUtil.db.bulletTemplate.read(nm);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", nm);
    return temp.build(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets an ability from registered ability getter functions.
   * ---------------------------------------- */
  fetchAbility = function(nm, paramObj) {
    return global.lovecUtil.db.abilitySetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets an AI from registered AI getter functions.
   * ---------------------------------------- */
  fetchAi = function(nm, paramObj) {
    return global.lovecUtil.db.aiSetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a drawer from registered drawer getter functions.
   * ---------------------------------------- */
  fetchDrawer = function(nm, paramObj) {
    return global.lovecUtil.db.drawerSetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a consumer from registered consumer getter functions.
   * ---------------------------------------- */
  fetchConsumer = function(nm, paramObj) {
    return global.lovecUtil.db.consumerSetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a dialog by name from registered ones.
   * ---------------------------------------- */
  fetchDialog = function(nm) {
    return global.lovecUtil.db.dialogGetter.read(nm, global.lovecUtil.db.dialogGetter.read("def"));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a dialog flow by name from registered ones.
   * ---------------------------------------- */
  fetchDialogFlow = function(nm) {
    return global.lovecUtil.db.dialFlow.read(nm, Array.air);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Love way of {extend} using content templates.
   * ---------------------------------------- */
  extendBase = function(temp, nmCt, obj) {
    return extend(temp.getParent(), nmCt, tryValProv(obj, prov(() => temp.build())));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {extend} used for blocks.
   * ---------------------------------------- */
  extendBlock = function(temp, nmBlk, objBlk, objB) {
    let blk = extend(temp[0].getParent(), nmBlk, tryValProv(objBlk, prov(() => temp[0].build())));
    blk.buildType = () => extend(temp[1].getParent(), blk, tryValProv(objB, prov(() => temp[1].build())));

    return blk;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {extend} used for unit types.
   * ---------------------------------------- */
  extendUnit = function(temp, nmUtp, objUtp) {
    let utp = extend(temp.getParent(), nmUtp, tryValProv(objUtp, prov(() => temp.build())));
    temp.initUnit(utp);
    global.lovecUtil.db.lovecUnits.push(utp);

    return utp;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {extend} used for planets.
   * ---------------------------------------- */
  extendPlanet = function(temp, nmPla, sectorSize, objPla) {
    let pla = extend(temp.getParent(), nmPla, null, 1.0, sectorSize, tryValProv(objPla, prov(() => temp.build())));
    temp.initPlanet(pla);

    return pla;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used for stat value, where JavaScript arrow functions won't work.
   * ---------------------------------------- */
  newStatValue = function(tableF) {
    return new StatValue() {
      display(tb) {
        tableF(tb);
      },
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a weapon template.
   * Format for {tempGetter}: {() => temp}.
   * ---------------------------------------- */
  newWeapon = function(nm, tempGetter) {
    if(global.lovecUtil.db.weaponTemplate.includes(nm)) return;
    global.lovecUtil.db.weaponTemplate.push(nm, tempGetter());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a bullet template.
   * Format for {tempGetter}: {() => temp}.
   * ---------------------------------------- */
  newBullet = function(nm, tempGetter) {
    if(global.lovecUtil.db.bulletTemplate.includes(nm)) return;
    global.lovecUtil.db.bulletTemplate.push(nm, tempGetter());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers an ability setter.
   * Format for {getter}: {paramObj => abi}.
   * ---------------------------------------- */
  newAbility = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.abilitySetter.includes(nm)) return;
      global.lovecUtil.db.abilitySetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers an AI controller setter.
   * Format for {getter}: {paramObj => ctrl}.
   * ---------------------------------------- */
  newAi = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.aiSetter.includes(nm)) return;
      global.lovecUtil.db.aiSetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a drawer.
   * Format for {getter}: {paramObj => drawer}.
   * ---------------------------------------- */
  newDrawer = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.drawerSetter.includes(nm)) return;
      global.lovecUtil.db.drawerSetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a consumer.
   * Format for {getter}: {paramObj => cons}.
   * ---------------------------------------- */
  newConsumer = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.consumerSetter.includes(nm)) return;
      global.lovecUtil.db.consumerSetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a dialog.
   * Format for {getter}: {() => dial}.
   * ---------------------------------------- */
  newDialog = function(nm, getter) {
    Events.run(ClientLoadEvent, () => {
      if(global.lovecUtil.db.dialogGetter.includes(nm)) return;
      global.lovecUtil.db.dialogGetter.push(nm, getter());
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a key binding.
   * Format for {scr}: {unit_pl => {...}}.
   * ---------------------------------------- */
  newKeyBind = function(nm, keyCodeDef, categ, scr) {
    Events.run(ClientLoadEvent, () => {
      Core.app.post(() => {
        global.lovec.varGen.addKeyBind(nm, keyCodeDef, categ);
        let keyBind = global.lovec.varGen.bindings[nm];
        if(global.lovecUtil.db.keyBindListener.includes(keyBind)) return;
        global.lovecUtil.db.keyBindListener.push(keyBind, scr);
      });
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a dialog flow.
   * ---------------------------------------- */
  newDialogFlow = function(nm, dialFlowArr) {
    Events.run(ContentInitEvent, () => {
      if(global.lovecUtil.db.dialFlow.includes(nm)) return;
      global.lovecUtil.db.dialFlow.push(nm, dialFlowArr);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to overwrite block flags.
   * ---------------------------------------- */
  resetBlockFlag = function(blk, flags) {
    blk.flags = EnumSet.of.apply(null, flags);
    if(blk.fogRadius > 0) blk.flags.with(BlockFlag.hasFogRadius);
    if(blk.sync) blk.flags.with(BlockFlag.synced);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used for draw methods.
   * ---------------------------------------- */
  processZ = function(z) {
    if(z == null) return;

    if(!processZ.isTail) {
      TMP_Z = Draw.z();
      Draw.z(z);
    } else {
      Draw.z(TMP_Z);
    };

    processZ.isTail = !processZ.isTail;
  };
  processZ.isTail = false;


  /* <---------- net ----------> */


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


  /* ----------------------------------------
   * NOTE:
   *
   * Parses an HTTP response as Json object.
   * ---------------------------------------- */
  parseResponse = function(res) {
    return JSON.parse(res.getResultAsString());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Writes an HTTP response into some file.
   * ---------------------------------------- */
  writeResponse = function(res, fi, shouldAppend) {
    if(shouldAppend == null) shouldAppend = false;
    fi.write(res.getResultAsSteam(), shouldAppend);

    return fi;
  };


  /* <---------- class ----------> */


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
