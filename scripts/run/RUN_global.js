/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Adds some methods to {global} so you can use them in game, if you know how to use console.
   * Can be used to avoid module coupling.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");
  const COMP = require("lovec/glb/BOX_comp");
  const NOISE = require("lovec/glb/BOX_noise");
  const TRIGGER = require("lovec/glb/BOX_trigger");
  const EFF = require("lovec/glb/GLB_eff");
  const JAVA = require("lovec/glb/GLB_java");
  const PARAM = require("lovec/glb/GLB_param");
  const SAVE = require("lovec/glb/GLB_save");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const CLS_matrix = require("lovec/cls/math/CLS_matrix");
  const CLS_tree = require("lovec/cls/struct/CLS_tree");
  const CLS_window = require("lovec/cls/ui/CLS_window");


  const MATH_function = require("lovec/math/MATH_function");
  const MATH_geometry = require("lovec/math/MATH_geometry");
  const MATH_interp = require("lovec/math/MATH_interp");
  const MATH_probability = require("lovec/math/MATH_probability");
  const MATH_statistics = require("lovec/math/MATH_statistics");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");
  const FRAG_item = require("lovec/frag/FRAG_item");
  const FRAG_unit = require("lovec/frag/FRAG_unit");


  const MDL_backend = require("lovec/mdl/MDL_backend");
  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_file = require("lovec/mdl/MDL_file");
  const MDL_java = require("lovec/mdl/MDL_java");
  const MDL_json = require("lovec/mdl/MDL_json");
  const MDL_market = require("lovec/mdl/MDL_market");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_reaction = require("lovec/mdl/MDL_reaction");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_test = require("lovec/mdl/MDL_test");
  const MDL_text = require("lovec/mdl/MDL_text");
  const MDL_texture = require("lovec/mdl/MDL_texture");
  const MDL_ui = require("lovec/mdl/MDL_ui");
  const MDL_util = require("lovec/mdl/MDL_util");


  const TP_ability = require("lovec/tp/TP_ability");
  const TP_ai = require("lovec/tp/TP_ai");
  const TP_attr = require("lovec/tp/TP_attr");
  const TP_cacheLayer = require("lovec/tp/TP_cacheLayer");
  const TP_cons = require("lovec/tp/TP_cons");
  const TP_dial = require("lovec/tp/TP_dial");
  const TP_drawer = require("lovec/tp/TP_drawer");
  const TP_effect = require("lovec/tp/TP_effect");
  const TP_shader = require("lovec/tp/TP_shader");
  const TP_sortF = require("lovec/tp/TP_sortF");
  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");
  const DB_env = require("lovec/db/DB_env");
  const DB_fluid = require("lovec/db/DB_fluid");
  const DB_item = require("lovec/db/DB_item");
  const DB_misc = require("lovec/db/DB_misc");
  const DB_status = require("lovec/db/DB_status");
  const DB_unit = require("lovec/db/DB_unit");


  const MOD_tmi = require("lovec/mod/MOD_tmi");


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onLoad(() => {


    global.lovec = {


      anno: ANNO,
      comp: COMP,
      noise: NOISE,
      trigger: TRIGGER,
      eff: EFF,
      java: JAVA,
      param: PARAM,
      save: SAVE,
      timer: TIMER,
      var: VAR,
      varGen: VARGEN,


      cls_matrix: CLS_matrix,
      cls_tree: CLS_tree,
      cls_window: CLS_window,


      math_function: MATH_function,
      math_geometry: MATH_geometry,
      math_interp: MATH_interp,
      math_probability: MATH_probability,
      math_statistics: MATH_statistics,


      frag_attack: FRAG_attack,
      frag_faci: FRAG_faci,
      frag_fluid: FRAG_fluid,
      frag_item: FRAG_item,
      frag_unit: FRAG_unit,


      mdl_backend: MDL_backend,
      mdl_call: MDL_call,
      mdl_color: MDL_color,
      mdl_cond: MDL_cond,
      mdl_content: MDL_content,
      mdl_draw: MDL_draw,
      mdl_effect: MDL_effect,
      mdl_entity: MDL_entity,
      mdl_file: MDL_file,
      mdl_java: MDL_java,
      mdl_json: MDL_json,
      mdl_market: MDL_market,
      mdl_pos: MDL_pos,
      mdl_reaction: MDL_reaction,
      mdl_recipe: MDL_recipe,
      mdl_recipeDict: MDL_recipeDict,
      mdl_test: MDL_test,
      mdl_text: MDL_text,
      mdl_texture: MDL_texture,
      mdl_ui: MDL_ui,
      mdl_util: MDL_util,


      tp_ability: TP_ability,
      tp_ai: TP_ai,
      tp_attr: TP_attr,
      tp_cacheLayer: TP_cacheLayer,
      tp_cons: TP_cons,
      tp_dial: TP_dial,
      tp_drawer: TP_drawer,
      tp_effect: TP_effect,
      tp_shader: TP_shader,
      tp_sortF: TP_sortF,
      tp_stat: TP_stat,


      db_block: DB_block,
      db_env: DB_env,
      db_fluid: DB_fluid,
      db_item: DB_item,
      db_misc: DB_misc,
      db_status: DB_status,
      db_unit: DB_unit,


      mod_tmi: MOD_tmi,


      modded: PARAM.modded,


    };


    global.lovec.print = {


      printLiq(tx, ty) {
        MDL_test._i_liq(tx, ty);
      },


      printCep(team) {
        if(!Vars.state.isGame()) {
          MDL_test._w_notInGame();
          return;
        };

        if(team == null) team = Vars.player.team();
        Log.info(
          "[LOVEC] CEP stats for " + team.toString().color(team.color)
            + "\n- CEP provided: " + Strings.fixed(FRAG_faci._cepCapCur(team), 2)
            + "\n- CEP used: " + Strings.fixed(FRAG_faci._cepUseCur(team), 2)
            + "\n- CEP fraction: " + FRAG_faci._cepFracCur(team).perc()
            + "\n- CEP efficiency: " + FRAG_faci._cepEffcCur(team).perc()
        );
      },


    };


    Time.run(1.0, () => {
      MDL_event._c_onDraw(() => {
        if(drawTest.enabled) drawTest.draw();
      });
    });


  }, 75112593);
