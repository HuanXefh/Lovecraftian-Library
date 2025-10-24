/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const FRAG_item = require("lovec/frag/FRAG_faci");


  const MDL_entity = require("lovec/mdl/MDL_entity");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the {target} field of the AI controller.
   * It's private and no class in JS, I have to do this.
   * ---------------------------------------- */
  const _tg = function(ctrl) {
    if(ctrl == null) return null;

    return Reflect.get(AIController, ctrl, "target");
  };
  exports._tg = _tg;


  /* <---------- action ----------> */


  const moveTo = function(unit, posIns, dst, smooth, keepDst) {
    if(unit == null || posIns == null) return;

    MDL_entity._ctrl(unit).moveTo(
      posIns,
      tryVal(dst, 0.0),
      tryVal(smooth, unit.flying ? 30.0 : 2.0),
      tryVal(keepDst, true),
      null,
    );
  };
  exports.moveTo = moveTo;


  const circle = function(unit, posIns, dst) {
    if(unit == null || posIns == null) return;

    MDL_entity._ctrl(unit).circle(posIns, tryVal(dst, unit.type.range / 1.8));
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


  const moveShoot = function(unit, posIns, keepDst) {
    if(unit == null) return;
    if(posIns == null) {
      unit.controlWeapons(false);
      return;
    };

    moveTo(unit, posIns, unit.range() * 0.8, null, keepDst);
    shootAt(unit, posIns.x, posIns.y, posIns.within(unit, unit.range()));
  };
  exports.moveShoot = moveShoot;


  /* <---------- component ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * {updateMovement} here may return boolean, which means whether the action is done.
   * Used for decision.
   * ---------------------------------------- */


  /* ----------------------------------------
   * NOTE:
   *
   * Moves to the current target if armed.
   * ---------------------------------------- */
  const comp_updateMovement_attack = function(ctrl, unit) {
    if(!unit.hasWeapons()) return false;
    let tg = _tg(ctrl);
    if(tg == null) return false;

    if(unit.type.circleTarget) {
      ctrl.circleAttack(110.0 + unit.hitSize * 0.5);
    } else {
      moveTo(unit, tg, unit.range() * 0.8);
      lookAt(unit, tg.x, tg.y);
    };

    return true;
  };
  exports.comp_updateMovement_attack = comp_updateMovement_attack;


  /* ----------------------------------------
   * NOTE:
   *
   * Follows an assigned target.
   * ---------------------------------------- */
  const comp_updateMovement_follow = function(ctrl, unit, followTg) {
    if(followTg == null) return false;

    let dst = (followTg instanceof Sized ? tryProp(followTg.hitSize, followTg) * 0.55 : 0.0) + unit.hitSize * 0.5 + 15.0;
    moveTo(unit, followTg, dst);

    return true;
  };
  exports.comp_updateMovement_follow = comp_updateMovement_follow;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: ctrl.timerUnload
   * Unloads items into some building.
   * ---------------------------------------- */
  const comp_updateMovement_unload = function(ctrl, unit, b) {
    if(!unit.hasItem() || b == null || !b.acceptItem(unit.item()) || b.isPayload()) return false;

    moveTo(unit, b);
    if(unit.within(b, 20.0) && ctrl.timerUnload.get(90.0)) {
      FRAG_item.dropBuildItem(unit, b);
    };

    return true;
  };
  exports.comp_updateMovement_unload = comp_updateMovement_unload;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: ctrl.timerFind, ctrl.isMining, ctrl.oreT
   * Miner AI.
   * ---------------------------------------- */
  const comp_updateMovement_mine = function(ctrl, unit, b, itm, rad) {
    if(!unit.canMine()) return false;
    if(rad == null) rad = Infinity;

    if(!unit.validMine(unit.mineTile)) unit.mineTile = null;

    if(!ctrl.isMining) {
      unit.mineTile = null;
      // Ready to mine or not
      if(unit.stack.amount === 0) {
        ctrl.isMining = true;
        return true;
      };
      // Drop item to {b}
      if(unit.within(b, unit.range())) {
        if(b.acceptStack(unit.item(), unit.stack.amount, unit) > 0) FRAG_item.dropBuildItem(unit, b);
        unit.clearItem();
        ctrl.isMining = true;
      };
      // Move to {b}
      circle(unit, b, unit.range() * 0.6);
    } else {
      // Do nothing if {b} is full
      if(b.acceptStack(itm, 1, unit) === 0) {
        unit.clearItem();
        unit.mineTile = null;
        return false;
      };
      if(unit.stack.amount >= unit.type.itemCapacity || !unit.acceptsItem(itm)) {
        // Full, end mining
        ctrl.isMining = false;
      } else {
        // Update ore tile
        if(ctrl.timerFind.get(120.0)) {
          ctrl.oreT = null;
          if(unit.type.mineFloor) ctrl.oreT = Vars.indexer.findClosestOre(b.x, b.y, itm);
          if(ctrl.oreT == null && unit.type.mineWalls) ctrl.oreT = Vars.indexer.findClosestWallOre(b.x, b.y, itm);
          if(Mathf.dst(b.x, b.y, ctrl.oreT.worldx(), ctrl.oreT.worldy()) > rad) ctrl.oreT = null;
        };
        // Move to ore
        if(ctrl.oreT != null) {
          moveTo(unit, ctrl.oreT, unit.type.mineRange * 0.5);
          if(unit.within(ctrl.oreT, unit.type.mineRange) && unit.validMine(ctrl.oreT)) unit.mineTile = ctrl.oreT;
        };
      };
    };

    return true;
  };
  exports.comp_updateMovement_mine = comp_updateMovement_mine;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD: ctrl.timerFind, ctrl.repairTg
   * Repair AI.
   * ---------------------------------------- */
  const comp_updateMovement_repair = function(ctrl, unit, b) {
    if(ctrl.timerFind.get(15.0)) {
      let repairTg = Units.findDamagedTile(unit.team, unit.x, unit.y);
      if(repairTg instanceof ConstructBlock.ConstructBuild) repairTg = null;
      ctrl.repairTg = null;
    };

    if(ctrl.repairTg == null) {
      let bTg = (b != null && !b.dead) ? b : unit.closestCore();
      if(bTg != null && !unit.within(bTg, 48.0)) {
        moveTo(unit, bTg, 48.0);
      } else return false;
    } else {
      moveShoot(unit, ctrl.repairTg, true);
    };

    return true;
  };
  exports.comp_updateMovement_repair = comp_updateMovement_repair;
