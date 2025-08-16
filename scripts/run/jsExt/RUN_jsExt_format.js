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
   * To percentage string.
   * ---------------------------------------- */
  ptp.perc = function(deciAmt) {
    return Strings.fixed(this * 100.0, Object.val(deciAmt, 2)) + "%";
  };


  /* ----------------------------------------
   * NOTE:
   *
   * To scientific notation string.
   * ---------------------------------------- */
  ptp.sci = function(pow, deciAmt) {
    return Strings.fixed(this * Math.pow(10, -pow), Object.val(deciAmt, 2)) + " × 10^" + pow;
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


  /* <---------- string ----------> */


  var ptp = String.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds color markup.
   * ---------------------------------------- */
  ptp.color = function(color) {
    return "[#" + color.toString() + "]" + this + "[]";
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Rainbow color for the string.
   * Can be used for not only rainbow.
   * ---------------------------------------- */
  ptp.rainbow = function(colors, scl, off) {
    let str = "";
    if(colors == null) colors = [Color.red, Color.orange, Color.yellow, Color.green, Color.cyan, Color.blue, Color.purple];
    if(scl == null) scl = 1.0;
    if(off == null) off = 0.0;

    let scl_fi = Mathf.clamp(scl, 0.0, 0.9999);
    let color, color_f, color_t;
    let frac, indBase, indCap;
    let i = 0;
    let iCap = this.iCap();
    let jCap = colors.iCap();
    while(i < iCap) {
      frac = Mathf.mod(i / scl_fi / iCap + off, 1.0);
      indBase = Math.max(Math.floor(frac * jCap - 0.0001), 0);
      indCap = Math.max(Math.ceil(frac * jCap - 0.0001), 1);
      color_f = colors[indBase];
      color_t = colors[indCap >= jCap ? 0 : indCap];

      color = Tmp.c1.set(color_f).lerp(color_t, frac * jCap - indBase);
      str += this[i].color(color);
      i++;
    };

    return str;
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
