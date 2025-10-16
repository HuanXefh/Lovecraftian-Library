/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


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
   * Lets a function class implements an interface.
   * ---------------------------------------- */
  ptp.implement = function(intf) {
    const thisCls = this;

    if(intf == null || !(intf instanceof CLS_interface)) ERROR_HANDLER.notInterface();
    if(intf.children.includes(this)) ERROR_HANDLER.duplicateInterface();

    Object._it(intf.interfaceObj, (key, prop) => {
      thisCls[key] !== undefined ?
        ERROR_HANDLER.interfaceMethodConflict(key) :
        thisCls[key] = prop;
    });
    intf.children.push(this);

    return this;
  };
