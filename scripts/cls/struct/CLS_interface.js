/* ----------------------------------------
 * NOTE:
 *
 * Interface formed from an object.
 * Used to add properties to a class.
 *
 * Interface instances are named like {INTF_xxx}.
 * More like a mixin though, I'm not gonna rename it.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_interface = function() {
  this.init.apply(this, arguments);
}.initClass();


CLS_interface.prototype.init = function(obj) {

  this.interfaceObj = obj;
  this.children = [];

};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_interface.prototype;


module.exports = CLS_interface;
