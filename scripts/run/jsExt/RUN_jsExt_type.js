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


  /* <---------- number ----------> */


  var ptp = Number.prototype;


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
   * Converts javascript number (double) to integer bits (as string).
   * ---------------------------------------- */
  ptp.toIntBits = function() {
    let arrBuffer = new ArrayBuffer(4);
    (new Float32Array(arrBuffer))[0] = this;
    let uint32Arr = new Uint32Array(arrBuffer);

    return uint32Arr[0].toString(2).padStart(32, "0");
  };


  /* <---------- string ----------> */


  var ptp = String.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a string of bits to Arc bits.
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


  /* <---------- array ----------> */


  var ptp = Array.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript array to java array, which you will definitely need.
   * {Object[]} by default, you can use a java class to set the type.
   * ---------------------------------------- */
  ptp.toJavaArr = function(javaClsObj) {
    let iCap = this.iCap();
    const javaArr = java.lang.reflect.Array.newInstance(tryVal(javaClsObj, java.lang.Object), iCap);
    if(iCap === 0) return javaArr;

    for(let i = 0; i < iCap; i++) {
      javaArr[i] = this[i];
    };

    return javaArr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript array to Arc seq.
   * ---------------------------------------- */
  ptp.toSeq = function() {
    return new Seq(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts javascript array to Arc object set.
   * ---------------------------------------- */
  ptp.toObjSet = function() {
    return ObjectSet.with(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a 2-array to Arc object map.
   * ---------------------------------------- */
  ptp.toObjMap = function() {
    let objMap = new ObjectMap();
    this.forEachRow(2, (key, val) => objMap.put(key, val));

    return objMap;
  };
