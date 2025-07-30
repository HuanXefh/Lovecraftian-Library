/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles player input.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_util = require("lovec/mdl/MDL_util");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  function setupKeybind() {
    DB_misc.db["keyBind"].forEachRow(3, (nm, keyCode, categ) => {
      VARGEN.__LovecBinding(nm, KeyBind.add(nm, keyCode, categ));
    });
  };


  /* <---------- listener ----------> */


  const listener_setting_toggle = function() {
    const thisFun = listener_setting_toggle;

    let i = 0;
    let iCap = thisFun.funArr.iCap();
    while(i < iCap) {
      if(Core.input.keyTap(VARGEN.LovecBinding[thisFun.funArr[i]])) {
        Core.settings.put("lovec-" + thisFun.funArr[i + 1], !MDL_util._cfg(thisFun.funArr[i + 1]));
        PARAM.forceLoadParam();
      };
      i += 2;
    };
  }
  .setProp({
    "funArr": [
      "lovec-setting-toggle-unit-stat", "unit0stat-show",
      "lovec-setting-toggle-damage-display", "damagedisplay-show",
    ],
  });


  function listener_player_dropLoot(unit) {
    if(!PARAM.modded || Vars.state.isPaused() || unit == null) return;
    if(unit.stack.amount < 1) return;
    if(!Core.input.keyTap(Binding.respawn) && !Core.input.keyTap(VARGEN.LovecBinding["lovec-player-drop-loot"])) return;

    Vars.net.client() ?
      MDL_call.spawnLootClient(unit.x, unit.y, unit.item(), unit.stack.amount, 0.0) :
      MDL_call.spawnLoot(unit.x, unit.y, unit.item(), unit.stack.amount, 0.0);
    unit.clearItem();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  setupKeybind();


  MDL_event._c_onUpdate(() => {


    if(Vars.headless) return;


    let unit_pl = Vars.player.unit();
    let t_pl = MDL_pos._tMouse();


    listener_setting_toggle();
    listener_player_dropLoot(unit_pl);


  }, 70216990);
