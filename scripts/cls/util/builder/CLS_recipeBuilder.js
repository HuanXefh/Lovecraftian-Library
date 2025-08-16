/* ----------------------------------------
 * NOTE:
 *
 * Used to build a recipe object.
 * Only contains fields related to I/O.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_paramBuilder = require("lovec/cls/util/builder/CLS_paramBuilder");


/* <---------- meta ----------> */


const CLS_recipeBuilder = function() {
  this.init.apply(this, arguments);
}.extendClass(CLS_paramBuilder).initClass();


CLS_recipeBuilder.prototype.init = function() {

  this.builderObj = {};

};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_recipeBuilder.prototype;


/* modification */


ptp.__ci = function(arr) {
  this.builderObj["ci"] = Object.val(arr, Array.air);

  return this;
};


ptp.__bi = function(arr) {
  this.builderObj["bi"] = Object.val(arr, Array.air);

  return this;
};


ptp.__aux = function(arr) {
  this.builderObj["aux"] = Object.val(arr, Array.air);

  return this;
};


ptp.__reqOpt = function(bool) {
  this.builderObj["reqOpt"] = Object.val(bool, false);

  return this;
};


ptp.__opt = function(arr) {
  this.builderObj["opt"] = Object.val(arr, Array.air);

  return this;
};


ptp.__co = function(arr) {
  this.builderObj["co"] = Object.val(arr, Array.air);

  return this;
};


ptp.__bo = function(arr) {
  this.builderObj["bo"] = Object.val(arr, Array.air);

  return this;
};


ptp.__failP = function(frac) {
  this.builderObj["failP"] = Object.val(frac, 0.0);

  return this;
};


ptp.__fo = function(arr) {
  this.builderObj["fo"] = Object.val(arr, Array.air);

  return this;
};


module.exports = CLS_recipeBuilder;
