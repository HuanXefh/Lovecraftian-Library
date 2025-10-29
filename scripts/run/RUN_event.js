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

    let unit_pl = Vars.player.unit();
    if(unit_pl != null) {
      MDL_pos._tsDstManh(unit_pl.tileOn(), VAR.r_unitSurRange, true).forEachFast(ot => MDL_draw.drawArea_tShrink(ot, 1, Pal.accent, 0.5, VAR.lay_debugFlr));
    };

    Groups.unit.each(unit => {
      if(MDL_cond._isVisible(unit)) {
        MDL_draw.drawDebug_hitSize(unit);
        MDL_draw.drawDebug_target(unit);
      };
    });

    Groups.bullet.each(bul => {
      if(MDL_cond._isVisible(bul)) {
        MDL_draw.drawDebug_hitSize(bul);
        MDL_draw.drawDebug_aim(bul);
      };
    });
  };


  function evComp_draw_unitStat() {
    if(!PARAM.drawUnitStat || !Vars.ui.hudfrag.shown) return;

    Groups.unit.each(unit => {
      if(!MDL_cond._isVisible(unit) || MDL_cond._isLoot(unit)) return false;
      if(
        (!unit.isPlayer() || !PARAM.drawPlayerStat)
        && !(unit.type instanceof MissileUnitType) && PARAM.drawUnitNearMouse
        && Mathf.dst(Core.input.mouseWorldX(), Core.input.mouseWorldY(), unit.x, unit.y) > VAR.rad_mouseRad + unit.type.hitSize * 0.5
      ) return false;
      if(unit.type instanceof MissileUnitType && !PARAM.drawMissileStat) return false;
      // Very weird condition
      if(!unit.type.logicControllable && !unit.type.playerControllable && unit.type.hidden && !unit.type.drawCell && !(unit.type instanceof MissileUnitType)) return false;
      return true;
    }, unit => {
      if(PARAM.drawUnitRange) {
        let z = Draw.z();
        Draw.z(VAR.lay_unitRange);
        let wp, rot = unit.rotation - 90.0, mtX, mtY, mtRot, hasAnyMountShown = false;
        unit.mounts.forEachFast(mt => {
          wp = mt.weapon;

          if(wp.shootCone > 0.0 && wp.shootCone < 179.99) {
            // Regular weapons with shoot cone
            mtX = unit.x + Angles.trnsx(rot, wp.x, wp.y);
            mtY = unit.y + Angles.trnsy(rot, wp.x, wp.y);
            Draw.color(
              wp instanceof RepairBeamWeapon ?
                Pal.heal :
                wp instanceof PointDefenseWeapon || wp instanceof PointDefenseBulletWeapon ?
                  Pal.techBlue :
                  wp.noAttack ?
                    Color.white :
                    unit.team.color,
              0.15,
            );
            Fill.arc(mtX, mtY, wp.range(), wp.shootCone / 180.0, rot + mt.rotation + 90.0 - wp.shootCone);
            hasAnyMountShown = true;
          } else if(wp.bullet instanceof BombBulletType || (wp.bullet.speed < 2.0 && !wp.bullet.collides && wp.bullet.splashDamage > 0.0)) {
            // Bomb weapons
            Draw.color(unit.team.color, 0.1);
            Fill.arc(unit.x, unit.y, wp.bullet.splashDamageRadius, 0.25, Time.time * 3.0);
            Fill.arc(unit.x, unit.y, wp.bullet.splashDamageRadius, 0.25, Time.time * 3.0 + 180.0);
            MDL_draw.drawCircle_normal(unit.x, unit.y, wp.bullet.splashDamageRadius, Pal.accent, 0.35, false, true);
            hasAnyMountShown = true;
          };
        });
        Draw.reset();
        if(!hasAnyMountShown) MDL_draw.drawCircle_normal(unit.x, unit.y, unit.range(), Pal.accent, 0.35, false, true);
        Draw.z(z);
      };
      MDL_draw.drawUnit_healthBar(
        unit, MDL_entity._healthFrac(unit), unit.type.hitSize / Vars.tilesize, unit.team.color,
        1.0, 0.0, 0, 1.0,
        MDL_entity._armor(unit), unit.shield, unit.speedMultiplier, unit.damageMultiplier * unit.reloadMultiplier,
      );
      if(PARAM.drawUnitReload) {
        let ids;
        (3)._it(1, i => {
          ids = DB_unit.db["param"]["reloadBarIds"]["off" + i].read(unit.type.name);
          if(ids != null) MDL_draw.drawUnit_reload(unit, ids, Pal.techBlue, 1.0, 0.0, i, null);
        });
        MDL_draw.drawUnit_reload(unit, null, Pal.items, 1.0, 0.0, -1, MDL_entity._payFrac(unit, true));
      };
      if(unit.payloads != null) {
        let pay = unit.payloads.size === 0 ? null : unit.payloads.peek();
        if(pay != null && pay instanceof BuildPayload) {
          let z = Draw.z();
          let ot = Vars.world.tileWorld(unit.x - pay.block().offset, unit.y - pay.block().offset);
          if(ot != null) {
            Draw.z(VAR.lay_effHigh + 1.5);
            Draw.color(Build.validPlace(pay.block(), unit.team, ot.x, ot.y, pay.build.rotation, false) ? Pal.items : Pal.remove, 0.5);
            Fill.rect(ot.worldx() + pay.block().offset, ot.worldy() + pay.block().offset, pay.block().size * Vars.tilesize, pay.block().size * Vars.tilesize);
            Draw.color();
            Draw.z(z);
          };
        };
      };
    });
  };


  const evComp_draw_buildStat = function() {
    const thisFun = evComp_draw_buildStat;

    if(!PARAM.drawBuildStat || !Vars.ui.hudfrag.shown) return;

    let t = MDL_pos._tMouse();
    let b = t == null ? null : t.build;
    let unit_pl = Vars.player.unit();
    let b_pl = (unit_pl == null || !(unit_pl instanceof BlockUnitc)) ? null : unit_pl.tile();

    // Draw player building
    if(b_pl != null && PARAM.drawPlayerStat) {
      thisFun.drawBaseBuildStats(b_pl);
    };

    // Draw mouse building if not player
    if(b != null && !b.block.privileged && (!PARAM.drawPlayerStat || b !== b_pl)) {
      thisFun.drawBaseBuildStats(b);

      if(b.team !== Vars.player.team()) return;

      // Draw bridge tranportation
      if(b.block instanceof ItemBridge || b.block instanceof DirectionBridge) {
        MDL_draw.comp_drawSelect_bridgeLine(b);
      };
    };
  }
  .setProp({
    drawBaseBuildStats: b => {
      if(PARAM.drawUnitRange && b.block instanceof Turret && b.block.shootCone > 0.0 && b.block.shootCone < 179.99) {
        let z = Draw.z();
        Draw.color(b.team.color, 0.15);
        Draw.z(VAR.lay_unitRange);
        Fill.arc(b.x, b.y, b.range() + b.block.shootY, b.block.shootCone / 180.0, b.rotation - b.block.shootCone);
        Draw.reset();
        Draw.z(z);
      };
      MDL_draw.drawUnit_healthBar(
        b, b.health / b.maxHealth, b.block.size, b.team.color,
        1.0, 0.0, -1 + VAR.r_offBuildStat, 1.0, b.block.armor,
        MDL_entity._bShield(b), MDL_entity._bSpd(b), null,
      );
      if(PARAM.drawUnitReload) {
        let hasReload = DB_block.db["group"]["showReload"].includes(b.block.name);
        if(hasReload) MDL_draw.drawUnit_reload(b, null, Pal.techBlue, 1.0, -16.0, -1.25 + VAR.r_offBuildStat, MDL_entity._reloadFrac(b));
        MDL_draw.drawUnit_reload(b, null, Pal.accent, 1.0, -16.0, (hasReload ? -0.25 : -1.25) + VAR.r_offBuildStat, MDL_entity._warmupFrac(b, true));
      };
      MDL_draw.drawRect_normal(b.x, b.y, VAR.r_offBuildStat, b.block.size, Pal.accent, 0.5, false, true);
    },
  });


  function evComp_draw_extraInfo() {
    if(!PARAM.showExtraInfo || !Vars.ui.hudfrag.shown) return;

    MDL_draw.comp_drawSelect_extraInfo(MDL_pos._tMouse());
  };


  /* <---------- build damage ----------> */


  function evComp_damage_buildDamageDisplay(b, bul) {
    if(!PARAM.displayDamage) return;
    if(b == null || bul == null) return;

    let mode = "health";
    if(MDL_entity._bShield(b, true) > dmg) mode = "shield";
    let dmg = MDL_entity._bulDmg(
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

    let mode = "health";
    if(unit.shield > dmg) mode = "shield";
    let dmg = MDL_entity._bulDmg(
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


  function evComp_destroy_buildingRemains(b) {
    if(!PARAM.createBuildingRemains || b == null || b.block.size < 2) return;
    if(MDL_cond._hasNoRemains(b.block)) return;

    MDL_effect.showAt_remains(b.x, b.y, b, b.team);
  };


  function evComp_destroy_unitRemains(unit) {
    if(MDL_cond._hasNoRemains(unit.type)) return;

    MDL_effect.showAt_remains(unit.x, unit.y, unit, unit.team);
    if(PARAM.secret_steelPipe) MDL_effect.playAt(unit.x, unit.y, "se-meme-steel-pipe");
  };


  function evComp_destroy_deathStatus(unit) {
    VARGEN.deathStas.forEachFast(sta => {
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


  MDL_event._c_onBDestroy(t => {

    evComp_destroy_buildingRemains(t.build);

  }, 44932710);


  MDL_event._c_onUnitDamage((unit, bul) => {

    evComp_damage_unitDamageDisplay(unit, bul);

  }, 76523545);


  MDL_event._c_onUnitDestroy(unit => {

    evComp_destroy_unitRemains(unit);
    evComp_destroy_deathStatus(unit);

  }, 47596662);
