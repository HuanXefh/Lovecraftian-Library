/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns json value of the file or json string.
   * ---------------------------------------- */
  const parse = function(json_gn) {
    return VAR.jsonReader.parse(json_gn);
  };
  exports.parse = parse;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a sub-json value.
   * ---------------------------------------- */
  const fetch = function(jsonVal, keys_p, noConvert) {
    let tmpJsonVal;
    if(!(keys_p instanceof Array)) {tmpJsonVal = jsonVal.get(keys_p)} else {
      tmpJsonVal = jsonVal;
      for(let key of keys_p) {
        if(tmpJsonVal != null) tmpJsonVal = tmpJsonVal.get(key);
      };
    };

    if(noConvert) return tmpJsonVal;

    let tmpVal;
    if(tmpJsonVal == null) {tmpVal = tmpJsonVal} else {
      switch(tmpJsonVal.type().toString()) {

        case "doubleValue" :
          tmpVal = tmpJsonVal.asDouble();
          break;

        case "longValue" :
          tmpVal = tmpJsonVal.asLong();
          break;

        case "booleanValue" :
          tmpVal = tmpJsonVal.asBoolean();
          break;

        case "stringValue" :
          tmpVal = tmpJsonVal.asString();
          break;

        default :
          tmpVal = tmpJsonVal;

      };
    };

    return tmpVal;
  };
  exports.fetch = fetch;
