/* ----------------------------------------
 * NOTE:
 *
 * Used to build a bullet type.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_paramBuilder = require("lovec/cls/util/builder/CLS_paramBuilder");


const MDL_content = require("lovec/mdl/MDL_content");


/* <---------- meta ----------> */


const CLS_bulletBuilder = function() {
  this.init.apply(this, arguments);
}.extendClass(CLS_paramBuilder).initClass();


CLS_bulletBuilder.prototype.init = function() {

  this.builderObj = {};

};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_bulletBuilder.prototype;


/* modification */


ptp.__range = function(rad, vel, keepVel) {
  this.builderObj.lifetime = Object.val(rad / vel, 1.0);
  this.builderObj.range = Object.val(rad, 1.0);
  this.builderObj.speed = Object.val(vel, 0.0);
  this.builderObj.keepVelocity = Object.val(keepVel, true);

  return this;
};


ptp.__rangeExtra = function(drag, accel) {
  this.builderObj.drag = Object.val(drag, 0.0);
  this.builderObj.accel = Object.val(accel, 0.0);

  return this;
};


ptp.__damage = function(dmg, sDmg, sDmgRad, shouldPierce, isScaled) {
  this.builderObj.dmg = Object.val(dmg, 0.0);
  this.builderObj.splashDamage = Object.val(sDmg, -1.0);
  this.builderObj.splashDamageRadius = Object.val(sDmgRad, -1.0);
  this.builderObj.splashDamagePierce = Object.val(shouldPierce, false);
  this.builderObj.scaledSplashDamage = Object.val(isScaled, false);

  return this;
};


ptp.__multiplier = function(bDmgMtp, shieldDmgMtp) {
  this.builderObj.buildingDamageMultiplier = Object.val(bDmgMtp, 1.0);
  this.builderObj.shieldDamageMultiplier = Object.val(shieldDmgMtp, 1.0);

  return this;
};


ptp.__collide = function(hits, hitsAir, hitsGround, hitsTerrain, isWaterborne, isUnitOnly) {
  this.builderObj.collides = Object.val(hits, true);
  this.builderObj.collidesAir = Object.val(hitsAir, true);
  this.builderObj.collidesGround = Object.val(hitsGround, true);
  this.builderObj.collideTerrain = Object.val(hitsTerrain, false);
  this.builderObj.collideFloor = Object.val(isWaterborne, false);
  this.builderObj.underwater = Object.val(isWaterborne, false);
  this.builderObj.collidesTiles = Object.val(!isUnitOnly, true);

  return this;
};


ptp.__hit = function(hitSize, despawnHit, fragHit) {
  this.builderObj.hitSize = Object.val(hitSize, 6.0);
  this.builderObj.despawnHit = Object.val(despawnHit, true);
  this.builderObj.fragOnHit = Object.val(fragHit, true);

  return this;
};


ptp.__visual = function(spr, lay, color1, color2, w, h, shrinkX, shrinkY, spin) {
  this.builderObj.sprite = Object.val(spr, "circle");
  this.builderObj.layer = Object.val(lay, VAR.lay_bulBase);
  this.builderObj.frontColor = Object.val(color2, Color.white);
  this.builderObj.backColor = Object.val(color1, Pal.accent);
  this.builderObj.width = Object.val(w, 6.0);
  this.builderObj.height = Object.val(h, 6.0);
  this.builderObj.shrinkX = Object.val(shrinkX, 0.0);
  this.builderObj.shrinkY = Object.val(shrinkY, 0.5);
  this.builderObj.spin = Object.val(spin, 0.0);

  return this;
};


ptp.__light = function(hasLight, color) {
  this.builderObj.lightOpacity = hasLight ? 0.65 : 0.0;
  this.builderObj.lightColor = Object.val(color, Pal.powerLight);

  return this;
};


ptp.__shake = function(despawnShake, hitShake) {
  this.builderObj.despawnShake = Object.val(despawnShake, 0.0);
  this.builderObj.hitShake = Object.val(hitSize, 0.0);

  return this;
};


ptp.__effect = function(color, despawnEff, hitEff, shootEff, smokeEff, chargeEff) {
  this.builderObj.hitColor = Object.val(color, Pal.accent);
  this.builderObj.despawnEffect = Object.val(despawnEff, Fx.none);
  this.builderObj.hitEffect = Object.val(hitEff, Fx.none);
  this.builderObj.shootEffect = Object.val(shootEff, Fx.none);
  this.builderObj.smokeEffect = Object.val(smokeEff, Fx.none);
  this.builderObj.chargeEffect = Object.val(chargeEff, Fx.none);

  return this;
};


ptp.__sound = function(despawnSeStr, hitSeStr) {
  this.builderObj.despawnSound = despawnSeStr == null ? Sounds.none : Vars.tree.loadSound(despawnSeStr);
  this.builderObj.hitSound = hitSeStr == null ? Sounds.none : Vars.tree.loadSound(hitSeStr);

  return this;
};


ptp.__trail = function(color, len, w, minVel) {
  this.builderObj.trailColor = Object.val(color, Color.missileYellowBack);
  this.builderObj.trailLength = Object.val(len, -1);
  this.builderObj.trailWidth = Object.val(w, 2.0);
  this.builderObj.trailMinVelocity = Object.val(minVel, 0.0);

  return this;
};


ptp.__trailOsc = function(mag, scl) {
  this.builderObj.trailSinMag = Object.val(mag, 0.0);
  this.builderObj.trailSinScl = Object.val(mag, 3.0);

  return this;
};


ptp.__trailEffect = function(trailEff, intv, shouldRot, interp) {
  this.builderObj.trailEffect = Object.val(trailEff, Fx.none);
  this.builderObj.trailInterval = Object.val(intv, 1.0);
  this.builderObj.trailRotation = Object.val(shouldRot, false);
  this.builderObj.trailInterp = Object.val(interp, Interp.one);

  return this;
};


ptp.__knockback = function(knockback, shouldImpact, recoil) {
  this.builderObj.knockback = Object.val(knockback, 0.0);
  this.builderObj.impact = Object.val(shouldImpact, false);
  this.builderObj.recoil = Object.val(recoil, 0.0);

  return this;
};


ptp.__pierce = function(cap, piercesBuilding, dmgFactor) {
  this.builderObj.pierce = true
  this.builderObj.pierceCap = Object.val(cap, -1);
  this.builderObj.pierceBuilding = Object.val(piercesBuilding, false);
  this.builderObj.pierceDamageFactor = Object.val(dmgFactor, 0.0);

  return this;
};


ptp.__frag = function(fragBtp, amt, offSpd, offLifetime) {
  this.builderObj.fragBullet = fragBtp;
  this.builderObj.fragBullets = Object.val(amt, 7);
  this.builderObj.fragVelocityMin = 1.0 - Object.val(offSpd, 0.0);
  this.builderObj.fragVelocityMax = 1.0 + Object.val(offSpd, 0.0);
  this.builderObj.fragLifeMin = 1.0 - Object.val(offLifetime, 0.0);
  this.builderObj.fragLifeMax = 1.0 + Object.val(offLifetime, 0.0);

  return this;
};


ptp.__fragShape = function(randomSpread, uniformSpread, ang) {
  this.builderObj.fragRandomSpread = Object.val(randomSpread, 360.0);
  this.builderObj.fragSpread = Object.val(uniformSpread, 0.0);
  this.builderObj.fragAngle = Object.val(ang, 0.0);

  return this;
};


ptp.__intv = function(intvBtp, intv, amt) {
  this.builderObj.intervalBullet = intvBtp;
  this.builderObj.bulletInterval = Object.val(intv, 20.0);
  this.builderObj.intervalBullets = Object.val(amt, 1);

  return this;
};


ptp.__intvShape = function(randomSpread, uniformSpread, ang) {
  this.builderObj.intervalRandomSpread = Object.val(randomSpread, 360.0);
  this.builderObj.intervalSpread = Object.val(uniformSpread, 0.0);
  this.builderObj.intervalAngle = Object.val(ang, 0.0);

  return this;
};


ptp.__homing = function(pow, rad, delay, followCursorSpd) {
  this.builderObj.homingPower = Object.val(pow, 0.0);
  this.builderObj.homingRange = Object.val(rad, 50.0);
  this.builderObj.homingDelay = Object.val(delay, -1.0);
  this.builderObj.followAimSpeed = Object.val(followCursorSpd, 0.0);

  return this;
};


ptp.__circle = function(spdMtp, rad, smoothRad) {
  this.builderObj.circleShooter = true;
  this.builderObj.circleShooterRotateSpeed = Object.val(spdMtp, 0.3);
  this.builderObj.circleShooterRadius = Object.val(rad, 13.0);
  this.builderObj.circleShooterRadiusSmooth = Object.val(smoothRad, 10.0);

  return this;
};


ptp.__fire = function(createsFire, rad, amt, p) {
  this.builderObj.makeFire = Object.val(createsFire, false);
  this.builderObj.incendSpread = Object.val(rad, 8.0);
  this.builderObj.incendAmount = Object.val(amt, 0);
  this.builderObj.incendChance = Object.val(p, 1.0);

  return this;
};


ptp.__puddle = function(liq_gn, rad, amt, puddleAmt) {
  this.builderObj.puddleLiquid = Object.val(MDL_content._ct(liq_gn, "rs"), Liquids.water);
  this.builderObj.puddleRange = Object.val(rad, 30.0);
  this.builderObj.puddles = Object.val(amt, 1);
  this.builderObj.puddleAmount = Object.val(puddleAmt, 5.0);

  return this;
};


ptp.__suppress = function(rad, dur, color, pScl) {
  this.builderObj.suppressionRange = Object.val(rad, -1.0);
  this.builderObj.suppressionDuration = Object.val(dur, 480.0);
  this.builderObj.suppressColor = Object.val(color, Pal.sapBullet);
  this.builderObj.suppressionEffectChance = Object.val(pScl, 1.0) * 50.0;

  return this;
};


ptp.__sticky = function(lifetimeExt) {
  this.builderObj.sticky = true;
  this.builderObj.stickyExtraLifetime = Object.val(lifetimeExt, 0.0);

  return this;
};


ptp.__trueDamage = function() {
  this.builderObj.pierceArmor = true;

  return this;
};


ptp.__lifesteal = function(frac) {
  this.builderObj.lifesteal = Object.val(frac, 0.0);

  return this;
};


ptp.__heal = function(amt, perc, color) {
  this.builderObj.healAmount = Object.val(amt, 0.0);
  this.builderObj.healPercent = Object.val(perc, 0.0);
  this.builderObj.healColor = Object.val(color, Pal.heal);

  return this;
};


ptp.__status = function(sta_gn, dur) {
  this.builderObj.status = Object.val(MDL_content._ct(sta_gn, "sta"), StatusEffects.none);
  this.builderObj.statusDuration = Object.val(dur, 480.0);

  return this;
};


ptp.__spawnUnit = function(utp) {
  this.builderObj.instantDisappear = true;
  this.builderObj.spawnUnit = utp;

  return this;
};


ptp.__despawnUnit = function(utp, amt, p, rad, outwards) {
  this.builderObj.despawnUnit = utp;
  this.builderObj.despawnUnitCount = Object.val(amt, 1);
  this.builderObj.despawnUnitChance = Object.val(p, 1.0);
  this.builderObj.despawnUnitRadius = Object.val(rad, 0.1);
  this.builderObj.faceOutwards = Object.val(outwards, false);

  return this;
};


ptp.__paramLaser1 = function(len, w, falloff, sideLen, sideW, sideAng) {
  this.builderObj.length = Object.val(len, 160.0);
  this.builderObj.width = Object.val(w, 15.0);
  this.builderObj.lengthFalloff = Object.val(falloff, 0.5);
  this.builderObj.sideLength = Object.val(sideLen, 30.0);
  this.builderObj.sideWidth = Object.val(sideW, 0.7);
  this.builderObj.sideAngle = Object.val(sideAng, 90.0);

  return this;
};


ptp.__paramFlak = function(flakIntv, flakDelay, exploR, exploDelay) {
  this.builderObj.flakInterval = Object.val(flakIntv, 6.0);
  this.builderObj.flakDelay = Object.val(flakDelay, 0.0);
  this.builderObj.explodeRange = Object.val(exploR, 30.0);
  this.builderObj.explodeDelay = Object.val(exploDelay, 5.0);

  return this;
};


ptp.__paramFire1 = function(rad, minVel, maxVel) {
  this.builderObj.radius = Object.val(rad, 3.0);
  this.builderObj.velMin = Object.val(minVel, 0.6);
  this.builderObj.velMax = Object.val(maxVel, 2.6);

  return this;
};


ptp.__paramFire2 = function(color_f, color_m, color_t, pScl) {
  this.builderObj.colorFrom = Object.val(color_f, Pal.lightFlame);
  this.builderObj.colorMid = Object.val(color_m, Pal.darkFlame);
  this.builderObj.colorTo = Object.val(color_t, Color.gray);
  this.builderObj.fireTrailChance = Object.val(pScl, 1.0) * 0.04;
  this.builderObj.fireEffectChance = Object.val(pScl, 1.0) * 0.1;
  this.builderObj.fireEffectChance2 = Object.val(pScl, 1.0) * 0.1;

  return this;
};


ptp.__paramLiquid = function(liq_gn, sizePuddle, sizeOrb, timeBoil) {
  this.builderObj.liquid = Object.val(MDL_content._ct(liq_gn, "rs"), null);
  this.builderObj.puddleSize = Object.val(sizePuddle, 6.0);
  this.builderObj.orbSize = Object.val(sizeOrb, 3.0);
  this.builderObj.boilTime = Object.val(timeBoil, 5.0);

  return this;
};


ptp.__paramLightning = function(len, randLen, color) {
  this.builderObj.lightningLength = Object.val(len, 25);
  this.builderObj.lightningLengthRand = Object.val(randLen, 5);
  this.builderObj.lightningColor = Object.val(color, Pal.lancerLaser);

  return this;
};


ptp.__paramLaser2 = function(colors, laserEff) {
  this.builderObj.colors = Object.val(colors, []);
  this.builderObj.laserEffect = Object.val(laserEff, Fx.lancerLaserShootSmoke);

  return this;
};


ptp.__paramLaser3 = function(arcDelay, arcSpacing, arcRandAng) {
  this.builderObj.lightningDelay = Object.val(arcDelay, 0.1);
  this.builderObj.lightningSpacing = Object.val(arcSpacing, -1.0);
  this.builderObj.lightningAngleRand = Object.val(arcRandAng, 0.0);

  return this;
};


ptp.__paramSap1 = function(len, randLen, w, sapFrac) {
  this.builderObj.length = Object.val(len, 100.0);
  this.builderObj.lengthRand = Object.val(randLen, 0.0);
  this.builderObj.width = Object.val(w, 0.4);
  this.builderObj.sapStrength = Object.val(sapFrac, 0.5);

  return this;
};


ptp.__paramSap2 = function(color, spr) {
  this.builderObj.color = Object.val(color, Color.white.cpy());
  this.builderObj.spr = Object.val(spr, "laser");

  return this;
};


ptp.__paramRail1 = function(len) {
  this.builderObj.length = Object.val(len, 100.0);

  return this;
};


ptp.__paramRail2 = function(lineEff, pointEff, pointEffSpacing, pierceEff, endEff) {
  this.builderObj.lineEffect = Object.val(lineEff, Fx.none);
  this.builderObj.pointEffect = Object.val(pointEff, Fx.none);
  this.builderObj.pointEffectSpace = Object.val(pointEffSpacing, 20.0);
  this.builderObj.pierceEffect = Object.val(pierceEff, Fx.hitBulletSmall);
  this.builderObj.endEffect = Object.val(endEff, Fx.none);

  return this;
};


ptp.__paramContinuousLaser1 = function(len, w, lenFront, lenBack, stroke_f, stroke_t, pointyScl) {
  this.builderObj.length = Object.val(len, 150.0);
  this.builderObj.width = Object.val(w, 9.0);
  this.builderObj.frontLength = Object.val(lenFront, 35.0);
  this.builderObj.backLength = Object.val(lenBack, 7.0);
  this.builderObj.strokeFrom = Object.val(stroke_f, 2.0);
  this.builderObj.strokeTo = Object.val(stroke_t, 0.5);
  this.builderObj.pointyScaling = Object.val(pointyScl, 0.75);

  return this;
};


ptp.__paramContinuousLaser2 = function(colors, shake, timeFade, strokeLight, oscScl, oscMag) {
  this.builderObj.colors = Object.val(colors, []);
  this.builderObj.shake = Object.val(shake, 0.0);
  this.builderObj.fadeTime = Object.val(timeFade, 16.0);
  this.builderObj.strokeLight = Object.val(strokeLight, 40.0);
  this.builderObj.oscScl = Object.val(oscScl, 0.8);
  this.builderObj.oscMag = Object.val(oscMag, 1.5);

  return this;
};


ptp.__paramContinuousFlame1 = function(len, w, interp) {
  this.builderObj.length = Object.val(len, 150.0);
  this.builderObj.width = Object.val(w, 3.7);
  this.builderObj.lengthInterp = Object.val(interp, Interp.slope);

  return this;
};


ptp.__paramContinuousFlame2 = function(colors, strokeLight, oscScl, oscMag) {
  this.builderObj.colors = Object.val(colors, []);
  this.builderObj.lightStroke = Object.val(strokeLight, 40.0);
  this.builderObj.oscScl = Object.val(oscScl, 1.2);
  this.builderObj.oscMag = Object.val(oscMag, 0.02);

  return this;
};


ptp.__paramContinuousFlame3 = function(shouldDrawFlare, color, w, len, innerScl, innerLenScl, shouldRot, rotSpd, z) {
  this.builderObj.drawFlare = Object.val(shouldDrawFlare, true);
  this.builderObj.flareColor = Object.val(color, Color.valueOf("e189f5"));
  this.builderObj.flareWidth = Object.val(w, 3.0);
  this.builderObj.flareLength = Object.val(len, 40.0);
  this.builderObj.flareInnerScl = Object.val(innerScl, 0.5);
  this.builderObj.flareInnerLenScl = Object.val(innerLenScl, 0.5);
  this.builderObj.rotateFlare = Object.val(shouldRot, false);
  this.builderObj.flareRotSpeed = Object.val(rotSpd, 1.2);
  if(z != null) this.builderObj.flareLayer = z;

  return this;
};


ptp.__paramEmp1 = function(rad, dur, incMtp, decMtp) {
  this.builderObj.radius = Object.val(rad, 100.0);
  this.builderObj.timeDuration = Object.val(dur, 600.0);
  this.builderObj.timerIncrease = Object.val(incMtp, 2.5);
  this.builderObj.powerSclDecrease = 1.0 - Object.val(decMtp, 0.8);

  return this;
};


ptp.__paramEmp2 = function(applyEff, hitEff, chainEff) {
  this.builderObj.applyEffect = Object.val(applyEff, Fx.heal);
  this.builderObj.hitPowerEffect = Object.val(hitEff, Fx.hitEmpSpark);
  this.builderObj.chainEffect = Object.val(chainEff, Fx.chainEmp);

  return this;
};


ptp.__paramEmp3 = function(powDmgMtp, hitsUnit, unitDmgMtp) {
  this.builderObj.powerDamageScl = Object.val(powDmgMtp, 2.0);
  this.builderObj.hitUnits = Object.val(hitsUnit, true);
  this.builderObj.unitDamageScl = Object.val(unitDmgMtp, 0.7);

  return this;
};


module.exports = CLS_bulletBuilder;
