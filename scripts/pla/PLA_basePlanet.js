/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Root of all planets.
   * ----------------------------------------
   * IMPORTANT:
   *
   * Don't put Json files under "content/planets", as they will always create new planets and cause name conflict (and loading error).
   * You should put them under "scripts/auxFi/json/planets".
   * Mod name prefix is required in the file (not file name).
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * !NOTHING
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const JAVA = require("lovec/glb/GLB_java");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_file = require("lovec/mdl/MDL_file");
  const MDL_json = require("lovec/mdl/MDL_json");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- planet ----------> */


    load: function(pla) {

    },


    init: function(pla) {

    },


    /* <---------- planet (specific) ----------> */


    /* <---------- planet (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


  };


  TEMPLATE.init = function(pla) {
    // I have to do this since a .json file always causes a new planet to be created
    let dir = MDL_file._script(MDL_content._mod(pla)).child("auxFi").child("json").child("planets");
    let fi = (function() {
      let tmp = dir.child(MDL_content._nmCtNoPrefix(pla) + ".json");
      return tmp.exists() ? tmp : dir.child(MDL_content._nmCtNoPrefix(pla) + ".hjson");
    })();
    let jsonVal = MDL_json.parse(fi);
    if(jsonVal == null || jsonVal.isString()) return;
    let parser = VAR.ctParser;
    let locate = (ctTp, nm) => Reflect.invoke(ContentParser, parser, "locate", [ctTp, nm], [ContentType, JAVA.STRING]);
    let read = runnable => Reflect.invoke(ContentParser, parser, "read", [runnable], [JAVA.RUNNABLE]);
    let readFields = (obj, jVal) => Reflect.invoke(ContentParser, parser, "readFields", [obj, jVal], [JAVA.OBJECT, JsonValue]);
    let parseMesh = (pla1, jVal) => Reflect.invoke(ContentParser, parser, "parseMesh", [pla1, jVal], [Planet, JsonValue]);

    pla.parent = locate(ContentType.planet, jsonVal.getString("parent", ""));
    jsonVal.remove("parent");

    if(jsonVal.has("mesh")) {
      let mesh = jsonVal.get("mesh");
      if(!mesh.isObject() && !mesh.isArray()) throw new Error("Error loading mesh for " + pla);
      jsonVal.remove("mesh");
      pla.meshLoader = prov(() => {
        try {
          return parseMesh(pla, mesh);
        } catch(err) {
          Log.err(err);
          return new ShaderSphereMesh(pla, Shaders.unlit, 2);
        };
      });
    };

    if(jsonVal.has("cloudMesh")) {
      let mesh = jsonVal.get("cloudMesh");
      if(!mesh.isObject() && !mesh.isArray()) throw new Error("Error loading cloud mesh for " + pla);
      jsonVal.remove("cloudMesh");
      pla.cloudMeshLoader = prov(() => {
        try {
          return parseMesh(pla, mesh);
        } catch(err) {
          Log.err(err);
          return null;
        };
      });
    };

    Reflect.set(ContentParser, parser, "currentContent", pla);
    read(run(() => readFields(pla, jsonVal)));

    pla.orbitTime = Mathf.pow(pla.orbitRadius, 1.5) * 1000.0;
    if(pla.parent != null) {
      pla.parent.children.add(pla);
      pla.parent.updateTotalRadius();
    };

    if(pla.sectors.size === 0) pla.sectors.add(new Sector(pla, PlanetGrid.Ptile.empty));
  };


  module.exports = TEMPLATE;
