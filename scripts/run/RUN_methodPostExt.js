/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Another part of extension called later than {RUN_methodExt}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  const CLS_annotation = require("lovec/cls/struct/CLS_annotation");
  const CLS_interface = require("lovec/cls/struct/CLS_interface");


/*
  ========================================
  Section: Application
  ========================================
*/


  /* <---------- object ----------> */


  /* <---------- function ----------> */


  var ptp = Function.prototype;


  /* modification */


  /* ----------------------------------------
   * NOTE:
   *
   * Modifies the method, which is defined in annotation.
   * Returns the modified method. Does not overwrite the original one!
   * ---------------------------------------- */
  ptp.setAnno = function(anno, annoArgs) {
    const thisFun = this;

    if(anno == null || !(anno instanceof CLS_annotation)) return thisFun;

    if(annoArgs == null) annoArgs = [];

    anno.onLoad(thisFun);

    return function() {
      var cond = anno.onCall(thisFun, annoArgs);
      var val = cond ? null : thisFun.apply(this, arguments);

      return val;
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up {__TODO__}.
   * ---------------------------------------- */
  ptp.setTodo = function(todoInfo) {
    return this.setAnno(ANNO.__TODO__(todoInfo));
  };


  /* class */


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a function class implements an interface.
   * ---------------------------------------- */
  ptp.implement = function(intf) {
    const thisCls = this;

    if(intf == null || !(intf instanceof CLS_interface)) return this;
    if(intf.childs.includes(this)) throw new Error("Don't implement an interface twice!");

    Object.iterate(intf.interfaceObj, (key, prop) => {
      if(thisCls[key] !== undefined) {
        throw new Error("Can't implement interface on a class due to name conflict.");
      } else {
        thisCls[key] = prop;
      };
    });
    intf.childs.push(this);

    return this;
  };


  /* <---------- array ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Converts array to json payload.
   * The array should only contain primitive values!
   * ---------------------------------------- */
  Array.toPayload = function(arr) {
    return JSON.stringify(Object.fromArr(arr));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts json payload to array.
   * ---------------------------------------- */
  Array.fromPayload = function(payload) {
    return Object.toArr(JSON.parse(payload));
  };
