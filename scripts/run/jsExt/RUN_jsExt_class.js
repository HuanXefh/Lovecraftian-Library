/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


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
   * Gets the super class. If not a function class, returns {null}.
   * ---------------------------------------- */
  ptp.getSuper = Function.airNull;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the function is a function class.
   * ---------------------------------------- */
  ptp.isClass = Function.airFalse;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the function is an abstract function class.
   * ---------------------------------------- */
  ptp.isAbstrClass = Function.airFalse;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up generic methods for function class and its instances.
   * This is required for a class to function properly.
   * ---------------------------------------- */
  ptp.initClass = function() {
    let cls = this;
    let ins = this.prototype;

    // Root class of all function class is {Function}
    if(cls.getSuper() == null) cls.getSuper = () => Function;

    cls.isClass = Function.airTrue;
    ins.getClass = () => cls;

    ins.setProp = obj => {
      for(let key in obj) {
        ins[key] = obj[key];
      };
    };

    return cls;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up an abstract class to be extended.
   * Creating new instance of this class directly is not allowed.
   * Don't call super in child classes, that's dumb idea.
   *
   * There's nothing called abstract method here, just set it empty.
   * ---------------------------------------- */
  ptp.initAbstrClass = function() {
    this.initClass();

    this.isAbstrClass = Function.airTrue;
    this.prototype.init = function() {
      throw new Error("Cannot create instances of an abstract class.");
    };

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a function class extends another function class.
   * Should be called before {initClass}.
   * WTF why do I even need reinvent this.
   *
   * You can use {this.super(nmFun, ...args)} to call super methods later.
   * ---------------------------------------- */
  ptp.extendClass = function(cls) {
    if(typeof cls !== "function" || !cls.isClass()) throw new Error("Parent class argument is not a function class: " + String(cls));

    Object.assign(this, cls);
    // A second abstract class??? {initAbstrClass} again
    this.isAbstrClass = Function.airFalse;
    this.getSuper = () => cls;

    this.super = function(nmFun) {
      let clsParent = this.getSuper();
      if(clsParent === Function) throw new Error("Can't call super when there's no parent class!");
      if(clsParent.isAbstrClass()) throw new Error("Calling super methods from an abstract class is not allowed.");
      let funParent = clsParent[nmFun];
      if(funParent == null) throw new Error("Method is undefined in super class: " + String(nmFun));

      return funParent.apply(this, Array.from(arguments).splice(0, 1));
    };

    this.prototype = Object.create(cls.prototype);
    this.prototype.constructor = this;

    this.prototype.super = function(nmFun) {
      let clsParent = this.getClass().getSuper();
      if(clsParent === Function) throw new Error("Can't call super when there's no parent class!");
      if(clsParent.isAbstrClass()) throw new Error("Calling super methods from an abstract class is not allowed.");
      let funParent = clsParent.prototype[nmFun];
      if(funParent == null) throw new Error("Method is undefined in super class: " + String(nmFun));

      return funParent.apply(new clsParent(), Array.from(arguments).splice(0, 1));
    };

    return this;
  };
