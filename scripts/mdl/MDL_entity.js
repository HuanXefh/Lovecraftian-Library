/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const DB_block = require("lovec/db/DB_block");
  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- generic ----------> */


  const _size = function(e0etp) {
    if(e0etp == null) return 0.0;

    if(e0etp instanceof Building) return e0etp.block.size;
    if(e0etp instanceof Block) return e0etp.size;
    if(e0etp instanceof Unit || e0etp instanceof Bullet) return e0etp.type.hitSize / Vars.tilesize;
    if(e0etp instanceof UnitType || e0etp instanceof BulletType) return e0etp.hitSize / Vars.tilesize;

    return 0.0;
  };
  exports._size = _size;


  const _hitSize = function(e0etp) {
    if(e0etp == null) return 0.0;

    if(e0etp instanceof Building) return e0etp.block.size * Vars.tilesize;
    if(e0etp instanceof Block) return e0etp.size * Vars.tilesize;
    if(e0etp instanceof Unit || e0etp instanceof Bullet) return e0etp.type.hitSize;
    if(e0etp instanceof UnitType || e0etp instanceof BulletType) return e0etp.hitSize;

    return 0.0;
  };
  exports._hitSize = _hitSize;


  const _clipSize = function(e0etp) {
    if(e0etp == null) return 0.0;

    if(e0etp instanceof Building) return e0etp.block.clipSize;
    if(e0etp instanceof Block || e0etp instanceof UnitType) return e0etp.clipSize;
    if(e0etp instanceof Unit) return e0etp.clipSize();
    if(e0etp instanceof Bullet) return e0etp.type.drawSize;
    if(e0etp instanceof BulletType) return e0etp.drawSize;

    return 0.0;
  };
  exports._clipSize = _clipSize;


  const _healthFrac = function(e) {
    if(e == null) return 0.0;

    if(e instanceof Building || e instanceof Unit) return e.health / e.maxHealth;
    if(e instanceof Bullet) return e.damage / e.type.damage;

    return 0.0;
  };
  exports._healthFrac = _healthFrac;


  const _armor = function(e) {
    if(e == null) return 0.0;

    if(e instanceof Building) {
      return e.block.armor;
    } else {
      return e.armorOverride < 0.0 ? e.armor : e.armorOverride;
    };
  };
  exports._armor = _armor;


  const _reloadFrac = function(e, mtIds) {
    if(e == null) return 0.0;

    var reload = 0.0;
    var maxReload = 0.0;
    if(e instanceof Building) {

      if(e.ex_getReloadFrac != null) return e.ex_getReloadFrac();

      if(e.reloadCounter != null) reload = e.reloadCounter;
      if(e.block.reload != null) maxReload = e.block.reload;

      if(DB_block.db["class"]["reload"]["frac"].hasIns(e.block)) return reload;
      if(DB_block.db["class"]["reload"]["revFrac"].hasIns(e.block)) return 1.0 - reload;

      let frac = maxReload < 0.0001 ? 1.0 : Mathf.clamp(reload / maxReload);
      if(DB_block.db["class"]["reload"]["rev"].hasIns(e.block)) return 1.0 - frac;
      return frac;

    } else if(e instanceof Unit) {

      if(mtIds == null || e == null) return 0.0;

      for(let id of mtIds) {
        let mt = e.mounts[id];
        if(mt == null) continue;
        reload += mt.reload;
        maxReload += mt.weapon.reload;
      };

      return maxReload < 0.0001 ? 1.0 : Mathf.clamp(1.0 - reload / maxReload);

    } else return 0.0;
  };
  exports._reloadFrac = _reloadFrac;


  const _dmgTake = function(e, dmg, piercesArmor) {
    return piercesArmor ? dmg : Math.max(dmg - _armor(e), dmg * 0.1);
  };
  exports._dmgTake = _dmgTake;


  /* <---------- building ----------> */


  const _warmup = function(b) {
    if(b == null) return 0.0;
    if(b.ex_getWarmupFrac != null) return b.ex_getWarmupFrac();

    return Mathf.maxZero(typeof b.warmup === "function" ? b.warmup() : b.warmup);
  };
  exports._warmup = _warmup;


  const _warmupFrac = function(b, nearCap) {
    if(b == null) return 0.0;

    var isLinear = true;
    if(b.block.linearWarmup != null) isLinear = b.block.linearWarmup;
    var warmup = isLinear ? _warmup(b) : Interp.pow3In.apply(_warmup(b));
    if(nearCap) warmup = Math.min(warmup, 0.999);

    return warmup;
  };
  exports._warmupFrac = _warmupFrac;


  const _bShield = function(b, isSelfShield) {
    if(b == null) return 0.0;
    if(b.power != null && b.power.status < 0.0001) return 0.0;

    if(b.block instanceof ShieldWall) return b.shield;
    if(b.block instanceof ForceProjector) return isSelfShield ? 0.0 : b.block.shieldHealth + b.block.phaseShieldBoost * b.phaseHeat - b.buildup;
    if(b.block instanceof DirectionalForceProjector) return isSelfShield ? 0.0 : b.block.shieldHealth - b.buildup;

    return 0.0;
  };
  exports._bShield = _bShield;


  const _bSpd = function(b) {
    if(b == null) return 0.0;

    return b.efficiency * Function.tryProp(b.timeScale, b);
  };
  exports._bSpd = _bSpd;


  /* <---------- unit ----------> */


  const _flashFrac = function(unit) {
    return unit == null ? 0.0 : Mathf.clamp(unit.hitTime);
  };
  exports._flashFrac = _flashFrac;


  const _elev = function(unit) {
    return unit == null ? 0.0 : Mathf.clamp(unit.elevation, unit.type.shadowElevation, 1.0) * unit.type.shadowElevationScl * (1.0 - unit.drownTime);
  };
  exports._elev = _elev;


  const _reloadMtp = function(unit, isClamped) {
    var mtp = unit == null ? 1.0 : unit.reloadMultiplier * (unit.disarmed ? 0.0 : 1.0);

    return !isClamped ? mtp : Mathf.clamp(mtp);
  };
  exports._reloadMtp = _reloadMtp;


  const _ctrl = function(unit) {
    return unit == null ? null : Function.tryProp(unit.controller, unit);
  };
  exports._ctrl = _ctrl;


  const _stackStaFirst = function(unit) {
    for(let sta of VARGEN.stackStas) {
      if(unit.hasEffect(sta)) return sta;
    };

    return;
  };
  exports._stackStaFirst = _stackStaFirst;


  const rotateUnit = function(unit, ang) {
    unit.rotation += ang;
    if(unit.baseRotation != null) unit.baseRotation += ang;
  };
  exports.rotateUnit = rotateUnit;


  /* <---------- bullet ----------> */


  const _bulDmg = function(bul, mtp, dst, armor, hitSize) {
    var dmg = bul.damage;
    var sDmg = bul.type.splashDamage;
    var sDmgRad = bul.type.splashDamageRadius;

    var isRemote = DB_unit.db["class"]["btp"]["remote"].hasIns(bul.type);
    var isRemoteCur = (dst > (bul.hitSize + hitSize) * 0.7499);

    var dmg_fi = 0.0;
    if(bul.type.pierceArmor) {
      dmg_fi += (!isRemote && isRemoteCur) ? 0.0 : dmg;
    } else {
      dmg_fi += (!isRemote && isRemoteCur) ? 0.0 : Damage.applyArmor(dmg, armor);
    };
    if(sDmgRad > 0.0) dmg_fi += sDmg * (1.0 - Mathf.clamp(dst / sDmgRad));

    return dmg_fi * mtp;
  };
  exports._bulDmg = _bulDmg;


  /* <---------- wave ----------> */


  const _waveArr = function(countWave) {
    if(countWave == null) countWave = Vars.state.wave;

    const arr = [];
    Vars.state.rules.spawns.each(spawnGrp => spawnGrp.team == null || spawnGrp.team === Vars.state.rules.waveTeam, spawnGrp => {
      let amt = spawnGrp.getSpawned(countWave);
      if(amt > 0) arr.push(spawnGrp.type, amt, spawnGrp.getShield(countWave), spawnGrp.effect);
    });

    return arr;
  };
  exports._waveArr = _waveArr;
