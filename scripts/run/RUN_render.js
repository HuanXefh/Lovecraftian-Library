/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const DB_env = require("lovec/db/DB_env");


  /* <---------- base ----------> */


  let noiseArgs = null;


  function _noiseArgs() {
    return DB_env.db["param"]["map"]["noise"].read(PARAM.mapCur, null);
  };


  function drawNoise() {
    if(Vars.state.isMenu() || noiseArgs == null) return;

    let tex = VARGEN.noiseTexs[noiseArgs[0]];
    if(tex == null) return;

    Draw.z(Layer.weather - 0.9);
    let i = 0;
    let iCap = noiseArgs.iCap();
    while(i < iCap) {
      Weather.drawNoise(tex, noiseArgs[i + 1], noiseArgs[i + 2], noiseArgs[i + 3], noiseArgs[i + 4], noiseArgs[i + 5], noiseArgs[i + 6], noiseArgs[i + 7], noiseArgs[i + 8]);
      i += 9;
    };
    Draw.reset();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onWorldLoadStart(() => {


    MDL_ui._d_fade(0.0, Color.black, 0.0, 2.0, 0.5);


  }, 49221025);


  MDL_event._c_onWorldLoad(() => {


    Time.run(60.0, () => {
      noiseArgs = _noiseArgs();
    });


  }, 95111687);


  MDL_event._c_onDraw(() => {

    drawNoise();

  }, 7792273);
