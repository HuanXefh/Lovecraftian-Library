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


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there's any loot unit at (x, y).
   * ---------------------------------------- */
  const _posHasLoot = function(x, y) {
    return Groups.unit.intersect(x - 3.0, y - 3.0, 12.0, 12.0).select(unit => _isLoot(unit)).size > 0;
  };
  exports._posHasLoot = _posHasLoot;


  /* <---------- resource ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is now available (unlocked and not hidden).
   * ---------------------------------------- */
  const _isRsAvailable = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return false;

    return rs.unlockedNow() && rs.isOnPlanet(Vars.state.getPlanet()) && !rs.isHidden();
  };
  exports._isRsAvailable = _isRsAvailable;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is an intermediate.
   * ---------------------------------------- */
  const _isIntmd = function(rs_gn) {
    return MDL_content._hasTag(MDL_content._ct(rs_gn, "rs"), "rs-intmd");
  };
  exports._isIntmd = _isIntmd;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is a waste.
   * ---------------------------------------- */
  const _isWas = function(rs_gn) {
    return MDL_content._hasTag(MDL_content._ct(rs_gn, "rs"), "rs-was");
  };
  exports._isWas = _isWas;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is a virtual item.
   * ---------------------------------------- */
  const _isVirt = function(rs_gn) {
    return MDL_content._hasTag(MDL_content._ct(rs_gn, "rs"), "rs-virt");
  };
  exports._isVirt = _isVirt;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is an abstract fluid.
   * ---------------------------------------- */
  const _isAux = function(rs_gn) {
    return MDL_content._hasTag(MDL_content._ct(rs_gn, "rs"), "rs-aux");
  };
  exports._isAux = _isAux;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is an abstract fluid that is not capped in buildings.
   * ---------------------------------------- */
  const _isNoCapAux = function(rs_gn) {
    return MDL_content._hasTag(MDL_content._ct(rs_gn, "rs"), "rs-nocap0aux");
  };
  exports._isNoCapAux = _isNoCapAux;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource contains water.
   * ---------------------------------------- */
  const _isAqueousLiq = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");

    return rs == null ? false : DB_fluid.db["group"]["aqueous"].includes(rs.name);
  };
  exports._isAqueousLiq = _isAqueousLiq;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is conductive and can cause short circuit.
   * ---------------------------------------- */
  const _isConductiveLiq = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");

    return rs == null ? false : DB_fluid.db["group"]["conductive"].includes(rs.name);
  };
  exports._isConductiveLiq = _isConductiveLiq;


  /* <---------- block ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is used for map.
   * ---------------------------------------- */
  const _isMapBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-map");
  };
  exports._isMapBlock = _isMapBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a generic miner.
   * ---------------------------------------- */
  const _isMiner = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-min");
  };
  exports._isMiner = _isMiner;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a drill.
   * ---------------------------------------- */
  const _isDrill = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-drl");
  };
  exports._isDrill = _isDrill;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an attribute miner.
   * ---------------------------------------- */
  const _isHarvester = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-harv");
  };
  exports._isHarvester = _isHarvester;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an ore scanner for depth ore detection.
   * ---------------------------------------- */
  const _isOreScanner = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-scan");
  };
  exports._isOreScanner = _isOreScanner;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a crop that can be harvested.
   * ---------------------------------------- */
  const _isCrop = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-crop");
  };
  exports._isCrop = _isCrop;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block transports items.
   * ---------------------------------------- */
  const _isItemDistributor = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-dis");
  };
  exports._isItemDistributor = _isItemDistributor;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a conveyor.
   * ---------------------------------------- */
  const _isConv = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-conv");
  };
  exports._isConv = _isConv;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a bridge (for item or fluid).
   * ---------------------------------------- */
  const _isBrd = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-brd");
  };
  exports._isBrd = _isBrd;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a gate (for item or fluid).
   * ---------------------------------------- */
  const _isGate = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-gate");
  };
  exports._isGate = _isGate;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is god.
   * ---------------------------------------- */
  const _isRouter = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-router");
  };
  exports._isRouter = _isRouter;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is exposed to air (can trigger some reactions).
   * ---------------------------------------- */
  const isExposedBlk = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : DB_block.db["group"]["exposed"].includes(blk.name);
  };
  exports.isExposedBlk = isExposedBlk;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an item container.
   * ---------------------------------------- */
  const _isCont = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-cont");
  };
  exports._isCont = _isCont;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block can store virtual items.
   * ---------------------------------------- */
  const _isVirtBlk = function(blk_gn) {
    return _isCoreBlock(blk_gn) || _isVCont(blk_gn);
  };
  exports._isVirtBlk = _isVirtBlk;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a virutal item container.
   * ---------------------------------------- */
  const _isVCont = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-vcont") || _isCoreBlock(blk_gn);
  };
  exports._isVCont = _isVCont;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a core.
   * ---------------------------------------- */
  const _isCoreBlock = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk")

    return blk == null ? false : (blk instanceof CoreBlock || MDL_content._hasTag(blk, "blk-core"));
  };
  exports._isCoreBlock = _isCoreBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block rejects all reactions.
   * ---------------------------------------- */
  const _isNoReacBlk = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk")
    if(blk == null) return false;
    if(blk instanceof CoreBlock) return true;

    return DB_block.db["group"]["noReac"].includes(blk.name);
  };
  exports._isNoReacBlk = _isNoReacBlk;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a pump block (can produce pressure/vacuum).
   * ---------------------------------------- */
  const _isPump = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-pump");
  };
  exports._isPump = _isPump;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a fluid conduit.
   * ---------------------------------------- */
  const _isFCond = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-fcond");
  };
  exports._isFCond = _isFCond;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a fluid container.
   * ---------------------------------------- */
  const _isFCont = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-fcont");
  };
  exports._isFCont = _isFCont;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a liquid conduit.
   * ---------------------------------------- */
  const _isLCond = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : MDL_content._hasTag(blk, "blk-fcond") && (blk.ex_getFluidType() === "liq" || blk.ex_getFluidType() === "both");
  };
  exports._isLCond = _isLCond;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a liquid container.
   * ---------------------------------------- */
  const _isLCont = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : MDL_content._hasTag(blk, "blk-fcont") && (blk.ex_getFluidType() === "liq" || blk.ex_getFluidType() === "both");
  };
  exports._isLCont = _isLCont;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a gas conduit.
   * ---------------------------------------- */
  const _isGCond = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : MDL_content._hasTag(blk, "blk-fcond") && (blk.ex_getFluidType() === "gas" || blk.ex_getFluidType() === "both");
  };
  exports._isGCond = _isGCond;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a gas container.
   * ---------------------------------------- */
  const _isGCont = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : MDL_content._hasTag(blk, "blk-fcont") && (blk.ex_getFluidType() === "gas" || blk.ex_getFluidType() === "both");
  };
  exports._isGCont = _isGCont;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a fluid junction.
   * ---------------------------------------- */
  const _isFJunc = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-fjunc");
  };
  exports._isFJunc = _isFJunc;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this conduit will receive damage if the fluid in it is viscous.
   * ---------------------------------------- */
  const _isCloggable = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : DB_block.db["group"]["cloggable"].includes(blk.name);
  };
  exports._isCloggable = _isCloggable;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block can store abstract fluid.
   * ---------------------------------------- */
  const _isAuxBlk = function(blk_gn) {
    return _isPump(blk_gn) || _isHCond(blk_gn) || _isTCont(blk_gn);
  };
  exports._isAuxBlk = _isAuxBlk;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a heat conduit.
   * ---------------------------------------- */
  const _isHCond = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-hcond");
  };
  exports._isHCond = _isHCond;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a torque container.
   * ---------------------------------------- */
  const _isTCont = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-tcont");
  };
  exports._isTCont = _isTCont;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a cogwheel.
   * ---------------------------------------- */
  const _isCog = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-cog");
  };
  exports._isCog = _isCog;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a cogwheel stack.
   * ---------------------------------------- */
  const _isCogStack = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-cog0stack");
  };
  exports._isCogStack = _isCogStack;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a transmission rod.
   * ---------------------------------------- */
  const _isTransRod = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-trans0rod");
  };
  exports._isTransRod = _isTransRod;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block can short-circuit if soaked in water.
   * ---------------------------------------- */
  const _canShortCircuit = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : DB_block.db["group"]["shortCircuit"].includes(blk.name);
  };
  exports._canShortCircuit = _canShortCircuit;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is related to power generation or transmission.
   * ---------------------------------------- */
  const _isPowBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-pow");
  };
  exports._isPowBlock = _isPowBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a generator.
   * ---------------------------------------- */
  const _isPowGen = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-pow0gen");
  };
  exports._isPowGen = _isPowGen;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a power transmitter.
   * ---------------------------------------- */
  const _isPowTrans = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-pow0trans");
  };
  exports._isPowTrans = _isPowTrans;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a cable.
   * ---------------------------------------- */
  const _isCable = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-cable");
  };
  exports._isCable = _isCable;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a power relay.
   * ---------------------------------------- */
  const _isPowRelay = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-relay");
  };
  exports._isPowRelay = _isPowRelay;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a power node.
   * ---------------------------------------- */
  const _isPowNode = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-node");
  };
  exports._isPowNode = _isPowNode;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block induces magnetic disturbance.
   * ---------------------------------------- */
  const _isMagnetic = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");

    return blk == null ? false : DB_block.db["group"]["magnetic"].includes(blk.name);
  };
  exports._isMagnetic = _isMagnetic;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a factory.
   * ---------------------------------------- */
  const _isFactory = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-fac");
  };
  exports._isFactory = _isFactory;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a furnace.
   * ---------------------------------------- */
  const _isFurnace = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-furn");
  };
  exports._isFurnace = _isFurnace;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a wall for defense.
   * ---------------------------------------- */
  const _isWall = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-wall");
  };
  exports._isWall = _isWall;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a generic projector.
   * ---------------------------------------- */
  const _isProjector = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-proj");
  };
  exports._isProjector = _isProjector;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a repairer.
   * ---------------------------------------- */
  const _isRepairer = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-mend");
  };
  exports._isRepairer = _isRepairer;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is related to logic.
   * ---------------------------------------- */
  const _isLogicBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-log");
  };
  exports._isLogicBlock = _isLogicBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a switch.
   * ---------------------------------------- */
  const _isSwitch = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-switch");
  };
  exports._isSwitch = _isSwitch;


  /* <---------- env ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an environmental block.
   * ---------------------------------------- */
  const _isEnvBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-env");
  };
  exports._isEnvBlock = _isEnvBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a vent.
   * ---------------------------------------- */
  const _isVentBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-vent");
  };
  exports._isVentBlock = _isVentBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a large tree (or mushroom).
   * ---------------------------------------- */
  const _isTreeBlock = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-tree");
  };
  exports._isTreeBlock = _isTreeBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an underground ore.
   * ---------------------------------------- */
  const _isDepthOre = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-dpore");
  };
  exports._isDepthOre = _isDepthOre;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an underground fluid deposit.
   * ---------------------------------------- */
  const _isDepthLiquid = function(blk_gn) {
    return MDL_content._hasTag(MDL_content._ct(blk_gn, "blk"), "blk-dpliq");
  };
  exports._isDepthLiquid = _isDepthLiquid;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is affected by ore scanners.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this entity can be healed.
   * ---------------------------------------- */
  const _canHeal = function(e, team) {
    if(e == null) return false;
    if(team != null && e.team !== team) return false;
    if(!e.damaged() || (e instanceof Building && e.isHealSuppressed())) return false;

    return true;
  };
  exports._canHeal = _canHeal;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this building is running.
   * ---------------------------------------- */
  const _isBuildingActive = function(b) {
    if(b == null) return false;
    if(b.team === Team.derelict || b.edelta() < 0.0001) return false;

    return true;
  };
  exports._isBuildingActive = _isBuildingActive;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is a loot unit.
   * ---------------------------------------- */
  const _isLoot = function(unit) {
    if(unit == null) return false;

    return unit.type.name.includes("unit0misc-loot");
  };
  exports._isLoot = _isLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this loot cannot be taken up now.
   * ---------------------------------------- */
  const _isLootProtected = function(loot) {
    return loot.fin() * 2.0 < VAR.time_lootProtection / loot.type.lifetime;
  };
  exports._isLootProtected = _isLootProtected;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit can be controlled by AI now.
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
   * Whether this unit can be covered by trees.
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
   * Whether this unit is covered by trees.
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
   * Whether this unit can be damaged by heat.
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
   * Whether this unit can be affected by liquid floor.
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
   * Whether this unit suffers from wall penalty.
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
   * Whether this unit is moving (not through collision).
   * ---------------------------------------- */
  const _isMoving = function(unit) {
    if(unit == null) return false;

    return unit.vel.len() > (unit.flying ? 0.1 : 0.01);
  };
  exports._isMoving = _isMoving;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is boosting up/down.
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
   * Whether this unit has injured status.
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
   * Whether this unit has damaged status.
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


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit has any of given status effects.
   * ---------------------------------------- */
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
   * Whether this unit ot a tile is HOT.
   * Used for remains.
   * ---------------------------------------- */
  const _isHot = function(unit, t) {
    if(unit == null) {
      if(t == null) return false;

      return _isHotSta(t.floor().status);
    } else {
      if(_hasEffectAny(unit, DB_status.db["group"]["hot"])) return true;
      let t = unit.tileOn();
      if(t != null && _isHotSta(t.floor().status)) return true;

      return false;
    };
  };
  exports._isHot = _isHot;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit has been soaked in aqueous liquids recently.
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
   * Whether this unit has at least one weapon active.
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
   * Whether this unit is performing any actions.
   * ---------------------------------------- */
  const _isActing = function(unit) {
    if(unit == null) return false;
    if(_isMoving(unit) || _isAttacking(unit) || unit.mining() || unit.isBuilding()) return true;

    return false;
  };
  exports._isActing = _isActing;


  /* <---------- status effect ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this status is related to high temperature.
   * ---------------------------------------- */
  const _isHotSta = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");

    return sta == null ? false : DB_status.db["group"]["hot"].includes(sta.name);
  };
  exports._isHotSta = _isHotSta;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this status is related to water.
   * ---------------------------------------- */
  const _isWetSta = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");

    return sta == null ? false : DB_status.db["group"]["wet"].includes(sta.name);
  };
  exports._isWetSta = _isWetSta;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this status is a fading (or flickering) status.
   * ---------------------------------------- */
  const _isFadeSta = function(sta_gn) {
    return MDL_content._hasTag(MDL_content._ct(sta_gn, "sta"), "sta-fade");
  };
  exports._isFadeSta = _isFadeSta;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this status is triggered upon unit death.
   * ---------------------------------------- */
  const _isDeathSta = function(sta_gn) {
    return MDL_content._hasTag(MDL_content._ct(sta_gn, "sta"), "sta-death");
  };
  exports._isDeathSta = _isDeathSta;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this status is a stackable status.
   * ---------------------------------------- */
  const _isStackSta = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");
    if(sta == null) return false;

    var cond = Function.tryFun(sta.ex_isStackSta, false, sta);

    return cond;
  };
  exports._isStackSta = _isStackSta;
