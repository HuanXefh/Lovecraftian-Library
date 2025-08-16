/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Status effects that is mainly applied by liquids.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * StatusEffect
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * sta.burstTime: f    // @PARAM: Time beyond which the unit gets damaged and the effect is removed. Set to {0.0} to disable burst.
   * sta.burstDamage: f    // @PARAM: Damage dealt when the effect bursts.
   * sta.burstDamagePerc: frac    // @PARAM: Damage dealt by ratio of max health.
   * sta.burstScr: unit => {...}    // @PARAM: Script called when the effect bursts.
   * sta.burstEff: eff    // @PARAM: Effect shown when status effect bursts.
   * sta.burstEffColor: color    // @PARAM: Color for {burstEff}.
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * !NOTHING
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/sta/STA_baseStatus");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(sta) {
    if(sta.burstTime > 0.0) sta.stats.add(TP_stat.sta_burstTime, sta.burstTime / 60.0, StatUnit.seconds);
    if(sta.burstDamage > 0.0) sta.stats.add(TP_stat.sta_burstDmg, MDL_text._dmgText(sta.burstDamage, sta.burstDamagePerc));
  };


  function comp_update(sta, unit, time) {
    if(sta.burstTime < 0.0001) return;

    if(TIMER.timerState_stackSta) {
      let t = unit.tileOn();
      if(t != null) {
        let flr = t.floor();
        let puddle = Puddles.get(t);
        if(((flr.status === sta && flr.statusDuration > 0.0) || (puddle != null && puddle.liquid.effect === sta)) && MDL_cond._isOnFloor(unit)) unit.apply(sta, time + VAR.time_stackStaExtDef * (flr.shallow ? 1.0 : 2.5));
      };
    };

    if(time > sta.burstTime) {
      let dmg = sta.burstDamage + unit.maxHealth * sta.burstDamagePerc;

      unit.unapply(sta);
      FRAG_attack.damage(unit, dmg, true);
      sta.burstScr(unit);
      sta.burstEff.at(unit.x, unit.y, unit.type.hitSize * 1.1, sta.burstEffColor);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- status ----------> */


    init: function(sta) {
      PARENT.init(sta);
    },


    setStats: function(sta) {
      PARENT.setStats(sta);
      comp_setStats(sta);
    },


    update: function(sta, unit, time) {
      PARENT.update(sta, unit, time);
      comp_update(sta, unit, time);
    },


    /* <---------- status (specific) ----------> */


    /* <---------- status (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


    // @NOSUPER
    ex_isStackSta: function(sta) {
      return sta.burstTime > 0.0;
    },


    // @NOSUPER
    ex_getBurstTime: function(sta) {
      return sta.burstTime;
    },


  };
