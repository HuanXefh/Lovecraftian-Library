/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Status effects that can stack up when applied, and finally burst to trigger something.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * StatusEffect
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
  const MDL_text = require("lovec/mdl/MDL_text");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(sta) {
    if(sta.burstTime > 0.0) sta.stats.add(TP_stat.sta_burstTime, sta.burstTime / 60.0, StatUnit.seconds);
    if(sta.burstDamage > 0.0) sta.stats.add(TP_stat.sta_burstDmg, MDL_text._dmgText(sta.burstDamage, sta.burstDamagePerc));
  };


  function comp_update(sta, unit, staEn) {
    if(sta.burstTime < 0.0001) return;

    if(staEn.time > sta.burstTime) {
      let dmg = sta.burstDamage + unit.maxHealth * sta.burstDamagePerc;

      MDL_cond._isHotSta(sta) ?
        FRAG_attack.damage(unit, dmg, true, "heat") :
        FRAG_attack.damage(unit, dmg, true);
      sta.burstScr(unit);
      sta.burstEff.at(unit.x, unit.y, unit.type.hitSize * 1.1, sta.burstEffColor);

      staEn.time = 30.0;
    };
  };


  function comp_applied(sta, unit, time, isExtend) {
    if(sta.justApplied) return;

    sta.justApplied = true;
    unit.apply(sta, time + sta.extendTimeGetter(unit, time));
    sta.justApplied = false;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- status ----------> */


    init: function(sta) {
      PARENT.init(sta);
    },


    setStats: function(sta) {
      PARENT.setStats(sta);
      comp_setStats(sta);
    },


    update: function(sta, unit, staEn) {
      PARENT.update(sta, unit, staEn);
      comp_update(sta, unit, staEn);
    },


    /* <---------- status (specific) ----------> */


    applied: function(sta, unit, time, isExtend) {
      comp_applied(sta, unit, time, isExtend);
    },


    /* <---------- status (extra) ----------> */


    // @NOSUPER
    ex_getTags: function(sta) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: [],
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


  TEMPLATE._std = function(eff, effP, burstTime, extendTimeGetter, burstDmg, burstDmgPerc, burstScr, burstEff, burstEffColor) {
    return {
      justApplied: false, burstTime: Object.val(burstTime, 0.0),
      extendTimeGetter: Object.val(extendTimeGetter, function(unit, time) {}),
      burstDamage: Object.val(burstDmg, 0.0), burstDamagePerc: Object.val(burstDmgPerc, 0.0),
      burstScr: Object.val(burstScr, function(unit) {}),
      burstEff: Object.val(burstEff, Fx.none), burstEffColor: Object.val(burstEffColor, Color.white),
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      update(unit, staEn) {
        this.super$update(unit, staEn);
        TEMPLATE.update(this, unit, staEn);
      },
      applied(unit, time, isExtend) {
        this.super$applied(unit, time, isExtend);
        TEMPLATE.applied(this, unit, time, isExtend);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_isStackSta() {
        return TEMPLATE.ex_isStackSta(this);
      },
      ex_getBurstTime() {
        return TEMPLATE.ex_getBurstTime(this);
      },
      // @SPEC
      effect: Object.val(eff, Fx.none), effectChance: Object.val(effP, 0.02),
    };
  };


  module.exports = TEMPLATE;
