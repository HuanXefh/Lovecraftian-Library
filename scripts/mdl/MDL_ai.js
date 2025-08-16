/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_entity = require("lovec/mdl/MDL_entity");


  /* <---------- base ----------> */


  const moveTo = function(unit, posIns, dst, smooth, keepDst) {
    if(unit == null || posIns == null) return;

    MDL_entity._ctrl(unit).moveTo(
      posIns,
      Object.val(dst, 0.0),
      Object.val(smooth, unit.flying ? 30.0 : 2.0),
      Object.val(keepDst, true),
      null,
    );
  };
  exports.moveTo = moveTo;


  const circle = function(unit, posIns, dst) {
    if(unit == null || posIns == null) return;

    MDL_entity._ctrl(unit).circle(posIns, Object.val(dst, unit.type.range / 1.8));
  };
  exports.circle = circle;


  const lookAt = function(unit, x, y, noAim) {
    if(unit == null) return;

    noAim ?
      unit.lookAt(x, y) :
      unit.aimLook(x, y);
  };
  exports.lookAt = lookAt;


  const shootAt = function(unit, x, y, bool) {
    if(unit == null) return;

    if(!bool) {
      unit.controlWeapons(false);
    } else {
      unit.type.faceTarget ?
        unit.aimLook(x, y) :
        unit.aim(x, y);
    };
  };
  exports.shootAt = shootAt;
