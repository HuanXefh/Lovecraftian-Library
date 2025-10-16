/* ----------------------------------------
 * NOTE:
 *
 * Used to build a weapon.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_paramBuilder = require("lovec/cls/util/builder/CLS_paramBuilder");


/* <---------- meta ----------> */


const CLS_weaponBuilder = function() {
  this.init.apply(this, arguments);
}.extendClass(CLS_paramBuilder).initClass();


CLS_weaponBuilder.prototype.init = function() {

  this.builderObj = {};

};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_weaponBuilder.prototype;


/* modification */


ptp.name = function(nm) {
  this.builderObj.name = tryVal(nm, "");

  return this;
};


ptp.stat = function(shouldDisplay, showSprite) {
  this.builderObj.display = tryVal(shouldDisplay, true);
  this.builderObj.showStatSprite = tryVal(showSprite, true);

  return this;
};


ptp.control = function(controllable, aiControllable) {
  this.builderObj.controllable = tryVal(controllable, true);
  this.builderObj.aiControllable = tryVal(aiControllable, true);

  return this;
};


ptp.ammo = function(useAmmo, ammoItm) {
  this.builderObj.useAmmo = tryVal(useAmmo, true);

  return this;
};


ptp.pos = function(x, y, shootX, shootY, randX, randY) {
  this.builderObj.x = tryVal(x, 0.0);
  this.builderObj.y = tryVal(y, 0.0);
  this.builderObj.shootX = tryVal(shootX, 0.0);
  this.builderObj.shootY = tryVal(shootY, 0.0);
  this.builderObj.xRand = tryVal(randX, 0.0);
  this.builderObj.yRand = tryVal(randY, 0.0);

  return this;
};


ptp.draw = function(offZ, isTop, radSha) {
  this.builderObj.layerOffset = tryVal(offZ, 0.0);
  this.builderObj.top = tryVal(isTop, true);
  this.builderObj.shadow = tryVal(radSha, -1.0);

  return this;
};


ptp.effect = function(shouldParentize, ejectEff) {
  this.builderObj.shouldParentize = tryVal(shouldParentize, true);
  this.builderObj.ejectEffect = tryVal(ejectEff, Fx.none);

  return this;
};


ptp.sound = function(shootSeStr, chargeSeStr, noAmmoSeStr) {
  this.builderObj.shootSound = shootSeStr == null ? Sounds.none : Vars.tree.loadSound(shootSeStr);
  this.builderObj.chargeSound = chargeSeStr == null ? Sounds.none : Vars.tree.loadSound(chargeSeStr);
  this.builderObj.noAmmoSound = noAmmoSeStr == null ? Sounds.none : Vars.tree.loadSound(noAmmoSeStr);

  return this;
};


ptp.soundExt = function(minPitch, maxPitch) {
  this.builderObj.soundPitchMin = tryVal(minPitch, 0.8);
  this.builderObj.soundPitchMax = tryVal(maxPitch, 1.0);

  return this;
};


ptp.mirror = function(shouldMirror, shouldAlternate, shouldFlipSprite) {
  this.builderObj.mirror = tryVal(shouldMirror, false);
  this.builderObj.alternate = tryVal(shouldAlternate, false);
  this.builderObj.flipSprite = tryVal(shouldFlipSprite, true);

  return this;
};


ptp.rotate = function(canRot, rotSpd, baseRot, rotLimit) {
  this.builderObj.rotate = tryVal(canRot, false);
  this.builderObj.rotateSpeed = tryVal(rotSpd, 20.0);
  this.builderObj.baseRotation = tryVal(baseRot, 0.0);
  this.builderObj.rotationLimit = tryVal(rotLimit, 361.0);

  return this;
};


ptp.range = function(useAttackRange) {
  this.builderObj.useAttackRange = tryVal(useAttackRange, true);

  return this;
};


ptp.shoot = function(cone, pattern, minVel, sta, staDur) {
  this.builderObj.shootCone = tryVal(cone, 5.0);
  this.builderObj.shootPattern = tryVal(pattern, new ShootPattern());
  this.builderObj.minShootVelocity = tryVal(minVel, -1.0);
  this.builderObj.shootStatus = tryVal(sta, StatusEffects.none);
  this.builderObj.shootStatusDuration = tryVal(staDur, 300.0);

  return this;
};


ptp.shootExt = function(noAttack, shootOnDeath, alwaysShooting, ignoreRot) {
  this.builderObj.noAttack = tryVal(noAttack, false);
  this.builderObj.shootOnDeath = tryVal(shootOnDeath, false);
  this.builderObj.alwaysShooting = tryVal(alwaysShooting, false);
  this.builderObj.ignoreRotation = tryVal(ignoreRot, false);

  return this;
};


ptp.reload = function(reload) {
  this.builderObj.reload = tryVal(reload, 1.0);

  return this;
};


ptp.recoil = function(shake, recoil, time, pow, recoils) {
  this.builderObj.shake = tryVal(shake, 0.0);
  this.builderObj.recoil = tryVal(recoil, 1.5);
  this.builderObj.recoilTime = tryVal(time, -1.0);
  this.builderObj.recoilPow = tryVal(pow, 1.8);
  this.builderObj.recoils = tryVal(recoils, -1);

  return this;
};


ptp.heat = function(cdTime, heatColor) {
  this.builderObj.cooldownTime = tryVal(cdTime, tryVal(this.builderObj.reload, 0.0) * 1.2);
  this.builderObj.heatColor = tryVal(heatColor, Pal.turretHeat);

  return this;
};


ptp.target = function(autoTarget, predictTarget, aimChangeSpd) {
  this.builderObj.autoTarget = tryVal(autoTarget, false);
  this.builderObj.predictTarget = tryVal(predictTarget, true);
  this.builderObj.aimChangeSpeed = tryVal(aimChangeSpd, java.lang.Float.POSITIVE_INFINITY);

  return this;
};


ptp.targetItnv = function(intv, switchIntv) {
  this.builderObj.targetInterval = tryVal(intv, 40.0);
  this.builderObj.targetSwitchInterval = tryVal(switchIntv, 70.0);

  return this;
};


ptp.warmup = function(minWarmup, isLinear, partWarmupSpd, partReloadSpd) {
  this.builderObj.minWarmup = tryVal(minWarmup, 0.0);
  this.builderObj.linearWarmup = tryVal(isLinear, false);
  this.builderObj.shootWarmupSpeed = tryVal(partWarmupSpd, 0.1);
  this.builderObj.smoothReloadSpeed = tryVal(partReloadSpd, 0.15);

  return this;
};


ptp.part = function(partArr) {
  this.builderObj.parts = tryVal(partArr, []).toSeq();

  return this;
};


ptp.bullet = function(btp) {
  this.builderObj.bullet = tryVal(btp, Bullets.placeholder);

  return this;
};


ptp.continuous = function(isContinuous, alwaysContinuous) {
  this.builderObj.continuous = tryVal(isContinuous, false);
  this.builderObj.alwaysContinuous = tryVal(alwaysContinuous, false);

  return this;
};


ptp.bulVel = function(randVelFrac, addVelFrac) {
  this.builderObj.velocityRnd = tryVal(randVelFrac, 0.0);
  this.builderObj.extraVelocity = tryVal(addVelFrac, 0.0);

  return this;
};


module.exports = CLS_weaponBuilder;
