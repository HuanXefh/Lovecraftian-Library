/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const EFF = require("lovec/glb/GLB_eff");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  const comp_update_damaged = function(utp, unit) {
    if(!TIMER.timerState_unit || !Mathf.chance(VAR.p_unitUpdateP)) return;

    let healthFrac = Mathf.clamp(unit.health / unit.maxHealth);
    let staDur = VAR.time_unitStaDef;

    if(MDL_cond._isNonRobot(utp)) {

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

    let t = unit.tileOn();
    if(t == null) return;
    let ts = MDL_pos._tsDstManh(t, VAR.r_unitSurRange, true);
    let staDur = VAR.time_unitStaDef;

    // Floor
    if(MDL_cond._isOnFloor(unit)) {

    };

    // Range
    ts.forEach(ot => {


      // Param
      let dst = Mathf.dst(ot.worldx(), ot.worldy(), unit.x, unit.y);
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
  };
  exports.comp_update_surrounding = comp_update_surrounding;


  const comp_update_heat = function(utp, unit) {
    if(!TIMER.timerState_unit || !Mathf.chance(VAR.p_unitUpdateP * 0.3)) return;
    if(!MDL_cond._isHeatDamageable(unit)) return;

    let rHeat = MDL_flow._rHeat(unit.tileOn());
    let rHeatRes = MDL_flow._rHeatRes(utp);
    let dmg = Time.delta * Mathf.maxZero(rHeat - rHeatRes) * 0.65;
    if(dmg < 0.0001) return;
    let dmg_fi = Math.min(dmg, VAR.dmg_heatMaxDmg);
    let staStackAmt = Math.round((dmg - dmg_fi) / VAR.dmg_overheatedConversionDmg);

    FRAG_attack.damage(unit, dmg_fi, true, "heat");
    let i = 0;
    while(i < staStackAmt) {
      unit.apply(Vars.content.statusEffect("loveclab-sta0bur-overheated"));
      i++;
    };
    if(Mathf.chance(0.5)) EFF.heatSmog.at(unit);
  }
  .setTodo("Unit heat update.");
  exports.comp_update_heat = comp_update_heat;
