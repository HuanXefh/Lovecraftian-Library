/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles various events globally.
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


  const FRAG_unit = require("lovec/frag/FRAG_unit");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  const DB_block = require("lovec/db/DB_block");
  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- update ----------> */


  function evComp_update_test() {



  };


  function evComp_update_unit() {
    Groups.unit.each(unit => {

      if(PARAM.modded && !MDL_cond._isLoot(unit)) {
        FRAG_unit.comp_update_surrounding(unit.type, unit);
        FRAG_unit.comp_update_heat(unit.type, unit);
      };

    });
  };


  /* <---------- draw ----------> */


  function evComp_draw_test() {
    if(!PARAM.testDraw) return;

    var unit_pl = Vars.player.unit();
    if(unit_pl != null) {


      // Param
      // NOTE: Use tmp!
      let t = unit_pl.tileOn();
      let ts = MDL_pos._tsDstManh(t, VAR.r_unitSurRange, true);


      // Draw unit surrounding range
      ts.forEach(ot => MDL_draw.drawArea_tShrink(ot, 1, Pal.accent, 0.5, VAR.lay_debugFlr));


    };

    Groups.unit.forEach(unit => {
      if(MDL_cond._isVisible(unit)) {


        MDL_draw.drawDebug_hitSize(unit);
        MDL_draw.drawDebug_target(unit);


      };
    });

    Groups.bullet.forEach(bul => {
      if(MDL_cond._isVisible(bul)) {


        MDL_draw.drawDebug_hitSize(bul);
        MDL_draw.drawDebug_aim(bul);


      };
    });

  };


  function evComp_draw_unitStat() {
    if(!PARAM.drawUnitStat || !Vars.ui.hudfrag.shown) return;

    Groups.unit.each(unit => {
      var cond = true;
      if(!MDL_cond._isVisible(unit) || MDL_cond._isLoot(unit)) cond = false;
      if(
        (!unit.isPlayer() || !PARAM.drawPlayerStat)
        && !(unit.type instanceof MissileUnitType) && PARAM.drawUnitNearMouse
        && Mathf.dst(Core.input.mouseWorldX(), Core.input.mouseWorldY(), unit.x, unit.y) > VAR.rad_mouseRad + unit.type.hitSize * 0.5
      ) cond = false;
      if(unit.type instanceof MissileUnitType && !PARAM.drawMissileStat) cond = false;

      if(cond) {
        MDL_draw.drawUnit_healthBar(
          unit,
          MDL_entity._healthFrac(unit),
          unit.type.hitSize / Vars.tilesize,
          unit.team.color,
          1.0,
          0.0,
          0,
          1.0,
          MDL_entity._armor(unit),
          unit.shield,
          unit.speedMultiplier,
          unit.damageMultiplier * unit.reloadMultiplier,
        );

        if(PARAM.drawUnitReload) {
          for(let i = 0; i < 3; i++) {
            let ids = DB_unit.db["param"]["reloadBarIds"]["off" + i].read(unit.type.name);
            if(ids != null) MDL_draw.drawUnit_reload(
              unit,
              ids,
              Pal.techBlue,
              1.0,
              0.0,
              i,
              null,
            );
          };
        };
      };
    });
  };


  function evComp_draw_buildStat() {
    if(!PARAM.drawBuildStat || !Vars.ui.hudfrag.shown) return;

    let t = MDL_pos._tMouse();
    let b = t == null ? null : t.build;
    let unit_pl = Vars.player.unit();
    let b_pl = (unit_pl == null || !(unit_pl instanceof BlockUnitc)) ? null : unit_pl.tile();

    // Draw player building
    if(b_pl != null && PARAM.drawPlayerStat) {
      MDL_draw.drawUnit_healthBar(
        b_pl,
        b_pl.health / b_pl.maxHealth,
        b_pl.block.size,
        b_pl.team.color,
        1.0,
        0.0,
        -1.0 + VAR.r_offBuildStat,
        1.0,
        b_pl.block.armor,
        MDL_entity._bShield(b_pl),
        MDL_entity._bSpd(b_pl),
        null,
      );

      if(PARAM.drawUnitReload) {
        let hasReload = DB_block.db["group"]["showReload"].includes(b_pl.block.name);

        if(hasReload) MDL_draw.drawUnit_reload(
          b_pl,
          null,
          Pal.techBlue,
          1.0,
          -16.0,
          -1.25 + VAR.r_offBuildStat,
          MDL_entity._reloadFrac(b_pl),
        );

        MDL_draw.drawUnit_reload(
          b_pl,
          null,
          Pal.accent,
          1.0,
          -16.0,
          (hasReload ? -0.25 : -1.25) + VAR.r_offBuildStat,
          MDL_entity._warmupFrac(b_pl, true),
        );
      };

      MDL_draw.drawRect_normal(b_pl.x, b_pl.y, VAR.r_offBuildStat, b_pl.block.size, Pal.accent, 0.5, false, true);
    };

    // Draw mouse building if not player
    if(b != null && !b.block.privileged && (!PARAM.drawPlayerStat || b !== b_pl)) {
      MDL_draw.drawUnit_healthBar(
        b,
        b.health / b.maxHealth,
        b.block.size,
        b.team.color,
        1.0,
        0.0,
        -1 + VAR.r_offBuildStat,
        1.0,
        b.block.armor,
        MDL_entity._bShield(b),
        MDL_entity._bSpd(b),
        null,
      );

      if(PARAM.drawUnitReload) {
        let hasReload = DB_block.db["group"]["showReload"].includes(b.block.name);

        if(hasReload) MDL_draw.drawUnit_reload(
          b,
          null,
          Pal.techBlue,
          1.0,
          -16.0,
          -1.25 + VAR.r_offBuildStat,
          MDL_entity._reloadFrac(b),
        );

        MDL_draw.drawUnit_reload(
          b,
          null,
          Pal.accent,
          1.0,
          -16.0,
          (hasReload ? -0.25 : -1.25) + VAR.r_offBuildStat,
          MDL_entity._warmupFrac(b, true),
        );
      };

      MDL_draw.drawRect_normal(b.x, b.y, VAR.r_offBuildStat, b.block.size, Pal.accent, 0.5, false, true);

      if(b.team !== Vars.player.team()) return;

      if(b.block instanceof ItemBridge || b.block instanceof DirectionBridge) {
        MDL_draw.comp_drawSelect_bridgeLine(b);
      };
    };
  };


  function evComp_draw_extraInfo() {
    if(!PARAM.showExtraInfo || !Vars.ui.hudfrag.shown) return;

    let t = MDL_pos._tMouse();

    MDL_draw.comp_drawSelect_extraInfo(t);
  };


  /* <---------- build damage ----------> */


  function evComp_damage_buildDamageDisplay(b, bul) {
    if(!PARAM.displayDamage) return;
    if(b == null || bul == null) return;

    var mode = "health";
    if(MDL_entity._bShield(b, true) > dmg) mode = "shield";

    var dmg = MDL_entity._bulDmg(
      bul,
      bul.type.buildingDamageMultiplier * (mode !== "shield" ? 1.0 : bul.type.shieldDamageMultiplier),
      Mathf.dst(bul.x, bul.y, b.x, b.y),
      b.block.armor,
      b.block.size * Vars.tilesize,
    );
    if(dmg < PARAM.damageDisplayThreshold) return;

    MDL_effect.showAt_dmg(b.x, b.y, dmg, bul.team, mode);
  };


  /* <---------- unit damage ----------> */


  function evComp_damage_unitDamageDisplay(unit, bul) {
    if(!PARAM.displayDamage) return;
    if(unit == null || bul == null) return;
    if(unit.type instanceof MissileUnitType && !PARAM.drawMissileStat) return;

    var mode = "health";
    if(unit.shield > dmg) mode = "shield";

    var dmg = MDL_entity._bulDmg(
      bul,
      1.0 / unit.healthMultiplier * (mode !== "shield" ? 1.0 : bul.type.shieldDamageMultiplier),
      Mathf.dst(bul.x, bul.y, unit.x, unit.y),
      MDL_entity._armor(unit),
      unit.type.hitSize,
    );
    if(dmg < PARAM.damageDisplayThreshold) return;

    MDL_effect.showAt_dmg(unit.x, unit.y, dmg, bul.team, mode);
  };


  /* <---------- unit destroy ----------> */


  function evComp_destroy_unitRemains(unit) {
    if(MDL_cond._hasNoRemains(unit.type)) return;

    MDL_effect.showAt_remains(unit.x, unit.y, unit, unit.team);
    if(PARAM.secret_steelPipe) MDL_effect.playAt(unit.x, unit.y, "se-meme-steel-pipe");
  };


  function evComp_destroy_deathStatus(unit) {
    VARGEN.deathStas.forEach(sta => {
      if(unit.hasEffect(sta)) sta.killedScr(unit);
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onUpdate(() => {

    evComp_update_test();
    evComp_update_unit();

  }, 45262222);


  MDL_event._c_onDraw(() => {

    evComp_draw_test();
    evComp_draw_unitStat();
    evComp_draw_buildStat();
    evComp_draw_extraInfo();

  }, 12597784);


  MDL_event._c_onBDamage((b, bul) => {

    evComp_damage_buildDamageDisplay(b, bul);

  }, 45751111);


  MDL_event._c_onUnitDamage((unit, bul) => {

    evComp_damage_unitDamageDisplay(unit, bul);

  }, 76523545);


  MDL_event._c_onUnitDestroy(unit => {

    evComp_destroy_unitRemains(unit);
    evComp_destroy_deathStatus(unit);

  }, 47596662);
