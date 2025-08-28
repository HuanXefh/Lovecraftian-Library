/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");
  const PARAM = require("lovec/glb/GLB_param");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- auxiliay ----------> */


  function comp_addStats(abi, tb, nm, tableF) {
    tb.add("\n\n[gray]" + Core.bundle.get("ability.lovec-abi-" + nm + ".description") + "[]\n\n").wrap().width(350.0);
    tb.row();
    tableF(tb);
  };


  function comp_localized(abi, nm) {
    return Core.bundle.get("ability.lovec-abi-" + nm + ".name");
  };


  function getAbilityDamage(dmg, e, bDmgMtp) {
    let dmg_fi = dmg;
    if(e instanceof Building) {
      dmg_fi *= Object.val(bDmgMtp, 1.0);
    } else {
      dmg_fi *= e.damageMultiplier;
    };

    return dmg_fi;
  };


  function registerAbilitySetter(nm, abiSetter) {
    MDL_event._c_onLoad(() => {
      global.lovecUtil.db.abilitySetter.push(nm, abiSetter);
    });
  };


  /* <---------- attack ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Creates explosion upon death.
   * ---------------------------------------- */
  const _explosion = function(dmg, rad, sta, staDur, se_gn) {
    if(dmg == null) dmg = 160.0;
    if(rad == null) rad = 40.0;
    if(sta == null) sta = StatusEffects.blasted;
    if(staDur == null) staDur = 120.0;
    if(se_gn == null) se_gn = "se-shot-explosion";

    let nm = "explosion";
    return extend(Ability, {


      addStats(tb) {
        comp_addStats(this, tb, nm, tb => {

          tb.add(MDL_text._statText(
            Stat.damage.localized(),
            Strings.autoFixed(dmg, 2),
          ));
          tb.row();

          tb.add(MDL_text._statText(
            Stat.range.localized(),
            Strings.autoFixed(rad / Vars.tilesize, 2),
            StatUnit.blocks.localized(),
          ));
          tb.row();

          if(sta !== StatusEffects.none) {
            tb.add(MDL_text._statText(
              Core.bundle.get("stat.lovec-stat-blk0misc-status"),
              sta.localizedName,
            ));
            tb.row();
          };

        });
      },


      death(unit) {
        Damage.damage(unit.team, unit.x, unit.y, rad, dmg);
        MDL_pos._it_units(unit.x, unit.y, rad, unit.team, null, ounit => {
          ounit.apply(sta, staDur);
        });

        MDL_effect.showAt(unit.x, unit.y, rad < 16.0 ? EFF.explosionSmall : EFF.explosion, 0.0);
        MDL_effect.showAt_shake(unit.x, unit.y, dmg / 160.0);
        MDL_effect.playAt(unit.x, unit.y, se_gn, 1.0, 1.0, 0.1);
      },


      localized() {
        return comp_localized(this, nm);
      },


    });
  }
  .setAnno(ANNO.__INIT__, null, function() {
    registerAbilitySetter("explosion", this);
  });
  exports._explosion = _explosion;


  /* <---------- support ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Point laser defense that targets enemy bullets.
   * ---------------------------------------- */
  const _laserDefense = function(dmg, chargeCap, chargeMtp, rad, se_gn) {
    if(dmg == null) dmg = 60.0;
    if(chargeCap == null) chargeCap = 180.0;
    if(chargeMtp == null) chargeMtp = 1.0;
    if(rad == null) rad = 80.0;
    if(se_gn == null) se_gn = "se-shot-laser-defense";

    let nm = "laser-defense";
    let progMap = new ObjectMap();
    let inCdMap = new ObjectMap();
    return extend(Ability, {


      addStats(tb) {
        comp_addStats(this, tb, nm, tb => {

          tb.add(MDL_text._statText(
            Stat.damage.localized(),
            Strings.autoFixed(dmg, 2),
          ));
          tb.row();

          tb.add(MDL_text._statText(
            Core.bundle.get("stat.lovec-stat-blk0misc-reloadtime"),
            Strings.autoFixed(chargeCap / 60.0 / chargeMtp, 2),
            StatUnit.seconds.localized(),
          ));
          tb.row();

          tb.add(MDL_text._statText(
            Stat.range.localized(),
            Strings.autoFixed(rad / Vars.tilesize, 2),
            StatUnit.blocks.localized(),
          ));
          tb.row();

        });
      },


      update(unit) {
        if(!Mathf.chance(0.2)) return;

        if(!progMap.containsKey(unit)) progMap.put(unit, chargeCap);
        if(!inCdMap.containsKey(unit)) inCdMap.put(unit, false);

        let prog = Math.min(progMap.get(unit, 0.0) + Time.delta * 5.0 * chargeMtp * MDL_entity._reloadMtp(unit), chargeCap);
        let inCd = inCdMap.get(unit, false);
        if(prog > 0.0 && !inCd) {
          let bul = MDL_pos._bul_tg(unit.x, unit.y, unit.team, rad);
          if(bul != null) {
            prog = Mathf.maxZero(prog - Mathf.clamp((bul.damage + bul.type.splashDamage) / dmg, 0.25, 1.0) * dmg);
            MDL_effect.showBetween_pointLaser(unit.x, unit.y, bul, Pal.remove, se_gn);
            MDL_call.damageBul(bul, dmg);
          };
        };
        if(prog < 0.0001) inCdMap.put(unit, true);
        if(prog > chargeCap - 0.0001 && inCd) inCdMap.put(unit, false);

        progMap.put(unit, prog);
      },


      draw(unit) {
        if(!PARAM.drawUnitReload) return;

        MDL_draw.drawUnit_reload(
          unit,
          null,
          inCdMap.get(unit, false) ? Color.white : Pal.remove,
          1.0,
          0.0,
          1,
          progMap.get(unit, 0.0) / chargeCap,
        );
      },


      localized() {
        return comp_localized(this, nm);
      },


    });
  }
  .setAnno(ANNO.__INIT__, null, function() {
    registerAbilitySetter("laser-defense", this);
  });
  exports._explosion = _explosion;


  /* ----------------------------------------
   * NOTE:
   *
   * Periodically repairs the nearest damaged building.
   * ---------------------------------------- */
  const _buildingRepairerModule = function(healAmt, healPerc, intv, rad, strokeScl) {
    if(healAmt == null) healAmt = 0.0;
    if(healPerc == null) healPerc = 0.0;
    if(intv == null) intv = 60.0;
    if(rad == null) rad = 40.0;
    if(strokeScl == null) strokeScl = 1.0;

    let nm = "building-repairer-module";
    let timerMap = new ObjectMap();
    return extend(Ability, {


      addStats(tb) {
        comp_addStats(this, tb, nm, tb => {

          tb.add(MDL_text._statText(
            Core.bundle.get("stat.lovec-stat-blk0misc-repairamt"),
            MDL_text._healText(healAmt, healPerc),
          ));
          tb.row();

          tb.add(MDL_text._statText(
            Core.bundle.get("stat.lovec-stat-blk0misc-repairintv"),
            Strings.autoFixed(intv / 60.0, 2),
            StatUnit.seconds.localized(),
          ));
          tb.row();

          tb.add(MDL_text._statText(
            Core.bundle.get("stat.lovec-stat-blk0misc-repairr"),
            Strings.autoFixed(rad / Vars.tilesize, 2),
            StatUnit.blocks.localized(),
          ));
          tb.row();

        });
      },


      update(unit) {
        if(!timerMap.containsKey(unit)) timerMap.put(unit, new Interval(1));

        if(!timerMap.get(unit).get(intv)) return;

        let b = MDL_pos._b_base(unit.x, unit.y, unit.team, rad, b => MDL_cond._canHeal(b));
        if(b == null) return;

        FRAG_attack.heal(b, b.maxHealth * healPerc + healAmt);
        MDL_effect.showBetween_laser(unit.x, unit.y, unit, b, Pal.heal, strokeScl);
      },


      localized() {
        return comp_localized(this, nm);
      },


    });
  }
  .setAnno(ANNO.__INIT__, null, function() {
    registerAbilitySetter("building-repairer-module", this);
  });
  exports._buildingRepairerModule = _buildingRepairerModule;
