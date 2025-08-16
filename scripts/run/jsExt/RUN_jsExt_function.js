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


  /* <---------- function ----------> */


  var ptp = Function.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Simlply assigns some properties to the function.
   * Well it's actually used a lot somehow.
   * ---------------------------------------- */
  ptp.setProp = function(obj) {
    for(let key in obj) {
      this[key] = obj[key];
    };

    return this;
  };
