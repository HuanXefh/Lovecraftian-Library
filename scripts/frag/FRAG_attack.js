/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");
  const EFF = require("lovec/glb/GLB_eff");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_net = require("lovec/mdl/MDL_net");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- base ----------> */


  const _presExploRad = function(size) {
    if(size == null) size = 1;

    return VAR.rad_presExploRad + size * 0.8 * Vars.tilesize;
  };
  exports._presExploRad = _presExploRad;


  const _presExploDmg = function(size) {
    if(size == null) size = 1;

    return VAR.dmg_presExploDmg * size * 0.3;
  };
  exports._presExploDmg = _presExploDmg;


  const _impactDmg = function(size, intv) {
    if(size == null) size = 1;
    if(intv == null) intv = 0.0;

    return Math.log(size + 1) * Math.log(Math.min(intv / 60.0, 10.0) + 1) * 400.0;
  };
  exports._impactDmg = _impactDmg;


  const _impactDur = function(intv) {
    if(intv == null) intv = 0.0;

    return Math.min(intv * 0.5, 240.0);
  };
  exports._impactDur = _impactDur;


  const _impactMinRad = function(size) {
    if(size == null) size = 1;

    return size * 1.2 * Vars.tilesize;
  };
  exports._impactMinRad = _impactMinRad;


  const _impactDustRad = function(size) {
    if(size == null) size = 1;

    return (size * 0.5 + 1.0) * Vars.tilesize;
  };
  exports._impactDustRad = _impactDustRad;


  /* <---------- damage ----------> */


  const damage = function(e, dmg, pierceArmor, mode_ow) {
    if(e == null) return false;
    if(dmg < 0.0001) return false;

    let dmg_fi = MDL_entity._dmgTake(e, dmg, pierceArmor);
    if(e instanceof Building) {
      MDL_effect.showAt_dmg(e.x, e.y, dmg, null, tryVal(mode_ow, MDL_entity._bShield(e, true) > dmg_fi ? "shield" : "health"));
      MDL_effect.showAt_flash(e);
    } else {
      MDL_effect.showAt_dmg(e.x, e.y, dmg, null, tryVal(mode_ow, e.shield > dmg_fi ? "shield" : "health"));
    };
    pierceArmor ? e.damagePierce(dmg, true) : e.damage(dmg, true);

    return true;
  };
  exports.damage = damage;


  const heal = function(e, healAmt) {
    if(e == null) return false;
    if(healAmt < 0.0001) return false;

    if(e instanceof Building) {
      MDL_effect.showAt_dmg(e.x, e.y, healAmt, null, "heal");
      MDL_effect.showAt_flash(e, Pal.heal);
      e.recentlyHealed();
    } else {
      MDL_effect.showAt_dmg(e.x, e.y, healAmt, null, "heal");
      e.healTime = 1.0;
    };
    e.heal(healAmt);

    return true;
  };
  exports.heal = heal;


  /* <---------- ranged ----------> */


  const apply_explosion = function(x, y, dmg, rad, shake, noSound) {
    if(!Vars.state.rules.reactorExplosions) return;
    if(dmg == null) dmg = 0.0;
    if(dmg < 0.0001) return;
    if(rad == null) rad = 40.0;
    if(rad < 0.0001) return;
    if(shake == null) shake = 0.0;

    Damage.damage(x, y, rad, dmg);

    MDL_effect.showAt(x, y, rad < 16.0 ? EFF.explosionSmall : EFF.explosion, 0.0);
    MDL_effect.showAt_shake(x, y, shake);
    if(!noSound) MDL_effect.playAt(x, y, "se-shot-explosion", 1.0, 1.0, 0.1);
  };
  exports.apply_explosion = apply_explosion;


  const apply_explosion_global = function(x, y, dmg, rad, shake, noSound) {
    apply_explosion(x, y, dmg, rad, shake, noSound);

    let payload = packPayload([
      x,
      y,
      dmg,
      rad,
      shake,
      noSound,
    ]);

    MDL_net.sendPacket("both", "lovec-both-attack-explosion", payload, true, true);
  }
  .setAnno(ANNO.__INIT__, function() {
    MDL_net.__packetHandler("both", "lovec-both-attack-explosion", payload => {
      apply_explosion.apply(this, unpackPayload(payload));
    });
  });
  exports.apply_explosion_global = apply_explosion_global;


  const apply_impact = function(x, y, dmg, staDur, rad, minRad, shake, caller) {
    if(dmg == null) dmg = 0.0;
    if(dmg < 0.0001) return;
    if(staDur == null) staDur = 120.0;
    if(rad == null) rad = 40.0;
    if(rad < 0.0001) return;
    if(minRad == null) minRad = 0.0;
    if(shake == null) shake = 0.0;

    let sta = Vars.content.statusEffect("loveclab-sta-stunned");

    MDL_pos._units(x, y, rad, caller).forEachFast(unit => {
      if(!MDL_cond._isOnFloor(unit) || MDL_pos._rayBool_mobileFlr(x, y, unit.x, unit.y, minRad)) return;

      let dst = Mathf.dst(x, y, unit.x, unit.y);
      let frac = 1.0 - dst / rad;
      let dmg_fi = dmg * (Mathf.random(0.6) + 0.7) * Math.max(frac, 0.1) + VAR.dmg_impactMinDmg;

      damage(unit, dmg_fi, true);
      if(sta != null && Mathf.chance(Math.max(frac, 0.2))) unit.apply(sta, staDur);
      MDL_call.knockback(x, y, unit, dmg / 100.0, rad);
    });

    MDL_effect.showAt_shake(x, y, shake);
  };
  exports.apply_impact = apply_impact;


  const apply_lightning = function(x, y, team, dmg, amt, r, offR, color_gn, noSound) {
    if(team == null) team = Team.derelict;
    if(dmg == null) dmg = VAR.blk_lightningDmg;
    if(amt == null) amt = 1;
    if(amt < 1) return;
    if(r == null) r = 5;
    if(offR == null) offR = 2;
    if(color_gn == null) color_gn = Pal.accent;

    let i = 0;
    while(i < amt) {
      let r_fi = Math.round(r + Mathf.random() * offR);
      Lightning.create(
        team,
        MDL_color._color(color_gn),
        dmg,
        x,
        y,
        Mathf.random(360.0),
        r_fi,
      );
      i++;
    };

    if(!noSound) MDL_effect.playAt(x, y, Sounds.spark);
  };
  exports.apply_lightning = apply_lightning;
