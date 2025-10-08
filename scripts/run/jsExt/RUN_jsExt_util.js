/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /* <---------- object ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Converts array to object.
   * This also works on function arguments.
   * ---------------------------------------- */
  Object.arrToObj = function(arr) {
    const obj = {};

    let i = 0;
    let iCap = arr.iCap();
    while(i < iCap) {
      obj[i] = arr[i];
      i++;
    };

    return obj;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts object to array (loses all keys).
   * ---------------------------------------- */
  Object.objToArr = function(obj) {
    const arr = [];

    let i = 0;
    for(let key in obj) {
      arr[i] = obj[key];
      i++;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts object to 2-array.
   * ---------------------------------------- */
  Object.objTo2Arr = function(obj) {
    const arr = [];
    if(obj == null) return arr;

    let i = 0;
    for(let key in obj) {
      arr[i] = key;
      arr[i + 1] = obj[key];
      i += 2;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Merges two objects.
   * Only objects and arrays should be present in the object.
   *
   * I have no idea how to simply this.
   * ---------------------------------------- */
  Object.mergeObj = function(obj0, obj) {
    const thisFun = Object.mergeObj;

    Object._it(obj0, (key1, val1) => {
      // Depth: 0
      val1 instanceof Array ?
        thisFun.funScr(key1, obj, val1) :
        Object._it(obj0[key1], (key2, val2) => {
          // Depth: 1
          val2 instanceof Array ?
            thisFun.funScr(key2, Object.dir(obj, [key1], Object.air), val2) :
            Object._it(obj0[key1][key2], (key3, val3) => {
              // Depth: 2
              val3 instanceof Array ?
                thisFun.funScr(key3, Object.dir(obj, [key1, key2], Object.air), val3) :
                Log.warn("[LOVEC] Cannot fully merge an object due to " + "too many layers".color(Pal.remove) + ".");
            });
        });
    });

  }
  .setProp({
    "funScr": (key, objTg, arrTg) => {
      let tmp = objTg[key];
      if(tmp == null || !(tmp instanceof Array)) return;

      arrTg.pushAll(tmp);
    },
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Merges all found DB files with the same name, in "scripts/db".
   * Cross-mod.
   * ---------------------------------------- */
  Object.mergeDB = function(dbObj, nmFi, nmModCur) {
    if(nmModCur == null) nmModCur = "lovec";

    let i = 0;
    Vars.mods.eachEnabled(mod => {
      if(mod.name === nmModCur) return;

      let path = mod.name + "/db/" + nmFi;
      let dbMdl;
      try {
        dbMdl = require(path);
      } catch(err) {
        dbMdl = null;
      };

      if(dbMdl != null) {
        Object.mergeObj(dbObj, dbMdl.db);
        i++;
      };
    });

    Log.info("[LOVEC] Merged " + i + " DB file(s) for " + nmFi + " in " + nmModCur.color(Pal.accent) + ".");
  };


  /* <---------- number ----------> */


  var ptp = Number.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a tile coordination to world coordination.
   * ---------------------------------------- */
  ptp.toFCoord = function(size) {
    return this * Vars.tilesize + (Object.val(size, 1) % 2 === 0 ? 4.0 : 0.0);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a world coordination to tile coordination.
   * ---------------------------------------- */
  ptp.toIntCoord = function() {
    return Math.round(this / Vars.tilesize);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a rectangular range parameter to full width of the rectangle.
   * ---------------------------------------- */
  ptp.toRectW = function(size) {
    return (this * 2.0 + size) * Vars.tilesize;
  };


  /* <---------- array ----------> */


  var ptp = Array.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {obj} is an instance of at least one class from this array.
   * Used only for class arrays.
   * ---------------------------------------- */
  ptp.hasIns = function(obj) {
    return this.some(cls => obj instanceof cls);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts array to Json payload.
   * The array should only contain primitive values!
   * ---------------------------------------- */
  Array.toPayload = function(arr) {
    return JSON.stringify(Object.arrToObj(arr));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts Json payload back to array.
   * ---------------------------------------- */
  Array.fromPayload = function(payload) {
    return Object.objToArr(JSON.parse(payload));
  };


  /* <---------- math ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a unique integer, used for id.
   * If the provided range is too small, however, duplicates may occur.
   * ---------------------------------------- */
  Math.intUnique = function(base, cap, arrGetter) {
    let base_fi = Math.round(base);
    let cap_fi = Math.round(cap);

    let num = null;
    let i = 0;
    while(num == null || (arrGetter().includes(num) && i < 1000)) {
      num = cap_fi.randInt(base_fi);
      i++;
    };

    return num;
  };
