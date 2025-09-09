/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");


  const MDL_file = require("lovec/mdl/MDL_file");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns json value of a json or hjson file.
   * ---------------------------------------- */
  const parse = function(fi) {
    if(fi == null || !fi.exists()) return null;

    let jsonStr = fi.readString("UTF-8");
    if(fi.extension() === "json") jsonStr = jsonStr.replace("#", "\\#");

    return VAR.json.fromJson(null, Jval.read(jsonStr).toString(Jval.Jformat.plain));
  };
  exports.parse = parse;


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
    if(!(keys_p instanceof Array)) {
      tmpJsonVal = jsonVal.get(keys_p);
    } else {
      tmpJsonVal = jsonVal;
      for(let key of keys_p) {
        if(tmpJsonVal != null) tmpJsonVal = tmpJsonVal.get(key);
      };
    };
    if(noConvert) return tmpJsonVal;

    let tmpVal;
    if(tmpJsonVal == null) {
      tmpVal = tmpJsonVal
    } else {
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
          // NOTE: I have to convert it to js array, or the game somehow converts it to object after saving 3 times, WTF.
          if(arrMode === "number") {
            tmpVal = tmpJsonVal.asDoubleArray().slice();
          } else if(arrMode === "string") {
            tmpVal = tmpJsonVal.asStringArray().slice();
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


  /* ----------------------------------------
  * NOTE:
  *
  * Returns json value of json file of the content.
  *
  * Don't do extra json fields.
  * It's possible to write extra fields in the json file but the game's gonna warn you a lot in the console.
  * ---------------------------------------- */
  const _jsonVal_ct = function(ct_gn) {
    return parse(MDL_file._json_ct(ct_gn));
  };
  exports._jsonVal_ct = _jsonVal_ct;
