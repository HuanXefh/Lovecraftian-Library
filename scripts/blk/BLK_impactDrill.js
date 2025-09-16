/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla burst drills.
   * Can mine depth ore if there's an active ore scanner nearby.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * BurstDrill
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


  const PARENT = require("lovec/blk/BLK_baseDrill");
  const TIMER = require("lovec/glb/GLB_timer");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk_impactR, blk.impactR, StatUnit.blocks);
    blk.stats.add(TP_stat.blk0min_depthMtp, blk.depthMtp.perc(2));
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw.comp_drawPlace_baseBlock(blk, tx, ty, rot, valid);

    MDL_draw.drawPulse_circle(tx * Vars.tilesize + blk.offset, ty * Vars.tilesize + blk.offset, blk.impactR * Vars.tilesize);

    let t = Vars.world.tile(tx, ty);
    if(t == null) return;

    Reflect.invoke(Drill, blk, "countOre", [t], [Tile]);
    let returnItm = Reflect.get(Drill, blk, "returnItem");
    let returnCount = Reflect.get(Drill, blk, "returnCount");

    if(returnItm != null) {

      let w = blk.drawPlaceText(Core.bundle.formatFloat("bar.drillspeed", 60.0 / blk.getDrillTime(returnItm) * returnCount, 2), tx, ty, valid);
      let x = tx * Vars.tilesize + blk.offset - w * 0.5 - 4.0;
      let y = ty * Vars.tilesize + blk.offset + blk.size * Vars.tilesize * 0.5 + 5.0;
      let iconW = Vars.iconSmall * 0.25;

      Draw.mixcol(Color.darkGray, 1.0);
      Draw.rect(blk.ex_isMiningDpore(tx, ty, returnItm) ? VARGEN.iconRegs.questionMark : returnItm.uiIcon, x, y - 1.0, iconW, iconW);
      Draw.reset();
      Draw.rect(blk.ex_isMiningDpore(tx, ty, returnItm) ? VARGEN.iconRegs.questionMark : returnItm.uiIcon, x, y, iconW, iconW);

      if(blk.drawMineItem) {
        Draw.color(returnItm.color);
        Draw.rect(blk.itemRegion, t.worldx() + blk.offset, t.worldy() + blk.offset);
        Draw.color();
      };

    } else {

      let ot = t.getLinkedTilesAs(blk, Reflect.get(Block, "tempTiles")).find(ot1 => ot1.drop() != null && (ot1.drop().hardness > blk.tier || (blk.blockedItems != null && blk.blockedItems.contains(ot1.drop()))));
      let itm = ot == null ? null : ot.drop();
      if(itm != null) blk.drawPlaceText(Core.bundle.get("bar.drilltierreq"), tx, ty, valid);

    };
  };


  function comp_updateTile(b) {
    if(b.invertTime > 0.9999) b.ex_onCraft();

    if(TIMER.timerState_effc && b.isMiningDpore) {
      b.scannerTg = MDL_pos._b_scan(b.x, b.y, b.team);
    };
  };


  function comp_onProximityUpdate(b) {
    b.isMiningDpore = b.block.ex_isMiningDpore(b.tileX(), b.tileY(), b.dominantItem);
  };


  function comp_drawSelect(b) {
    MDL_draw.drawPulse_circle(b.x, b.y, b.block.ex_getImpactR() * Vars.tilesize);

    if(b.isMiningDpore) {
      b.scannerTg == null ?
        MDL_draw.drawText_select(b, MDL_bundle._info("lovec", "text-no-scanner"), false, b.useCep ? 1 : 0) :
        MDL_draw.drawConnector_area(b, b.scannerTg);
    };
  };


  function comp_canMine(blk, t) {
    let ov = t.overlay();
    if(!MDL_cond._isDepthOre(ov)) return true;

    return ov.itemDrop.hardness <= blk.tier * blk.depthMtp;
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(b.isMiningDpore) b.efficiency *= b.scannerTg == null ? 0.0 : b.scannerTg.ex_getScanFrac();
  };


  function comp_ex_isMiningDepore(blk, tx, ty, itm) {
    var cond = false;

    let t = Vars.world.tile(tx, ty);
    if(t == null) return cond;
    let ov;
    t.getLinkedTilesAs(blk, Reflect.get(Block, "tempTiles")).each(ot => {
      if(cond) return;
      ov = ot.overlay();
      if(MDL_cond._isDepthOre(ov) && ov.itemDrop === itm) cond = true;
    });

    return cond;
  };


  function comp_ex_onCraft(b) {
    FRAG_attack.apply_impact(
      b.x,
      b.y,
      FRAG_attack._impactDmg(b.block.size, b.block.drillTime),
      FRAG_attack._impactDur(b.block.drillTime),
      b.block.ex_getImpactR() * Vars.tilesize,
      FRAG_attack._impactMinRad(b.block.size),
      b.block.shake,
    );
    MDL_effect.showAt_dust(b.x, b.y, FRAG_attack._impactDustRad(b.block.size), Math.pow(b.block.size, 2));
    MDL_effect.showAt_colorDust(b.x, b.y, FRAG_attack._impactDustRad(b.block.size) * 1.5, b.tile);
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


    // @NOSUPER
    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
      comp_drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT.created(b);
    },


    onDestroyed: function(b) {
      PARENT.onDestroyed(b);
    },


    updateTile: function(b) {
      PARENT.updateTile(b);
      comp_updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
      comp_onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
      comp_drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    canMine: function(blk, t) {
      return comp_canMine(blk, t);
    },


    /* <---------- build (specific) ----------> */


    updateEfficiencyMultiplier: function(b) {
      PARENT.updateEfficiencyMultiplier(b);
      comp_updateEfficiencyMultiplier(b);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-min", "blk-drl"],
    }),


    // @NOSUPER
    ex_getImpactR: function(blk) {
      return blk.impactR;
    },


    // @NOSUPER
    ex_isMiningDpore: function(blk, tx, ty, itm) {
      return comp_ex_isMiningDepore(blk, tx, ty, itm);
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_onCraft: function(b) {
      comp_ex_onCraft(b);
    },


  };


  TEMPLATE._std = function(r, mtp, drillEff, drillEffP) {
    return {
      impactR: Object.val(r, 5), depthMtp: Object.val(mtp, 1.0),
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
      canMine(t) {
        if(!this.super$canMine(t)) return false;
        if(!TEMPLATE.canMine(this, t)) return false;
        return true;
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      ex_getImpactR() {
        return TEMPLATE.ex_getImpactR(this);
      },
      ex_isMiningDpore(tx, ty, itm) {
        return TEMPLATE.ex_isMiningDpore(this, tx, ty, itm);
      },
      // @SPEC
      drillEffect: Object.val(drillEff, Fx.none), drillEffectChance: Object.val(drillEffP, 1.0),
    };
  };


  TEMPLATE._std_b = function(useCep) {
    return {
      useCep: Object.val(useCep, false),
      isMiningDpore: false, scannerTg: null,
      created() {
        this.super$created();
        TEMPLATE.created(this);
      },
      onDestroyed() {
        this.super$onDestroyed();
        TEMPLATE.onDestroyed(this);
      },
      updateTile() {
        this.super$updateTile();
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
      ex_onCraft() {
        TEMPLATE.ex_onCraft(this);
      },
    };
  };


  module.exports = TEMPLATE;
