/* ----------------------------------------
 * NOTE:
 *
 * A container formed from an object, not expected to be modified afterwards.
 * Do not try iteration on this.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_objectBox = function() {
  this.init.apply(this, arguments);
}.initClass();


CLS_objectBox.prototype.init = function(obj) {
  if(obj == null) obj = {};

  var count = 0;
  for(let key in obj) {
    this[key] = obj[key];
    count++;
  };

  this.size = count;
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_objectBox.prototype;


/* meta */


/* ----------------------------------------
 * NOTE:
 *
 * Returns size of the box, NOW.
 * ---------------------------------------- */
ptp.getSize = function() {
  var count = 0;
  for(let key in this) {
    count++;
  };

  return count;
};


/* condition */


/* ----------------------------------------
 * NOTE:
 *
 * Whether the box has been modified.
 * ---------------------------------------- */
ptp.isDirty = function() {
  return this.size !== this.getSize();
};


module.exports = CLS_objectBox;
