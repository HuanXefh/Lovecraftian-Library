/* ----------------------------------------
 * NOTE:
 *
 * Utility class for automatic recipe generation.
 * ---------------------------------------- */


/* <---------- import ----------> */


const MDL_content = require("lovec/mdl/MDL_content");
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
 * Parses raw BI data, returns the array used in recipe object.
 * ---------------------------------------- */
ptp.parseRawBi = function(rawBi, amtO, pO) {
  let amt = amtO * pO;
  let bi = [];

  rawBi.forEachRow(3, (tmp, frac, p) => {
    if(!(tmp instanceof Array)) {
      let tmp1 = MDL_content._ct(tmp, "rs");
      if(tmp1 == null) return;
      bi.push(tmp1.name, Math.round(amt * frac * (1.0 / p)), p);
    } else {
      let subBi = [];
      tmp.forEachRow(3, (tmp1, frac1, p1) => {
        let tmp2 = MDL_content._ct(tmp1, "rs");
        if(tmp2 == null) return;
        subBi.push(tmp2.name, Math.round(amt * frac1 * (1.0 / p1)), p1);
      });
      bi.push(subBi, -1.0, -1.0);
    };
  });

  return bi;
};


/* ----------------------------------------
 * NOTE:
 *
 * Parses raw PAYI data, returns the array used in recipe object.
 * ---------------------------------------- */
ptp.parseRawPayi = function(rawPayi, payAmtO) {
  let payi = [];

  rawPayi.forEachRow(2, (nm, frac) => {
    let ct = MDL_content._ct(nm, null, true);
    if(ct == null) return;
    payi.push(nm, Math.round(payAmtO * frac));
  });

  return payi;
};


/* ----------------------------------------
 * NOTE:
 *
 * Parses raw BO data, returns the array used in recipe object.
 * ---------------------------------------- */
ptp.parseRawBo = function(rawBo, amtI, pI) {
  let amt = amtI * pI;
  let bo = [];

  rawBo.forEachRow(3, (nm, frac, p) => {
    let tmp = MDL_content._ct(nm, "rs");
    if(tmp == null) return;
    bo.push(tmp.name, Math.round(amt * frac * (1.0 / p)), p);
  });

  return bo;
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
