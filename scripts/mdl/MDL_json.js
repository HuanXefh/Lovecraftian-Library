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
   * This method only supports pure json files with only primitive values (no array).
   * ---------------------------------------- */
  const parse = function(fi0jsonStr) {
    return VAR.jsonReader.parse(fi0jsonStr);
  };
  exports.parse = parse;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns json value of a json or hjson file.
   * ---------------------------------------- */
  const parseEx = function(fi) {
    const thisFun = parseEx;

    if(fi == null || !fi.exists()) return null;

    let jsonStr = fi.readString("UTF-8");
    if(fi.extension() === "json") jsonStr = jsonStr.replace("#", "\\#");

    return VAR.json.fromJson(null, Jval.read(jsonStr).toString(Jval.Jformat.plain));
  };
  exports.parseEx = parseEx;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes json string/object to {fi}.
   * Note that there should be primitive values only.
   * ---------------------------------------- */
  const write = function(fi, json_gn) {
    if(fi == null || json_gn == null) return;

    var str = (typeof json_gn === "string") ? json_gn : JSON.stringify(json_gn);
    fi.writeString(str);
  };
  exports.write = write;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a sub-json value.
   * ---------------------------------------- */
  const fetch = function(jsonVal, keys_p, noConvert, arrMode) {
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

        case "array" :
          if(arrMode === "number") {
            tmpVal = tmpJsonVal.asDoubleArray();
          } else if(arrMode === "string") {
            tmpVal = tmpJsonVal.asStringArray();
          } else {
            tmpVal = tmpJsonVal;
          };
          break;

        default :
          tmpVal = tmpJsonVal;

      };
    };

    return tmpVal;
  };
  exports.fetch = fetch;
