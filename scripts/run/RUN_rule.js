/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up current map rules.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_env = require("lovec/db/DB_env");


  /* <---------- base ----------> */


  let rules = null;
  let nmMapCur = "";
  let hasInit = false;
  let hasWe = false;


  function comp_init() {
    rules = Vars.state.rules;
    hasWe = false;

    hasInit = true;
  };


  function comp_updateBase() {
    let nmMap = PARAM.mapCur == null || Vars.state.isMenu() ?
      "" :
      PARAM.mapCur.plainName();

    if(nmMap !== nmMapCur) {
      hasInit = false;
      nmMapCur = nmMap;
    };

    if(!hasInit) comp_init();
  };


  function comp_updateWeather() {
    if(hasWe || !Vars.state.isGame() || Vars.state.isEditor() || PARAM.mapCur == null) return;

    let nmWeas = DB_env.db["param"]["map"]["we"].read(PARAM.mapCur.plainName(), Array.air);
    if(nmWeas.length > 0) {
      Groups.weather.clear();
      
      let weSeq = new Seq();
      nmWeas.forEach(nmWea => {
        let we = VARGEN.wes[nmWea];
        if(we == null) {
          Log.warn("[LOVEC] Invalid weather name: " + nmWea);
        } else {
          weSeq.add(we);
        };
      });
      rules.weather = weSeq;
    };

    hasWe = true;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onUpdate(() => {

    comp_updateBase();
    comp_updateWeather();

  }, 72663182);
