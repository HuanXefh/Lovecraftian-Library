/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * On rare occasions java classes are needed, e.g. {config} of a block.
   * Don't try java things other than that.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- auxilliary ----------> */


  function getArrayClass(javaCls) {
    return java.lang.reflect.Array.newInstance(javaCls, 1).getClass();
  };


  /* <---------- base ----------> */


  const INT = java.lang.Integer;
  exports.INT = INT;


  const INT_ARRAY = getArrayClass(INT);
  exports.INT_ARRAY = INT_ARRAY;


  const BYTE = java.lang.Byte;
  exports.BYTE = BYTE;


  const BYTE_ARRAY = getArrayClass(BYTE);
  exports.BYTE_ARRAY = BYTE_ARRAY;


  const SHORT = java.lang.Short;
  exports.SHORT = SHORT;


  const SHORT_ARRAY = getArrayClass(SHORT);
  exports.SHORT_ARRAY = SHORT_ARRAY;


  const LONG = java.lang.Long;
  exports.LONG = LONG;


  const LONG_ARRAY = getArrayClass(LONG);
  exports.LONG_ARRAY = LONG_ARRAY;


  const FLOAT = java.lang.Float;
  exports.FLOAT = FLOAT;


  const FLOAT_ARRAY = getArrayClass(FLOAT);
  exports.FLOAT_ARRAY = FLOAT_ARRAY;


  const DOUBLE = java.lang.Double;
  exports.DOUBLE = DOUBLE;


  const DOUBLE_ARRAY = getArrayClass(DOUBLE);
  exports.DOUBLE_ARRAY = DOUBLE_ARRAY;


  const BOOLEAN = java.lang.Boolean;
  exports.BOOLEAN = BOOLEAN;


  const BOOLEAN_ARRAY = getArrayClass(BOOLEAN);
  exports.BOOLEAN_ARRAY = BOOLEAN_ARRAY;


  const STRING = java.lang.String;
  exports.STRING = STRING;


  const STRING_ARRAY = getArrayClass(STRING);
  exports.STRING_ARRAY = STRING_ARRAY;


  const OBJECT = java.lang.Object;
  exports.OBJECT = OBJECT;


  const OBJECT_ARRAY = getArrayClass(OBJECT);
  exports.OBJECT_ARRAY = OBJECT_ARRAY;


  const CLASS = java.lang.Class;
  exports.CLASS = CLASS;


  const CLASS_ARRAY = getArrayClass(CLASS);
  exports.CLASS_ARRAY = CLASS_ARRAY;


  /* <---------- arc ----------> */


  const POINT2_ARRAY = getArrayClass(Point2);
  exports.POINT2_ARRAY = POINT2_ARRAY;


  const VEC2_ARRAY = getArrayClass(Vec2);
  exports.VEC2_ARRAY = VEC2_ARRAY;


  const VEC3_ARRAY = getArrayClass(Vec2);
  exports.VEC3_ARRAY = VEC3_ARRAY;
