/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MATH_geometry = require("lovec/math/MATH_geometry");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  const comp_update_damaged = function(utp, unit) {
    if(!TIMER.timerState_unit || !Mathf.chance(VAR.p_unitUpdateP)) return;

    const healthFrac = Mathf.clamp(unit.health / unit.maxHealth);
    const staDur = VAR.time_unitStaDef;

    if(MDL_content._isNonRobot(utp)) {

      let sta1 = Vars.content.statusEffect("loveclab-sta-slightly-injured");
      let sta2 = Vars.content.statusEffect("loveclab-sta-injured");
      let sta3 = Vars.content.statusEffect("loveclab-sta-heavily-injured");

      if(healthFrac < 0.25) {unit.apply(sta3, staDur); unit.unapply(sta1); unit.unapply(sta2)}
      else if(healthFrac < 0.5) {unit.apply(sta2, staDur); unit.unapply(sta1); unit.unapply(sta3)}
      else if(healthFrac < 0.75) {unit.apply(sta1, staDur); unit.unapply(sta2); unit.unapply(sta3)}
      else {unit.unapply(sta1); unit.unapply(sta2); unit.unapply(sta3)};

    } else {

      let sta1 = Vars.content.statusEffect("loveclab-sta-damaged");
      let sta2 = Vars.content.statusEffect("loveclab-sta-severely-damaged");

      if(healthFrac < 0.25) {unit.apply(sta2, staDur); unit.unapply(sta1)}
      else if(healthFrac < 0.5) {unit.apply(sta1, staDur); unit.unapply(sta2)}
      else {unit.unapply(sta1); unit.unapply(sta2)};

    };
  };
  exports.comp_update_damaged = comp_update_damaged;


  const comp_update_surrounding = function(utp, unit) {
    if(!TIMER.timerState_unit || !Mathf.chance(VAR.p_unitUpdateP)) return;

    const t = unit.tileOn();
    if(t == null) return;
    const ts = MDL_pos._tsDstManh(t, VAR.r_unitSurRange, true);
    const staDur = VAR.time_unitStaDef;

    // Floor
    if(MDL_cond._isOnFloor(unit)) {

    };

    // Range
    ts.forEach(ot => {


      // Param
      let dst = MATH_geometry._dst(ot.worldx(), ot.worldy(), unit.x, unit.y);
      let oblk = ot.block();
      let ob = ot.build;


      // Tree
      if(MDL_cond._isCoverable(unit, true) && MDL_cond._isTreeBlock(oblk)) {
        if(dst < oblk.region.width * VAR.rad_treeScl) {
          if(oblk.ex_getHidable()) unit.apply(Vars.content.statusEffect("loveclab-sta-hidden-well"), staDur);
          oblk.drawBase(ot);
        };
      };


      // Block status
      VARGEN.blkStas.forEach(sta => {
        if(sta.ex_canApply(unit, ts)) unit.apply(sta, staDur);
      });


    });

    ts.clear();
  };
  exports.comp_update_surrounding = comp_update_surrounding;


  const comp_update_heat = function(utp, unit) {
    // TODO
  }
  .setTodo("Unit heat update.");
  exports.comp_update_heat = comp_update_heat;
