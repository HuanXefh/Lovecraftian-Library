/* ----------------------------------------
 * NOTE:
 *
 * Annotation marks and modifies other methods.
 * See {Function.prototype.setAnno} in {RUN_methodExt}.
 *
 * {funCaller} defines how to modify the original method {this}.
 * If you are using {this}, don't write arrow functions!
 * By returning {true} the original method will not be called.
 * Format: (arg1, arg2, arg3, ...) => {...}.
 *
 * {loadScr} is called just after the function is defined.
 *
 * {funArgCaller} is similiar to {funCaller}, but {this} refers to {arguments} of the original method.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_annotation = function() {
  this.init.apply(this, arguments);
}.initClass();


CLS_annotation.prototype.init = function(nm, funCaller, loadScr, funArgCaller) {

  this.name = nm;

  this.onCall = function(fun, annoArgs) {
    return funCaller == null ? false : funCaller.apply(fun, annoArgs);
  };

  this.onLoad = function(fun, annoLoadArgs) {
    if(loadScr != null) loadScr.apply(fun, annoLoadArgs);
  };

  this.onArgCall = function(funArgs, annoArgArgs) {
    return funArgCaller == null ? false : funArgCaller.apply(funArgs, annoArgArgs);
  };

};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_annotation.prototype;


module.exports = CLS_annotation;
