/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");
  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");


  const MATH_base = require("lovec/math/MATH_base");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const TP_effect = require("lovec/tp/TP_effect");


  /* <---------- base ----------> */


  const _p_frac = function(p, frac) {
    return Math.min(p * frac, VAR.p_effPCap);
  };
  exports._p_frac = _p_frac;


  const _se = function(se_gn) {
    if(se_gn instanceof Sound) return se_gn;

    return Vars.tree.loadSound(se_gn);
  };
  exports._se = _se;


  /* <---------- sound ----------> */


  const play = function(se_gn) {
    if(se_gn == null) return;

    let se = _se(se_gn);
    if(se != null) se.play();
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.play = play;


  const globalPlay = function(se_gn, vol, pitch, offPitch) {
    if(se_gn == null) return;

    let se = _se(se_gn);
    if(se == null) return;
    if(vol == null) vol = 1.0;
    if(pitch == null) pitch = 1.0;

    var pitch_fi = (offPitch == null) ? pitch : (pitch + Mathf.range(offPitch));
    Call.sound(se, vol, pitch, 1.0);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setAnno(ANNO.__SERVER__);
  exports.globalPlay = globalPlay;


  const playAt = function(x, y, se_gn, vol, pitch, offPitch) {
    if(se_gn == null) return;

    let se = _se(se_gn);
    if(se == null) return;
    if(vol == null) vol = 1.0;
    if(pitch == null) pitch = 1.0;

    var pitch_fi = (offPitch == null) ? pitch : (pitch + Mathf.range(offPitch));
    se.at(x, y, pitch_fi, vol);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.playAt = playAt;


  /* <---------- effect ----------> */


  const showAt = function(x, y, eff, rot, color, data) {
    if(Vars.state.isPaused() || eff == null) return;

    if(rot == null) rot = Mathf.random(360.0);
    if(color == null) color = Color.white;

    if(data == null) {
      eff.at(x, y, rot, color);
    } else {
      eff.at(x, y, rot, color, data);
    };
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showAt = showAt;


  const showAtP = function(p, x, y, eff, rot, color, data) {
    if(!Mathf.chance(p)) return;

    showAt(x, y, eff, rot, color, data);
  };
  exports.showAtP = showAtP;


  const showAround = function(x, y, eff, rad, rot, color, data) {
    if(Vars.state.isPaused() || eff == null) return;

    return showAt(x + Mathf.range(rad), y + Mathf.range(rad), eff, rot, color, data);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showAround = showAround;


  const showAroundP = function(p, x, y, eff, rad, rot, color, data) {
    if(!Mathf.chance(p)) return;

    showAround(x, y, eff, rad, rot, color, data);
  };
  exports.showAroundP = showAroundP;


  /* <---------- special effects ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a regular shake effect.
   * ---------------------------------------- */
  const showAt_shake = function(x, y, pow, dur) {
    if(Vars.state.isPaused()) return;

    if(pow == null) pow = 4.0;
    if(dur == null) dur = 60.0;
    if(pow < 0.0001 || dur < 0.0001) return;

    Effect.shake(pow, dur, x, y);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showAt_shake = showAt_shake;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates floor dust effects in a range.
   * ---------------------------------------- */
  const showAt_dust = function(x, y, rad, repeat) {
    if(Vars.state.isPaused()) return;

    if(rad == null) rad = 8.0;
    if(repeat == null) repeat = 1;

    var x_i;
    var y_i;
    for(let i = 0; i < repeat; i++) {
      x_i = x + Mathf.range(rad);
      y_i = y + Mathf.range(rad);
      Effect.floorDust(x_i, y_i, 8.0);
    };
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showAt_dust = showAt_dust;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a ripple effect on liquid floors.
   * Ignore {liqColor} for dynamic color selection.
   * ---------------------------------------- */
  const showAt_ripple = function(x, y, rad, liqColor) {
    const thisFun = showAt_ripple;

    if(Vars.state.isPaused()) return;

    if(rad == null) rad = 18.0;

    if(liqColor == null) {
      let t = Vars.world.tileWorld(x, y);
      if(t != null) {
        let liq = t.floor().liquidDrop;
        if(liq != null) liqColor = liq.color;
      };
    };
    if(liqColor == null) return;

    showAt(x, y, thisFun.funEff, rad, liqColor);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": (function() {
      const tmp = new Effect(30.0, eff => {
        eff.lifetime = 30.0 * eff.rotation * 0.25;

        Draw.color(Tmp.c1.set(eff.color).mul(1.5));
        Lines.stroke(eff.fout() * 1.4);
        Lines.circle(eff.x, eff.y, eff.fin() * eff.rotation);
      });
      tmp.layer = Layer.debris - 0.0001;

      return tmp;
    })(),
  });
  exports.showAt_ripple = showAt_ripple;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates impact wave effect.
   * ---------------------------------------- */
  const showAt_impactWave = function(x, y, rad) {
    const thisFun = showAt_impactWave;

    thisFun.funEffPack.forEach(eff => {
      showAt(x, y, eff, rad);
    });
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEffPack": [
      TP_effect._impactWave(6.0, 0.0, null, 1.0),
      TP_effect._impactWave(6.0, 0.0, null, 1.2),
      TP_effect._impactWave(6.0, 0.0, null, 1.5),
      TP_effect._impactWave(6.0, 0.0, null, 1.9),
    ],
  });
  exports.showAt_impactWave = showAt_impactWave;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates rotor wave effect.
   * Used by rotor units.
   * ---------------------------------------- */
  const showAt_rotorWave = function(x, y, rad) {
    const thisFun = showAt_rotorWave;

    showAt(x, y, thisFun.funEff, rad);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": (function() {
      const tmp = new Effect(20.0, eff => {
        eff.lifetime = 20.0 * Math.pow(eff.rotation * 0.025, 0.5);

        Draw.color(Color.valueOf("ffffff30"), Color.valueOf("ffffff00"), eff.fin());
        Lines.stroke(2.0);
        Lines.circle(eff.x, eff.y, eff.rotation * eff.fin());
        Draw.reset();
      });
      tmp.layer = VAR.lay_effFlr;

      return tmp;
    })(),
  });
  exports.showAt_rotorWave = showAt_rotorWave;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates liquid corrosion effect.
   * ---------------------------------------- */
  const showAt_corrosion = function(x, y, size, liqColor) {
    const thisFun = showAt_corrosion;

    if(Vars.state.isPaused()) return;

    if(size == null) size = 1;
    if(liqColor == null) liqColor = Color.white;

    var rad = size * Vars.tilesize * 0.5;
    showAround(x, y, thisFun.funEff, rad, 0.0, liqColor);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": new Effect(120.0, eff => {
      Draw.z(VAR.lay_effBase);
      Draw.color(eff.color);
      Fill.circle(eff.x, eff.y, 0.8 * Interp.pow5Out.apply(1.0 - eff.fin()))
    }),
  });
  exports.showAt_corrosion = showAt_corrosion;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates remains of a unit.
   * ---------------------------------------- */
  const showAt_remains = function(x, y, utp0unit, team, isPermanent, forceHot) {
    if(utp0unit == null || team == null) return;

    let unit = (utp0unit instanceof Unit) ? utp0unit : null;
    let utp = (utp0unit instanceof Unit) ? utp0unit.type : utp0unit;
    if(MDL_cond._hasNoRemains(utp)) return;

    var t = Vars.world.tileWorld(x, y);
    if(t == null || !t.floor().canShadow) return;

    let tint = null;
    var a = 1.0;
    var z = VAR.lay_unitRemains;
    let inLiq = false;
    let shouldFloat = false;
    if(t.floor().isLiquid && t.build == null && (!t.solid() || t.block() instanceof TreeBlock)) {
      inLiq = true;
      if(utp.hitSize < 17.5001) {shouldFloat = true} else {
        let liq = t.floor().liquidDrop;
        if(liq != null) {
          tint = liq.color;
          a = 0.5;
          z = 22.0;
        };
      };
    };

    const remains = extend(Decal, {


      lifetime: isPermanent ? MATH_base.maxTime : PARAM.unitRemainsLifetime, offTime: Mathf.random(1200.0),
      x: x, y: y, rotation: Mathf.random(360.0), team: team,
      color: Color.valueOf("606060"), tint: tint, a: a, z: z,
      region: Core.atlas.find(utp.name + "-icon", utp.region),
      cellRegion: Core.atlas.find(utp.name + "-cell-icon", utp.cellRegion),
      shouldFloat: shouldFloat,
      isHot: forceHot ? true : MDL_cond._isHot(unit), shouldFadeHeat: forceHot ? false : (!MDL_cond._isHotSta(t.floor().status) || !inLiq),


      draw() {
        var x = this.x + (!this.shouldFloat ? 0.0 : Math.sin((Time.time + this.offTime) * 0.01) * 0.35 * Vars.tilesize);
        var y = this.y + (!this.shouldFloat ? 0.0 : Math.cos((Time.time + this.offTime) * 0.05 + 32.0) * 0.15 * Vars.tilesize);
        if(this.shouldFloat && Mathf.chanceDelta(0.01)) showAt_ripple(x, y, utp.hitSize * 1.2);

        Draw.z(this.z);
        if(this.tint != null) {Draw.tint(this.color, this.tint, 0.5)} else {
          if(!this.isHot) {Draw.color(this.color)} else {
            Draw.color(Tmp.c1.set(Color.valueOf("ea8878")).lerp(this.color, Interp.pow2Out.apply(this.fin())));
          };
        };
        Draw.alpha(this.a - Mathf.curve(this.fin(), 0.98) * this.a);
        Draw.rect(this.region, x, y, this.rotation);
        Draw.color(Tmp.c2.set(this.color).mul(this.team.color));
        Draw.alpha(this.a - Mathf.curve(this.fin(), 0.98) * this.a);
        Draw.rect(this.cellRegion, x, y, this.rotation);
        Draw.color();
        if(this.isHot) {
          Draw.blend(Blending.additive);
          Draw.mixcol(Color.valueOf("ff3838"), 1.0);
          Draw.alpha((0.5 + Mathf.absin(10.0, 0.5)) * (!this.shouldFadeHeat ? (0.5 - Mathf.curve(this.fin(), 0.98) * 0.5) : (0.5 - Interp.pow2Out.apply(this.fin()) * 0.5)));
          Draw.rect(this.region, x, y, this.rotation);
          Draw.blend();
        };
        Draw.reset();
      },


    });
    remains.add();
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showAt_remains = showAt_remains;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a flash effect over an entity.
   * Color is only used for buildings, due to hard-coded {applyColor()}.
   * The only exception for unit is {Pal.heal}.
   * ---------------------------------------- */
  const showAt_flash = function(e, color_gn) {
    const thisFun = showAt_flash;

    if(Vars.state.isPaused() || e == null) return;

    if(color_gn == null) color_gn = Color.white;

    showAt(MDL_ui._cameraX(), MDL_ui._cameraY(), thisFun.funEff, 0.0, MDL_draw._color(color_gn), e);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": new Effect(20.0, eff => {
      let e = eff.data;
      let color = eff.color;
      var a = eff.fout() * color.a;

      if(e instanceof Building) {

        var reg = Core.atlas.find(e.block.name + "-icon", e.block.region);
        var ang = 0.0;
        MDL_draw.drawRegion_normal(e.x, e.y, reg, ang, 1.0, color, a, Layer.effect + VAR.lay_offDrawOver, true);

      } else if(e instanceof Unit) {

        if(MDL_draw._isSameColor(color, Pal.heal)) {unit.healTime = 1.0}
        else {unit.hitTime = 1.0};

      };
    }),
  });
  exports.showAt_flash = showAt_flash;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a texture region or icon that fades out.
   * ---------------------------------------- */
  const showAt_regFade = function(x, y, reg0icon, color_gn, scl) {
    const thisFun = showAt_regFade;

    if(Vars.state.isPaused() || reg0icon == null) return;

    if(color_gn == null) color_gn = Color.white;
    if(scl == null) scl = 1.0;

    showAt(x, y, thisFun.funEff, scl, MDL_draw._color(color_gn), reg0icon);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": new Effect(40.0, eff => {
      eff.lifetime = 40.0 * eff.rotation;

      let reg0icon = eff.data;
      let color = eff.color;
      var a = eff.fout() * color.a;

      if(reg0icon instanceof TextureRegion) {
        MDL_draw.drawRegion_normal(eff.x, eff.y, reg0icon, 0.0, 1.0, color, a, Layer.effect + VAR.lay_offDrawOver);
      } else {
        MDL_draw.drawRegion_icon(eff.x, eff.y, reg0icon, 0.0, 1.0, color, a);
      };
    }),
  });
  exports.showAt_regFade = showAt_regFade;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a damage number effect.
   * Only works when damage display is enabled.
   * ---------------------------------------- */
  const showAt_dmg = function(x, y, dmg, team, mode) {
    const thisFun = showAt_dmg;

    if(!PARAM.displayDamage || dmg == null || dmg < 0.0001 || dmg < PARAM.damageDisplayThreshold) return;
    if(mode == null) mode = "health";
    if(!mode.equalsAny(thisFun.modes)) return;

    if(team == null) team = Team.derelict;

    var color = null;
    switch(mode) {
      case "health" :
        color = team === Team.derelict ? Color.white : team.color;
        break;
      case "shield" :
        color = Pal.techBlue;
        break;
      case "heal" :
        color = Pal.heal;
        break;
    };
    if(color == null) return;

    showAround(x, y, thisFun.funEff, 14.0, dmg, color, mode);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "modes": ["health", "shield", "heal"],
    "funEff": new Effect(40.0, eff => {
      let dmg = eff.rotation;
      let mode = eff.data;
      var sizeScl = Math.max(Math.log((dmg + 10.0) / 10.0), 0.7);

      let strDmg = dmg > 9.9999 ? Strings.fixed(dmg, 0) : (dmg > 0.9999 ? Strings.fixed(dmg, 1) : Strings.fixed(dmg, 2));
      let str_fi = null;
      switch(mode) {
        case "health" :
          str_fi = strDmg;
          break;
        case "shield" :
          str_fi = "<" + strDmg + ">";
          break;
        case "heal" :
          str_fi = "+" + strDmg;
          break;
      };

      MDL_draw.drawText(
        eff.x,
        eff.y,
        str_fi,
        sizeScl - Interp.pow3In.apply(eff.fin()) * sizeScl,
        eff.color,
        Align.center,
        0.0,
        8.0 * eff.fin(),
        Math.min(dmg / 10000.0, 10.0),
      );
    }),
  });
  exports.showAt_dmg = showAt_dmg;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a line effect from (x, y) to {posIns}.
   * ---------------------------------------- */
  const showBetween_line = function(x, y, posIns, color_gn, strokeScl) {
    const thisFun = showBetween_line;

    if(posIns == null) return;

    if(color_gn == null) color_gn = Color.white;
    if(strokeScl == null) strokeScl = 1.0;

    showAt(x, y, thisFun.funEff, strokeScl, MDL_draw._color(color_gn), posIns);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": new Effect(40.0, eff => {
      let e = eff.data;
      var strokeScl = eff.rotation;
      let color = eff.color;
      var a = Interp.pow2In.apply(eff.fout()) * color.a;

      Lines.stroke(2.0 * strokeScl, color);
      Draw.alpha(a);
      Lines.line(eff.x, eff.y, e.x, e.y);
      Draw.reset();
    }),
  });
  exports.showBetween_line = showBetween_line;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a item transfer effect from (x, y) to {posIns}.
   * ---------------------------------------- */
  const showBetween_itemTransfer = function(x, y, posIns, color_gn, repeat) {
    if(posIns == null) return;

    if(color_gn == null) color_gn = Pal.accent;
    if(repeat == null) repeat = 3;

    for(let i = 0; i < repeat; i++) {
      showAt(x, y, Fx.itemTransfer, 0.0, MDL_draw._color(color_gn), posIns);
    };
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showBetween_itemTransfer = showBetween_itemTransfer;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a chain lightning effect from (x, y) to {posIns}.
   * ---------------------------------------- */
  const showBetween_lightning = function(x, y, posIns, color_gn, hasSound) {
    if(posIns == null) return;

    if(color_gn == null) color_gn = Pal.accent;

    showAt(x, y, Fx.chainLightning, 0.0, MDL_draw._color(color_gn), posIns);
    if(hasSound) playAt(x, y, Sounds.spark);
  };
  exports.showBetween_lightning = showBetween_lightning;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {showBetween_lightning} that is used for a list of entities.
   * ---------------------------------------- */
  const showAmong_lightning = function(x, y, es, color_gn, hasSound) {
    if(es == null || es.length === 0) return;

    let i = 0;
    let iCap = es.iCap();
    while(i < iCap) {
      let e1 = (i === 0) ? new Vec2(x, y) : es[i - 1];
      let e2 = es[i];
      showBetween_lightning(e1.x, e1.y, e2, color_gn);
      i++;
    };

    if(hasSound) playAt(x, y, Sounds.spark);
  };
  exports.showAmong_lightning = showAmong_lightning;
