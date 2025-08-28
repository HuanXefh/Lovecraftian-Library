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
  this.builderObj.name = Object.val(nm, "");

  return this;
};


ptp.stat = function(shouldDisplay, showSprite) {
  this.builderObj.display = Object.val(shouldDisplay, true);
  this.builderObj.showStatSprite = Object.val(showSprite, true);

  return this;
};


ptp.control = function(controllable, aiControllable) {
  this.builderObj.controllable = Object.val(controllable, true);
  this.builderObj.aiControllable = Object.val(aiControllable, true);

  return this;
};


ptp.ammo = function(useAmmo, ammoItm) {
  this.builderObj.useAmmo = Object.val(useAmmo, true);

  return this;
};


ptp.pos = function(x, y, shootX, shootY, randX, randY) {
  this.builderObj.x = Object.val(x, 0.0);
  this.builderObj.y = Object.val(y, 0.0);
  this.builderObj.shootX = Object.val(shootX, 0.0);
  this.builderObj.shootY = Object.val(shootY, 0.0);
  this.builderObj.xRand = Object.val(randX, 0.0);
  this.builderObj.yRand = Object.val(randY, 0.0);

  return this;
};


ptp.draw = function(offZ, isTop, radSha) {
  this.builderObj.layerOffset = Object.val(offZ, 0.0);
  this.builderObj.top = Object.val(isTop, true);
  this.builderObj.shadow = Object.val(radSha, -1.0);

  return this;
};


ptp.effect = function(shouldParentize, ejectEff) {
  this.builderObj.shouldParentize = Object.val(shouldParentize, true);
  this.builderObj.ejectEffect = Object.val(ejectEff, Fx.none);

  return this;
};


ptp.sound = function(shootSeStr, chargeSeStr, noAmmoSeStr) {
  this.builderObj.shootSound = shootSeStr == null ? Sounds.none : Vars.tree.loadSound(shootSeStr);
  this.builderObj.chargeSound = chargeSeStr == null ? Sounds.none : Vars.tree.loadSound(chargeSeStr);
  this.builderObj.noAmmoSound = noAmmoSeStr == null ? Sounds.none : Vars.tree.loadSound(noAmmoSeStr);

  return this;
};


ptp.soundExt = function(minPitch, maxPitch) {
  this.builderObj.soundPitchMin = Object.val(minPitch, 0.8);
  this.builderObj.soundPitchMax = Object.val(maxPitch, 1.0);

  return this;
};


ptp.mirror = function(shouldMirror, shouldAlternate, shouldFlipSprite) {
  this.builderObj.mirror = Object.val(shouldMirror, false);
  this.builderObj.alternate = Object.val(shouldAlternate, false);
  this.builderObj.flipSprite = Object.val(shouldFlipSprite, true);

  return this;
};


ptp.rotate = function(canRot, rotSpd, baseRot, rotLimit) {
  this.builderObj.rotate = Object.val(canRot, false);
  this.builderObj.rotateSpeed = Object.val(rotSpd, 20.0);
  this.builderObj.baseRotation = Object.val(baseRot, 0.0);
  this.builderObj.rotationLimit = Object.val(rotLimit, 361.0);

  return this;
};


ptp.range = function(useAttackRange) {
  this.builderObj.useAttackRange = Object.val(useAttackRange, true);

  return this;
};


ptp.shoot = function(cone, pattern, minVel, sta, staDur) {
  this.builderObj.shootCone = Object.val(cone, 5.0);
  this.builderObj.shootPattern = Object.val(pattern, new ShootPattern());
  this.builderObj.minShootVelocity = Object.val(minVel, -1.0);
  this.builderObj.shootStatus = Object.val(sta, StatusEffects.none);
  this.builderObj.shootStatusDuration = Object.val(staDur, 300.0);

  return this;
};


ptp.shootExt = function(noAttack, shootOnDeath, alwaysShooting, ignoreRot) {
  this.builderObj.noAttack = Object.val(noAttack, false);
  this.builderObj.shootOnDeath = Object.val(shootOnDeath, false);
  this.builderObj.alwaysShooting = Object.val(alwaysShooting, false);
  this.builderObj.ignoreRotation = Object.val(ignoreRot, false);

  return this;
};


ptp.reload = function(reload) {
  this.builderObj.reload = Object.val(reload, 1.0);

  return this;
};


ptp.recoil = function(shake, recoil, time, pow, recoils) {
  this.builderObj.shake = Object.val(shake, 0.0);
  this.builderObj.recoil = Object.val(recoil, 1.5);
  this.builderObj.recoilTime = Object.val(time, -1.0);
  this.builderObj.recoilPow = Object.val(pow, 1.8);
  this.builderObj.recoils = Object.val(recoils, -1);

  return this;
};


ptp.heat = function(cdTime, heatColor) {
  this.builderObj.cooldownTime = Object.val(cdTime, Object.val(this.builderObj.reload, 0.0) * 1.2);
  this.builderObj.heatColor = Object.val(heatColor, Pal.turretHeat);

  return this;
};


ptp.target = function(autoTarget, predictTarget, aimChangeSpd) {
  this.builderObj.autoTarget = Object.val(autoTarget, false);
  this.builderObj.predictTarget = Object.val(predictTarget, true);
  this.builderObj.aimChangeSpeed = Object.val(aimChangeSpd, java.lang.Float.POSITIVE_INFINITY);

  return this;
};


ptp.targetItnv = function(intv, switchIntv) {
  this.builderObj.targetInterval = Object.val(intv, 40.0);
  this.builderObj.targetSwitchInterval = Object.val(switchIntv, 70.0);

  return this;
};


ptp.warmup = function(minWarmup, isLinear, partWarmupSpd, partReloadSpd) {
  this.builderObj.minWarmup = Object.val(minWarmup, 0.0);
  this.builderObj.linearWarmup = Object.val(isLinear, false);
  this.builderObj.shootWarmupSpeed = Object.val(partWarmupSpd, 0.1);
  this.builderObj.smoothReloadSpeed = Object.val(partReloadSpd, 0.15);

  return this;
};


ptp.part = function(partArr) {
  this.builderObj.parts = Object.val(partArr, []).toSeq();

  return this;
};


ptp.bullet = function(btp) {
  this.builderObj.bullet = Object.val(btp, Bullets.placeholder);

  return this;
};


ptp.continuous = function(isContinuous, alwaysContinuous) {
  this.builderObj.continuous = Object.val(isContinuous, false);
  this.builderObj.alwaysContinuous = Object.val(alwaysContinuous, false);

  return this;
};


ptp.bulVel = function(randVelFrac, addVelFrac) {
  this.builderObj.velocityRnd = Object.val(randVelFrac, 0.0);
  this.builderObj.extraVelocity = Object.val(addVelFrac, 0.0);

  return this;
};


module.exports = CLS_weaponBuilder;
