/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");
  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");


  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_net = require("lovec/mdl/MDL_net");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  const DB_status = require("lovec/db/DB_status");


  /* <---------- unit ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Spawns a unit at (x, y).
   * Use {repeat} to spawn multiple times in radius of {rad}.
   * Set {ang} to apply a specific rotation.
   * Use {scr} to furthur modify those spawned units.
   * ---------------------------------------- */
  const spawnUnit = function(x, y, utp_gn, team, rad, ang, repeat, applyDefSta, scr) {
    let utp = MDL_content._ct(utp_gn, "utp");
    if(utp == null) return;
    if(team == null) team = Team.sharded;
    if(rad == null) rad = 0.0;
    if(ang == null) ang = "rand";
    if(repeat == null) repeat = 1;

    var x_i, y_i, ang_i;
    for(let i = 0; i < repeat; i++) {
      x_i = x + Mathf.range(rad);
      y_i = y + Mathf.range(rad);
      ang_i = ang === "rand" ? Mathf.random(360.0) : ang;

      let unit = scr == null ? utp.spawn(team, x_i, y_i, ang_i) : utp.spawn(team, x_i, y_i, ang_i, scr);
      if(applyDefSta) {
        unit.apply(StatusEffects.unmoving, 30.0);
        unit.apply(StatusEffects.invincible, 60.0);
      };
      Units.notifyUnitSpawn(unit);
    };
  }
  .setAnno(ANNO.__SERVER__);
  exports.spawnUnit = spawnUnit;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {spawnUnit} used on client side.
   * ---------------------------------------- */
  const spawnUnit_client = function(x, y, utp, team, rad, ang, repeat, applyDefSta) {
    let utp = MDL_content._ct(utp_gn, "utp");
    if(utp == null) return;

    let payload = Array.toPayload([
      x,
      y,
      utp.name,
      team,
      rad,
      ang,
      repeat,
      applyDefSta
    ]);

    MDL_net.sendPacket("client", "lovec-client-unit-spawn", payload, true, true);
  }
  .setAnno(ANNO.__INIT__, null, function() {
    MDL_net.__packetHandler("server", "lovec-client-unit-spawn", payload => {
      spawnUnit.apply(this, Array.fromPayload(payload));
    });
  })
  .setAnno(ANNO.__CLIENT__)
  .setAnno(ANNO.__NONCONSOLE__);
  exports.spawnUnit_client = spawnUnit_client;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit despawn.
   * ---------------------------------------- */
  const despawnUnit = function(unit) {
    if(unit == null) return;

    Call.unitDespawn(unit);
  }
  .setAnno(ANNO.__SERVER__);
  exports.despawnUnit = despawnUnit;


  /* ----------------------------------------
   * NOTE:
   *
   * Applys knockback for {unit} from a center of (x, y), with {pow} as the power.
   * {pow} can be negative to pull the target.
   * Set {rad} to apply range knockback, e.g. for splash damage.
   * Set {ang} to push/pull the target in a specific angle.
   * ---------------------------------------- */
  const knockback = function(x, y, unit, pow, rad, ang) {
    if(unit == null || MDL_cond._isHighAir(unit)) return;
    if(pow == null) pow = 0.0;
    if(Math.abs(pow) < 0.0001) return;

    var pow_fi = rad == null ? pow : (pow * (1.0 - Mathf.clamp(Mathf.dst(x, y, unit.x, unit.y) / rad)) * 4.0);
    if(unit.flying) pow_fi *= 2.5;

    let vec2 = Tmp.v1.set(unit).sub(x, y).nor().scl(pow_fi * 80.0);
    if(ang != null) vec.setAngle(ang + (pow_fi < 0.0 ? 180.0 : 0.0));

    unit.impulse(vec2);
  };
  exports.knockback = knockback;


  /* ----------------------------------------
   * NOTE:
   *
   * Spawns a loot unit.
   * It's item on the ground which can be picked up by player units.
   * ---------------------------------------- */
  const spawnLoot = function(x, y, itm_gn, amt, rad, repeat) {
    const thisFun = spawnLoot;

    if(!PARAM.modded) return;
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;
    if(amt == null) amt = 0;
    if(amt < 1) return;
    if(rad == null) rad = VAR.rad_unitLootRad;
    if(repeat == null) repeat = 1;

    spawnUnit(x, y, thisFun.funUtp, Vars.player.team(), rad, null, repeat, false, unit => {
      unit.addItem(itm, amt);
      MDL_effect.showAt_global(unit.x, unit.y, EFF.circlePulseDynamic, 5.0, Pal.accent);
      MDL_effect.showBetween_line(x, y, null, unit, Pal.accent);
    });
  }
  .setAnno(ANNO.__SERVER__)
  .setProp({
    "funUtp": (function() {
      if(!PARAM.modded) return null;

      const tmp = extend(UnitType, "unit0misc-loot", {


        envEnabled: Env.any, envDisabled: Env.none, fogRadius: 0,
        createWreck: false, createScorch: false, deathShake: 0.0, fallEffect: Fx.none, fallEngineEffect: Fx.none, deathExplosionEffect: Fx.none, deathSound: Sounds.none,
        hoverable: false, drawMiniMap: false,
        isEnemy: false, canAttack: false, hittable: false, targetable: false, allowedInPayloads: false,
        hidden: true, internal: true, useUnitCap: false, physics: false, bounded: false,
        playerControllable: false, logicControllable: false,
        speed: 0.0, rotateSpeed: 0.0,
        itemCapacity: 9999,
        lifetime: VAR.time_lootLifetime * 2.0,


        init() {
          this.super$init();
          DB_status.db["group"]["lootImmune"].forEach(sta_gn => {
            let sta = MDL_content._ct(sta_gn, "sta", true);
            if(sta != null) this.immunities.add(sta);
          });
        },


        update(unit) {
          if(unit.fin() > 0.5) unit.remove();
          if(MDL_cond._isLootProtected(unit)) return;

          // Create explosion if damaged somehow
          if(unit.health < 10.0) {
            let lootTg = unit.item();
            if(lootTg != null) {
              let lootAmt = unit.stack.amount;
              let explo = lootTg.explosiveness * lootAmt * 1.53;
              let flam = lootTg.flammability * lootAmt / 1.9;
              let charge = lootTg.charge * Mathf.pow(lootAmt, 1.11) * 160.0;
              Damage.dynamicExplosion(unit.x, unit.y, flam, explo, charge, 28.0, Vars.state.rules.damageExplosions, lootTg.flammability > 0.9, null, Fx.none, 0.0);
            };
            unit.remove();
          };

          // Prevent drowning to death
          if(unit.drownTime > 0.98) unit.remove();

          // Let a player unit take the item, only meant for mobile player
          if(Vars.mobile && TIMER.timerState_unit && Mathf.chance(0.5)) {
            let unit_pl = MDL_pos._unit_pl(unit.x, unit.y, null, VAR.rad_lootRad);
            if(unit_pl != null && Mathf.dst(unit.x, unit.y, unit_pl.x, unit_pl.y) < unit_pl.hitSize * 0.5 + VAR.rad_lootPickRad) {
              if(FRAG_item.takeUnitLoot(unit_pl, unit)) MDL_effect.showBetween_itemTransfer(unit.x, unit.y, unit_pl);
            };
          };

          // Randomly merge loots with the same item
          if(Mathf.chance(0.005)) {
            let loot = MDL_pos._loot(unit.x, unit.y, VAR.rad_lootMergeRad, unit);
            if(loot != null && loot.item() === unit.item()) {
              unit.stack.amount += loot.stack.amount;
              loot.remove();
            };
          };
        },


        draw(unit) {
          let itm = unit.item();
          if(itm == null) return;
          let amt = unit.stack.amount;
          var regScl = PARAM.drawStaticLoot ? 1.0 : 1.0 + Math.sin(Time.time * 0.065) * 0.15;
          var sizeScl = Math.log(amt + 1.0) * 0.4;

          Draw.z(VAR.lay_unitRemains + 0.2 + sizeScl / 100.0);
          // Draw soft shadow
          Draw.color(Color.black);
          Draw.alpha(unit.lastDrownFloor == null ? 0.4 * (1.0 - Interp.pow10In.apply(unit.fin() * 2.0)) : 0.4 * (1.0 - Interp.pow10In.apply(unit.fin() * 2.0) - Interp.pow3In.apply(unit.drownTime)));
          Draw.rect(this.softShadowRegion, unit.x, unit.y, 10.0 * regScl * sizeScl, 10.0 * regScl * sizeScl, 0.0);
          // Draw item circle
          if(!PARAM.drawStaticLoot) {
            if(unit.lastDrownFloor == null) {
              Draw.color(Pal.accent);
              Draw.alpha(1.0 - Interp.pow10In.apply(unit.fin() * 2.0));
            } else {
              Draw.color(Pal.accent, Tmp.c2.set(unit.lastDrownFloor.mapColor).mul(0.83), unit.drownTime * 0.9);
              Draw.alpha(1.0 - Interp.pow10In.apply(unit.fin() * 2.0) - Interp.pow2In.apply(unit.drownTime));
            };
            Lines.stroke(1.0);
            Lines.circle(unit.x, unit.y, 4.5 * regScl * sizeScl);
          };
          // Draw item icon
          if(unit.lastDrownFloor == null) {
            Draw.color(Color.white);
            Draw.alpha(1.0 - Interp.pow10In.apply(unit.fin() * 2.0));
          } else {
            Draw.color(Color.white, Tmp.c3.set(unit.lastDrownFloor.mapColor).mul(0.83), unit.drownTime * 0.9);
            Draw.alpha(1.0 - Interp.pow10In.apply(unit.fin() * 2.0) - Interp.pow3In.apply(unit.drownTime));
          };
          Draw.rect(itm.uiIcon, unit.x, unit.y, 5.0 * regScl * sizeScl, 5.0 * regScl * sizeScl, unit.rotation);
          if(MDL_cond._isHot(unit)) {
            Draw.blend(Blending.additive);
            Draw.mixcol(Color.valueOf("ff3838"), 1.0);
            Draw.alpha((0.5 + Mathf.absin(10.0, 0.5)) * 0.75);
            Draw.rect(itm.uiIcon, unit.x, unit.y, 5.0 * regScl * sizeScl, 5.0 * regScl * sizeScl, unit.rotation);
            Draw.blend();
          };
          Draw.reset();

          // Draw amount text
          if(PARAM.drawLootAmount && Mathf.dst(Core.input.mouseWorldX(), Core.input.mouseWorldY(), unit.x, unit.y) < Math.max(8.0 * sizeScl, 6.0)) MDL_draw.drawText(unit.x, unit.y - 4.0, String(amt), 0.85, Pal.accent);
        },


      });
      tmp.constructor = () => extend(TimedKillUnit, {});

      return tmp;
    })(),
  });
  exports.spawnLoot = spawnLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {spawnLoot} used on client side.
   * ---------------------------------------- */
  const spawnLoot_client = function(x, y, itm_gn, amt, rad, repeat) {
    if(!PARAM.modded) return;

    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;

    let payload = Array.toPayload([
      x,
      y,
      itm.name,
      amt,
      rad,
      repeat,
    ]);

    MDL_net.sendPacket("client", "lovec-client-loot-spawn", payload, true, true);
  }
  .setAnno(ANNO.__INIT__, null, function() {
    MDL_net.__packetHandler("server", "lovec-client-loot-spawn", payload => {
      spawnLoot.apply(this, Array.fromPayload(payload));
    });
  })
  .setAnno(ANNO.__CLIENT__)
  .setAnno(ANNO.__NONCONSOLE__);
  exports.spawnLoot_client = spawnLoot_client;


  /* ----------------------------------------
   * NOTE:
   *
   * Clears all loot units, only called on server side.
   * ---------------------------------------- */
  const clearLoot = function() {
    Groups.unit.each(unit => {
      if(MDL_cond._isLoot(unit)) unit.remove();
    });
  }
  .setAnno(ANNO.__SERVER__);
  exports.clearLoot = clearLoot;


  /* <---------- bullet ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Like {spawnUnit} but for bullets.
   * Set {se_gn} if a sound should be played.
   * ---------------------------------------- */
  const spawnBul = function(x, y, btp, se_gn, team, rad, ang, repeat, dmg_ow, scl, velScl) {
    if(btp == null) return;
    if(team == null) team = Team.derelict;
    if(rad == null) rad = 0.0;
    if(ang == null) ang = "rand";
    if(repeat == null) repeat = 1;
    if(dmg_ow == null) dmg_ow = -1;
    if(scl == null) scl = 1.0;
    if(velScl == null) velScl = 1.0;

    var x_i;
    var y_i;
    for(let i = 0; i < repeat; i++) {
      x_i = x + Mathf.range(rad);
      y_i = y + Mathf.range(rad);
      ang_i = ang === "rand" ? Mathf.random(360.0) : ang;

      Call.createBullet(btp, team, x_i, y_i, ang_i, dmg_ow, velScl, scl);
    };

    MDL_effect.playAt(x, y, se_gn);
  }
  .setAnno(ANNO.__SERVER__);
  exports.spawnBul = spawnBul;


  /* ----------------------------------------
   * NOTE:
   *
   * Applies damage to a bullet.
   * Destroys the bullet if bullet damage is reduced to below zero.
   * ---------------------------------------- */
  const damageBul = function(bul, dmg) {
    if(bul == null) return;
    if(dmg == null) dmg = 0.0;
    if(dmg < 0.0001) return;

    bul.damage > dmg ? (bul.damage -= dmg) : bul.remove();
  };
  exports.damageBul = damageBul;
