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


  Object.printKeys = function(obj) {
    if(typeof obj !== "object" && typeof obj !== "function") return;
    Object.keys(obj).printEach();
  };


  /* <---------- function ----------> */


  var ptp = Function.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Simply {print} but at the end.
   * ---------------------------------------- */
  ptp.print = function() {
    print(this);
  };


  /* <---------- array ----------> */


  var ptp = Array.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Simply {print} but at the end.
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
    this.forEachFast(i => print(i));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {print} used for formatted arrays.
   * ---------------------------------------- */
  ptp.printFormat = function(ord) {
    this.forEachRow(tryVal(ord, 1), () => {
      print(Array.from(arguments));
    });
  };
