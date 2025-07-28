/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_block = require("lovec/db/DB_block");
  const DB_fluid = require("lovec/db/DB_fluid");
  const DB_status = require("lovec/db/DB_status");
  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- pos ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the floor at given position supports shadow casting.
   * ---------------------------------------- */
  const _posCanShadow = function(x, y) {
    var flr = Vars.world.floorWorld(x, y);
    if(flr == null || flr instanceof EmptyFloor || !flr.canShadow) return false;

    return true;
  };
  exports._posCanShadow = _posCanShadow;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether something at given position is visible (in the screen).
   * ---------------------------------------- */
  const _posVisible = function(x, y, clipSize) {
    if(clipSize == null) clipSize = 0.0;

    return Core.camera.bounds(Tmp.r1).overlaps(Tmp.r2.setCentered(x, y, clipSize));
  };
  exports._posVisible = _posVisible;


  const _posHasLoot = function(x, y) {
    return Groups.unit.intersect(x - 3.0, y - 3.0, 12.0, 12.0).select(unit => _isLoot(unit)).size > 0;
  };
  exports._posHasLoot = _posHasLoot;


  /* <---------- resource ----------> */


  const _isRsAvailable = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return false;

    return rs.unlockedNow() && rs.isOnPlanet(Vars.state.getPlanet()) && !rs.isHidden();
  };
  exports._isRsAvailable = _isRsAvailable;


  const _isIntmd = function(rs_gn) {
    return MDL_content._hasTag(MDL_content._ct(rs_gn, "rs"), "rs-intmd");
  };
  exports._isIntmd = _isIntmd;


  const _isWas = function(rs_gn) {
    return MDL_content._hasTag(MDL_content._ct(rs_gn, "rs"), "rs-was");
  };
  exports._isWas = _isWas;


  const _isVirt = function(rs_gn) {
    return MDL_content._hasTag(MDL_content._ct(rs_gn, "rs"), "rs-virt");
  };
  exports._isVirt = _isVirt;


  const _isAux = function(rs_gn) {
    return MDL_content._hasTag(MDL_content._ct(rs_gn, "rs"), "rs-aux");
  };
  exports._isAux = _isAux;


  const _isNoCapAux = function(rs_gn) {
    return MDL_content._hasTag(MDL_content._ct(rs_gn, "rs"), "rs-nocap0aux");
  };
  exports._isNoCapAux = _isNoCapAux;


  const _isConductiveLiq = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");

    return rs == null ? false : DB_fluid.db["group"]["conductive"].includes(rs.name);
  };
  exports._isConductiveLiq = _isConductiveLiq;


  /* <---------- block ----------> */


  const _isMapBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-map");
  };
  exports._isMapBlock = _isMapBlock;


  const _isMiner = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-min");
  };
  exports._isMiner = _isMiner;


  const _isDrill = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-drl");
  };
  exports._isDrill = _isDrill;


  const _isHarvester = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-harv");
  };
  exports._isHarvester = _isHarvester;


  const _isOreScanner = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-scan");
  };
  exports._isOreScanner = _isOreScanner;


  const _isCrop = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-crop");
  };
  exports._isCrop = _isCrop;


  const _isItemDistributor = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-dis");
  };
  exports._isItemDistributor = _isItemDistributor;


  const _isConv = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-conv");
  };
  exports._isConv = _isConv;


  const _isBrd = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-brd");
  };
  exports._isBrd = _isBrd;


  const _isGate = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-gate");
  };
  exports._isGate = _isGate;


  const _isRouter = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-router");
  };
  exports._isRouter = _isRouter;


  const _isTall = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : DB_block.db["group"]["tall"].includes(blk.name);
  };
  exports._isTall = _isTall;


  const _isHoist = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-hoist");
  };
  exports._isHoist = _isHoist;


  const _isTallSource = function(blk_gn) {
    return _isTall(blk_gn) || _isHoist(blk_gn);
  };
  exports._isTallSource = _isTallSource;


  const _isExposedBlock = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : DB_block.db["group"]["exposed"].includes(blk.name);
  };
  exports._isExposedBlock = _isExposedBlock;


  const _isCont = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-cont");
  };
  exports._isCont = _isCont;


  const _isVirtBlk = function(blk_gn) {
    return _isCoreBlock(blk_gn) || _isVCont(blk_gn);
  };
  exports._isVirtBlk = _isVirtBlk;


  const _isVCont = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-vcont") || _isCoreBlock(blk_gn);
  };
  exports._isVCont = _isVCont;


  const _isCoreBlock = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk")

    return blk == null ? false : (blk instanceof CoreBlock || MDL_content._hasTag(blk, "blk-core"));
  };
  exports._isCoreBlock = _isCoreBlock;


  const _isFCond = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-fcond");
  };
  exports._isFCond = _isFCond;


  const _isFCont = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-fcont");
  };
  exports._isFCont = _isFCont;


  const _isLCond = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : MDL_content._hasTag(blk, "blk-fcond") && (blk.ex_getFluidType() === "liq" || blk.ex_getFluidType() === "both");
  };
  exports._isLCond = _isLCond;


  const _isLCont = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : MDL_content._hasTag(blk, "blk-fcont") && (blk.ex_getFluidType() === "liq" || blk.ex_getFluidType() === "both");
  };
  exports._isLCont = _isLCont;


  const _isGCond = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : MDL_content._hasTag(blk, "blk-fcond") && (blk.ex_getFluidType() === "gas" || blk.ex_getFluidType() === "both");
  };
  exports._isGCond = _isGCond;


  const _isGCont = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : MDL_content._hasTag(blk, "blk-fcont") && (blk.ex_getFluidType() === "gas" || blk.ex_getFluidType() === "both");
  };
  exports._isGCont = _isGCont;


  const _isFJunc = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-fjunc");
  };
  exports._isFJunc = _isFJunc;


  const _isCloggable = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : DB_block.db["group"]["cloggable"].includes(blk.name);
  };
  exports._isCloggable = _isCloggable;


  const _isAuxBlk = function(blk_gn) {
    return _isHCond(blk_gn) || _isACond(blk_gn) || _isACont(blk_gn);
  };
  exports._isAuxBlk = _isAuxBlk;


  const _isHCond = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-hcond");
  };
  exports._isHCond = _isHCond;


  const _isACond = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-acond");
  };
  exports._isACond = _isACond;


  const _isACont = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-acont");
  };
  exports._isACont = _isACont;


  const _canShortCircuit = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : DB_block.db["group"]["shortCircuit"].includes(blk.name);
  };
  exports._canShortCircuit = _canShortCircuit;


  const _isPowBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-pow");
  };
  exports._isPowBlock = _isPowBlock;


  const _isPowGen = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-pow0gen");
  };
  exports._isPowGen = _isPowGen;


  const _isPowTrans = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-pow0trans");
  };
  exports._isPowTrans = _isPowTrans;


  const _isPowRelay = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-relay");
  };
  exports._isPowRelay = _isPowRelay;


  const _isPowNode = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-node");
  };
  exports._isPowNode = _isPowNode;


  const _isMagnetic = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : DB_block.db["group"]["magnetic"].includes(blk.name);
  };
  exports._isMagnetic = _isMagnetic;


  const _isFactory = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-fac");
  };
  exports._isFactory = _isFactory;


  const _isFurnace = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-furn");
  };
  exports._isFurnace = _isFurnace;


  const _isWall = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-wall");
  };
  exports._isWall = _isWall;


  const _isLogicBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-log");
  };
  exports._isLogicBlock = _isLogicBlock;


  /* <---------- env ----------> */


  const _isEnvBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-env");
  };
  exports._isEnvBlock = _isEnvBlock;


  const _isVentBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-vent");
  };
  exports._isVentBlock = _isVentBlock;


  const _isTreeBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-tree");
  };
  exports._isTreeBlock = _isTreeBlock;


  const _isDepthOre = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-dpore");
  };
  exports._isDepthOre = _isDepthOre;


  const _isDepthLiquid = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-dpliq");
  };
  exports._isDepthLiquid = _isDepthLiquid;


  const _isScannerTarget = function(blk_gn) {
    if(_isDepthOre(blk_gn) || _isDepthLiquid(blk_gn)) return true;

    return false;
  };
  exports._isScannerTarget = _isScannerTarget;


  /* <---------- unit type ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is created with Lovec methods.
   * ---------------------------------------- */
  const _isLovecUnit = function(utp_gn) {
    return MDL_content._hasTag(MDL_content._ct(utp_gn, "utp"), "utp-lovec");
  };
  exports._isLovecUnit = _isLovecUnit;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is related to core.
   * ---------------------------------------- */
  const _isCoreUnit = function(utp_gn) {
    let utp = MDL_content._ct(utp_gn, "utp");

    return utp == null ? false : DB_unit.db["group"]["coreUnit"].includes(utp.name);
  };
  exports._isCoreUnit = _isCoreUnit;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is a robot.
   * ---------------------------------------- */
  const _isNonRobot = function(utp_gn) {
    let utp = MDL_content._ct(utp_gn, "utp");

    return utp == null ? false : DB_unit.db["group"]["nonRobot"].includes(utp.name);
  };
  exports._isNonRobot = _isNonRobot;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit can creates remains upon death.
   * ---------------------------------------- */
  const _hasNoRemains = function(utp_gn) {
    let utp = MDL_content._ct(utp_gn, "utp");

    return utp == null ? false : (
      DB_unit.db["group"]["noRemainsMod"].includes(MDL_content._mod(utp))
        || DB_unit.db["group"]["noRemains"].includes(utp.name)
        || _isNonRobot(utp)
        || utp instanceof MissileUnitType
        || !utp.createScorch
    );
  };
  exports._hasNoRemains = _hasNoRemains;


  /* <---------- entity ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this entity is supposed to update.
   * ---------------------------------------- */
  const _canUpdate = function(e) {
    if(e == null) return false;
    if(Vars.state.isEditor()) return false;
    if(e instanceof Building && !e.allowUpdate()) return false;

    return true;
  };
  exports._canUpdate = _canUpdate;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this entity is in the screen and not covered by fog.
   * ---------------------------------------- */
  const _isVisible = function(e) {
    if(e == null) return false;

    return !e.inFogTo(Vars.player.team()) && _posVisible(e.x, e.y, MDL_entity._clipSize(e));
  };
  exports._isVisible = _isVisible;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this entity is seen as enemy to {team}.
   * ---------------------------------------- */
  const _isEnemy = function(e, team) {
    if(e == null || team == null) return false;
    if(e.team === Team.derelict || e.team === team) return false;

    return true;
  };
  exports._isEnemy = _isEnemy;


  const _isBuildingActive = function(b) {
    if(b == null) return false;
    if(b.team === Team.derelict || b.edelta() < 0.0001) return false;

    return true;
  };
  exports._isBuildingActive = _isBuildingActive;


  const _isLoot = function(unit) {
    if(unit == null) return false;

    return unit.type.name.includes("unit0misc-loot");
  };
  exports._isLoot = _isLoot;


  const _isLootProtected = function(loot) {
    return loot.fin() * 2.0 < VAR.time_lootProtection / loot.type.lifetime;
  };
  exports._isLootProtected = _isLootProtected;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit can be controlled by AI.
   * ---------------------------------------- */
  const _isAiReady = function(unit) {
    if(unit == null) return false;
    if(unit.dead || unit.isPlayer()) return false;

    return true;
  };
  exports._isAiReady = _isAiReady;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit can be covered by trees.
   * ---------------------------------------- */
  const _isCoverable = function(unit, includeSize) {
    if(unit == null) return false;
    if(unit.flying || unit.type.groundLayer > 75.9999) return false;
    if(includeSize && unit.type.hitSize > VAR.rad_treeHideMaxRad - 0.0001) return false;

    return true;
  };
  exports._isCoverable = _isCoverable;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit is covered by trees.
   * ---------------------------------------- */
  const _isCovered = function(unit) {
    if(unit == null) return false;

    let sta = Vars.content.statusEffect("loveclab-sta-hidden-well");
    if(sta != null && unit.hasEffect(sta)) return true;

    return false;
  };
  exports._isCovered = _isCovered;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit can be damaged by heat.
   * ---------------------------------------- */
  const _isHeatDamageable = function(unit) {
    if(unit == null) return false;
    if(!_isOnFloor(unit)) return false;
    if(unit.type.naval) return false;

    return true;
  };
  exports._isHeatDamageable = _isHeatDamageable;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit can be affected by liquid floor.
   * ---------------------------------------- */
  const _isOnFloor = function(unit) {
    if(unit == null) return false;
    if(unit.flying) return false;
    if(unit.hovering && (unit instanceof Legsc)) return false;

    return true;
  };
  exports._isOnFloor = _isOnFloor;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit suffers from wall penalty.
   * ---------------------------------------- */
  const _isLowGround = function(unit) {
    if(unit == null) return false;
    if(unit.flying) return false;
    if(unit instanceof Legsc) return false;

    return true;
  };
  exports._isLowGround = _isLowGround;


  /* ----------------------------------------
   * NOTE:
   *
   * Still affected by explosion knockback.
   * ---------------------------------------- */
  const _isLowAir = function(unit) {
    if(unit == null) return false;
    if(!unit.flying) return false;
    if(!unit.type.lowAltitude) return false;

    return true;
  };
  exports._isLowAir = _isLowAir;


  /* ----------------------------------------
   * NOTE:
   *
   * It flies high.
   * ---------------------------------------- */
  const _isHighAir = function(unit) {
    if(unit == null) return false;
    if(!unit.flying) return false;
    if(unit.type.lowAltitude) return false;

    return true;
  };
  exports._isHighAir = _isHighAir;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit is moving (not done by collision).
   * ---------------------------------------- */
  const _isMoving = function(unit) {
    if(unit == null) return false;

    return unit.vel.len() > (unit.flying ? 0.1 : 0.01);
  };
  exports._isMoving = _isMoving;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit is boosting up/down.
   * ---------------------------------------- */
  const _isBoosting = function(unit) {
    if(unit == null) return false;
    if(!unit.type.canBoost) return false;

    return unit.elevation > 0.33 && unit.elevation < 1.0;
  };
  exports._isBoosting = _isBoosting;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit has injured status.
   * ---------------------------------------- */
  const _isInjured = function(unit) {
    const thisFun = _isInjured;

    if(unit == null) return false;
    if(_hasEffectAny(unit, thisFun.funStas)) return true;

    return false;
  }
  .setProp({
    "funStas": [
      "loveclab-sta-slightly-injured",
      "loveclab-sta-injured",
      "loveclab-sta-heavily-injured",
    ],
  });
  exports._isInjured = _isInjured;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit has damaged status.
   * ---------------------------------------- */
  const _isDamaged = function(unit) {
    const thisFun = _isDamaged;

    if(unit == null) return false;
    if(_hasEffectAny(unit, thisFun.funStas)) return true;

    return false;
  }
  .setProp({
    "funStas": [
      "loveclab-sta-damaged",
      "loveclab-sta-severely-damaged",
    ],
  });
  exports._isDamaged = _isDamaged;


  const _hasEffectAny = function(unit, stas_gn) {
    if(unit == null) return false;
    if(stas_gn.some(sta_gn => {
      let sta = MDL_content._ct(sta_gn, "sta", true);
      return sta != null && unit.hasEffect(sta);
    })) return true;

    return false;
  };
  exports._hasEffectAny = _hasEffectAny;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit is HOT.
   * Used for remains.
   * ---------------------------------------- */
  const _isHot = function(unit) {
    if(unit == null) return false;
    if(_hasEffectAny(unit, DB_status.db["group"]["hot"])) return true;
    //if(FRAG_heat._meltTime(unit) > 0.0) return true;

    let t = unit.tileOn();
    if(t != null && _isHotSta(t.floor().status)) return true;

    return false;
  };
  exports._isHot = _isHot;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit has been soaked in aqueous liquids recently.
   * This may influence something like short circuit.
   * ---------------------------------------- */
  const _isWet = function(unit) {
    if(unit == null) return false;
    if(_hasEffectAny(unit, DB_status.db["group"]["wet"])) return true;

    return false;
  };
  exports._isWet = _isWet;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit has at least one weapon active.
   * ---------------------------------------- */
  const _isAttacking = function(unit) {
    if(unit == null) return false;
    if(unit.mounts.some(mt => mt.reload > 0.0)) return true;

    return false;
  };
  exports._isAttacking = _isAttacking;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the unit is performing any actions.
   * ---------------------------------------- */
  const _isActing = function(unit) {
    if(unit == null) return false;
    if(_isMoving(unit) || _isAttacking(unit) || unit.mining() || unit.isBuilding()) return true;

    return false;
  };
  exports._isActing = _isActing;


  /* <---------- status effect ----------> */


  const _isHotSta = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");

    return sta == null ? false : DB_status.db["group"]["hot"].includes(sta.name);
  };
  exports._isHotSta = _isHotSta;


  const _isWetSta = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");

    return sta == null ? false : DB_status.db["group"]["wet"].includes(sta.name);
  };
  exports._isWetSta = _isWetSta;


  const _isFadeSta = function(sta_gn) {
    return MDL_content._hasTag(MDL_content._ct(sta_gn, "sta"), "blk-fade");
  };
  exports._isFadeSta = _isFadeSta;


  const _isBlkSta = function(sta_gn) {
    return MDL_content._hasTag(MDL_content._ct(sta_gn, "sta"), "blk-sta");
  };
  exports._isBlkSta = _isBlkSta;


  const _isDeathSta = function(sta_gn) {
    return MDL_content._hasTag(MDL_content._ct(sta_gn, "sta"), "death-sta");
  };
  exports._isDeathSta = _isDeathSta;


  const _isStackSta = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");
    if(sta == null) return false;

    var cond = Function.funTry(sta.ex_isStackSta, false).call(sta);

    return cond;
  };
  exports._isStackSta = _isStackSta;
