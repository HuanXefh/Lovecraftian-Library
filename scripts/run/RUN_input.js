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


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- listener ----------> */


  function evComp_update_dropLoot(unit) {
    if(!PARAM.modded || unit == null) return;
    if(!Core.input.keyTap(Binding.respawn)) return;

    Vars.net.client() ?
      MDL_call.spawnLootClient(unit.x, unit.y, unit.item(), unit.stack.amount, 0.0) :
      MDL_call.spawnLoot(unit.x, unit.y, unit.item(), unit.stack.amount, 0.0);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onUpdate(() => {


    let unit_pl = Vars.player.unit();
    let t_pl = MDL_pos._tMouse();


    evComp_update_dropLoot(unit_pl);


  }, 70216990);
