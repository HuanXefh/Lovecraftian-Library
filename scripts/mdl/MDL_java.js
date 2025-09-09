/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- java class ----------> */


  const clsLoader = Core.app.class.getClassLoader();


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a java class from given string.
   * ---------------------------------------- */
  const _cls_nm = function(nm) {
    return java.lang.Class.forName(nm, false, clsLoader);
  };
  exports._cls_nm = _cls_nm;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the java class object.
   * ---------------------------------------- */
  const _clsObj = function(clsObj_gn) {
    if(clsObj_gn == null) return null;
    if(typeof clsObj_gn === "string") return java.lang.Class.forName(clsObj_gn, false, clsLoader);

    return clsObj_gn.__javaObject__;
  };
  exports._clsObj = _clsObj;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a java argument array to a 2-tuple used in {Reflect.invoke}.
   * A java argument array is a 2-array of java classes and arguments.
   *
   * Example:
   * [
   *   "mindustry.world.Block", Blocks.router,
   *   java.lang.Float, 0.5,
   *   Tile, Vars.world.tile(0, 0),
   * ];
   * ---------------------------------------- */
  const _argTup = function(javaArgs) {
    const arr = [[], []];
    if(javaArgs == null || javaArgs.length === 0) return arr;

    javaArgs.forEachRow(2, (clsObj_gn, arg) => {
      arr[0].push(arg);
      arr[1].push(_clsObj(clsObj_gn));
    });

    return arr;
  };
  exports._argTup = _argTup;


  /* ----------------------------------------
   * NOTE:
   *
   * Calls a java method in some class, using a java argument array.
   * If for static methods, set {caller} to {null}.
   * Can be used to call private methods, or when ambiguous argument error is inevitable.
   * ---------------------------------------- */
  const invoke = function(javaCls, nmFun, caller, javaArgs) {
    let argTup = _argTup(javaArgs);

    return Reflect.invoke(javaCls, Object.val(caller, null), nmFun, argTup[0], argTup[1]);
  };
  exports.invoke = invoke;
