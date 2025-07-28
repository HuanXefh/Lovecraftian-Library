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


  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_env = require("lovec/db/DB_env");


  /* <---------- base ----------> */


  const rules = Vars.state.rules;
  let hasInit = false;
  let tmpNmMap = "";
  let hasWe = false;


  function comp_init() {
    hasWe = false;


    if(Vars.state.isGame()) {

      // Weather
      Groups.weather.clear();
      let wes = DB_env.db["param"]["map"]["we"].read(PARAM.mapCur.plainName(), Array.air);
      if(wes.length > 0) rules.weather = wes.toSeq();

    };
  };


  function comp_updateBase() {
    if(PARAM.mapCur == null) return;

    let nmMapCur = PARAM.mapCur.plainName();
    if(Vars.state.isMenu() || nmMapCur !== tmpNmMap) {
      tmpNmMap = nmMapCur;
      hasInit = false;
    };

    if(!hasInit) comp_init();
  };


  function comp_updateWeather() {
    if(PARAM.mapCur == null || hasWe || !Vars.state.isGame()) return;

    let wes = DB_env.db["param"]["map"]["we"].read(PARAM.mapCur.plainName(), Array.air);
    if(wes.length > 0) {
      rules.weather = wes.toSeq();
      Groups.weather.clear();
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
