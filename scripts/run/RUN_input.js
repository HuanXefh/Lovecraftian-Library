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
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_util = require("lovec/mdl/MDL_util");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  function setupKeybind() {
    DB_misc.db["mod"]["keyBind"].forEachRow(3, (nm, keyCode, categ) => {
      VARGEN.__bindings(nm, KeyBind.add(nm, keyCode, categ));
    });
  };


  /* <---------- listener ----------> */


  const evComp_update_settingToggle = function() {
    const thisFun = evComp_update_settingToggle;

    let i = 0;
    let iCap = thisFun.keybindSettingMap.iCap();
    while(i < iCap) {
      if(Core.input.keyTap(VARGEN.bindings[thisFun.keybindSettingMap[i]])) {
        Core.settings.put("lovec-" + thisFun.keybindSettingMap[i + 1], !MDL_util._cfg(thisFun.keybindSettingMap[i + 1]));
        PARAM.forceLoadParam();
      };
      i += 2;
    };
  }
  .setProp({
    keybindSettingMap: [
      "lovec-setting-toggle-win", "window-show",
      "lovec-setting-toggle-unit-stat", "unit0stat-show",
      "lovec-setting-toggle-damage-display", "damagedisplay-show",
    ],
  });


  function evComp_update_playerLoot(unit) {
    if(!PARAM.modded || Vars.state.isPaused() || unit == null) return;

    if(Core.input.keyTap(Binding.respawn) || Core.input.keyTap(VARGEN.bindings["lovec-player-drop-loot"])) {
      DB_misc.db["mod"]["dragButton"]["modded"].read("lovec-player-drop-loot")[3]();
    };

    if(Core.input.keyTap(VARGEN.bindings["lovec-player-take-loot"])) {
      DB_misc.db["mod"]["dragButton"]["modded"].read("lovec-player-take-loot")[3]();
    };
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

    evComp_update_settingToggle();
    evComp_update_playerLoot(unit_pl);

  }, 70216990);
