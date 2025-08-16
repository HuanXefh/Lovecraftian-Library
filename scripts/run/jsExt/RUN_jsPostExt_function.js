/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  const CLS_annotation = require("lovec/cls/struct/CLS_annotation");


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
   * Modifies the method, which is defined in annotation.
   * Returns the modified method. Does not modify the original one!
   * ---------------------------------------- */
  ptp.setAnno = function(anno, annoArgs_p, annoLoadArgs_p) {
    const thisFun = this;

    if(anno == null || !(anno instanceof CLS_annotation)) throw new Error("Found invalid or undefined annotation!");

    if(annoArgs_p == null) annoArgs_p = [];
    if(annoLoadArgs_p == null) annoLoadArgs_p = [];
    let annoArgs = annoArgs_p instanceof Array ? annoArgs_p : [annoArgs_p];
    let annoLoadArgs = annoLoadArgs_p instanceof Array ? annoLoadArgs_p : [annoLoadArgs_p];

    anno.onLoad(thisFun, annoLoadArgs);

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
    return this.setAnno(ANNO.__TODO__, null, todoInfo);
  };
