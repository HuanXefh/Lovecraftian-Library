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
  ptp.setAnno = function(anno, annoArgs_p, annoLoadArgs_p, annoArgArgs_p) {
    const thisFun = this;

    if(anno == null || !(anno instanceof CLS_annotation)) ERROR_HANDLER.notAnno();

    if(annoArgs_p == null) annoArgs_p = [];
    if(annoLoadArgs_p == null) annoLoadArgs_p = [];
    if(annoArgArgs_p == null) annoArgArgs_p = [];
    let annoArgs = annoArgs_p instanceof Array ? annoArgs_p : [annoArgs_p];
    let annoLoadArgs = annoLoadArgs_p instanceof Array ? annoLoadArgs_p : [annoLoadArgs_p];
    let annoArgArgs = annoArgArgs_p instanceof Array ? annoArgArgs_p : [annoArgArgs_p];

    anno.onLoad(thisFun, annoLoadArgs);

    let fun = function() {
      var cond = anno.onCall(thisFun, annoArgs) || anno.onArgCall(arguments, annoArgArgs);
      var val = cond ? null : thisFun.apply(this, arguments);

      return val;
    };
    fun.annos = this.getAnnos().pushAll(anno);

    return fun;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a copy of the annotation list of this function.
   * ---------------------------------------- */
  ptp.getAnnos = function() {
    return tryVal(this.annos, Array.air).slice();
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up {__TODO__}.
   * ---------------------------------------- */
  ptp.setTodo = function(todoInfo) {
    return this.setAnno(ANNO.__TODO__, null, todoInfo);
  };
