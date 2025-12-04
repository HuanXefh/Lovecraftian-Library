/* ----------------------------------------
 * NOTE:
 *
 * Utility class for automatic recipe generation.
 * ---------------------------------------- */


/* <---------- import ----------> */


const MDL_event = require("lovec/mdl/MDL_event");


/* <---------- meta ----------> */


const CLS_recipeGenerator = newClass().initClass();


/* ----------------------------------------
 * NOTE:
 *
 * {setter} is used to write some recipe object.
 * {this} in the setter function refers to the recipe generator.
 * Format for {setter}: {(rcObj, paramObj) => {...}}.
 * ---------------------------------------- */
CLS_recipeGenerator.prototype.init = function(setter) {
  this.setter = tryVal(setter, Function.air);
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_recipeGenerator.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Returns the standard generated header name for some recipe.
 * ---------------------------------------- */
ptp.getHeaderName = function(nmCt, categ, tag) {
  return tryVal(categ, "uncategorized").toUpperCase() + ": <[$1][$2]>".format(nmCt, tag == null ? "" : " ([$1])".format(tag));
};


/* ----------------------------------------
 * NOTE:
 *
 * Adds recipe to the recipe object.
 * Any recipe added by this method will be tagged as GENERATED.
 *
 * Use {CLS_recipeBuilder} to modify the I/O fields (obtain the builder object).
 * ---------------------------------------- */
ptp.addRc = function(rc, nmCt, categ, tag, objF, rcBuilderObj) {
  let rcObj = {
    icon: nmCt,
    category: categ,
    isGenerated: true,
  };
  if(rcBuilderObj != null) {
    Object.cloneProp(rcObj, rcBuilderObj);
  };
  if(objF != null) {
    objF(rcObj);
  };

  rc["recipe"].push(this.getHeaderName(nmCt, categ, tag), rcObj);
};


/* ----------------------------------------
 * NOTE:
 *
 * Modifies {rc} on CLIENT LOAD.
 * ---------------------------------------- */
ptp.run = function(rc, paramObj) {
  MDL_event._c_onLoad(() => {
    this.setter(rc, paramObj);
  });
};



module.exports = CLS_recipeGenerator;
