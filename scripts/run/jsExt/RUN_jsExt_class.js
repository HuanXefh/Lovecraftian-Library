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
      ERROR_HANDLER.abstractInstance();
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
    if(typeof cls !== "function" || !cls.isClass()) ERROR_HANDLER.notClass(cls);

    Object.assign(this, cls);
    // A second abstract class??? {initAbstrClass} again
    this.isAbstrClass = Function.airFalse;
    this.getSuper = () => cls;

    this.super = function(nmFun) {
      let clsParent = this.getSuper();
      if(clsParent === Function) ERROR_HANDLER.noSuperClass();
      if(clsParent.isAbstrClass()) ERROR_HANDLER.abstractSuper();
      let funParent = clsParent[nmFun];
      if(funParent == null) ERROR_HANDLER.noSuperMethod(nmFun);

      return funParent.apply(this, Array.from(arguments).splice(1));
    };

    this.prototype = Object.create(cls.prototype);
    this.prototype.constructor = this;

    this.prototype.super = function(nmFun) {
      let clsParent = this.getClass().getSuper();
      if(clsParent === Function) ERROR_HANDLER.noSuperClass();
      if(clsParent.isAbstrClass()) ERROR_HANDLER.abstractSuper();
      let funParent = clsParent.prototype[nmFun];
      if(funParent == null) ERROR_HANDLER.noSuperMethod(nmFun);

      return funParent.apply(this, Array.from(arguments).splice(1));
    };

    return this;
  };
