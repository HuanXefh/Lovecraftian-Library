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

    if(intf == null || !(intf instanceof CLS_interface)) throw new Error("Found invalid of undefined interface!");
    if(intf.childs.includes(this)) throw new Error("Don't implement an interface twice!");

    Object._it(intf.interfaceObj, (key, prop) => {
      if(thisCls[key] !== undefined) {
        throw new Error("Can't implement interface on a class due to name conflict.");
      } else {
        thisCls[key] = prop;
      };
    });
    intf.childs.push(this);

    return this;
  };
