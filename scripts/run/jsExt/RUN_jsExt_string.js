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


  /* <---------- string ----------> */


  var ptp = String.prototype;


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


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the string contains any piece from {strs}.
   * ---------------------------------------- */
  ptp.includesAny = function(strs) {
    let i = 0;
    let iCap = strs.iCap();
    while(i < iCap) {
      if(this.includes(strs[i])) return true;
      i++;
    };

    return false;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the string contains all the pieces from {strs}.
   * ---------------------------------------- */
  ptp.includesAll = function(strs) {
    let i = 0;
    let iCap = strs.iCap();
    while(i < iCap) {
      if(this.includes(strs[i])) return false;
      i++;
    };

    return true;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the string equals any string from {strs}.
   * No triple equality here!
   * ---------------------------------------- */
  ptp.equalsAny = function(strs) {
    let i = 0;
    let iCap = strs.iCap();
    while(i < iCap) {
      if(this == strs[i]) return true;
      i++;
    };

    return false;
  };
