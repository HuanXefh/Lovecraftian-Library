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


  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_texture = require("lovec/mdl/MDL_texture");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const TP_effect = require("lovec/tp/TP_effect");
  const TP_shader = require("lovec/tp/TP_shader");


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


  const play_global = function(se_gn, vol, pitch, offPitch) {
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
  exports.play_global = play_global;


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

    data == null ?
      eff.at(x, y, rot, color) :
      eff.at(x, y, rot, color, data);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showAt = showAt;


  const showAt_global = function(x, y, eff, rot, color, data) {
    if(Vars.state.isPaused() || eff == null) return;
    if(rot == null) rot = Mathf.random(360.0);
    if(color == null) color = Color.white;

    showAt(x, y, eff, rot, color, data);
    data == null ?
      Call.effect(eff, x, y, rot, color) :
      Call.effect(eff, x, y, rot, color, data);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showAt_global = showAt_global;


  const showAround = function(x, y, eff, rad, rot, color, data) {
    if(Vars.state.isPaused() || eff == null) return;

    showAt(x + Mathf.range(rad), y + Mathf.range(rad), eff, rot, color, data);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showAround = showAround;


  const showAround_global = function(x, y, eff, rot, color, data) {
    if(Vars.state.isPaused() || eff == null) return;

    showAt_global(x, y, eff, rot, color, data);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showAround_global = showAround_global;


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
    (repeat)._it(1, i => {
      x_i = x + Mathf.range(rad);
      y_i = y + Mathf.range(rad);
      Effect.floorDust(x_i, y_i, 8.0);
    });
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showAt_dust = showAt_dust;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates an effect that shows click.
   * ---------------------------------------- */
  const showAt_click = function(x, y, color_gn) {
    const thisFun = showAt_click;

    if(Vars.state.isPaused()) return;
    if(color_gn == null) color_gn = Pal.accent;

    showAt(x, y, thisFun.funEff, 0.0, MDL_color._color(color_gn));
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": TP_effect._circleWave(2.0, 0.0, 6.0, null, 0.75),
  });
  exports.showAt_click = showAt_click;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates several circle spark effects.
   * ---------------------------------------- */
  const showAt_colorDust = function(x, y, rad, color_gn) {
    const thisFun = showAt_colorDust;

    if(Vars.state.isPaused()) return;
    if(rad == null) rad = 20.0;

    showAt(x, y, thisFun.funEff, rad, MDL_color._color(color_gn));
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": (function() {
      const tmp = new Effect(80.0, eff => {
        let frac1 = Interp.pow10Out.apply(Interp.pow10Out.apply(eff.fin()));
        let frac2 = 1.0 - Interp.pow2In.apply(eff.fin());

        Draw.color(eff.color);
        Angles.randLenVectors(eff.id, 18, eff.finpow() * eff.rotation, (x, y) => {
          Fill.circle(eff.x + x * frac1, eff.y + y * frac1, frac2 * 3.5);
        });
        Draw.color(Tmp.c1.set(eff.color).mul(1.2));
        Angles.randLenVectors(eff.id + 11, 14, eff.finpow() * eff.rotation * 0.9, (x, y) => {
          Fill.circle(eff.x + x * frac1, eff.y + y * frac1, frac2 * 3.0);
        });
        Draw.color(Tmp.c1.set(eff.color).mul(1.35));
        Angles.randLenVectors(eff.id + 22, 10, eff.finpow() * eff.rotation * 0.85, (x, y) => {
          Fill.circle(eff.x + x * frac1, eff.y + y * frac1, frac2 * 2.5);
        });
      });
      tmp.layer = VAR.lay_effFlr - 0.1;

      return tmp;
    })(),
  });
  exports.showAt_colorDust = showAt_colorDust;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a triangular effect that moves towards the nearest core.
   * Mostly used by CEP consumer blocks.
   * ---------------------------------------- */
  const showAt_coreSignal = function(x, y, team, pad, rad) {
    const thisFun = showAt_coreSignal;

    if(Vars.state.isPaused() || team == null) return;
    if(team == null) return;
    let b = Vars.state.teams.closestCore(x, y, team);
    if(b == null) return;
    if(pad == null) pad = 0.0;
    if(rad == null) rad = 120.0;

    showAt(x, y, thisFun.funEff, rad, team.color, [b, pad, Math.random() > 0.5]);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": new Effect(280.0, eff => {
      var ang = Mathf.angle(eff.data[0].x - eff.x, eff.data[0].y - eff.y);
      var size = 24.0 - 18.0 * Interp.pow2Out.apply(1.0 - eff.fout());

      Draw.color(eff.color, Interp.pow2In.apply(1.0 - eff.fin()));
      Draw.rect(
        "lovec-efr-triangle-hollow",
        eff.x + eff.rotation * Mathf.cosDeg(ang) * eff.fin() + eff.data[1] * Mathf.cosDeg(ang),
        eff.y + eff.rotation * Mathf.sinDeg(ang) * eff.fin() + eff.data[1] * Mathf.sinDeg(ang),
        size,
        size,
        ang + 90.0 + 640.0 * eff.fin() * (eff.data[2] ? -1.0 : 1.0));
      Draw.reset();
    }),
  });
  exports.showAt_coreSignal = showAt_coreSignal;


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
        Draw.reset();
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

    if(Vars.state.isPaused()) return;

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

    if(Vars.state.isPaused()) return;

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
  const showAt_corrosion = function(x, y, size, liqColor, isClogging) {
    const thisFun = showAt_corrosion;

    if(Vars.state.isPaused()) return;
    if(size == null) size = 1;
    if(liqColor == null) liqColor = Color.white;

    var rad = size * Vars.tilesize * 0.5;
    showAround(x, y, thisFun.funEff, rad, null, liqColor, Object.val(isClogging, false));
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": new Effect(120.0, eff => {
      Draw.z(VAR.lay_effBase);
      Draw.color(eff.color);

      var sizeScl = Interp.pow5Out.apply(1.0 - eff.fin());
      !eff.data ?
        Fill.circle(eff.x, eff.y, 0.8 * sizeScl) :
        Draw.rect("lovec-efr-glob", eff.x, eff.y, 5.0 * sizeScl, 5.0 * sizeScl, eff.rotation);
    }),
  });
  exports.showAt_corrosion = showAt_corrosion;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates remains of a unit.
   * ---------------------------------------- */
  const showAt_remains = function(x, y, e0etp, team, isPermanent, forceHot) {
    if(e0etp == null || team == null) return;
    let e = (e0etp instanceof Unit) ? e0etp : (e0etp instanceof Building ? e0etp : null);
    let etp = (e0etp instanceof Unit) ? e0etp.type : (e0etp instanceof Building ? e0etp.block : e0etp);
    let t = Vars.world.tileWorld(x, y);
    if(t == null || !t.floor().canShadow) return;

    let tint = null;
    var a = 1.0;
    var z = etp instanceof Block ? VAR.lay_buildingRemains : VAR.lay_unitRemains;
    let inLiq = false;
    let shouldFloat = false;
    if((function () {
      if(!t.floor().isLiquid) return false;
      if(etp instanceof Block) {
        return true;
      } else {
        if(t.build != null || (t.solid() && !(t.block() instanceof TreeBlock))) return false;
      };
      return true;
    })()) {
      inLiq = true;
      if(!(etp instanceof Block) && MDL_entity._hitSize(etp) < 17.5001) {shouldFloat = true} else {
        let liq = t.floor().liquidDrop;
        if(liq != null) {
          tint = liq.color;
        } else {
          tint = t.floor().mapColor;
        };
        a = 0.5;
        z = etp instanceof Block ? VAR.lay_buildingRemainsDrown : VAR.lay_unitRemainsDrown;
      };
    };

    const remains = extend(Decal, {


      lifetime: isPermanent ? MATH_base.maxTime : PARAM.unitRemainsLifetime, offTime: Mathf.random(1200.0),
      x: x, y: y, rotation: etp instanceof Block ? (Mathf.random(90.0) - 45.0) : Mathf.random(360.0), team: team,
      color: Color.valueOf("606060"), tint: tint, a: a, z: z, off: Mathf.random(90.0),
      region: etp instanceof Block ? MDL_texture._regBlk(etp) : Core.atlas.find(etp.name + "-icon", etp.region),
      cellRegion: etp instanceof Block ? null : Core.atlas.find(etp.name + "-cell-icon", etp.cellRegion), softShadowRegion: etp instanceof Block ? null : etp.softShadowRegion,
      shouldFloat: shouldFloat,
      isHot: forceHot ? true : MDL_cond._isHot(e, t), shouldFadeHeat: forceHot ? false : (!MDL_cond._isHotSta(t.floor().status) || !inLiq),


      draw() {
        var x = this.x + (!this.shouldFloat ? 0.0 : Math.sin((Time.time + this.offTime) * 0.01) * 0.35 * Vars.tilesize);
        var y = this.y + (!this.shouldFloat ? 0.0 : Math.cos((Time.time + this.offTime) * 0.05 + 32.0) * 0.15 * Vars.tilesize);
        if(this.shouldFloat && Mathf.chanceDelta(0.01)) showAt_ripple(x, y, MDL_entity._hitSize(etp) * 1.2);

        Draw.z(this.z - 1.0);
        Draw.color(Color.black, etp instanceof Block ? 0.3 : 0.5);
        if(this.softShadowRegion == null) {
          Draw.rect("square-shadow", x, y, MDL_entity._hitSize(etp) * 2.1, MDL_entity._hitSize(etp) * 2.1, this.rotation);
        } else {
          Draw.rect(this.softShadowRegion, x, y, this.region.width * 0.4, this.region.width * 0.4, this.rotation);
        };
        if(etp instanceof Block) {
          Draw.draw(this.z, () => {
            // Use a shader to create incomplete debris
            TP_shader.shader0blk_debris.ex_accRegion(this.region);
            TP_shader.shader0blk_debris.ex_accMulColor(this.color);
            TP_shader.shader0blk_debris.ex_accA(this.a - Mathf.curve(this.fin(), 0.98) * this.a);
            TP_shader.shader0blk_debris.ex_accOff(this.off);
            Draw.shader(TP_shader.shader0blk_debris);
            Draw.rect(this.region, x, y, this.rotation);
            Draw.shader();
            Draw.flush();
          });
        } else {
          Draw.z(this.z);
          if(this.tint != null) {Draw.tint(this.color, this.tint, 0.5)} else {
            if(!this.isHot) {Draw.color(this.color)} else {
              Draw.color(Tmp.c1.set(Color.valueOf("ea8878")).lerp(this.color, Interp.pow2Out.apply(this.fin())), this.a - Mathf.curve(this.fin(), 0.98) * this.a);
            };
          };
          Draw.rect(this.region, x, y, this.rotation);
          if(this.cellRegion != null) {
            Draw.color(Tmp.c2.set(this.color).mul(this.team.color), this.a - Mathf.curve(this.fin(), 0.98) * this.a);
            Draw.rect(this.cellRegion, x, y, this.rotation);
          };
          Draw.color();
          if(this.isHot) {
            Draw.blend(Blending.additive);
            Draw.mixcol(Color.valueOf("ff3838"), 1.0);
            Draw.alpha((0.5 + Mathf.absin(10.0, 0.5)) * (!this.shouldFadeHeat ? (0.5 - Mathf.curve(this.fin(), 0.98) * 0.5) : (0.5 - Interp.pow2Out.apply(this.fin()) * 0.5)));
            Draw.rect(this.region, x, y, this.rotation);
            Draw.blend();
          };
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

    if(e instanceof Building) {
      let reg = e.block instanceof BaseTurret ?
        Object.val(MDL_texture._regTurBase(e.block), e.block.region) :
        Core.atlas.find(e.block.name + "-icon", e.block.region);
      if(reg != null) showAt(MDL_ui._cameraX(), MDL_ui._cameraY(), thisFun.funEff, 0.0, MDL_color._color(color_gn), [reg, e]);
    } else {
      if(MDL_color._isSameColor(color, Pal.heal)) {
        unit.healTime = 1.0;
      } else {
        unit.hitTime = 1.0;
      };
    };
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": new Effect(20.0, eff => {
      let e = eff.data[1];

      MDL_draw.drawRegion_normal(e.x, e.y, eff.data[0], e.drawrot(), 1.0, eff.color, eff.color.a * eff.fout(), Layer.effect + VAR.lay_offDrawOver, true);
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
    if(scl == null) scl = 1.0;

    showAt(x, y, thisFun.funEff, scl, MDL_color._color(color_gn), reg0icon);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": new Effect(40.0, eff => {
      eff.lifetime = 40.0 * eff.rotation;

      var a = eff.fout() * color.a;

      if(eff.data instanceof TextureRegion) {
        MDL_draw.drawRegion_normal(eff.x, eff.y, eff.data, 0.0, 1.0, eff.color, a, Layer.effect + VAR.lay_offDrawOver);
      } else {
        MDL_draw.drawRegion_icon(eff.x, eff.y, eff.data, 0.0, 1.0, eff.color, a);
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

    let color = null;
    let str = dmg > 9.9999 ? Strings.fixed(dmg, 0) : (dmg > 0.9999 ? Strings.fixed(dmg, 1) : Strings.fixed(dmg, 2));
    switch(mode) {
      case "health" :
        color = team === Team.derelict ? Color.white : team.color;
        break;
      case "shield" :
        color = Pal.techBlue;
        str = "<" + str + ">";
        break;
      case "heal" :
        color = Pal.heal;
        str = "+" + str;
        break;
      case "heat" :
        color = Color.orange;
        str = "^" + str;
        break;
    };
    if(color == null) return;

    let sizeScl = Math.max(Math.log((dmg + 10.0) / 10.0), 0.7);

    showAround(x, y, thisFun.funEff, 8.0, dmg, color, [str, sizeScl]);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "modes": ["health", "shield", "heal", "heat"],
    "funEff": new Effect(40.0, eff => {
      MDL_draw.drawText(
        eff.x,
        eff.y,
        eff.data[0],
        eff.data[1] - Interp.pow3In.apply(eff.fin()) * eff.data[1],
        eff.color,
        Align.center,
        0.0,
        8.0 * eff.fin(),
        Math.min(eff.rotation / 10000.0, 10.0),
      );
    }),
  });
  exports.showAt_dmg = showAt_dmg;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a line effect from (x, y) or {e0} to {e}.
   * ---------------------------------------- */
  const showBetween_line = function(x, y, e0, e, color_gn, strokeScl) {
    const thisFun = showBetween_line;

    if(Vars.state.isPaused() || e == null) return;
    if(strokeScl == null) strokeScl = 1.0;

    showAt(x, y, thisFun.funEff, strokeScl, MDL_color._color(color_gn), [e0, e]);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": new Effect(40.0, eff => {
      let e0 = eff.data[0];

      Lines.stroke(2.0 * eff.rotation, eff.color);
      Draw.alpha(Interp.pow2In.apply(eff.fout()) * eff.color.a);
      Lines.line(e0 == null ? eff.x : e0.x, e0 == null ? eff.y : e0.y, eff.data[1].x, eff.data[1].y);
      Draw.reset();
    }),
  });
  exports.showBetween_line = showBetween_line;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a item transfer effect from (x, y) to {posIns}.
   * ---------------------------------------- */
  const showBetween_itemTransfer = function(x, y, posIns, color_gn, repeat, isGlobal) {
    if(Vars.state.isPaused() || posIns == null) return;
    if(color_gn == null) color_gn = Pal.accent;
    if(repeat == null) repeat = 3;

    for(let i = 0; i < repeat; i++) {
      (isGlobal ? showAt_global : showAt)(x, y, Fx.itemTransfer, 0.0, MDL_color._color(color_gn), posIns);
    };
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showBetween_itemTransfer = showBetween_itemTransfer;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a chain lightning effect from (x, y) to {e}.
   * ---------------------------------------- */
  const showBetween_lightning = function(x, y, e, color_gn, hasSound) {
    if(Vars.state.isPaused() || posIns == null) return;
    if(color_gn == null) color_gn = Pal.accent;

    showAt(x, y, Fx.chainLightning, 0.0, MDL_color._color(color_gn), e);
    if(hasSound) playAt(x, y, Sounds.spark);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showBetween_lightning = showBetween_lightning;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {showBetween_lightning} that is used for a list of entities.
   * ---------------------------------------- */
  const showAmong_lightning = function(x, y, es, color_gn, hasSound) {
    if(Vars.state.isPaused() || es == null || es.length === 0) return;

    let i = 0;
    let iCap = es.iCap();
    while(i < iCap) {
      let e1 = (i === 0) ? new Vec2(x, y) : es[i - 1];
      let e2 = es[i];
      showBetween_lightning(e1.x, e1.y, e2, color_gn);
      i++;
    };

    if(hasSound) playAt(x, y, Sounds.spark);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.showAmong_lightning = showAmong_lightning;


  /* ----------------------------------------
   * NOTE:
   *
   * Line effect but replaced with laser.
   * ---------------------------------------- */
  const showBetween_laser = function(x, y, e0, e, color_gn, strokeScl, hasLight) {
    const thisFun = showBetween_laser;

    if(Vars.state.isPaused() || e == null) return;
    if(color_gn == null) color_gn = Pal.accent;

    showAt(x, y, thisFun.funEff, Object.val(strokeScl, 1.0), MDL_color._color(color_gn), [e0, e, hasLight]);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff": new Effect(30.0, eff => {
      let e0 = eff.data[0];

      MDL_draw.drawLine_laser(
        e0 == null ? eff.x : e0.x,
        e0 == null ? eff.y : e0.y,
        eff.data[1].x,
        eff.data[1].y,
        eff.rotation * Interp.pow2Out.apply(1.0 - eff.fin()),
        eff.color,
        Color.white,
        1.0,
        eff.data[2],
      );
    }),
  });
  exports.showBetween_laser = showBetween_laser;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a point laser effect, e.g. the one used in laser defense ability.
   * ---------------------------------------- */
  const showBetween_pointLaser = function(x, y, e, color_gn, se_gn) {
    const thisFun = showBetween_pointLaser;

    if(Vars.state.isPaused() || e == null) return;
    if(color_gn == null) color_gn = Pal.remove;

    let color = MDL_color._color(color_gn);
    let tup = [e.x, e.y];

    showAt(x, y, thisFun.funEff1, 0.0, color, tup);
    showAt(x, y, thisFun.funEff2, 0.0, color, tup);
    showAt(x, y, thisFun.funEff2, 0.0, color);
    if(se_gn != null) playAt(x, y, se_gn, 1.0, 1.0, 0.05);
  }
  .setAnno(ANNO.__NONHEADLESS__)
  .setProp({
    "funEff1": new Effect(30.0, 300.0, eff => {
      Draw.color(eff.color, eff.fout());
      Lines.stroke(2.0);
      Lines.line(eff.x, eff.y, eff.data[0], eff.data[1]);
      Drawf.light(eff.x, eff.y, eff.data[0], eff.data[1], 20.0, eff.color, 0.65 * eff.fout());
      Draw.reset();
    }),
    "funEff2": new Effect(30.0, eff => {
      Draw.color(eff.color, eff.fout());
      eff.data == null ?
        Fill.circle(eff.x, eff.y, 2.0 + eff.fout()) :
        Fill.circle(eff.data[0], eff.data[1], 2.0 + eff.fout());
    }),
  });
  exports.showBetween_pointLaser = showBetween_pointLaser;
