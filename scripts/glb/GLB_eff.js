/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TP_effect = require("lovec/tp/TP_effect");


  /* <---------- static ----------> */


  exports.sniperTrail = TP_effect._trailFade("lovec-efr-sniper-wave", 18.0, Color.valueOf("ffffffa0"), 0.22222222);


  /* <---------- particle ----------> */


  exports.harvesterParticle = TP_effect._shrinkParticle("lovec-efr-square", 4.0, 0.0, Pal.accent, 0.7, false, true, false);
  exports.powerParticle = TP_effect._releaseParticle("circle", 3, 1.2, 8.0, Pal.accent);


  /* <---------- crack ----------> */


  exports.furnaceCrack = TP_effect._furnaceCrack();
  exports.furnaceCrackLarge = TP_effect._furnaceCrack(4.5, 24.0, null, 2.0);
  exports.craftCrack = TP_effect._craftCrack();
  exports.drillCrack = TP_effect._drillCrack();
  exports.plantCrack = TP_effect._plantCrack();
  exports.sawmillCrack = TP_effect._smokeCrack(5, 3.0, 12.0, Color.valueOf("dccdb1"), 1.0);


  /* <---------- smog ----------> */


  exports.furnaceSmog = TP_effect._releaseSmog();
  exports.furnaceSmogLarge = TP_effect._releaseSmog(18, 14.0, 64.0, 4.0);
  exports.blackSmog = TP_effect._releaseSmog(null, null, null, 1.5, true);
  exports.unitDamagedSmog = TP_effect._releaseSmog(1, null, 12.0, 0.6, true, true);
  exports.heatSmog = TP_effect._heatSmog();


  /* <---------- wave ----------> */


  /* <---------- area ----------> */


  exports.squareFadePack = [
    Fx.none,
    TP_effect._squareFade(0.5, Pal.accent),
    TP_effect._squareFade(1, Pal.accent),
    TP_effect._squareFade(1.5, Pal.accent),
    TP_effect._squareFade(2, Pal.accent),
    TP_effect._squareFade(2.5, Pal.accent),
    TP_effect._squareFade(3, Pal.accent),
    TP_effect._squareFade(3.5, Pal.accent),
    TP_effect._squareFade(4, Pal.accent),
    TP_effect._squareFade(4.5, Pal.accent),
    TP_effect._squareFade(5, Pal.accent),
  ],


  exports.disableFadePack = [
    Fx.none,
    TP_effect._squareFade(0.5, Pal.sap),
    TP_effect._squareFade(1, Pal.sap),
    TP_effect._squareFade(1.5, Pal.sap),
    TP_effect._squareFade(2, Pal.sap),
    TP_effect._squareFade(2.5, Pal.sap),
    TP_effect._squareFade(3, Pal.sap),
    TP_effect._squareFade(3.5, Pal.sap),
    TP_effect._squareFade(4, Pal.sap),
    TP_effect._squareFade(4.5, Pal.sap),
    TP_effect._squareFade(5, Pal.sap),
  ],


  /* <---------- complex ----------> */


  exports.explosion = TP_effect._explosion(56.0);
  exports.explosionSmall = TP_effect._explosion(24.0, null, null, true);


  exports.drillPulsePack = [
    Fx.none,
    TP_effect._rectPulse(0.5, Pal.techBlue),
    TP_effect._rectPulse(1, Pal.techBlue),
    TP_effect._rectPulse(1.5, Pal.techBlue),
    TP_effect._rectPulse(2, Pal.techBlue),
    TP_effect._rectPulse(2.5, Pal.techBlue),
    TP_effect._rectPulse(3, Pal.techBlue),
    TP_effect._rectPulse(3.5, Pal.techBlue),
    TP_effect._rectPulse(4, Pal.techBlue),
    TP_effect._rectPulse(4.5, Pal.techBlue),
    TP_effect._rectPulse(5, Pal.techBlue),
  ];


  exports.circlePulseDynamic = TP_effect._circlePulse();
