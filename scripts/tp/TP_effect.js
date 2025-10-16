/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");


  const MDL_color = require("lovec/mdl/MDL_color");


  /* <---------- static ----------> */


  const _flare = function(size, ang, color_gn, scl, noLight) {
    if(size == null) size = 40.0;
    if(ang == null) ang = 0.0;
    if(color_gn == null) color_gn = Pal.accent;
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow5Out,
      lifetime: 60.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: "lovec-efr-flare",
      layer: VAR.lay_effBloom,
      particles: 1,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: Color.white,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: noLight ? 0.0 : 0.65,

      /* angle & length */

      baseRotation: ang,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: 0.0,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.linear,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._flare = _flare;


  const _trailFade = function(spr, size, color_gn, scl, hasLight) {
    if(spr == null) spr = "circle";
    if(size == null) size = 8.0;
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");
    let color_t = color.cpy();
    color_t.a = 0.0;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow3Out,
      lifetime: 90.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: VAR.lay_effBase,
      particles: 1,
      followParent: false,
      rotWithParent: true,
      useRotation: true,
      colorFrom: color,
      colorTo: color_t,
      lightScl: 2.0,
      lightOpacity: hasLight ? 0.65 : 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: 0.0,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow3Out,
      sizeFrom: 0.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._trailFade = _trailFade;


  /* <---------- particle ----------> */


  const _releaseParticle = function(spr, amt, size, rad, color_gn, scl, rev, hasBloom, hasLight) {
    if(spr == null) spr = "circle";
    if(amt == null) amt = 5;
    if(size == null) size = 4.0;
    if(rad == null) rad = 12.0;
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");

    return extend(ParticleEffect, {

      /* meta */

      interp: rev ? Interp.reverse : Interp.linear,
      lifetime: 60.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: hasBloom ? VAR.lay_effBloom : VAR.lay_effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: hasLight ? 0.65 : 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.linear,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._releaseParticle = _releaseParticle;


  const _shrinkParticle = function(spr, size, spin, color_gn, scl, shouldFade, hasBloom, hasLight) {
    if(spr == null) spr = "circle";
    if(size == null) size = 4.0;
    if(spin == null) spin = 0.0;
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");
    let color_t = color.cpy();
    if(shouldFade) color_t.a = 0.0;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.linear,
      lifetime: 150.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: hasBloom ? VAR.lay_effBloom : VAR.lay_effBase,
      particles: 1,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color_t,
      lightScl: 2.0,
      lightOpacity: hasLight ? 0.65 : 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: spin,
      randLength: true,
      length: 0.0,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow2In,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._shrinkParticle = _shrinkParticle;


  const _wetParticle = function(color_gn) {
    let color = MDL_color._color(color_gn, "new");

    return new Effect(80.0, eff => {
      Draw.color(color);
      Draw.alpha(Mathf.clamp(eff.fin() * 2.0));
      Fill.circle(eff.x, eff.y, eff.fout());
      Draw.reset();
    });
  };
  exports._wetParticle = _wetParticle;


  /* <---------- crack ----------> */


  const _furnaceCrack = function(size, rad, color_gn, scl, noLight) {
    if(size == null) size = 3.0;
    if(rad == null) rad = 18.0;
    if(color_gn == null) color_gn = "ffc999";
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow2Out,
      lifetime: 60.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: "lovec-efr-diamond",
      layer: VAR.lay_effBase,
      particles: 2,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: noLight ? 0.0 : 0.65,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.sine,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._furnaceCrack = _furnaceCrack;


  const _drillCrack = function(amt, size, rad, color_gn, scl, hasLight) {
    if(amt == null) amt = 3;
    if(size == null) size = 4.0;
    if(rad == null) rad = 18.0;
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");
    color.a = 0.5;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow10Out,
      lifetime: 180.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: "lovec-efr-diamond",
      layer: VAR.lay_effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: hasLight ? 0.65 : 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.sine,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._drillCrack = _drillCrack;


  const _craftCrack = function(amt, size, rad, color_gn, scl) {
    if(amt == null) amt = 2;
    if(size == null) size = 4.0;
    if(rad == null) rad = 10.0;
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow5Out,
      lifetime: 90.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: "lovec-efr-diamond",
      layer: VAR.lay_effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow10In,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._craftCrack = _craftCrack;


  const _plantCrack = function(amt, size, rad, color_gn, scl) {
    if(amt == null) amt = 12;
    if(size == null) size = 1.5;
    if(rad == null) rad = 12.0;
    if(color_gn == null) color_gn = "91b692";
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow10Out,
      lifetime: 480.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: "lovec-efr-diamond",
      layer: VAR.lay_effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow10Out,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._plantCrack = _plantCrack;


  const _smokeCrack = function(amt, size, rad, color_gn, scl) {
    if(amt == null) amt = 5;
    if(size == null) size = 3.0;
    if(rad == null) rad = 12.0;
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow10Out,
      lifetime: 180.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: "lovec-efr-urchin",
      layer: VAR.lay_effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.sine,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._smokeCrack = _smokeCrack;


  const _squareCrack = function(amt, size, rad, color_gn, scl, hasLight) {
    if(amt == null) amt = 7;
    if(size == null) size = 4.0;
    if(rad == null) rad = 56.0;
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow2Out,
      lifetime: 150.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: "lovec-efr-square",
      layer: VAR.lay_effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: hasLight ? 0.65 : 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow3In,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._squareCrack = _squareCrack;


  /* <---------- spark ----------> */


  const _lineSpark = function(amt, stroke, len, rad, color_gn, scl) {
    if(amt == null) amt = 7;
    if(stroke == null) stroke = 1.5;
    if(len == null) len = 4.0;
    if(rad == null) rad = 18.0;
    if(scl == null) scl = 1.0;

    return new Effect(15.0 * scl, eff => {
      Draw.color(color_gn == null ? eff.color : MDL_color._color(color_gn));
      Lines.stroke(eff.fout() * stroke);
      Angles.randLenVectors(eff.id, amt, eff.finpow() * rad, (x, y) => {
        Lines.lineAngle(eff.x + x, eff.y + y, Mathf.angle(x, y), (eff.fout() + 0.25) * len);
      });
    });
  };
  exports._lineSpark = _lineSpark;


  const _circleSpark = function(amt, size, rad, color_gn, scl) {
    if(amt == null) amt = 7;
    if(size == null) size = 4.0;
    if(rad === null) rad = 30.0;
    if(scl == null) scl = 1.0;

    return new Effect(30.0 * scl, eff => {
      Draw.color(color_gn == null ? eff.color : MDL_color._color(color_gn));
      Angles.randLenVectors(eff.id, amt, eff.finpow() * rad, (x, y) => {
        Fill.circle(eff.x + x, eff.y + y, (eff.fout() + 0.25) * size);
      });
    });
  };
  exports._circleSpark = _circleSpark;


  /* <---------- smog ----------> */


  const _releaseSmog = function(amt, size, rad, scl, isBlack, isHigh) {
    if(amt == null) amt = 12;
    if(size == null) size = 7.0;
    if(rad == null) rad = 24.0;
    if(scl == null) scl = 1.0;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow2Out,
      lifetime: 120.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: isBlack ? "lovec-efr-shadow" : "lovec-efr-shadow-white",
      layer: isHigh ? VAR.lay_effSmogHigh : VAR.lay_effSmog,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: Color.valueOf("ffffff40"),
      colorTo: Color.valueOf("ffffff00"),
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow5Out,
      sizeFrom: 2.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._releaseSmog = _releaseSmog;


  const _sideReleaseSmog = function(amt, size, rad, offRad, cone, scl, rev, isBlack, isHigh) {
    if(amt == null) amt = 6;
    if(size == null) size = 5.0;
    if(rad == null) rad = 14.0;
    if(offRad == null) offRad = 0.0;
    if(cone == null) cone = 10.0;
    if(scl == null) scl = 1.0;

    return extend(ParticleEffect, {

      /* meta */

      interp: rev ? Interp.reverse : Interp.linear,
      lifetime: 80.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: isBlack ? "lovec-efr-shadow" : "lovec-efr-shadow-white",
      layer: isHigh ? VAR.lay_effSmogHigh : VAR.lay_effSmog,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: Color.valueOf("ffffff40"),
      colorTo: Color.valueOf("ffffff00"),
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: cone,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: offRad,

      /* size & stroke & len */

      line: false,
      sizeInterp: rev ? Interp.reverse : Interp.linear,
      sizeFrom: 0.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._sideReleaseSmog = _sideReleaseSmog;


  const _shootSmog = function(amt, size_f, size_t, rad, cone, scl, isBlack, isHigh) {
    if(amt == null) amt = 12;
    if(size_f == null) size_f = 4.0;
    if(size_t == null) size_t = 12.0;
    if(rad == null) rad = 28.0;
    if(cone == null) cone = 20.0;
    if(scl == null) scl = 1.0;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow10Out,
      lifetime: 300.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: isBlack ? "lovec-efr-shadow" : "lovec-efr-shadow-white",
      layer: isHigh ? VAR.lay_effSmogHigh : VAR.lay_effSmog,
      particles: amt,
      followParent: false,
      rotWithParent: false,
      useRotation: true,
      colorFrom: Color.valueOf("ffffff60"),
      colorTo: Color.valueOf("ffffff00"),
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: cone,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow2Out,
      sizeFrom: size_f,
      sizeTo: size_t,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._shootSmog = _shootSmog;


  const _heatSmog = function(amt, size, rad, scl, isBlack, isHigh) {
    if(amt == null) amt = 4;
    if(size == null) size = 6.0;
    if(rad == null) rad = 10.0;
    if(scl == null) scl = 1.0;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.linear,
      lifetime: 40.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: isBlack ? "lovec-efr-shadow" : "lovec-efr-shadow-white",
      layer: isHigh ? VAR.lay_effSmogHigh : VAR.lay_effSmog,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: Color.valueOf("ffffffc0"),
      colorTo: Color.valueOf("ffffff00"),
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.linear,
      sizeFrom: 0.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._heatSmog = _heatSmog;


  const _exploSmog = function(amt, size, rad, scl, isBlack, isHigh) {
    if(amt == null) amt = 16;
    if(size == null) size = 54.0;
    if(rad == null) rad = 54.0;
    if(scl == null) scl = 1.0;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow2Out,
      lifetime: 360.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: isBlack ? "lovec-efr-shadow" : "lovec-efr-shadow-white",
      layer: isHigh ? VAR.lay_effSmogHigh : VAR.lay_effSmog,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: Color.valueOf("ffffff40"),
      colorTo: Color.valueOf("ffffff00"),
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow2Out,
      sizeFrom: 2.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._exploSmog = _exploSmog;


  const _ventSmog = function(size, rad, color_gn, scl) {
    if(size == null) size = 10.0;
    if(rad == null) rad = 20.0;
    if(color_gn == null) color_gn = "7898ba";
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");
    let color_f = color.cpy();
    color_f.a = 0.3;
    let color_t = color.cpy();
    color_t.a = 0.0;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow2In,
      lifetime: 160.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: "lovec-efr-shadow-white",
      layer: VAR.lay_effSmog,
      particles: 1,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color_f,
      colorTo: color_t,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 15.0,
      offset: 0.0,
      cone: 40.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.sine,
      sizeFrom: 0.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports._ventSmog = _ventSmog;


  /* <---------- wave ----------> */


  const _impactWave = function(size_f, size_t, rad, scl) {
    if(size_f == null) size_f = 6.0;
    if(size_t == null) size_t = 0.0;
    if(scl == null) scl = 1.0;

    const eff = new Effect(40.0, eff => {
      var rad_fi = tryVal(rad, eff.rotation);

      eff.lifetime = 40.0 * scl * Math.pow(rad_fi * 0.025, 0.5);

      Draw.color(MDL_color._color("ffffff30", Tmp.c2), MDL_color._color("ffffff00", Tmp.c3), eff.fin());
      Lines.stroke(size_f - Interp.pow2Out.apply(eff.fin()) * (size_f - size_t));
      Lines.circle(eff.x, eff.y, rad_fi * Interp.pow2Out.apply(eff.fin()));
      Draw.reset();
    });
    eff.layer = VAR.lay_effFlr;

    return eff;
  };
  exports._impactWave = _impactWave;


  const _rectWave = function(size_f, size_t, r, color_gn, scl) {
    if(size_f == null) size_f = 4.0;
    if(size_t == null) size_t = 0.0;
    if(scl == null) scl = 1.0;

    const eff = new Effect(20.0 * scl, eff => {
      var rad_fi = tryVal(r, eff.rotation) * Vars.tilesize * Interp.pow2Out.apply(eff.fin());
      let color = MDL_color._color(tryVal(color_gn, eff.color));

      Draw.color(color);
      Lines.stroke(size_f - eff.fin() * (size_f - size_t));
      Lines.line(eff.x - rad_fi, eff.y - rad_fi, eff.x + rad_fi, eff.y - rad_fi);
      Lines.line(eff.x + rad_fi, eff.y - rad_fi, eff.x + rad_fi, eff.y + rad_fi);
      Lines.line(eff.x + rad_fi, eff.y + rad_fi, eff.x - rad_fi, eff.y + rad_fi);
      Lines.line(eff.x - rad_fi, eff.y + rad_fi, eff.x - rad_fi, eff.y - rad_fi);
      Draw.reset();
    });

    return eff;
  };
  exports._rectWave = _rectWave;


  const _circleWave = function(size_f, size_t, rad, color_gn, scl) {
    if(size_f == null) size_f = 4.0;
    if(size_t == null) size_t = 0.0;
    if(scl == null) scl = 1.0;

    const eff = new Effect(20.0 * scl, eff => {
      var rad_fi = tryVal(rad, eff.rotation) * Interp.pow2Out.apply(eff.fin());
      let color = MDL_color._color(tryVal(color_gn, eff.color));

      Draw.color(color);
      Lines.stroke(size_f - eff.fin() * (size_f - size_t));
      Lines.circle(eff.x, eff.y, rad_fi);
      Draw.reset();
    });

    return eff;
  };
  exports._circleWave = _circleWave;


  /* <---------- area ----------> */


  const _squareFade = function(r, color_gn, scl) {
    if(r == null) r = 0.5;
    if(scl == null) scl = 1.0;

    const eff = new Effect(40.0 * scl, eff => {
      let color = MDL_color._color(tryVal(color_gn, eff.color));

      Draw.color(color);
      Draw.alpha(eff.fout());
      Fill.square(eff.x, eff.y, r * Vars.tilesize);
      Draw.reset();
    });

    return eff;
  };
  exports._squareFade = _squareFade;


  const _exploDisk = function(rad, color_gn, scl, noLight) {
    if(rad == null) rad = 40.0;
    if(color_gn == null) color_gn = Pal.accent;
    if(scl == null) scl = 1.0;

    let color = MDL_color._color(color_gn, "new");
    let color_t = color.cpy();
    color_t.a = 0.0;

    return new MultiEffect(
      extend(ParticleEffect, {

        /* meta */

        interp: Interp.pow5In,
        lifetime: 40.0 * scl,
        startDelay: 0.0,

        /* visual */

        region: "lovec-efr-shadow-white",
        layer: VAR.lay_effHigh,
        particles: 1,
        followParent: true,
        rotWithParent: false,
        useRotation: true,
        colorFrom: color,
        colorTo: color_t,
        lightScl: 2.0,
        lightOpacity: noLight ? 0.0 : 0.65,

        /* angle & length */

        baseRotation: 0.0,
        offset: 0.0,
        cone: 180.0,
        spin: 0.0,
        randLength: true,
        length: 0.0,
        baseLength: 0.0,

        /* size & stroke & len */

        line: false,
        sizeInterp: Interp.pow10Out,
        sizeFrom: 0.0,
        sizeTo: rad,
        strokeFrom: 0.0,
        strokeTo: 0.0,
        lenFrom: 0.0,
        lenTo: 0.0,

      }),
      extend(ParticleEffect, {

        /* meta */

        interp: Interp.pow5In,
        lifetime: 40.0 * scl,
        startDelay: 0.0,

        /* visual */

        region: "lovec-efr-shadow-white",
        layer: VAR.lay_effHigh + 0.0001,
        particles: 1,
        followParent: true,
        rotWithParent: false,
        useRotation: true,
        colorFrom: Color.white,
        colorTo: Color.valueOf("ffffff00"),
        lightScl: 2.0,
        lightOpacity: 0.65,

        /* angle & length */

        baseRotation: 0.0,
        offset: 0.0,
        cone: 180.0,
        spin: 0.0,
        randLength: true,
        length: 0.0,
        baseLength: 0.0,

        /* size & stroke & len */

        line: false,
        sizeInterp: Interp.pow10Out,
        sizeFrom: 0.0,
        sizeTo: rad * 0.7,
        strokeFrom: 0.0,
        strokeTo: 0.0,
        lenFrom: 0.0,
        lenTo: 0.0,

      }),
    );
  };
  exports._exploDisk = _exploDisk;


  /* <---------- complex ----------> */


  const _impactDrillCraft = function(size, rad) {
    return new MultiEffect(
      _impactWave(null, null, rad, size / 2.0 * 0.75),
      _impactWave(null, null, rad, size / 2.0),
      _releaseSmog(18, 10.0, 40.0, 1.5),
      _drillCrack(6, null, size * 9.0, null, 1.33333333),
    );
  };
  exports._impactDrillCraft = _impactDrillCraft;


  const _explosion = function(rad, color_gn, colorCenter_gn, noSmog) {
    if(rad == null) rad = 56.0;
    if(color_gn == null) color_gn = "feb380";
    if(colorCenter_gn == null) colorCenter_gn = Pal.accent;

    return noSmog ?
      new MultiEffect(
        _squareCrack(5, 1.5, rad, color_gn, 0.3, true),
        _exploDisk(rad * 0.7, colorCenter_gn),
      ) :
      new MultiEffect(
        _impactWave(null, null, rad, 1.0),
        _impactWave(null, null, rad, 1.2),
        _impactWave(null, null, rad, 1.5),
        _impactWave(null, null, rad, 1.9),
        _exploSmog(null, rad * 1.35, rad * 1.35),
        _squareCrack(null, null, rad, color_gn, 1.0, true),
        _exploDisk(rad * 0.7, colorCenter_gn),
      );
  };
  exports._explosion = _explosion;


  const _rectPulse = function(r, color_gn) {
    return new MultiEffect(
      _rectWave(3.5, 0.0, r, color_gn, 1.0),
      _rectWave(2.5, 0.0, r, color_gn, 2.0),
    );
  };
  exports._rectPulse = _rectPulse;


  const _circlePulse = function(rad, color_gn) {
    return new MultiEffect(
      _circleWave(3.5, 0.0, rad, color_gn, 1.0),
      _circleWave(2.5, 0.0, rad, color_gn, 2.0),
    );
  };
  exports._circlePulse = _circlePulse;
