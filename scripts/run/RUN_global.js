/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Adds some methods to {global} so you can use them in game, if you know how to use console.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");
  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const CLS_matrix = require("lovec/cls/math/CLS_matrix");


  const MATH_base = require("lovec/math/MATH_base");
  const MATH_geometry = require("lovec/math/MATH_geometry");
  const MATH_probability = require("lovec/math/MATH_probability");
  const MATH_statistics = require("lovec/math/MATH_statistics");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");
  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_file = require("lovec/mdl/MDL_file");
  const MDL_json = require("lovec/mdl/MDL_json");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_test = require("lovec/mdl/MDL_test");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const TP_dial = require("lovec/tp/TP_dial");
  const TP_effect = require("lovec/tp/TP_effect");
  const TP_table = require("lovec/tp/TP_table");


  const DB_block = require("lovec/db/DB_block");
  const DB_env = require("lovec/db/DB_env");
  const DB_fluid = require("lovec/db/DB_fluid");
  const DB_item = require("lovec/db/DB_item");
  const DB_misc = require("lovec/db/DB_misc");
  const DB_status = require("lovec/db/DB_status");
  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- tool ----------> */


  let propListenerState = false;
  const propListenerTimer = new Interval(1);
  let propListenerIntv = 120.0;
  let propListenerGetter = null;
  let propListenerInd = 1;


  let drawTesterState = false;
  let drawTesterXGetter = () => Vars.player.unit() == null ? 0.0 : Vars.player.unit().x;
  let drawTesterYGetter = () => Vars.player.unit() == null ? 0.0 : Vars.player.unit().y;
  let drawTesterDrawF = () => {};


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onLoad(() => {
    global.lovec = {


      anno: ANNO,
      eff: EFF,
      param: PARAM,
      var: VAR,
      varGen: VARGEN,


      cls_matrix: CLS_matrix,


      math_base: MATH_base,
      math_geometry: MATH_geometry,
      math_probability: MATH_probability,
      math_statistics: MATH_statistics,


      frag_attack: FRAG_attack,
      frag_faci: FRAG_faci,
      frag_fluid: FRAG_fluid,
      frag_item: FRAG_item,


      mdl_call: MDL_call,
      mdl_cond: MDL_cond,
      mdl_content: MDL_content,
      mdl_draw: MDL_draw,
      mdl_file: MDL_file,
      mdl_json: MDL_json,
      mdl_effect: MDL_effect,
      mdl_recipe: MDL_recipe,
      mdl_ui: MDL_ui,


      tp_dial: TP_dial,
      tp_effect: TP_effect,
      tp_table: TP_table,


      db_block: DB_block,
      db_env: DB_env,
      db_fluid: DB_fluid,
      db_item: DB_item,
      db_misc: DB_misc,
      db_status: DB_status,
      db_unit: DB_unit,


      print: {


        printLiq(tx, ty) {
          MDL_test._i_liq(tx, ty);
        },


        printCep(team) {
          if(!Vars.state.isGame()) {
            MDL_test._i_notInGame();
            return;
          };

          if(team == null) team = Vars.player.team();
          Log.info(
            "[LOVEC] CEP stats for " + team.toString().color(team.color)
              + "\n- CEP provided: " + Strings.fixed(FRAG_faci._cepCapCur(team), 2)
              + "\n- CEP used: " + Strings.fixed(FRAG_faci._cepUseCur(team), 2)
              + "\n- CEP fraction: " + Number(FRAG_faci._cepFracCur(team)).perc()
              + "\n- CEP efficiency: " + Number(FRAG_faci._cepEffcCur(team)).perc()
          );
        },


      },


      tool: {


        propListener: {


          setState(bool) {
            propListenerState = Boolean(bool);

            propListenerInd = 1;
          },


          setProp(propGetter) {
            propListenerGetter = null;
            if(propGetter != null && propGetter instanceof Function) propListenerGetter = propGetter;

            propListenerInd = 1;
          },


          setInterval(time) {
            propListenerIntv = Mathf.clamp(time, 6.0, 600.0);
            if(isNaN(propListenerIntv)) propListenerIntv = 120.0;

            propListenerInd = 1;
          },


        },


        drawTester: {


          setState(bool) {
            drawTesterState = Boolean(bool);
          },


          setGetter(xGetter, yGetter) {
            if(xGetter != null) drawTesterXGetter = xGetter;
            if(yGetter != null) drawTesterYGetter = yGetter;
          },


          setDrawF(drawF) {
            drawTesterDrawF = drawF;
          },


        },


        timeControl(param) {
          var timeScl = Number(param);
          // NOTE: Too large {timeScl} will BREAK your save forever.
          if(isNaN(timeScl) || timeScl < 0.0 || timeScl > 50.0) {
            MDL_test._i_invalidArgs();
            return;
          };

          Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0 * timeScl);
          MDL_test._i_timeControl(timeScl);
        },


        cheat() {
          Core.scene.add(TP_table._winDial("NOPE", tb => {
            tb.add("[red]Just no way.[]");
          }));

          Log.info("[LOVEC] Nice try :)");
        },


      },


    };
  }, 75112593);


  MDL_event._c_onUpdate(() => {


    // Property listener
    if(propListenerState && propListenerGetter != null && propListenerTimer.get(propListenerIntv)) {
      let prop = propListenerGetter();
      if(prop instanceof Array) {

        let str = "[LOVEC] Property listener (" + propListenerInd + "): [accent](";
        for(let ele of prop) {
          str += String(ele) + ", ";
        };
        str += ")[]";

        Log.info(str);

      } else {
        Log.info("[LOVEC] Property listener (" + propListenerInd + "): " + String(prop).color(Pal.accent));
      };

      propListenerInd++;
    };


  }, 62543995);


  MDL_event._c_onDraw(() => {


    // Draw tester
    if(drawTesterState) {
      try {
        drawTesterDrawF(drawTesterXGetter(), drawTesterYGetter());
      } catch(err) {
        drawTesterDrawF = () => {};
        drawTesterState = false;
        Log.info("[LOVEC] " + "Draw tester ended due to error:".color(Pal.remove) + "\n" + err);
      };
    };


  }, 75111268);
