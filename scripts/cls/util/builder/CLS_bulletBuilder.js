/* ----------------------------------------
 * NOTE:
 *
 * Used to build a bullet type.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_paramBuilder = require("lovec/cls/util/builder/CLS_paramBuilder");


const MDL_content = require("lovec/mdl/MDL_content");


/* <---------- meta ----------> */


const CLS_bulletBuilder = newClass().extendClass(CLS_paramBuilder).initClass();


CLS_bulletBuilder.prototype.init = function() {
  this.builderObj = {};
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_bulletBuilder.prototype;


ptp.__range = function(rad, vel, keepVel) {
  this.builderObj.lifetime = tryVal(rad / vel, 1.0);
  this.builderObj.range = tryVal(rad, 1.0);
  this.builderObj.speed = tryVal(vel, 0.0);
  this.builderObj.keepVelocity = tryVal(keepVel, true);

  return this;
};


ptp.__rangeExtra = function(drag, accel) {
  this.builderObj.drag = tryVal(drag, 0.0);
  this.builderObj.accel = tryVal(accel, 0.0);

  return this;
};


ptp.__damage = function(dmg, sDmg, sDmgRad, shouldPierce, isScaled) {
  this.builderObj.dmg = tryVal(dmg, 0.0);
  this.builderObj.splashDamage = tryVal(sDmg, -1.0);
  this.builderObj.splashDamageRadius = tryVal(sDmgRad, -1.0);
  this.builderObj.splashDamagePierce = tryVal(shouldPierce, false);
  this.builderObj.scaledSplashDamage = tryVal(isScaled, false);

  return this;
};


ptp.__multiplier = function(bDmgMtp, shieldDmgMtp) {
  this.builderObj.buildingDamageMultiplier = tryVal(bDmgMtp, 1.0);
  this.builderObj.shieldDamageMultiplier = tryVal(shieldDmgMtp, 1.0);

  return this;
};


ptp.__collide = function(hits, hitsAir, hitsGround, hitsTerrain, isWaterborne, isUnitOnly) {
  this.builderObj.collides = tryVal(hits, true);
  this.builderObj.collidesAir = tryVal(hitsAir, true);
  this.builderObj.collidesGround = tryVal(hitsGround, true);
  this.builderObj.collideTerrain = tryVal(hitsTerrain, false);
  this.builderObj.collideFloor = tryVal(isWaterborne, false);
  this.builderObj.underwater = tryVal(isWaterborne, false);
  this.builderObj.collidesTiles = tryVal(!isUnitOnly, true);

  return this;
};


ptp.__hit = function(hitSize, despawnHit, fragHit) {
  this.builderObj.hitSize = tryVal(hitSize, 6.0);
  this.builderObj.despawnHit = tryVal(despawnHit, true);
  this.builderObj.fragOnHit = tryVal(fragHit, true);

  return this;
};


ptp.__visual = function(spr, lay, color1, color2, w, h, shrinkX, shrinkY, spin) {
  this.builderObj.sprite = tryVal(spr, "circle");
  this.builderObj.layer = tryVal(lay, VAR.lay_bulBase);
  this.builderObj.frontColor = tryVal(color2, Color.white);
  this.builderObj.backColor = tryVal(color1, Pal.accent);
  this.builderObj.width = tryVal(w, 6.0);
  this.builderObj.height = tryVal(h, 6.0);
  this.builderObj.shrinkX = tryVal(shrinkX, 0.0);
  this.builderObj.shrinkY = tryVal(shrinkY, 0.5);
  this.builderObj.spin = tryVal(spin, 0.0);

  return this;
};


ptp.__light = function(hasLight, color) {
  this.builderObj.lightOpacity = hasLight ? 0.65 : 0.0;
  this.builderObj.lightColor = tryVal(color, Pal.powerLight);

  return this;
};


ptp.__shake = function(despawnShake, hitShake) {
  this.builderObj.despawnShake = tryVal(despawnShake, 0.0);
  this.builderObj.hitShake = tryVal(hitSize, 0.0);

  return this;
};


ptp.__effect = function(color, despawnEff, hitEff, shootEff, smokeEff, chargeEff) {
  this.builderObj.hitColor = tryVal(color, Pal.accent);
  this.builderObj.despawnEffect = tryVal(despawnEff, Fx.none);
  this.builderObj.hitEffect = tryVal(hitEff, Fx.none);
  this.builderObj.shootEffect = tryVal(shootEff, Fx.none);
  this.builderObj.smokeEffect = tryVal(smokeEff, Fx.none);
  this.builderObj.chargeEffect = tryVal(chargeEff, Fx.none);

  return this;
};


ptp.__sound = function(despawnSeStr, hitSeStr) {
  this.builderObj.despawnSound = despawnSeStr == null ? Sounds.none : Vars.tree.loadSound(despawnSeStr);
  this.builderObj.hitSound = hitSeStr == null ? Sounds.none : Vars.tree.loadSound(hitSeStr);

  return this;
};


ptp.__trail = function(color, len, w, minVel) {
  this.builderObj.trailColor = tryVal(color, Color.missileYellowBack);
  this.builderObj.trailLength = tryVal(len, -1);
  this.builderObj.trailWidth = tryVal(w, 2.0);
  this.builderObj.trailMinVelocity = tryVal(minVel, 0.0);

  return this;
};


ptp.__trailOsc = function(mag, scl) {
  this.builderObj.trailSinMag = tryVal(mag, 0.0);
  this.builderObj.trailSinScl = tryVal(mag, 3.0);

  return this;
};


ptp.__trailEffect = function(trailEff, intv, shouldRot, interp) {
  this.builderObj.trailEffect = tryVal(trailEff, Fx.none);
  this.builderObj.trailInterval = tryVal(intv, 1.0);
  this.builderObj.trailRotation = tryVal(shouldRot, false);
  this.builderObj.trailInterp = tryVal(interp, Interp.one);

  return this;
};


ptp.__knockback = function(knockback, shouldImpact, recoil) {
  this.builderObj.knockback = tryVal(knockback, 0.0);
  this.builderObj.impact = tryVal(shouldImpact, false);
  this.builderObj.recoil = tryVal(recoil, 0.0);

  return this;
};


ptp.__pierce = function(cap, piercesBuilding, dmgFactor) {
  this.builderObj.pierce = true
  this.builderObj.pierceCap = tryVal(cap, -1);
  this.builderObj.pierceBuilding = tryVal(piercesBuilding, false);
  this.builderObj.pierceDamageFactor = tryVal(dmgFactor, 0.0);

  return this;
};


ptp.__frag = function(fragBtp, amt, offSpd, offLifetime) {
  this.builderObj.fragBullet = fragBtp;
  this.builderObj.fragBullets = tryVal(amt, 7);
  this.builderObj.fragVelocityMin = 1.0 - tryVal(offSpd, 0.0);
  this.builderObj.fragVelocityMax = 1.0 + tryVal(offSpd, 0.0);
  this.builderObj.fragLifeMin = 1.0 - tryVal(offLifetime, 0.0);
  this.builderObj.fragLifeMax = 1.0 + tryVal(offLifetime, 0.0);

  return this;
};


ptp.__fragShape = function(randomSpread, uniformSpread, ang) {
  this.builderObj.fragRandomSpread = tryVal(randomSpread, 360.0);
  this.builderObj.fragSpread = tryVal(uniformSpread, 0.0);
  this.builderObj.fragAngle = tryVal(ang, 0.0);

  return this;
};


ptp.__intv = function(intvBtp, intv, amt) {
  this.builderObj.intervalBullet = intvBtp;
  this.builderObj.bulletInterval = tryVal(intv, 20.0);
  this.builderObj.intervalBullets = tryVal(amt, 1);

  return this;
};


ptp.__intvShape = function(randomSpread, uniformSpread, ang) {
  this.builderObj.intervalRandomSpread = tryVal(randomSpread, 360.0);
  this.builderObj.intervalSpread = tryVal(uniformSpread, 0.0);
  this.builderObj.intervalAngle = tryVal(ang, 0.0);

  return this;
};


ptp.__homing = function(pow, rad, delay, followCursorSpd) {
  this.builderObj.homingPower = tryVal(pow, 0.0);
  this.builderObj.homingRange = tryVal(rad, 50.0);
  this.builderObj.homingDelay = tryVal(delay, -1.0);
  this.builderObj.followAimSpeed = tryVal(followCursorSpd, 0.0);

  return this;
};


ptp.__circle = function(spdMtp, rad, smoothRad) {
  this.builderObj.circleShooter = true;
  this.builderObj.circleShooterRotateSpeed = tryVal(spdMtp, 0.3);
  this.builderObj.circleShooterRadius = tryVal(rad, 13.0);
  this.builderObj.circleShooterRadiusSmooth = tryVal(smoothRad, 10.0);

  return this;
};


ptp.__fire = function(createsFire, rad, amt, p) {
  this.builderObj.makeFire = tryVal(createsFire, false);
  this.builderObj.incendSpread = tryVal(rad, 8.0);
  this.builderObj.incendAmount = tryVal(amt, 0);
  this.builderObj.incendChance = tryVal(p, 1.0);

  return this;
};


ptp.__puddle = function(liq_gn, rad, amt, puddleAmt) {
  this.builderObj.puddleLiquid = tryVal(MDL_content._ct(liq_gn, "rs"), Liquids.water);
  this.builderObj.puddleRange = tryVal(rad, 30.0);
  this.builderObj.puddles = tryVal(amt, 1);
  this.builderObj.puddleAmount = tryVal(puddleAmt, 5.0);

  return this;
};


ptp.__suppress = function(rad, dur, color, pScl) {
  this.builderObj.suppressionRange = tryVal(rad, -1.0);
  this.builderObj.suppressionDuration = tryVal(dur, 480.0);
  this.builderObj.suppressColor = tryVal(color, Pal.sapBullet);
  this.builderObj.suppressionEffectChance = tryVal(pScl, 1.0) * 50.0;

  return this;
};


ptp.__sticky = function(lifetimeExt) {
  this.builderObj.sticky = true;
  this.builderObj.stickyExtraLifetime = tryVal(lifetimeExt, 0.0);

  return this;
};


ptp.__trueDamage = function() {
  this.builderObj.pierceArmor = true;

  return this;
};


ptp.__lifesteal = function(frac) {
  this.builderObj.lifesteal = tryVal(frac, 0.0);

  return this;
};


ptp.__heal = function(amt, perc, color) {
  this.builderObj.healAmount = tryVal(amt, 0.0);
  this.builderObj.healPercent = tryVal(perc, 0.0);
  this.builderObj.healColor = tryVal(color, Pal.heal);

  return this;
};


ptp.__status = function(sta_gn, dur) {
  this.builderObj.status = tryVal(MDL_content._ct(sta_gn, "sta"), StatusEffects.none);
  this.builderObj.statusDuration = tryVal(dur, 480.0);

  return this;
};


ptp.__spawnUnit = function(utp) {
  this.builderObj.instantDisappear = true;
  this.builderObj.spawnUnit = utp;

  return this;
};


ptp.__despawnUnit = function(utp, amt, p, rad, outwards) {
  this.builderObj.despawnUnit = utp;
  this.builderObj.despawnUnitCount = tryVal(amt, 1);
  this.builderObj.despawnUnitChance = tryVal(p, 1.0);
  this.builderObj.despawnUnitRadius = tryVal(rad, 0.1);
  this.builderObj.faceOutwards = tryVal(outwards, false);

  return this;
};


ptp.__paramLaser1 = function(len, w, falloff, sideLen, sideW, sideAng) {
  this.builderObj.length = tryVal(len, 160.0);
  this.builderObj.width = tryVal(w, 15.0);
  this.builderObj.lengthFalloff = tryVal(falloff, 0.5);
  this.builderObj.sideLength = tryVal(sideLen, 30.0);
  this.builderObj.sideWidth = tryVal(sideW, 0.7);
  this.builderObj.sideAngle = tryVal(sideAng, 90.0);

  return this;
};


ptp.__paramFlak = function(flakIntv, flakDelay, exploR, exploDelay) {
  this.builderObj.flakInterval = tryVal(flakIntv, 6.0);
  this.builderObj.flakDelay = tryVal(flakDelay, 0.0);
  this.builderObj.explodeRange = tryVal(exploR, 30.0);
  this.builderObj.explodeDelay = tryVal(exploDelay, 5.0);

  return this;
};


ptp.__paramFire1 = function(rad, minVel, maxVel) {
  this.builderObj.radius = tryVal(rad, 3.0);
  this.builderObj.velMin = tryVal(minVel, 0.6);
  this.builderObj.velMax = tryVal(maxVel, 2.6);

  return this;
};


ptp.__paramFire2 = function(color_f, color_m, color_t, pScl) {
  this.builderObj.colorFrom = tryVal(color_f, Pal.lightFlame);
  this.builderObj.colorMid = tryVal(color_m, Pal.darkFlame);
  this.builderObj.colorTo = tryVal(color_t, Color.gray);
  this.builderObj.fireTrailChance = tryVal(pScl, 1.0) * 0.04;
  this.builderObj.fireEffectChance = tryVal(pScl, 1.0) * 0.1;
  this.builderObj.fireEffectChance2 = tryVal(pScl, 1.0) * 0.1;

  return this;
};


ptp.__paramLiquid = function(liq_gn, sizePuddle, sizeOrb, timeBoil) {
  this.builderObj.liquid = tryVal(MDL_content._ct(liq_gn, "rs"), null);
  this.builderObj.puddleSize = tryVal(sizePuddle, 6.0);
  this.builderObj.orbSize = tryVal(sizeOrb, 3.0);
  this.builderObj.boilTime = tryVal(timeBoil, 5.0);

  return this;
};


ptp.__paramLightning = function(len, randLen, color) {
  this.builderObj.lightningLength = tryVal(len, 25);
  this.builderObj.lightningLengthRand = tryVal(randLen, 5);
  this.builderObj.lightningColor = tryVal(color, Pal.lancerLaser);

  return this;
};


ptp.__paramLaser2 = function(colors, laserEff) {
  this.builderObj.colors = tryVal(colors, []);
  this.builderObj.laserEffect = tryVal(laserEff, Fx.lancerLaserShootSmoke);

  return this;
};


ptp.__paramLaser3 = function(arcDelay, arcSpacing, arcRandAng) {
  this.builderObj.lightningDelay = tryVal(arcDelay, 0.1);
  this.builderObj.lightningSpacing = tryVal(arcSpacing, -1.0);
  this.builderObj.lightningAngleRand = tryVal(arcRandAng, 0.0);

  return this;
};


ptp.__paramSap1 = function(len, randLen, w, sapFrac) {
  this.builderObj.length = tryVal(len, 100.0);
  this.builderObj.lengthRand = tryVal(randLen, 0.0);
  this.builderObj.width = tryVal(w, 0.4);
  this.builderObj.sapStrength = tryVal(sapFrac, 0.5);

  return this;
};


ptp.__paramSap2 = function(color, spr) {
  this.builderObj.color = tryVal(color, Color.white.cpy());
  this.builderObj.spr = tryVal(spr, "laser");

  return this;
};


ptp.__paramRail1 = function(len) {
  this.builderObj.length = tryVal(len, 100.0);

  return this;
};


ptp.__paramRail2 = function(lineEff, pointEff, pointEffSpacing, pierceEff, endEff) {
  this.builderObj.lineEffect = tryVal(lineEff, Fx.none);
  this.builderObj.pointEffect = tryVal(pointEff, Fx.none);
  this.builderObj.pointEffectSpace = tryVal(pointEffSpacing, 20.0);
  this.builderObj.pierceEffect = tryVal(pierceEff, Fx.hitBulletSmall);
  this.builderObj.endEffect = tryVal(endEff, Fx.none);

  return this;
};


ptp.__paramContinuousLaser1 = function(len, w, lenFront, lenBack, stroke_f, stroke_t, pointyScl) {
  this.builderObj.length = tryVal(len, 150.0);
  this.builderObj.width = tryVal(w, 9.0);
  this.builderObj.frontLength = tryVal(lenFront, 35.0);
  this.builderObj.backLength = tryVal(lenBack, 7.0);
  this.builderObj.strokeFrom = tryVal(stroke_f, 2.0);
  this.builderObj.strokeTo = tryVal(stroke_t, 0.5);
  this.builderObj.pointyScaling = tryVal(pointyScl, 0.75);

  return this;
};


ptp.__paramContinuousLaser2 = function(colors, shake, timeFade, strokeLight, oscScl, oscMag) {
  this.builderObj.colors = tryVal(colors, []);
  this.builderObj.shake = tryVal(shake, 0.0);
  this.builderObj.fadeTime = tryVal(timeFade, 16.0);
  this.builderObj.strokeLight = tryVal(strokeLight, 40.0);
  this.builderObj.oscScl = tryVal(oscScl, 0.8);
  this.builderObj.oscMag = tryVal(oscMag, 1.5);

  return this;
};


ptp.__paramContinuousFlame1 = function(len, w, interp) {
  this.builderObj.length = tryVal(len, 150.0);
  this.builderObj.width = tryVal(w, 3.7);
  this.builderObj.lengthInterp = tryVal(interp, Interp.slope);

  return this;
};


ptp.__paramContinuousFlame2 = function(colors, strokeLight, oscScl, oscMag) {
  this.builderObj.colors = tryVal(colors, []);
  this.builderObj.lightStroke = tryVal(strokeLight, 40.0);
  this.builderObj.oscScl = tryVal(oscScl, 1.2);
  this.builderObj.oscMag = tryVal(oscMag, 0.02);

  return this;
};


ptp.__paramContinuousFlame3 = function(shouldDrawFlare, color, w, len, innerScl, innerLenScl, shouldRot, rotSpd, z) {
  this.builderObj.drawFlare = tryVal(shouldDrawFlare, true);
  this.builderObj.flareColor = tryVal(color, Color.valueOf("e189f5"));
  this.builderObj.flareWidth = tryVal(w, 3.0);
  this.builderObj.flareLength = tryVal(len, 40.0);
  this.builderObj.flareInnerScl = tryVal(innerScl, 0.5);
  this.builderObj.flareInnerLenScl = tryVal(innerLenScl, 0.5);
  this.builderObj.rotateFlare = tryVal(shouldRot, false);
  this.builderObj.flareRotSpeed = tryVal(rotSpd, 1.2);
  if(z != null) this.builderObj.flareLayer = z;

  return this;
};


ptp.__paramEmp1 = function(rad, dur, incMtp, decMtp) {
  this.builderObj.radius = tryVal(rad, 100.0);
  this.builderObj.timeDuration = tryVal(dur, 600.0);
  this.builderObj.timerIncrease = tryVal(incMtp, 2.5);
  this.builderObj.powerSclDecrease = 1.0 - tryVal(decMtp, 0.8);

  return this;
};


ptp.__paramEmp2 = function(applyEff, hitEff, chainEff) {
  this.builderObj.applyEffect = tryVal(applyEff, Fx.heal);
  this.builderObj.hitPowerEffect = tryVal(hitEff, Fx.hitEmpSpark);
  this.builderObj.chainEffect = tryVal(chainEff, Fx.chainEmp);

  return this;
};


ptp.__paramEmp3 = function(powDmgMtp, hitsUnit, unitDmgMtp) {
  this.builderObj.powerDamageScl = tryVal(powDmgMtp, 2.0);
  this.builderObj.hitUnits = tryVal(hitsUnit, true);
  this.builderObj.unitDamageScl = tryVal(unitDmgMtp, 0.7);

  return this;
};


module.exports = CLS_bulletBuilder;
