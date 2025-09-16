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
   * Returns {val} if not {null}, or returns {def} instead.
   * Don't use {val = val | def}, you know, double equality.
   * ---------------------------------------- */
  Object.val = function(val, def) {
    return val == null ? def : val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the last child object that is not {undefined} when searching with given keys.
   * If {def} is given, returns it instead if not found.
   * ---------------------------------------- */
  Object.dir = function(obj, keys, def) {
    let tg = obj;
    let tmp = null;

    let i = 0;
    let iCap = keys.iCap();
    while(i < iCap) {
      tmp = tg[keys[i]];
      if(tmp != null) {
        tg = tmp;
      } else if(def !== undefined) {
        return def;
      } else break;
      i++;
    };

    return tg;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through an object, if you're that lazy.
   * {_it_xxx} means interation, I assume that you have seen it in {MDL_pos}.
   * ---------------------------------------- */
  Object._it = function(obj, scr) {
    for(let key in obj) {
      scr(key, obj[key]);
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: obj, isWritable, nmProp1, val1, nmProp2, val2, nmProp3, val3, ...
   * Sets a lot of properties for {obj}.
   * ---------------------------------------- */
  Object.prop = function(obj, isWritable) {
    let iCap = arguments.length;
    if(iCap <= 2) return obj;
    if(isWritable == null) isWritable = false;

    for(let i = 2; i < iCap; i += 2) {
      Object.defineProperty(obj, arguments[i], {value: arguments[i + 1], writable: isWritable});
    };

    return obj;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {obj} has {key}.
   * ---------------------------------------- */
  Object.hasKey = function(obj, key) {
    return obj[key] !== undefined;
  };


  /* <---------- function ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Tries to call a function if it exists, or returns the default value if not defined.
   * Usually {caller} is required for correct output, you can put more arguments after {caller}.
   * Stop using {try} & {catch} it's too costy.
   * ---------------------------------------- */
  Function.tryFun = function(fun, def, caller) {
    if(fun == null || typeof fun !== "function") {
      return def;
    } else {
      if(arguments.length <= 3) {
        return fun.call(caller);
      } else {
         return fun.apply(caller, Array.from(arguments).splice(0, 3));
      };
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used when there's a field and another method bearing the same name.
   * There's barely any need to use more arguments, so only {call} is used.
   *
   * {b.warmup} and {b.warmup()}, in java it's fine, in javascript it's crash.
   * ---------------------------------------- */
  Function.tryProp = function(prop0fun, caller) {
    if(prop0fun == null || typeof "prop0fun" !== "function") {
      return prop0fun;
    } else {
      return prop0fun.call(caller);
    };
  };


  /* <---------- number ----------> */


  var ptp =  Number.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Interation using this number as cap.
   * ---------------------------------------- */
  ptp._it = function(gap, scr) {
    if(gap == null) gap = 1;

    gap = Math.round(gap);
    if(gap < 1) return;
    let iCap = Math.round(this);
    if(iCap < 1) return;

    let i = 0;
    while(i < iCap) {
      scr(i);
      i += gap;
    };
  };


  /* <---------- string ----------> */


  var ptp = String.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Capacity for iteration.
   * ---------------------------------------- */
  ptp.iCap = function() {
    return this.length;
  };


  /* <---------- array ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through each pair in {arr1} and {arr2}.
   * ---------------------------------------- */
  Array.forEachPair = function(arr1, arr2, scr) {
    let i = 0;
    let iCap = arr1.iCap();
    let j = 0;
    let jCap = arr2.iCap();
    while(i < iCap) {
      while(j < jCap) {
        scr(arr1[i], arr2[j]);
        j++;
      };
      i++;
    };
  };


  var ptp = Array.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Capacity for iteration.
   * ---------------------------------------- */
  ptp.iCap = function() {
    return this.length;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Faster {forEach}, or not, I hope so.
   * Use this instead of {forEach} so you won't accidentally call it on something like a seq, which crash the game on Android.
   * ---------------------------------------- */
  ptp.forEachFast = function(scr) {
    let iCap = this.iCap();
    if(iCap === 0) return;
    for(let i = 0; i < iCap; i++) {
      scr(this[i]);
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {forEach} with a condition check.
   * ---------------------------------------- */
  ptp.forEachCond = function(boolF, scr) {
    if(boolF == null) boolF = Function.airTrue;

    let iCap = this.iCap();
    if(iCap === 0) return;
    for(let i = 0; i < iCap; i++) {
      if(boolF(this[i])) scr(this[i]);
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through a formatted array.
   * ---------------------------------------- */
  ptp.forEachRow = function(ord, scr) {
    if(ord == null) ord = 1;

    let iCap = this.iCap();
    if(iCap === 0) return;
    let tmpArr = [];
    for(let i = 0, j = 0; i < iCap; i += ord) {
      tmpArr.clear();
      while(j < ord) {
        tmpArr.push(this[i + j]);
        j++;
      };
      j = 0;
      scr.apply(null, tmpArr);
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Empties the array.
   * ---------------------------------------- */
  ptp.clear = function() {
    this.length = 0;

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Sets array length and fills it with {val}.
   * ---------------------------------------- */
  ptp.setVal = function(val, len) {
    if(len == null) len = this.length;

    this.clear();
    let i = 0;
    while(i < len) {
      this[i] = val;
      i++;
    };

    return this;
  };
