/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Utility global methods.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- internal ----------> */


  TRIGGER_BACKGROUND = false;
  TRIGGER_MUSIC = false;


  /* <---------- version check ----------> */


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


  /* <---------- format array ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Checks if the given name has been registered, and throw an error if it does.
   * ---------------------------------------- */
  registerUniqueName = function(nm, nms, tag) {
    if(nm == null || nms.includes(nm)) ERROR_HANDLER.throw("notUniqueName", nm, tryVal(tag, "unknown"));
    nms.push(nm);

    return nm;
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


  /* <---------- error ----------> */


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


  /* <---------- game ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used to control some in-game HUD related things.
   * ---------------------------------------- */
  HUD_HANDLER = {


    placeFrag: {


      /* ----------------------------------------
       * NOTE:
       *
       * Used for blocks that can have different placement HUD layouts for buildings, e.g. multi-crafters.
       * ---------------------------------------- */
      forceUpdate() {
        Reflect.set(PlacementFragment, Vars.ui.hudfrag.blockfrag, "lastDisplayState", null);
      },


    },


  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set position-related config for buildings.
   * ---------------------------------------- */
  POS_CONFIG_HANDLER = {


    isReady: false,
    __INT_QUEUE__: [],
    __PON2_QUEUE__: [],
    __VEC2_QUEUE__: [],


    init() {
      Events.run(ClientLoadEvent, () => {
        Core.app.post(() => {
          global.lovec.mdl_event._c_onTileTap(t => POS_CONFIG_HANDLER.trigger(t), 12050505);
        });
      });
    },


    add(b, posType) {
      switch(posType) {
        case "int":
          POS_CONFIG_HANDLER.__INT_QUEUE__.push(b);
          break;
        case "pon2":
          POS_CONFIG_HANDLER.__PON2_QUEUE__.push(b);
          break;
        case "vec2":
          POS_CONFIG_HANDLER.__VEC2_QUEUE__.push(b);
          break;
        default :
          throw new Error("Unknown position type: " + posType);
      };
      POS_CONFIG_HANDLER.isReady = true;
    },


    remove(b) {
      POS_CONFIG_HANDLER.__INT_QUEUE__.pull(b);
      POS_CONFIG_HANDLER.__PON2_QUEUE__.pull(b);
      POS_CONFIG_HANDLER.__VEC2_QUEUE__.pull(b);
      POS_CONFIG_HANDLER.isReady = POS_CONFIG_HANDLER.__INT_QUEUE__.length > 0 && POS_CONFIG_HANDLER.__PON2_QUEUE__.length > 0 && POS_CONFIG_HANDLER.__VEC2_QUEUE__.length > 0;
    },


    clear() {
      POS_CONFIG_HANDLER.__INT_QUEUE__.clear();
      POS_CONFIG_HANDLER.__PON2_QUEUE__.clear();
      POS_CONFIG_HANDLER.__VEC2_QUEUE__.clear();
      POS_CONFIG_HANDLER.isReady = false;
    },


    trigger(t) {
      if(!POS_CONFIG_HANDLER.isReady) return;

      POS_CONFIG_HANDLER.__INT_QUEUE__.forEachFast(b => b.configure(t.pos()));
      POS_CONFIG_HANDLER.__PON2_QUEUE__.forEachFast(b => b.configure(Tmp.p1.set(t.x, t.y)));
      POS_CONFIG_HANDLER.__VEC2_QUEUE__.forEachFast(b => b.configure(Tmp.v1.set(t.worldx(), t.worldy())));
      POS_CONFIG_HANDLER.clear();
    },


  };
  POS_CONFIG_HANDLER.init();
