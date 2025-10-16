/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * A tiny mender that repairs the building in front of it.
   * No optional since I don't need it.
   *
   * This can heal enemy blocks, I'm not gonna fix that cauz it's fun.
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
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_text = require("lovec/mdl/MDL_text");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rotate = true;
    blk.lightRadius = 24.0;                   // Well should not be that bright
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.repairTime);
    blk.stats.remove(Stat.range);
    blk.stats.remove(Stat.booster);

    blk.stats.add(TP_stat.blk0misc_repairAmt, MDL_text._healText(
      0.0,
      blk.healPercent / 100.0,
    ));
    blk.stats.add(TP_stat.blk0misc_repairR, blk.range / Vars.tilesize, StatUnit.blocks);
    blk.stats.add(TP_stat.blk0misc_repairIntv, blk.reload / 60.0, StatUnit.seconds);
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw.comp_drawPlace_baseBlock(blk, tx, ty, rot, valid);

    let t = Vars.world.tile(tx, ty);
    if(t == null) return;
    let ot = t.nearby(rot);
    if(ot == null) return;

    MDL_draw.drawRect_normal(ot.worldx(), ot.worldy(), 0, 1, Pal.heal, 1.0, true);
  };


  function comp_created(b) {
    b.sideReg1 = MDL_texture._reg(b.block, "-side1", "-side");
    b.sideReg2 = MDL_texture._reg(b.block, "-side2", "-side");
  };


  function comp_updateTile(b) {
    var cond = !b.checkSuppression();

    // No phase heat since optional is not used
    b.smoothEfficiency = Mathf.lerpDelta(b.smoothEfficiency, b.efficiency, 0.08);
    b.heat = Mathf.lerpDelta(b.heat, cond && b.efficiency > 0.0 ? 1.0 : 0.0, 0.08);
    b.charge += b.heat * b.delta();

    if(b.timer.get(b.block.timerUse, b.block.useTime) && cond) b.consume();

    if(b.charge > b.block.reload && cond) {
      b.charge = 0.0;

      let ob = b.nearby(b.rotation);
      if(ob != null && MDL_cond._canHeal(ob)) {
        FRAG_attack.heal(ob, ob.maxHealth * b.block.healPercent / 100.0 * b.efficiency, true);
      };
    };
  };


  function comp_draw(b) {
    b.drawTeamTop();

    Draw.rect(b.block.region, b.x, b.y);
    Draw.rect(b.rotation < 2 ? b.sideReg1 : b.sideReg2, b.x, b.y, b.drawrot());
    Draw.color(b.block.baseColor);
    Draw.alpha(b.heat * Mathf.absin(Time.time, 50.0 / Mathf.PI2, 1.0) * 0.5);
    Draw.rect(b.block.topRegion, b.x, b.y, b.drawrot());
    Draw.alpha(1.0);
  };


  function comp_drawSelect(b) {
    let ot = b.tile.nearby(b.rotation);
    if(ot == null) return;

    MDL_draw.drawRect_normal(ot.worldx(), ot.worldy(), 0, 1, Pal.heal, 1.0, true);
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
      comp_init(blk);
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
      comp_setStats(blk);
    },


    // @NOSUPER
    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
      comp_drawPlace(blk, tx, ty, rot, valid);
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


    // @NOSUPER
    draw: function(b) {
      PARENT.draw(b);
      comp_draw(b);
    },


    // @NOSUPER
    drawSelect: function(b) {
      PARENT.drawSelect(b);
      comp_drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    // @NOSUPER
    icons: function(blk) {
      return [MDL_texture._reg(blk, "-icon")];
    },


    /* <---------- build (specific) ----------> */


    updateEfficiencyMultiplier: function(b) {
      PARENT.updateEfficiencyMultiplier(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: ["blk-proj", "blk-mend"],
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
        TEMPLATE.drawPlace(this, tx, ty, rot, valid);
      },
      icons() {
        return TEMPLATE.icons(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  TEMPLATE._std_b = function(useCep) {
    return {
      useCep: tryVal(useCep, false),
      sideReg1: null, sideReg2: null,
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
        TEMPLATE.draw(this);
      },
      drawSelect() {
        TEMPLATE.drawSelect(this);
      },
      updateEfficiencyMultiplier() {
        this.super$updateEfficiencyMultiplier();
        TEMPLATE.updateEfficiencyMultiplier(this);
      },
    };
  };


  module.exports = TEMPLATE;
