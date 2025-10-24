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


  const MDL_backend = require("lovec/mdl/MDL_backend");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_util = require("lovec/mdl/MDL_util");


  const DB_env = require("lovec/db/DB_env");


  /* <---------- base ----------> */


  let rules = null;
  let nmMapCur = "";
  let hasInit = false;
  let hasWea = false;


  function comp_init() {
    rules = Vars.state.rules;
    hasWea = false;

    hasInit = true;
  };


  function comp_updateBase() {
    if(nmMapCur !== PARAM.mapCur) {
      nmMapCur = PARAM.mapCur;
      hasInit = false;
      PARAM.forceLoadParam();
      Time.run(3.0, () => {
        MDL_backend.setWinTitle(null, "[$1][$2]".format(MDL_util._cfg("misc-title-name"), !MDL_util._cfg("misc-title-map") ? "" : ": [$1]".format(PARAM.mapCur === "" ? "menu" : PARAM.mapCur)));
      });
    };

    if(!hasInit) comp_init();
  };


  function comp_updateWeather() {
    if(hasWea || !Vars.state.isGame() || Vars.state.isEditor()) return;

    let nmWeas = DB_env.db["param"]["map"]["weaEn"].read(PARAM.mapCur, Array.air);
    if(nmWeas.length > 0) {
      Groups.weather.clear();

      let weaEnSeq = new Seq();
      nmWeas.forEachFast(nmWea => {
        let weaEn = VARGEN.weaEns[nmWea];
        if(weaEn == null) {
          Log.warn("[LOVEC] Invalid weather name: " + nmWea);
        } else {
          weaEnSeq.add(weaEn);
        };
      });
      rules.weather = weaEnSeq;
    };

    hasWea = true;
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
