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
   * Returns the modified method. This does not modify the original one!
   * {annoArgs} is for on-call-type annotations.
   * {annoLoadArgs} is for on-load-type annotations.
   * {annoArgArgs} is for argument-type annotations.
   * {skipVal} is the value returned when method is skipped somehow.
   * ---------------------------------------- */
  ptp.setAnno = function(anno, args_p, skipVal) {
    const thisFun = this;

    if(anno == null || !(anno instanceof CLS_annotation)) ERROR_HANDLER.notAnno();

    if(args_p == null) args_p = [];
    let args = args_p instanceof Array ? args_p : [args_p];

    if(anno.type === "on-load") {
      anno.onLoad(thisFun, args);
    };

    let fun = function() {
      return (anno.type === "on-load" ? false : anno.type === "on-call" ? anno.onCall(thisFun, args) : anno.type === "argument" ? anno.onArgCall(arguments, args) : false) ?
        skipVal :
        thisFun.apply(this, arguments);
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
    return this.setAnno(ANNO.__TODO__, todoInfo);
  };
