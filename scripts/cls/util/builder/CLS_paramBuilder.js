/* ----------------------------------------
 * NOTE:
 *
 * The base class for all parameter builders.
 * {builderObj} should be defined in child classes.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_paramBuilder = newClass().initAbstrClass();


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_paramBuilder.prototype;


ptp.extend = function(obj) {
  if(this.builderObj == null || obj == null) return this;

  for(let key in obj) {
    this.builderObj[key] = obj[key];
  };

  return this;
};


ptp.build = function() {
  return tryVal(this.builderObj, Object.air);
};


module.exports = CLS_paramBuilder;
