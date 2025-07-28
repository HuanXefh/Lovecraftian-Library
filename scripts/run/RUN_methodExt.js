/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Method extension to native javascript classes.
   * I don't think a conflict will happen since most guys won't dig deeper in js.
   * ---------------------------------------- */


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


  Object.air = {};


  Object.val = function(val, def) {
    return val == null ? def : val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts array to object.
   * This also works on function arguments.
   * ---------------------------------------- */
  Object.fromArr = function(arr) {
    const obj = {};
    if(arr == null) return obj;

    let i = 0;
    let iCap = arr.length;
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
  Object.toArr = function(obj) {
    const arr = [];
    if(obj == null) return arr;

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
  Object.toArrFormatted = function(obj) {
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
   * ---------------------------------------- */
  Object.mergeObj = function(obj0, obj) {
    let tmp = null;

    for(let key1 in obj0) {

      if(obj0[key1] instanceof Array) {

        try {tmp = obj[key1]} catch(err) {tmp = null};
        if(tmp != null) obj0[key1].pushAll(tmp);

      } else {

        for(let key2 in obj0[key1]) {

          if(obj0[key1][key2] instanceof Array) {

            try {tmp = obj[key1][key2]} catch(err) {tmp = null};
            if(tmp != null) obj0[key1][key2].pushAll(tmp);

          } else {

            for(let key3 in obj0[key1][key2]) {

              if(obj0[key1][key2][key3] instanceof Array) {

                try {tmp = obj[key1][key2][key3]} catch(err) {tmp = null};
                if(tmp != null) obj0[key1][key2][key3].pushAll(tmp);

              } else {

                // Too deep
                Log.warn("[LOVEC] Cannot fully merge an object due to too many layers.");

              };

            };

          };

        };

      };

    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Merges all found DB files with the same name, in "scripts/db".
   * Cross-mod.
   * ---------------------------------------- */
  Object.mergeDB = function(dbObj, nmFi, nmModCur) {
    if(nmModCur == null) nmModCur = "lovec";

    Vars.mods.eachEnabled(mod => {
      if(mod.name !== nmModCur) {
        let dbFi = null;
        var path = mod.name + "/db/" + nmFi;
        try {dbFi = require(path)} catch(err) {dbFi = null};
        if(dbFi != null) {
          Object.mergeObj(dbObj, dbFi.db);
        };
      };
    });
  };


  // NOTE: Don't modify the prototype of {Object}, which will break everything!


  /* <---------- function ----------> */


  Function.air = function() {};
  Function.airZero = function() {return 0.0};
  Function.airOne = function() {return 1.0};
  Function.airOneMinus = function() {return -1.0};
  Function.airInfinity = function() {return Infinity};
  Function.airNull = function() {return null};
  Function.airFalse = function() {return false};
  Function.airTrue = function() {return true};
  Function.airArr = function() {return Array.air};
  Function.airObj = function() {return Object.air};


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a function that tries to call {fun}.
   * If {fun} is undefined, the function returns {def} instead.
   * Usually {call} or {apply} is needed after {funTry} to assign {this}.
   * Stop using {try} it's costy.
   * ---------------------------------------- */
  Function.funTry = function(fun, def) {
    if(def == null) def = null;

    return (fun == null || typeof fun !== "function") ? function() {return def} : fun;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {b.warmup} and {b.warmup()}, in java it's fine, in javascript it's crash.
   * {Function.propTry(b.warmup).call(b)}.
   * ---------------------------------------- */
  Function.propTry = function(prop0fun) {
    return (prop0fun == null || typeof fun !== "function") ? function() {return prop0fun} : prop0fun;
  };


  var ptp = Function.prototype;


  /* modification */


  /* ----------------------------------------
   * NOTE:
   *
   * Assigns some properties to the function.
   * ---------------------------------------- */
  ptp.setProp = function(obj) {
    for(let key in obj) {
      this[key] = obj[key];
    };

    return this;
  };


  /* class */


  ptp.getSuper = Function.airNull;
  ptp.isClass = Function.airFalse;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up generic methods for function class and its instances.
   * This is required for a class to function properly.
   *
   * New methods added:
   * fun.isClass();    // Whether the function is a class function.
   * ins.getClass();    // Returns class of the instance.
   * ins.setProp(obj);    // Lets an instance copy properties of an object.
   * ---------------------------------------- */
  ptp.initClass = function() {
    let cls = this;
    let ins = this.prototype;

    if(cls.getSuper() == null) cls.getSuper = () => Function;
    cls.isClass = () => true;
    ins.getClass = () => cls;
    ins.setProp = obj => {
      for(let key in obj) {
        ins[key] = obj[key];
      };
    };

    return cls;
  },


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a function class extends another function class.
   * Should be called before {init}.
   * WTF why do I even need reinvent this.
   *
   * New methods added:
   * cls.getSuper();    // Returns the super class, {null} if not class, {Function} if no super class found.
   * cls.super(nmFun, ...args);    // Calls a static method from the super class.
   * ins.super(nmFun, ...args);    // Calls a instance method from the super class.
   * ---------------------------------------- */
  ptp.extendClass = function(cls) {
    if(cls == null || !cls.isClass()) return this;

    Object.assign(this, cls);
    this.getSuper = () => cls;
    this.super = function(nmFun) {
      let funParent = this.getSuper()[nmFun];
      if(funParent != null) return funParent.apply(this, Array.from(arguments).splice(1));
    };
    this.prototype = Object.create(cls.prototype);
    this.prototype.constructor = this;
    this.prototype.super = function(nmFun) {
      let clsParent = this.getClass().getSuper();
      let funParent = clsParent.prototype[nmFun];
      if(funParent != null) return funParent.apply(new clsParent(), Array.from(arguments).splice(1));
    };

    return this;
  };


  /* <---------- number ----------> */


  Number.intMax = java.lang.Integer.MAX_VALUE;
  Number.intMin = java.lang.Integer.MIN_VALUE;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns P(cap, amt).
   * ---------------------------------------- */
  Number.permutation = function(cap, amt) {
    let cap_fi = Number(cap);
    let amt_fi = Number(amt);

    return cap_fi.fac() / (cap_fi - amt_fi).fac();
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns C(cap, amt).
   * ---------------------------------------- */
  Number.combination = function(cap, amt) {
    let cap_fi = Number(cap);
    let amt_fi = Number(amt);

    return cap_fi.fac() / ((cap_fi - amt_fi).fac() * amt_fi.fac());
  };


  var ptp = Number.prototype;


  /* meta */


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript number to java integer.
   * ---------------------------------------- */
  ptp.toInt = function() {
    return new java.lang.Integer(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript number to java byte.
   * ---------------------------------------- */
  ptp.toByte = function() {
    return new java.lang.Byte(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript number to java short.
   * ---------------------------------------- */
  ptp.toShort = function() {
    return new java.lang.Short(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript number to java long.
   * ---------------------------------------- */
  ptp.toLong = function() {
    return new java.lang.Long(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript number to java float.
   * ---------------------------------------- */
  ptp.toF = function() {
    return new java.lang.Float(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript number to java double.
   * ---------------------------------------- */
  ptp.toDouble = function() {
    return new java.lang.Double(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript number (double) to integer bits.
   * ---------------------------------------- */
  ptp.toIntBits = function() {
    let arrBuffer = new ArrayBuffer(4);
    (new Float32Array(arrBuffer))[0] = this;
    let uint32Arr = new Uint32Array(arrBuffer);

    return uint32Arr[0].toString(2).padStart(32, "0");
  };


  /* calculation */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns factorial of this number (rounded).
   * ---------------------------------------- */
  ptp.fac = function() {
    let iCap = Math.round(this) + 1;
    if(iCap === 1) return 1;

    var val = 1.0;
    let i = 1;
    while(i < iCap) {
      val *= i;
      i++;
    };

    return val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Only retains several digits after the decimal point.
   * ---------------------------------------- */
  ptp.deciDigit = function(deciDigit) {
    if(deciDigit == null) deciDigit = 2;

    let mtp = Math.pow(10.0, deciDigit);

    return Math.round(this * mtp) / mtp;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a random integer with the number (floored) as maximum.
   * ---------------------------------------- */
  ptp.randInt = function(base) {
    var cap = Math.floor(this);
    if(base == null) base = 0.0;

    return Math.floor(Math.random() * (cap + 1.0 - base) + base);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets how many times something occurs at {p} with the number (floored) as attempts.
   * ---------------------------------------- */
  ptp.randFreq = function(p) {
    var freq = 0;

    let iCap = isNaN(this) ? 0 : Math.floor(this);
    if(iCap > 0) {
      for(let i = 0; i < iCap; i++) {
        if(Mathf.chance(p)) freq++;
      };
    };

    return freq;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * To percentage string.
   * ---------------------------------------- */
  ptp.perc = function(deciDigit) {
    return Strings.fixed(this * 100.0, Object.val(deciDigit, 2)) + "%";
  };


  /* ----------------------------------------
   * NOTE:
   *
   * To scientific notation string.
   * ---------------------------------------- */
  ptp.sci = function(pow, deciDigit) {
    return Strings.fixed(this * Math.pow(10, -pow), Object.val(deciDigit, 2)) + " × 10^" + pow;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * To UI format.
   * ---------------------------------------- */
  ptp.ui = function() {
    let intNum = Math.round(this);
    let abs = Math.abs(Math.round(this));

    if(abs < 1000.0) {return String(this)}
    else if(abs < 1000000.0) {return intNum / 1000.0 + "k"}
    else if(abs < 1000000000.0) {return intNum / 1000000.0 + "m"}
    else if(abs < 1000000000000.0) {return intNum / 1000000000.0 + "b"}
    else if(abs < 1000000000000000.0) {return intNum / 1000000000000.0 + "t"}
    else return "!LARGE";
  };


  /* <---------- boolean ----------> */


  var ptp = Boolean.prototype;


  /* calculation */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the flipped boolean value. Does NOT change the original one.
   * Don't use "===" here or you will get screwed by boolean objects.
   * ---------------------------------------- */
  ptp.conj = function() {
    return this != true;
  };


  /* <---------- string ----------> */


  var ptp = String.prototype;


  /* meta */


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a string of bits to arc bits.
   * ---------------------------------------- */
  ptp.toBitset = function() {
    const bitset = new Bits();
    let i = 0;
    for(let l of this) {
      if(l === "0") {
        bitset.set(i++, false);
      } else if(l === "1") {
        bitset.set(i++, true);
      };
    };

    return bitset;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns hash value that is unique to the string.
   * ---------------------------------------- */
  ptp.toHash = function() {
    let hash = 0;
    if(this.length === 0) return hash;
    let i = 0;
    let iCap = this.iCap();
    while(i < iCap) {
      hash = ((hash << 5) - hash) + this.charCodeAt(i);
      hash = hash & hash;
      i++;
    };

    return hash;
  };


  /* condition */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the string contains any piece from {strs}.
   * ---------------------------------------- */
  ptp.includesAny = function(strs) {
    let iCap = strs.iCap();
    if(iCap === 0) return true;
    for(let i = 0; i < iCap; i++) {
      if(this.includes(strs[i])) return true;
    };

    return false;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the string contains all the pieces from {strs}.
   * ---------------------------------------- */
  ptp.includesAll = function(strs) {
    let iCap = strs.iCap();
    if(iCap === 0) return true;
    for(let i = 0; i < iCap; i++) {
      if(!this.includes(strs[i])) return false;
    };

    return true;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the string equals any string from {strs}.
   * ---------------------------------------- */
  ptp.equalsAny = function(strs) {
    let iCap = strs.iCap();
    if(iCap === 0) return true;
    for(let i = 0; i < iCap; i++) {
      if(this == strs[i]) return true;
    };

    return false;
  };


  /* calculation */


  ptp.iCap = function() {
    return Number(this.length);
  };


  /* string calculation */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds color mark.
   * ---------------------------------------- */
  ptp.color = function(color) {
    return "[#" + color.toString() + "]" + this + "[]";
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * "Convert this to camelCase".toCamelCase()    // Returns "convertThisToCamelCase"
   * ---------------------------------------- */
  ptp.toCamelCase = function() {
    return this.replace(/(?:^\w|[A-Z]|\b\w)/g, (l, ind) => ind === 0 ? l.toLowerCase() : l.toUpperCase()).replace(/\s+/g, "").replace(/-/g, "");
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * "Convert this to kebab-case".toKebabCase()    // Returns "convert-this-to-kebab-case"
   * ---------------------------------------- */
  ptp.toKebabCase = function() {
    return this.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s+_]/g, "-").toLowerCase();
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * "convertThisToSnakeCase".toSnakeCase()    // Returns "convert_this_to_snake_case"
   * ---------------------------------------- */
  ptp.toSnakeCase = function() {
    return this.replace(/([a-zA-Z])(?=[A-Z])/g, "$1_").replace(/-/g, "_").toLowerCase();
  };


  /* <---------- array ----------> */


  Array.air = [];


  var ptp = Array.prototype;


  /* test */


  /* ----------------------------------------
   * NOTE:
   *
   * Simply {print}.
   * ---------------------------------------- */
  ptp.print = function() {
    print(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Simply {print} for each element.
   * ---------------------------------------- */
  ptp.printEach = function() {
    this.forEach(i => print(i));
  };


  /* meta */


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript array to java array.
   * {Object[]} by default.
   * ---------------------------------------- */
  ptp.toJavaArr = function(javaCls) {
    let iCap = this.iCap();
    const javaArr = java.lang.reflect.Array.newInstance(Object.val(javaCls, java.lang.Object), iCap);
    if(iCap === 0) return javaArr;

    for(let i = 0; i < iCap; i++) {
      javaArr[i] = this[i];
    };

    return javaArr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript array to arc seq.
   * ---------------------------------------- */
  ptp.toSeq = function() {
    return new Seq(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript array to arc object set.
   * ---------------------------------------- */
  ptp.toObjSet = function() {
    return ObjectSet.with(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Faster {forEach}.
   * ---------------------------------------- */
  ptp.forEachFast = function(scr) {
    if(scr == null) return;

    let iCap = this.iCap();
    if(iCap === 0) return;
    for(let i = 0; i < iCap; i++) {
      scr(this[i]);
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through an n-array.
   * ---------------------------------------- */
  ptp.forEachRow = function(ord, scr) {
    if(ord == null) ord = 1;

    let iCap = this.iCap();
    if(iCap === 0) return;
    for(let i = 0, j = 0; i < iCap; i += ord) {
      let tmpArr = [];
      while(j < ord) {
        tmpArr.push(this[i + j]);
        j++;
      };
      j = 0;
      scr.apply(null, tmpArr);
    };
  };


  /* modification */


  /* ----------------------------------------
   * NOTE:
   *
   * Pushes the element only when it is not in the array.
   * ---------------------------------------- */
  ptp.pushUnique = function(ele) {
    var cond = true;

    if(this.includes(ele)) cond = false;
    if(ele instanceof Array && this.some(ele0 => ele0 instanceof Array && ele0.equals(ele))) cond = false;

    if(cond) this.push(ele);

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Pushes every element from {arr_p} to the array.
   * {arr_p} can be a single element btw.
   * In case of chaining, use this instead of {push}!
   * ---------------------------------------- */
  ptp.pushAll = function(eles_p) {
    !(eles_p instanceof Array) ? this.push(eles_p) : eles_p.forEach(ele => this.push(ele));

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Removes the first matching element in the array.
   * ---------------------------------------- */
  ptp.remove = function(ele) {
    var ind = this.indexOf(ele);
    if(ind > -1) this.splice(ind, 1);

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Batch variant of {remove}.
   * ---------------------------------------- */
  ptp.removeAll = function(eles_p) {
    !(eles_p instanceof Array) ? this.remove(eles_p) : eles_p.forEach(ele => this.remove(ele));

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Removes all matching element in the array.
   * This does not return the array, in consistence with {push}.
   * ---------------------------------------- */
  ptp.pull = function(ele) {
    while(this.includes(ele)) {
      this.remove(ele);
    };

    return this.length;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Batch variant of {pull}.
   * ---------------------------------------- */
  ptp.pullAll = function(eles_p) {
    !(eles_p instanceof Array) ? this.pull(eles_p) : eles_p.forEach(ele => this.pull(ele));

    return this;
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
      this.push(val);
      i++;
    };

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {sort} for numeric array.
   * ---------------------------------------- */
  ptp.numSort = function() {
    return this.sort((a, b) => Number(a) - Number(b));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {sort} for mixed-type array.
   * ---------------------------------------- */
  ptp.mixSort = function() {
    const thisFun = ptp.mixSort;

    return this.sort((a, b) => {
      if(typeof a !== typeof b) return thisFun.funArr.indexOf(typeof a) - thisFun.funArr.indexOf(typeof b);

      return a === b ? 0.0 : ((a > b) ? 1.0 : - 1.0);
    });
  }
  .setProp({
    "funArr": ["string", "number", "boolean", "undefined", "object"],
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Randomizes the orders of elements in the array.
   * ---------------------------------------- */
  ptp.randomize = function(ord) {
    if(ord == null) ord = 1;

    let iCap = this.iCap();
    if(iCap === 0) return this;
    for(let i = iCap - ord; i > -1; i -= ord) {
      let j = Math.round(Mathf.random(i / ord)) * ord;
      for(let k = 0; k < ord; k++) {
        let tmp = this[i + k];
        this[i + k] = this[j + k];
        this[j + k] = tmp;
      };
    };

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Replaces elements in the array, using {mapF} as the mapper function.
   * I won't call this REPLACE cauz it returns a new object for string.
   * ---------------------------------------- */
  ptp.substitute = function(mapF, ord, off) {
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let iCap = this.iCap();
    if(iCap === 0) return this;
    for(let i = 0; i < iCap; i += ord) {
      this[i + off] = mapF(this[i + off]);
    };

    return this;
  };


  /* condition */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {obj} is an instance of at least one class from this array.
   * ---------------------------------------- */
  ptp.hasIns = function(obj) {
    return this.some(cls => obj instanceof cls);
  };


  /* array condition */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the two arrays equal each other.
   * WTF why is this not defined?!
   * ---------------------------------------- */
  ptp.equals = function(arr) {
    if(arr == null) return false;

    let i = 0;
    let iCap = this.iCap();
    if(iCap !== arr.length) return false;
    var cond = true;
    while(i < iCap) {
      if(this[i] !== arr[i]) {
        cond = false;
        break;
      };
      i++;
    };

    return cond;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {equals} that uses {mapF}.
   * ---------------------------------------- */
  ptp.equalsBy = function(arr, mapF) {
    if(arr == null) return false;

    if(mapF == null) mapF = ele => ele;

    let i = 0;
    let iCap = this.iCap();
    if(iCap !== arr.length) return false;
    var cond = true;
    while(i < iCap) {
      if(mapF(this[i]) !== mapF(arr[i])) {
        cond = false;
        break;
      };
      i++;
    };

    return cond;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the two arrays equal each other regardless of order.
   * ---------------------------------------- */
  ptp.looseEquals = function(arr) {
    if(arr == null) return false;

    return this.slice().mixSort().equals(arr.slice().mixSort());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this array is a subset of another array.
   * ---------------------------------------- */
  ptp.subsetOf = function(arr) {
    if(arr == null) return false;

    const countArr = this.toCountArr();

    let iCap = countArr.iCap();
    if(iCap === 0) return true;
    for(let i = 0; i < iCap; i += 2) {
      let ele = countArr[i];
      let count = countArr[i + 1];

      if(arr.count(ele) < count) return false;
    };

    countArr.clear();
    return true;
  };


  /* calculation */


  ptp.iCap = function() {
    return Number(this.length);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Sums up numbers in the array.
   * ---------------------------------------- */
  ptp.sum = function(ord, off) {
    var val = 0.0;
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let iCap = this.iCap();
    if(iCap === 0) return val;
    for(let i = 0; i < iCap; i += ord) {
      let tmpVal = Number(this[i + off]);
      if(!isNaN(tmpVal)) val += tmpVal;
    };

    return val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {sum} that uses values from {mapF}.
   * ---------------------------------------- */
  ptp.sumBy = function(mapF, ord, off) {
    var val = 0.0;
    if(mapF == null) mapF = ele => ele;
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let iCap = this.iCap();
    if(iCap === 0) return val;
    for(let i = 0; i < iCap; i+= ord) {
      let tmpVal = Number(this[i + off]);
      if(!isNaN(tmpVal)) val += mapF(tmpVal);
    };

    return val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns average value.
   * ---------------------------------------- */
  ptp.mean = function(ord, off) {
    var val = 0.0;
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let iCap = this.iCap();
    if(iCap === 0) return val;
    var count = 0;
    for(let i = 0; i < iCap; i += ord) {
      let tmpVal = Number(this[i + off]);
      if(!isNaN(tmpVal)) {
        val += tmpVal;
        count++;
      };
    };

    return count === 0 ? 0.0 : val / count;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {mean} that uses values from {mapF}.
   * ---------------------------------------- */
  ptp.meanBy = function(mapF, ord, off) {
    var val = 0.0;
    if(mapF == null) mapF = ele => ele;
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let iCap = this.iCap();
    if(iCap === 0) return val;
    var count = 0;
    for(let i = 0; i < iCap; i += ord) {
      let tmpVal = Number(this[i + off]);
      if(!isNaN(tmpVal)) {
        val += mapF(tmpVal);
        count++;
      };
    };

    return count === 0 ? 0.0 : val / count;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns power mean.
   * ---------------------------------------- */
  ptp.meanPow = function(pow, ord, off) {
    var val = 0.0;
    if(pow == null) pow = 1;
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let iCap = this.iCap();
    if(iCap === 0) return val;
    var count = 0;
    for(let i = 0; i < iCap; i += ord) {
      let tmpVal = Number(this[i + off]);
      if(!isNaN(tmpVal)) {
        val += Math.pow(tmpVal, pow);
        count++;
      };
    };

    return count === 0 ? 0.0 : Math.pow(val / count, 1.0 / pow);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {meanPow} that uses values from {mapF}.
   * ---------------------------------------- */
  ptp.meanPowBy = function(mapF, pow, ord, off) {
    var val = 0.0;
    if(mapF == null) mapF = ele => ele;
    if(pow == null) pow = 1;
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let iCap = this.iCap();
    if(iCap === 0) return val;
    var count = 0;
    for(let i = 0; i < iCap; i += ord) {
      let tmpVal = Number(this[i + off]);
      if(!isNaN(tmpVal)) {
        val += Math.pow(mapF(tmpVal), pow);
        count++;
      };
    };

    return count === 0 ? 0.0 : Math.pow(val / count, 1.0 / pow);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Counts how many times an element occurs in the array.
   * ---------------------------------------- */
  ptp.count = function(ele, ord, off) {
    var count = 0;
    if(ele == null) return count;

    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let iCap = this.iCap();
    if(iCap === 0) return count;
    for(let i = 0; i < iCap; i += ord) {
      if(this[i + off] === ele) count++;
    };

    return count;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {count} that counts only when {boolF} returns {true}.
   * ---------------------------------------- */
  ptp.countBy = function(boolF, ord, off) {
    var count = 0;
    if(boolF == null) boolF = ele => true;
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let iCap = this.iCap();
    if(iCap === 0) return count;
    for(let i = 0; i < iCap; i += ord) {
      if(boolF(this[i + off])) count++;
    };

    return count;
  };


  /* array calculation */


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * [0, 1, 2, 1, 2, 3, 0, 4, 5].unique();    // Returns [0, 1, 2, 3, 4, 5]
   * ---------------------------------------- */
  ptp.unique = function() {
    const arr = [];

    let iCap = this.iCap();
    if(iCap === 0) return arr;
    for(let i = 0; i < iCap; i++) {
      let ele = this[i];
      if(!arr.includes(ele)) arr.push(ele);
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {unique} that uses values from {mapF}.
   * ---------------------------------------- */
  ptp.uniqueBy = function(mapF) {
    const thisFun = ptp.uniqueBy;

    if(mapF == null) mapF = ele => ele;
    const arr = [];

    let iCap = this.iCap();
    if(iCap === 0) return arr;
    for(let i = 0; i < iCap; i++) {
      let ele = this[i];
      let tmpEle = mapF(ele);
      if(!thisFun.funArr.includes(tmpEle)) {
        arr.push(ele);
        thisFun.funArr.push(tmpEle);
      };
    };

    thisFun.funArr.clear();
    return arr;
  }
  .setProp({
    "funArr": [],
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * [0, 1, 2, 3, 4].intersect([2, 3, 4, 5, 6]);    // Returns [2, 3, 4]
   * ---------------------------------------- */
  ptp.intersect = function(eles_p) {
    const arr = [];

    let iCap = this.iCap();
    if(iCap === 0) return arr;
    for(let i = 0; i < iCap; i++) {
      let ele = this[i];
      if(!(eles_p instanceof Array) ? ele === eles_p : eles_p.includes(ele)) arr.push(ele);
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {intersect} that uses values from {mapF}.
   * ---------------------------------------- */
  ptp.intersectBy = function(eles_p, mapF) {
    const thisFun = ptp.intersectBy;

    if(mapF == null) mapF = ele => ele;
    if(eles_p instanceof Array) eles_p.forEach(ele => thisFun.funArr.push(mapF(ele)));
    const arr = [];

    let iCap = this.iCap();
    if(iCap === 0) return arr;
    for(let i = 0; i < iCap; i++) {
      let ele = this[i];
      let tmpEle = mapF(ele);
      if(!(eles_p instanceof Array) ? tmpEle === mapF(eles_p) : thisFun.funArr.includes(tmpEle)) arr.push(ele);
    };

    thisFun.funArr.clear();
    return arr;
  }
  .setProp({
    "funArr": [],
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * [0,1,2,3,4,5,6].chunk(3);    // Returns [[0, 1, 2], [3, 4, 5], [6]]
   * ---------------------------------------- */
  ptp.chunk = function(ord, def) {
    const arr = [];
    if(ord == null) ord = 1;

    let iCap = this.iCap();
    if(iCap === 0) return arr;
    for(let i = 0, j = 0; i < iCap; i += ord) {
      let tmpArr = [];
      while(j < ord) {
        let ele = this[i + j];
        if(ele !== undefined) {
          tmpArr.push(ele);
        } else if(def != null) {
          tmpArr.push(def);
        };
        j++;
      };
      j = 0;
      arr.push(tmpArr);
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Why is {Array.prototype.flat} absent?!
   *
   * Example:
   * [0, 1, [2, 3], [4, 5, 6]].flatten();    // Returns [0, 1, 2, 3, 4, 5, 6]
   * ---------------------------------------- */
  ptp.flatten = function() {
    const arr = [];

    let iCap = this.iCap();
    if(iCap === 0) return arr;
    for(let i = 0; i < iCap; i++) {
      if(!(this[i] instanceof Array)) {
        arr.push(this[i]);
      } else {
        this[i].forEach(ele => arr.push(ele));
      };
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an index array.
   *
   * Example:
   * [5, 6, 9, 0, 1].toIndArr()    // Returns [0, 1, 2, 3, 4]
   * [5, 6, 9, 0, 1].toIndArr(true)    // Returns [1, 2, 3, 4, 5]
   * ---------------------------------------- */
  ptp.toIndArr = function(isStatistical) {
    const arr = [];

    let iCap = this.iCap();
    if(iCap === 0) return arr;
    for(let i = 0; i < iCap; i++) {
      arr.push(isStatistical ? i + 1 : i);
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a 2-array of elements and their frequencies.
   *
   * Example:
   * [0, 0, 1, 2, 3, 3, 3, 4].toCountArr()    // Returns [0, 2, 1, 1, 2, 1, 3, 3, 4, 1]
   * ---------------------------------------- */
  ptp.toCountArr = function(ord, off) {
    const arr = [];
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let iCap = this.iCap();
    if(iCap === 0) return arr;
    for(let i = 0; i < iCap; i += ord) {
      let ele = this[i + off];
      if(arr.read(ele, 0) === 0) {
        arr.push(ele, this.count(ele));
      };
    };

    return arr;
  };


  /* data */


  /* ----------------------------------------
   * NOTE:
   *
   * How many rows (or lines) this array has at given order.
   *
   * Example:
   * [0, 1, 2, 0, 2, 3, 0, 3, 4, 0].rowAmt(3);    // Returns 4
   * ---------------------------------------- */
  ptp.rowAmt = function(ord) {
    if(this.length === 0) return 0;
    if(ord == null) ord = 1;

    return (this.length - this.length % ord) / ord + Number(this.length % ord !== 0);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Reads data from a formatted array.
   * Use {def} for default value.
   * Use {unordered} to ignore order of the elements.
   * If there are multiple matching results, this only returns the first one.
   * ---------------------------------------- */
  ptp.read = function(nms_p, def, unordered) {
    if(def === undefined) def = null;
    if(nms_p == null) return def;

    let iCap = this.iCap();
    if(iCap === 0) return def;
    const nms = (nms_p instanceof Array) ? nms_p : [nms_p];
    let jCap = nms.iCap();
    for(let i = 0; i < iCap; i += jCap + 1) {
      if((function(arr) {
        if(!unordered) {
          for(let j = 0; j < jCap; j++) {if(arr[i + j] != nms[j]) return false};
          return true;
        } else {
          let tmpArr = [];
          for(let j = 0; j < jCap; j++) {tmpArr.push(arr[i + j])};
          return nms.looseEquals(tmpArr);
        };
      }) (this)) return this[i + jCap];
    };

    nms.clear();
    return def;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of elements with the same offset (in the same column) in a formatted array.
   * ---------------------------------------- */
  ptp.readCol = function(ord, off) {
    const arr = [];
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let iCap = this.iCap();
    if(iCap === 0) return arr;
    for(let i = 0; i < iCap; i += ord) {
      arr.push(this[i + off]);
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a random element.
   * ---------------------------------------- */
  ptp.readRand = function(ord, off, def) {
    if(this.length === 0) return null;

    if(ord == null) ord = 1;
    if(off == null) off = 0;
    if(def == null) def = null;

    let val = this[Math.round(Number(this.rowAmt(ord) - 1).randInt() * ord + off)];

    return val == null ? def : val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Reads data from a formatted array, and returns the results as an array.
   * Mostly useful when there are multiple matching results.
   * ---------------------------------------- */
  ptp.readList = function(nms_p, unordered) {
    const arr = [];
    if(nms_p == null) return arr;

    let iCap = this.iCap();
    if(iCap === 0) return arr;
    const nms = (nms_p instanceof Array) ? nms_p : [nms_p];
    let jCap = nms.iCap();
    for(let i = 0; i < iCap; i += jCap + 1) {
      if((function(arr) {
        if(!unordered) {
          for(let j = 0; j < jCap; j++) {if(arr[i + j] !== nms[j]) return false};
          return true;
        } else {
          let tmpArr = [];
          for(let j = 0; j < jCap; j++) {tmpArr.push(arr[i + j])};
          return nms.looseEquals(tmpArr);
        };
      }) (this)) arr.push(this[i + jCap]);
    };

    nms.clear();
    return arr;
  };


  /* <---------- global ----------> */


  global.jsExt = {};
