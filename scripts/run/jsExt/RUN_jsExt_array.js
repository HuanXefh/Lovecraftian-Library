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


  /* <---------- array ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an index array.
   * If {isStatistical}, this will starts at 1 instead of 0.
   * ---------------------------------------- */
  Array.getIndArr = function(len, isStatistical) {
    const arr = [];

    let i = 0;
    while(i < len) {
      arr.push(isStatistical ? (i + 1) : i);
      i++;
    };

    return arr;
  };


  var ptp = Array.prototype;


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
   * Pushes the element only when it's not {null}.
   * Double equality so {undefined} won't be pushed.
   * ---------------------------------------- */
  ptp.pushNonNull = function(ele) {
    if(ele == null) return this;

    this.push(ele);

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Pushes every element from {arr_p} to the array.
   * In case of chaining, use this instead of {push}!
   * ---------------------------------------- */
  ptp.pushAll = function(eles_p) {
    !(eles_p instanceof Array) ?
      this.push(eles_p) :
      eles_p.forEachFast(ele => this.push(ele));

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
    !(eles_p instanceof Array) ?
      this.remove(eles_p) :
      eles_p.forEachFast(ele => this.remove(ele));

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Remove some row in a formatted array.
   * Note that {rowInd} for the 1st row is {0}.
   * No negative index for reversed order.
   * ---------------------------------------- */
  ptp.removeRow = function(ord, rowInd) {
    if(ord == null) ord = 1;
    if(rowInd == null) rowInd = 0;
    // Don't remove anything if index is negative
    if(rowInd < 0) return;

    let ind = (rowInd + 1) * ord;

    return this.splice(ind, ord);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Removes all matching element in the array.
   * This does not return the array, in consistence with {push}.
   * Don't use this in chaining!
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
    !(eles_p instanceof Array) ?
      this.pull(eles_p) :
      eles_p.forEachFast(ele => this.pull(ele));

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Pulls out elements at the start of an array.
   * If {forResult}, this returns removed elements instead of the array.
   * ---------------------------------------- */
  ptp.shiftAll = function(amt, forResult) {
    if(amt == null) amt = 1;

    let i = 0;
    if(!forResult) {
      while(i < amt) {
        this.shift();
        i++;
      };
      return this;
    } else {
      let arr = [];
      while(i < amt) {
        arr.push(this.shift());
        i++;
      };
      return arr;
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Puts elements at the start of an array.
   * Yep batch variant of {unshift}.
   * ---------------------------------------- */
  ptp.unshiftAll = function(eles_p) {
    !(eles_p instanceof Array) ?
      this.unshift(eles_p) :
      eles_p.reverse().forEachFast(ele => this.unshift(ele));

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {sort} for purely numeric array, since native {sort} always treats elements as strings.
   * ---------------------------------------- */
  ptp.numSort = function() {
    return this.sort((a, b) => a - b);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {sort} for mixed-type array.
   * ---------------------------------------- */
  ptp.mixSort = function() {
    const thisFun = ptp.mixSort;

    return this.sort((a, b) => {
      // Sort different types
      if(typeof a !== typeof b) return thisFun.funArr.indexOf(typeof a) - thisFun.funArr.indexOf(typeof b);
      // No need to sort objects
      if(typeof a === "object") return 0.0;

      return a === b ? 0.0 : ((a > b) ? 1.0 : - 1.0);
    });
  }
  .setProp({
    // Order of types
    "funArr": ["string", "number", "boolean", "undefined", "object"],
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Randomizes the orders of elements in the array.
   * Can be used for a formatted array.
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
   * Replaces elements in the array.
   * Will modify this array.
   * Can be used for a formatted array.
   *
   * I won't call this REPLACE cauz {replace} returns a new object for string.
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


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the two arrays equal each other.
   * WTF why is this not defined?!
   * ---------------------------------------- */
  ptp.equals = function(arr, mapF) {
    let i = 0;
    let iCap = this.iCap();
    if(iCap !== arr.length) return false;

    if(mapF == null) {
      while(i < iCap) {
        if(this[i] !== arr[i]) return false;
        i++;
      };
    } else {
      while(i < iCap) {
        if(mapF(this[i]) !== mapF(arr[i])) return false;
        i++;
      };
    };


    return true;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the two arrays equal each other regardless of order.
   * ---------------------------------------- */
  ptp.looseEquals = function(arr) {
    return this.slice().mixSort().equals(arr.slice().mixSort());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {includes} used for formatted arrays.
   * ---------------------------------------- */
  ptp.colIncludes = function(ele, ord, off) {
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = off;
    let iCap = this.iCap();
    while(i < iCap) {
      if(this[i] === ele) return true;
      i += ord;
    };

    return false;
  };



  /* ----------------------------------------
   * NOTE:
   *
   * Whether this array is a subset of another array.
   * ---------------------------------------- */
  ptp.subsetOf = function(arr) {
    const countArr = this.toCountArr();

    let i = 0;
    let iCap = countArr.iCap();
    while(i < iCap) {
      if(arr.count(countArr[i]) < countArr[i + 1]) return false;
      i += 2;
    };
    countArr.clear();

    return true;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Counts how many times an element occurs in the array.
   * Can be used for a formatted array.
   * ---------------------------------------- */
  ptp.count = function(ele, mapF, ord, off) {
    var count = 0;
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = 0;
    let iCap = this.iCap();
    if(mapF == null) {
      while(i < iCap) {
        if(this[i + off] === ele) count++;
        i += ord;
      };
    } else {
      while(i < iCap) {
        if(mapF(this[i + off]) === ele) count++;
        i += ord;
      };
    };

    return count;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * [0, 1, 2, 1, 2, 3, 0, 4, 5].unique();    // Returns [0, 1, 2, 3, 4, 5]
   * ---------------------------------------- */
  ptp.unique = function(mapF) {
    const arr = [];

    let i = 0;
    let iCap = this.iCap();
    if(mapF == null) {
      while(i < iCap) {
        if(!arr.includes(this[i])) arr.push(this[i]);
        i++;
      };
    } else {
      let tmpArr = [];
      while(i < iCap) {
        let tmp = mapF(this[i]);
        if(!tmpArr.includes(tmp)) {
          arr.push(this[i]);
          tmpArr.push(tmp);
        };
        i++;
      };
      tmpArr.clear();
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * [0, 1, 2, 3, 4].intersect([2, 3, 4, 5, 6]);    // Returns [2, 3, 4]
   * ---------------------------------------- */
  ptp.intersect = function(eles_p, mapF) {
    const arr = [];

    let i = 0;
    let iCap = this.iCap();
    if(mapF == null) {
      while(i < iCap) {
        if(!(eles_p instanceof Array) ? this[i] === eles_p : eles_p.includes(this[i])) {
          arr.push(ele);
        };
        i++;
      };
    } else {
      let tmpArr = [];
      if(eles_p instanceof Array) eles_p.forEachFast(ele => tmpArr.push(mapF(ele)));
      while(i < iCap) {
        let tmp = mapF(this[i]);
        if(!(eles_p instanceof Array) ? tmp === mapF(eles_p) : tmpArr.includes(tmp)) {
          arr.push(ele);
        };
        i++;
      };
      tmpArr.clear();
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Example:
   * [0, 1, 2, 3, 4, 5, 6].chunk(3);    // Returns [[0, 1, 2], [3, 4, 5], [6]]
   * [0, 1, 2, 3, 4, 5, 6].chunk(3, 0);    // Returns [[0, 1, 2], [3, 4, 5], [6, 0, 0]]
   * ---------------------------------------- */
  ptp.chunk = function(ord, def) {
    const arr = [];
    if(ord == null) ord = 1;

    let i = 0;
    let j = 0;
    let iCap = this.iCap();
    while(i < iCap) {
      let tmpArr = [];
      while(j < ord) {
        let tmp = this[i + j];
        if(tmp !== undefined) {
          tmpArr.push(ele);
        } else if(def !== undefined) {
          tmpArr.push(def);
        };
        j++;
      };
      arr.push(tmpArr);
      j = 0;
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

    let i = 0;
    let iCap = this.iCap();
    while(i < iCap) {
      !(this[i] instanceof Array) ?
        arr.push(this[i]) :
        this[i].forEachFast(ele => arr.push(ele));
      i++;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a 2-array of elements and their frequencies.
   * Can be used for a formatted array.
   *
   * Example:
   * [0, 0, 1, 2, 3, 3, 3, 4].toCountArr()    // Returns [0, 2, 1, 1, 2, 1, 3, 3, 4, 1]
   * ---------------------------------------- */
  ptp.toCountArr = function(ord, off) {
    const arr = [];
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = 0;
    let iCap = this.iCap();
    while(i < iCap) {
      let tmp = this[i + off];
      if(arr.read(tmp, 0) === 0) {
        arr.push(tmp, this.count(tmp));
      };
      i += ord;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * How many rows (or lines) this formatted array has.
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
   *
   * Given a target row of {0, 1, 2, 3}, then {nms_p} should be {[0, 1, 2]}.
   * ---------------------------------------- */
  ptp.read = function(nms_p, def, unordered) {
    const thisFun = Array.prototype.read;

    let i = 0;
    let iCap = this.iCap();
    let nms = nms_p instanceof Array ? nms_p : [nms_p];
    let jCap = nms.iCap();
    while(i < iCap) {
      if(thisFun.funBoolF(nms, this, i, jCap, unordered)) return this[i + jCap];
      i += jCap + 1;
    };

    return def;
  }
  .setProp({
    "funBoolF": (nms, arr, rowCur, fieldAmt, unordered) => {
      let i = 0;
      if(!unordered) {
        while(i < fieldAmt) {
          if(arr[rowCur + i] !== nms[i]) return false;
          i++;
        };
        return true;
      } else {
        let tmpArr = [];
        while(i < fieldAmt) {
          tmpArr.push(arr[rowCur + i]);
          i++;
        };
        return nms.looseEquals(tmpArr);
      };
    },
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Like {read} but returns the row index.
   * Will return {-1} if not found.
   * ---------------------------------------- */
  ptp.readRowInd = function(nms_p, unordered) {
    const thisFun = Array.prototype.readRowInd;

    let i = 0;
    let iCap = this.iCap();
    let nms = nms_p instanceof Array ? nms_p : [nms_p];
    let jCap = nms.iCap();
    while(i < iCap) {
      if(thisFun.funBoolF(nms, this, i, jCap, unordered)) return Math.round(i / (jCap + 1));
      i += jCap + 1;
    };

    return -1;
  }
  .setProp({
    "funBoolF": (nms, arr, rowCur, fieldAmt, unordered) => {
      let i = 0;
      if(!unordered) {
        while(i < fieldAmt) {
          if(arr[rowCur + i] !== nms[i]) return false;
          i++;
        };
        return true;
      } else {
        let tmpArr = [];
        while(i < fieldAmt) {
          tmpArr.push(arr[rowCur + i]);
          i++;
        };
        return nms.looseEquals(tmpArr);
      };
    },
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of elements with the same offset (in the same column) in a formatted array.
   * ---------------------------------------- */
  ptp.readCol = function(ord, off) {
    const arr = [];
    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let i = 0;
    let iCap = this.iCap();
    while(i < iCap) {
      arr.push(this[i + off]);
      i += ord;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a random element.
   * Supports formatted array.
   * ---------------------------------------- */
  ptp.readRand = function(ord, off, def) {
    if(this.length === 0) return null;

    if(ord == null) ord = 1;
    if(off == null) off = 0;

    let val = this[Math.round((this.rowAmt(ord) - 1).randInt() * ord + off)];

    return val == null ? def : val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Reads data from a formatted array, and returns the results as an array.
   * Mostly useful when there are multiple matching results.
   * ---------------------------------------- */
  ptp.readList = function(nms_p, unordered) {
    const thisFun = Array.prototype.readList;
    const arr = [];

    let i = 0;
    let iCap = this.iCap();
    let nms = nms_p instanceof Array ? nms_p : [nms_p];
    let jCap = nms.iCap();
    while(i < iCap) {
      if(thisFun.funBoolF(nms, this, i, jCap, unordered)) arr.push(this[i + jCap]);
      i += jCap + 1;
    };

    return arr;
  }
  .setProp({
    "funBoolF": (nms, arr, rowCur, fieldAmt, unordered) => {
      let i = 0;
      if(!unordered) {
        while(i < fieldAmt) {
          if(arr[rowCur + i] !== nms[i]) return false;
          i++;
        };
        return true;
      } else {
        let tmpArr = [];
        while(i < fieldAmt) {
          tmpArr.push(arr[rowCur + i]);
          i++;
        };
        return nms.looseEquals(tmpArr);
      };
    },
  });


  /* ----------------------------------------
   * NOTE:
   *
   * The other side of {read}, pretty much obvious.
   * ---------------------------------------- */
  ptp.write = function(nms_p, val, unordered) {
    const thisFun = Array.prototype.write;

    let i = 0;
    let iCap = this.iCap();
    let nms = nms_p instanceof Array ? nms_p : [nms_p];
    let jCap = nms.iCap();
    while(i < iCap) {
      if(thisFun.funBoolF(nms, this, i, jCap, unordered)) {
        this[i + jCap] = val;
        return;
      };
      i += jCap + 1;
    };

    this.pushAll(nms);
    this.push(val);
  }
  .setProp({
    "funBoolF": (nms, arr, rowCur, fieldAmt, unordered) => {
      let i = 0;
      if(!unordered) {
        while(i < fieldAmt) {
          if(arr[rowCur + i] !== nms[i]) return false;
          i++;
        };
        return true;
      } else {
        let tmpArr = [];
        while(i < fieldAmt) {
          tmpArr.push(arr[rowCur + i]);
          i++;
        };
        return nms.looseEquals(tmpArr);
      };
    },
  });
