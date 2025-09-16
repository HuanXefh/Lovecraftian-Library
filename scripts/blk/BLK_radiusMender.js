/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla mender, but heal numbers are shown.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * MendProjector
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["param"]["cep"]["use"]    // @PARAM
   * DB_block.db["param"]["heal"]["amount"]    // @PARAM: Heal amount for units.
   * DB_block.db["param"]["heal"]["percent"]    // @PARAM: Heal percent for units.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseProjector");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_text = require("lovec/mdl/MDL_text");


  const TP_stat = require("lovec/tp/TP_stat");


  const DB_block = require("lovec/db/DB_block");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.remove(Stat.repairTime);
    blk.stats.remove(Stat.range);

    blk.stats.add(TP_stat.blk0misc_repairAmt, MDL_text._healText(
      0.0,
      blk.healPercent / 100.0,
    ));
    blk.stats.add(TP_stat.blk0misc_unitRepairAmt, MDL_text._healText(
      DB_block.db["param"]["heal"]["amount"].read(blk.name, 0.0),
      DB_block.db["param"]["heal"]["percent"].read(blk.name, 0.0),
    ));
    blk.stats.add(TP_stat.blk0misc_repairR, blk.range / Vars.tilesize, StatUnit.blocks);
    blk.stats.add(TP_stat.blk0misc_repairIntv, blk.reload / 60.0, StatUnit.seconds);
  };


  function comp_created(b) {
    b.unitHealAmt = DB_block.db["param"]["heal"]["amount"].read(b.block.name, 0.0);
    b.unitHealPerc = DB_block.db["param"]["heal"]["percent"].read(b.block.name, 0.0);
  };


  function comp_updateTile(b) {
    var cond = !b.checkSuppression();

    b.smoothEfficiency = Mathf.lerpDelta(b.smoothEfficiency, b.efficiency, 0.08);
    b.heat = Mathf.lerpDelta(b.heat, cond && b.efficiency > 0.0 ? 1.0 : 0.0, 0.08);
    b.charge += b.heat * b.delta();
    b.phaseHeat = Mathf.lerpDelta(b.phaseHeat, b.optionalEfficiency, 0.1);

    if(b.optionalEfficiency > 0.0 && b.timer.get(b.block.timerUse, b.block.useTime) && cond) b.consume();

    if(b.charge > b.block.reload && cond) {
      b.charge = 0.0;

      let rad = b.block.range + b.phaseHeat * b.block.phaseRangeBoost;
      MDL_pos._it_bs(b.x, b.y, rad, b.team, ob => MDL_cond._canHeal(ob), ob => {
        FRAG_attack.heal(ob, ob.maxHealth * (b.block.healPercent + b.phaseHeat * b.block.phaseBoost) / 100.0 * b.efficiency, true);
      });

      if(b.unitHealAmt > 0.0 || b.unitHealPerc > 0.0) {
        MDL_pos._it_units(b.x, b.y, rad, b.team, ounit => MDL_cond._canHeal(ounit), ounit => {
          if(FRAG_attack.heal(ounit, (ounit.maxHealth * (b.unitHealPerc + b.phaseHeat * b.block.phaseBoost / 100.0) + b.unitHealAmt) * b.efficiency)) {
            MDL_effect.showBetween_line(b.x, b.y, null, ounit, Pal.heal);
          };
        });
      };
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- block ----------> */


    init: function(blk) {
      PARENT.init(blk);
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
      comp_setStats(blk);
    },


    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT.created(b);
      comp_created(b);
    },


    onDestroyed: function(b) {
      PARENT.onDestroyed(b);
    },


    // @NOSUPER
    updateTile: function(b) {
      PARENT.updateTile(b);
      comp_updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    /* <---------- build (specific) ----------> */


    updateEfficiencyMultiplier: function(b) {
      PARENT.updateEfficiencyMultiplier(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-proj", "blk-mend"],
    }),


    /* <---------- build (extended) ----------> */


  };


  TEMPLATE._std = function() {
    return {
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      drawPlace(tx, ty, rot, valid) {
        this.super$drawPlace(tx, ty, rot, valid);
        TEMPLATE.drawPlace(this, tx, ty, rot, valid);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  TEMPLATE._std_b = function(useCep) {
    return {
      useCep: Object.val(useCep, false),
      unitHealAmt: 0.0, unitHealPerc: 0.0,
      created() {
        this.super$created();
        TEMPLATE.created(this);
      },
      onDestroyed() {
        this.super$onDestroyed();
        TEMPLATE.onDestroyed(this);
      },
      updateTile() {
        TEMPLATE.updateTile(this);
      },
      onProximityUpdate() {
        this.super$onProximityUpdate();
        TEMPLATE.onProximityUpdate(this);
      },
      draw() {
        this.super$draw();
        TEMPLATE.draw(this);
      },
      drawSelect() {
        this.super$drawSelect();
        TEMPLATE.drawSelect(this);
      },
      updateEfficiencyMultiplier() {
        this.super$updateEfficiencyMultiplier();
        TEMPLATE.updateEfficiencyMultiplier(this);
      },
    };
  };


  module.exports = TEMPLATE;
