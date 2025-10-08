/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used when radius and/or color parameters are dynamic and costy to get.
   * Format for {drawF}: {(blk, tx, ty, rot, rad, color) => {...}}.
   * ---------------------------------------- */
  const drawBuffer_place = function(blk, tx, ty, rot, radGetter, colorGetter, drawF) {
    const thisFun = drawBuffer_place;

    if(drawF == null) return;
    if(radGetter == null) radGetter = Function.airZero;
    if(colorGetter == null) colorGetter = Function.airWhite;

    let tmpBlk = thisFun.funTup[0];
    var tmpTx = thisFun.funTup[1];
    var tmpTy = thisFun.funTup[2];
    var tmpRot = thisFun.funTup[3];
    if(blk !== tmpBlk || tx !== tmpTx || ty !== tmpTy || rot !== tmpRot) {
      thisFun.funTup.clear().push(blk, tx, ty, rot, radGetter(), colorGetter(), drawF);
      tmpBlk = thisFun.funTup[0];
      tmpTx = thisFun.funTup[1];
      tmpTy = thisFun.funTup[2];
      tmpRot = thisFun.funTup[3];
    };

    thisFun.funTup[6](tmpBlk, tmpTx, tmpTy, tmpRot, thisFun.funTup[4], thisFun.funTup[5]);
  }
  .setProp({
    "funTup": [],
  });
  exports.drawBuffer_place = drawBuffer_place;


  /* ----------------------------------------
   * NOTE:
   *
   * {drawPlace} that every block should have.
   * Used if {this.super$drawPlace} is not called.
   * ---------------------------------------- */
  const comp_drawPlace_baseBlock = function(blk, tx, ty, rot, valid) {
    blk.drawPotentialLinks(tx, ty);
    blk.drawOverlay(tx.toFCoord(blk.size), ty.toFCoord(blk.size), rot);
  };
  exports.comp_drawPlace_baseBlock = comp_drawPlace_baseBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * {draw} that every building should have.
   * Used if {this.super$draw} is not called.
   * ---------------------------------------- */
  const comp_draw_baseBuilding = function(b) {
    b.block.variant === 0 || b.block.variantRegions == null ?
      Draw.rect(b.block.region, b.x, b.y, b.drawrot()) :
      Draw.rect(b.block.variantRegions[Mathf.randomSeed(b.tile.pos(), 0, Mathf.maxZero(b.block.variantRegions.length - 1))], b.x, b.y, b.drawrot());

    b.drawTeamTop();
  };
  exports.comp_draw_baseBuilding = comp_draw_baseBuilding;


  /* ----------------------------------------
   * NOTE:
   *
   * Shows extra information for a tile/building.
   * See {DB_misc.db["block"]["extraInfo"]}.
   * ---------------------------------------- */
  const comp_drawSelect_extraInfo = function(t) {
    const thisFun = comp_drawSelect_extraInfo;

    if(t == null) return;

    if(t === thisFun.tmpT) {
      thisFun.tmpCd--;
    } else {
      thisFun.tmpT = t;
      thisFun.tmpCd = VAR.time_extraInfoCooldown;
      thisFun.tmpStr = null;
    };
    if(thisFun.tmpCd > 0.0) return;

    var x = t.build == null ? t.worldx() : t.build.x;
    var y = t.build == null ? t.worldy() : t.build.y;
    var offX = !PARAM.drawBuildStat || t.build == null ? 0.0 : ((VAR.r_offBuildStat + t.build.block.size * 0.5) * Vars.tilesize - 8.0);
    var offY = -(!PARAM.drawBuildStat || t.build == null ? 10.0 : ((VAR.r_offBuildStat + t.build.block.size * 0.5) * Vars.tilesize + 2.0));

    if(thisFun.tmpStr == null) {
      thisFun.tmpStr = "";
      DB_misc.db["block"]["extraInfo"].forEachFast(strGetter => thisFun.tmpStr += Object.val(strGetter(t, t.build), ""));
    };

    drawText(x + offX, y + offY, thisFun.tmpStr, 0.8, Color.white, Align.left, 0.0, 0.0, 10.0);
  }.setProp({
    "tmpT": null,
    "tmpCd": 0.0,
    "tmpStr": null,
  });
  exports.comp_drawSelect_extraInfo = comp_drawSelect_extraInfo;


  /* ----------------------------------------
   * NOTE:
   *
   * Shows how bridges are connected and the transport destination.
   * ---------------------------------------- */
  const comp_drawSelect_bridgeLine = function(b) {
    const thisFun = comp_drawSelect_bridgeLine;

    if(!PARAM.drawBridgeTransportLine) return;

    if(b.block instanceof DirectionBridge) {

      let tmpB = b;
      let tmpOb = b.findLink();
      var isFirst = true;
      thisFun.funArr.clear().push(tmpB);
      while(tmpOb != null) {
        if(!thisFun.funArr.includes(tmpOb)) {
          if(!isFirst) drawConnector_circleArrow(tmpOb, tmpB);
          thisFun.funArr.push(tmpOb);
          tmpB = tmpOb;
          tmpOb = tmpB.findLink();
          isFirst = false;
        } else break;
      };

    } else if(b.block instanceof ItemBridge) {

      let ot = Vars.world.tile(b.link);
      let tmpB = b;
      let tmpOb = null;
      var isFirst = true;
      thisFun.funArr.clear().push(tmpB);
      while(ot != null) {
        tmpOb = ot.build;
        if(tmpOb != null && tmpOb.block === b.block && !thisFun.funArr.includes(tmpOb)) {
          if(!isFirst) drawConnector_circleArrow(tmpOb, tmpB);
          thisFun.funArr.push(tmpOb);
          tmpB = ot.build;
          // Idk why but on rare occasions this throws NullPointerException
          if(tmpB == null || tmpB.block !== b.block) break;
          ot = Vars.world.tile(tmpB.link);
          isFirst = false;
        } else break;
      };

    };
  }
  .setProp({
    "funArr": [],
  });
  exports.comp_drawSelect_bridgeLine = comp_drawSelect_bridgeLine;


  /* <---------- region ----------> */


  /* normal */


  /* ----------------------------------------
   * NOTE:
   *
   * {drawRegion}.
   * ---------------------------------------- */
  const drawRegion_normal = function(x, y, reg, ang, regScl, color_gn, a, z, shouldMixcol, mixcolA) {
    if(reg == null) return;
    if(ang == null) ang = 0.0;
    if(regScl == null) regScl = 1.0;
    if(a == null) a = 1.0;

    var w = reg.width * 2.0 * regScl / Vars.tilesize;
    var h = reg.height * 2.0 * regScl / Vars.tilesize;

    let prevZ = Draw.z();
    if(z != null) Draw.z(z);
    if(shouldMixcol) {
      Draw.mixcol(MDL_color._color(color_gn), Object.val(mixcolA, 1.0));
      Draw.color(Color.white);
    } else {
      Draw.color(MDL_color._color(color_gn));
    };
    Draw.alpha(a);
    Draw.rect(reg, x, y, w, h, ang);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRegion_normal = drawRegion_normal;


  /* ----------------------------------------
   * NOTE:
   *
   * {drawSideRegion}.
   * ---------------------------------------- */
  const drawRegion_side = function(x, y, reg1, reg2, rot, color_gn, a, z) {
    if(reg1 == null || reg2 == null) return;
    if(rot == null) rot = 0;
    if(color_gn == null) color_gn = Color.white;
    if(a == null) a = 1.0;

    let prevZ = Draw.z();
    if(z != null) Draw.z(z);
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(a);
    Draw.rect(rot > 1 ? reg1 : reg2, x, y, rot * 90.0);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRegion_side = drawRegion_side;


  /* ----------------------------------------
   * NOTE:
   *
   * {drawRegion} with a shader effect.
   * ---------------------------------------- */
  const drawRegion_shader = function(x, y, reg, shader, ang, regScl, color_gn, a, z) {
    if(reg == null) return;
    if(ang == null) ang = 0.0;
    if(regScl == null) regScl = 1.0;
    if(color_gn == null) color_gn = Color.white;
    if(a == null) a = 1.0;

    var w = reg.width * 2.0 * regScl / Vars.tilesize;
    var h = reg.height * 2.0 * regScl / Vars.tilesize;

    let prevZ = Draw.z();
    if(z != null) Draw.z(z);
    Draw.color(MDL_color._color(color_gn), a);
    Draw.shader(shader);
    Draw.rect(reg, x, y, w, h, ang);
    Draw.shader();
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRegion_shader = drawRegion_shader;


  /* ----------------------------------------
   * NOTE:
   *
   * A planar region that flips, that's it.
   * ---------------------------------------- */
  const drawRegion_flip = function(x, y, reg, flipAng, ang, regScl, color_gn, a, z) {
    if(reg == null) return;
    if(flipAng == null) flipAng = 0.0;
    if(ang == null) ang = 0.0;
    if(regScl == null) regScl = 1.0;
    if(color_gn == null) color_gn = Color.white;
    if(a == null) a = 1.0;

    var w = reg.width * 2.0 * regScl / Vars.tilesize * Mathf.cos(Mathf.wrapAngleAroundZero(flipAng * Mathf.degressToRadians));
    var h = reg.height * 2.0 * regScl / Vars.tilesize;

    let prevZ = Draw.z();
    if(z != null) Draw.z(z);
    Draw.color(MDL_color._color(color_gn), a);
    Draw.rect(reg, x, y, w, h, ang);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRegion_flip = drawRegion_flip;


  /* ----------------------------------------
   * NOTE:
   *
   * Better use this in {drawBase} for some floor blocks.
   * Randomly chooses one in {regs} to draw over the floor.
   * Higher {denom} means sparser.
   * ---------------------------------------- */
  const drawRegion_randomOverlay = function(t, regs, denom, off1, off2) {
    if(t == null || regs == null) return;
    let iCap = regs.iCap();
    if(iCap === 0) return;
    if(denom == null) denom = 80;
    if(off1 == null) off1 = 0;
    if(off2 == null) off2 = 0;

    if(Math.floor(Mathf.randomSeed(t.pos() + off1, 0, denom)) !== 0) return;

    drawRegion_normal(
      t.worldx(),
      t.worldy(),
      regs[Math.floor(Mathf.randomSeed(t.pos() + 114514 + off2, 0, iCap))],
      0.0,
      1.0,
      Color.white,
      1.0,
      VAR.lay_randOv,
    );
  };
  exports.drawRegion_randomOverlay = drawRegion_randomOverlay;


  /* icon */


  /* ----------------------------------------
   * NOTE:
   *
   * Draws something like Icon.power, not in a table now.
   * ---------------------------------------- */
  const drawRegion_icon = function(x, y, icon, ang, regScl, color_gn, a) {
    if(icon == null) return;
    if(ang == null) ang = 0.0;
    if(regScl == null) regScl = 1.0;
    if(color_gn == null) color_gn = Color.white;
    if(a == null) a = 1.0;

    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(a * 0.8);
    Draw.rect(icon.getRegion(), x, y, 6.0 * regScl, 6.0 * regScl);
    Draw.reset();
  };
  exports.drawRegion_icon = drawRegion_icon;


  /* ----------------------------------------
   * NOTE:
   *
   * Just a big red cross.
   * ---------------------------------------- */
  const drawRegion_redCross = function(x, y) {
    drawRegion_icon(x, y, Icon.cancel, 0.0, 1.0, Color.scarlet, 1.0);
  };
  exports.drawRegion_redCross = drawRegion_redCross;


  /* status */


  /* ----------------------------------------
   * NOTE:
   *
   * Draws block status.
   * Rarely used unless something about consumer is screwed.
   * ---------------------------------------- */
  const drawRegion_status = function(x, y, size, color_gn, z) {
    if(size == null) size = 1;
    if(color_gn == null) color_gn = Color.green;
    if(z == null) z = Layer.power + 1.0;

    var mtp = size > 1 ? 1.0 : 0.64;
    var x_fi = x + size * Vars.tilesize * 0.5 - Vars.tilesize * 0.5 * mtp;
    var y_fi = y - size * Vars.tilesize * 0.5 + Vars.tilesize * 0.5 * mtp;

    let prevZ = Draw.z();
    Draw.z(z);
    Draw.color(Pal.gray);
    Fill.square(x_fi, y_fi, mtp * 2.5, 45.0);
    Draw.color(MDL_color._color(color_gn));
    Fill.square(x_fi, y_fi, mtp * 1.5, 45.0);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRegion_status = drawRegion_status;


  /* fade */


  /* ----------------------------------------
   * NOTE:
   *
   * {drawFade}.
   * ---------------------------------------- */
  const drawRegion_fade = function(x, y, reg, ang, regScl, fadeScl, color_gn, a, z) {
    if(reg == null) return;

    drawRegion_normal(
      x,
      y,
      reg,
      ang,
      regScl,
      color_gn,
      Object.val(a, 1.0) * Math.abs(Math.sin(Time.time * 0.065 / Object.val(fadeScl, 1.0))),
      z,
    );
  };
  exports.drawRegion_fade = drawRegion_fade;


  /* ----------------------------------------
   * NOTE:
   *
   * This fading region will become opaque when {frac} approaches 1.0 (not linearly).
   * Used for some very dangerous blocks like reactors.
   * ---------------------------------------- */
  const drawRegion_fadeAlert = function(x, y, frac, reg, ang, regScl, color_gn, a, z) {
    if(reg == null) return;

    drawRegion_fade(
      x,
      y,
      reg,
      ang,
      regScl,
      0.2,
      color_gn,
      1.0 - Math.pow(Mathf.clamp(Object.val(frac, 0.0)) - 1.0, 2),
      z,
    );
  };
  exports.drawRegion_fadeAlert = drawRegion_fadeAlert;


  /* ----------------------------------------
   * NOTE:
   *
   * {drawFade} controlled by a progress instead of {Time.time}.
   * Can be used to do accelerating flashers.
   * ---------------------------------------- */
  const drawRegion_fadeProg = function(x, y, fadeProg, reg, ang, regScl, fadeScl, color_gn, a, z) {
    if(reg == null) return;

    drawRegion_normal(
      x,
      y,
      reg,
      ang,
      regScl,
      color_gn,
      Object.val(a, 1.0) * Math.abs(Math.sin(fadeProg * 0.15 / Object.val(fadeScl, 1.0))),
      z,
    );
  };
  exports.drawRegion_fadeProg = drawRegion_fadeProg;


  /* rotator */


  /* ----------------------------------------
   * NOTE:
   *
   * Spin sprite I think.
   * {tProg} is supposed to be a building's {totalProgress}, use {rate} to change the speed of rotation.
   * {sideAmt} should match your sprite's symmetry.
   * ---------------------------------------- */
  const drawRegion_rotator = function(x, y, tProg, reg, ang, regScl, rate, sideAmt, color_gn, a, z) {
    if(reg == null) return;
    if(ang == null) ang = 0.0;
    if(regScl == null) regScl = 1.0;
    if(rate == null) rate = 6.0;
    if(sideAmt == null) side = 4;
    if(a == null) a = 1.0;

    var w = reg.width * 2.0 * regScl / Vars.tilesize;
    var h = reg.width * 2.0 * regScl / Vars.tilesize;
    var ang_fd = 360.0 / sideAmt;
    var ang_fi = Mathf.mod(tProg * rate + ang, ang_fd);

    let prevZ = Draw.z();
    if(z != null) Draw.z(z);
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(a);
    Draw.rect(reg, x, y, w, h, ang_fi);
    Draw.alpha(ang_fi / ang_fd);
    Draw.rect(reg, x, y, w, h, ang_fi - ang_fd);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRegion_rotator = drawRegion_rotator;


  /* flame */


  /* ----------------------------------------
   * NOTE:
   *
   * Alternative for {drawFlame}, where you don't have a fixed "-top" region.
   * Light is not included.
   * ---------------------------------------- */
  const drawRegion_flame = function(x, y, warmup, reg, rad, radIn, radScl, radMag, radInMag, color_gn, a) {
    if(reg == null) return;
    if(rad == null) rad = 2.5;
    if(radIn == null) radIn = 1.5;
    if(radScl == null) radScl = 5.0;
    if(radMag == null) radMag = 2.0;
    if(radInMag == null) radInMag = 1.0;
    if(color_gn == null) color_gn = "ffc999";
    if(a == null) a = 1.0;

    var param1 = 0.3;
    var param2 = 0.06;
    var param3 = Mathf.random(0.1);
    var a_fi = a * ((1.0 - param1) + Mathf.absin(Time.time, 8.0, param1) + Mathf.random(param2) - param2) * warmup;
    var rad_fi = rad + Mathf.absin(Time.time, radScl, radMag) + param3;
    var radIn_fi = radIn + Mathf.absin(Time.time, radScl, radInMag) + param3;

    let prevZ = Draw.z();
    Draw.z(Layer.block + 0.01);
    Draw.alpha(a * warmup);
    Draw.rect(reg, x, y);
    Draw.alpha(a_fi);
    Draw.tint(MDL_color._color(color_gn));
    Fill.circle(x, y, rad_fi);
    Draw.color(1.0, 1.0, 1.0, a * warmup);
    Fill.circle(x, y, radIn_fi);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRegion_flame = drawRegion_flame;


  /* shape */


  /* ----------------------------------------
   * NOTE:
   *
   * {drawWeave} but that texture region is gone.
   * ---------------------------------------- */
  const drawRegion_scan = function(x, y, tProg, warmup, size, color_gn, a, z) {
    if(size == null) size = 1;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;

    let prevZ = Draw.z();
    if(z != null) Draw.z(z);
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(warmup * a);
    Lines.lineAngleCenter(
      x + Mathf.sin(tProg, 6.0, size * Vars.tilesize / 3.0),
      y,
      90.0,
      size * Vars.tilesize / 2.0,
    );
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRegion_scan = drawRegion_scan;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws sublimate torch, no flare.
   * ---------------------------------------- */
  const drawRegion_torch = function(x, y, warmup, len, w, size, ang, color1_gn, color2_gn, a, z) {
    if(len == null) len = 0.0;
    if(len < 0.0001) return;
    if(w == null) w = 6.0;
    if(size == null) size = 0;
    if(ang == null) ang = 0.0;
    if(color1_gn == null) color1_gn = Pal.accent;
    if(color2_gn == null) color2_gn = Color.white;
    if(a == null) a = 1.0;

    let color1 = MDL_color._color(color1_gn, Tmp.c2);
    let color2 = MDL_color._color(color2_gn, Tmp.c3);
    var offRad = size * Vars.tilesize * 0.5;
    var x_fi = x + Mathf.cosDeg(ang) * offRad;
    var y_fi = y + Mathf.sinDeg(ang) * offRad;
    var len_f = len * 0.4 * warmup;
    var len_t = len * warmup;
    var w_f = w * 0.3 * warmup;
    var w_t = w * 1.2 * warmup;
    var lenScl = 1.0 + Mathf.sin(Time.time, 1.0, 0.07);

    Drawf.light(x_fi, y_fi, x + Mathf.cosDeg(ang) * len * 1.2, y + Mathf.sinDeg(ang) * len * 1.2, w_t * 6.0, color1, a * 0.65);
    let prevZ = Draw.z();
    Draw.z(z != null ? z : VAR.lay_bulFlame);
    for(let i = 0; i < 4; i++) {
      let frac_i = 1.0 - i / 3.0;
      let a_i = Mathf.lerp(a, a * 0.4, frac_i);
      let len_i = Mathf.lerp(len_f, len_t, frac_i);
      let w_i = Mathf.lerp(w_f, w_t, frac_i)
      Draw.color(Tmp.c2.set(color2).lerp(color1, frac_i));
      Draw.alpha(a_i);
      Drawf.flame(x_fi, y_fi, 12, ang, len_i * lenScl, w_i, 0.2);
    };
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRegion_torch = drawRegion_torch;


  /* glow */


  /* ----------------------------------------
   * NOTE:
   *
   * {drawGlow}.
   * ---------------------------------------- */
  const drawRegion_glow = function(x, y, reg, ang, color_gn, a, pulse, pulseScl) {
    if(reg == null) return;
    if(ang == null) ang = 0.0;
    if(color_gn == null) color_gn = "ff3838";
    if(a == null) a = 1.0;
    if(pulse == null) pulse = 0.3;
    if(pulseScl == null) pulseScl = 10.0;

    var a_fi = a * (1.0 - pulse + Mathf.absin(pulseScl, pulse));

    let prevZ = Draw.z();
    Draw.z(Layer.blockAdditive);
    Draw.blend(Blending.additive);
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(a_fi);
    Draw.rect(reg, x, y, ang);
    Draw.blend();
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRegion_glow = drawRegion_glow;


  /* ----------------------------------------
   * NOTE:
   *
   * {drawHeat}.
   * ---------------------------------------- */
  const drawRegion_heat = function(x, y, heatFrac, reg, ang, size) {
    drawRegion_glow(
      x,
      y,
      Object.val(reg, VARGEN.blockHeatRegs[Object.val(size, 1)]),
      ang,
      null,
      Mathf.clamp(Object.val(heatFrac, 1.0)),
    );
  };
  exports.drawRegion_heat = drawRegion_heat;


  /* light */


  /* ----------------------------------------
   * NOTE:
   *
   * Draws cicular light.
   * ---------------------------------------- */
  const drawRegion_light = function(x, y, warmup, rad, size, sinScl, sinMag, color_gn, a) {
    if(rad == null) rad = 40.0;
    if(size == null) size = 1;
    if(sinScl == null) sinScl = 16.0;
    if(sinMag == null) sinMag = 6.0;
    if(color_gn == null) color_gn = "ffc999";
    if(a == null) a = 0.65;

    Drawf.light(x, y, (rad + Mathf.absin(sinScl, sinMag)) * warmup * size, MDL_color._color(color_gn), a);
  };
  exports.drawRegion_light = drawRegion_light;


  /* plan */


  /* ----------------------------------------
   * NOTE:
   *
   * A transparent region that shrinks and expands with time.
   * Used to indicate placement.
   * ---------------------------------------- */
  const drawRegion_plan = function(x, y, reg, ang, regScl, color_gn, a) {
    if(reg == null) return;
    if(ang == null) ang = 0.0;
    if(regScl == null) regScl = 1.0;
    if(color_gn == null) color_gn = Color.white;
    if(a == null) a = 1.0;

    var regScl_fi = regScl * (0.825 + Math.sin(Time.time * 0.65) * 0.075);
    var w = reg.width * 2.0 * regScl_fi / Vars.tilesize;
    var h = reg.height * 2.0 * regScl_fi / Vars.tilesize;

    let prevZ = Draw.z();
    Draw.z(Layer.power - 0.01);
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(0.75 * a);
    Draw.rect(reg, x, y, ang, w, h);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRegion_plan = drawRegion_plan;


  const drawRegion_planBlk = function(blk_gn, t, color_gn) {
    if(t == null) return;
    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;

    drawRegion_plan(t.x.toFCoord(blk.size), t.y.toFCoord(blk.size), MDL_texture._regBlk(blk), color_gn);
  };
  exports.drawRegion_planBlk = drawRegion_planBlk;


  /* content */


  /* ----------------------------------------
   * NOTE:
   *
   * Draws a resource icon like that shown for drills.
   * ---------------------------------------- */
  const drawRegion_rs = function(x, y, rs_gn, size, z) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return;
    if(size == null) size = 1;

    var x_fi = x - Vars.tilesize * 0.5 * size;
    var y_fi = y + Vars.tilesize * 0.5 * size;

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Draw.mixcol(Color.darkGray, 1.0);
    Draw.rect(rs.uiIcon, x_fi, y_fi - 1.0, 6.0, 6.0);
    Draw.mixcol();
    Draw.rect(rs.uiIcon, x_fi, y_fi, 6.0, 6.0);
    Draw.z(prevZ);
  };
  exports.drawRegion_rs = drawRegion_rs;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws a resource icon that fits in tiles.
   * ---------------------------------------- */
  const drawRegion_rsBlk = function(x, y, rs_gn, size, z) {
    let rs = MDL_content._ct(rs_gn, "rs");
    if(rs == null) return;
    if(size == null) size = 1;

    var off = size % 2 === 0 ? 4.0 : 0.0;
    var w = size * Vars.tilesize;

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Draw.rect(rs.uiIcon, x + off, y + off, w, w);
    Draw.z(prevZ);
  };
  exports.drawRegion_rsBlk = drawRegion_rsBlk;


  /* <---------- p3d ----------> */


  /* ----------------------------------------
   * DEDICATION:
   *
   * Inspired by Meepscellaneous Concepts by MEEPofFaith.
   * ---------------------------------------- */


  const _coord_p3d = function(coord, z3d, isY) {
    return coord + (coord - (isY ? (Core.camera.position.y - 48.0) : Core.camera.position.x)) * Object.val(z3d, 0.0) * 0.06;
  };
  exports._coord_p3d = _coord_p3d;


  const drawP3d_wall = function(x1, y1, x2, y2, z3d, colorIn_gn, colorOut_gn, z) {
    if(colorIn_gn == null) colorIn_gn = Color.white;
    if(colorOut_gn == null) colorOut_gn = colorIn_gn;

    let fBits1 = MDL_color._color(colorIn_gn).toFloatBits();
    let fBits2 = MDL_color._color(colorOut_gn).toFloatBits();

    let prevZ = Draw.z();
    if(z != null) Draw.z(z);
    Fill.quad(
      x1, y1, fBits1,
      x2, y2, fBits1,
      _coord_p3d(x2, z3d, false), _coord_p3d(y2, z3d, true), fBits2,
      _coord_p3d(x1, z3d, false), _coord_p3d(y1, z3d, true), fBits2,
    );
    Draw.z(prevZ)
  };
  exports.drawP3d_wall = drawP3d_wall;


  const drawP3d_room = function(x, y, z3d, w, h, colorIn_gn, colorOut_gn, z) {
    const thisFun = drawP3d_room;

    if(w == null) w = 0.0;
    if(w < 0.0001) return;
    if(h == null) h = 0.0;
    if(h < 0.0001) return;
    if(colorIn_gn == null) colorIn_gn = Color.white;
    if(colorOut_gn == null) colorOut_gn = colorIn_gn;

    let colorIn = MDL_color._color(colorIn_gn, Tmp.c1);
    let colorOut = MDL_color._color(colorOut_gn, Tmp.c2);

    if(z == null) z = Draw.z();
    drawP3d_wall(x - w * 0.5, y - h * 0.5, x + w * 0.5, y - h * 0.5, z3d, Tmp.c2.set(colorIn).mul(0.75), Tmp.c3.set(colorOut).mul(0.75), z - 0.1 + thisFun.funScr(0, x, y - h * 0.5));
    drawP3d_wall(x - w * 0.5, y + h * 0.5, x + w * 0.5, y + h * 0.5, z3d, Tmp.c2.set(colorIn).mul(1.2), Tmp.c3.set(colorOut).mul(1.2), z - 0.1 + thisFun.funScr(2, x, y + h * 0.5));
    drawP3d_wall(x - w * 0.5, y - h * 0.5, x - w * 0.5, y + h * 0.5, z3d, Tmp.c2.set(colorIn), Tmp.c3.set(colorOut), z - 0.1 + thisFun.funScr(3, x - w * 0.5, y));
    drawP3d_wall(x + w * 0.5, y - h * 0.5, x + w * 0.5, y + h * 0.5, z3d, Tmp.c2.set(colorIn), Tmp.c3.set(colorOut), z - 0.1 + thisFun.funScr(1, x + w * 0.5, y));
  }
  .setProp({
    "funScr": (ind, x, y) => {
      let condX = x - Core.camera.position.x >= 0.0;
      let condY = y - Core.camera.position.y + 48.0 >= 0.0;
      if(condX && condY) {
        switch(ind) {
          case 0 : return 0.0003;
          case 1 : return 0.0001;
          case 2 : return 0.0002;
          case 3 : return 0.0004;
        };
      } else if(!condX && condY) {
        switch(ind) {
          case 0 : return 0.0003;
          case 1 : return 0.0004;
          case 2 : return 0.0002;
          case 3 : return 0.0001;
        };
      } else if(!condX && !condY) {
        switch(ind) {
          case 0 : return 0.0002;
          case 1 : return 0.0004;
          case 2 : return 0.0003;
          case 3 : return 0.0001;
        };
      } else {
        switch(ind) {
          case 0 : return 0.0002;
          case 1 : return 0.0001;
          case 2 : return 0.0003;
          case 3 : return 0.0004;
        };
      };
    },
  });
  exports.drawP3d_room = drawP3d_room;


  const drawP3d_roomFade = function(x, y, z3d, w, h, color_gn, z) {
    let colorIn = MDL_color._color(color_gn);
    let colorOut = Tmp.c3.set(colorIn);
    colorOut.a = 0.0;
    drawP3d_room(x, y, z3d, w, h, colorIn, colorOut, z);
  };
  exports.drawP3d_roomFade = drawP3d_roomFade;


  const drawP3d_region = function(x, y, z3d, reg, regScl, regFixScl, color_gn, z) {
    if(reg == null) return;
    // 0.5 is enough for regular tall buildings
    if(z3d == null) z3d = 0.5;
    if(regScl == null) regScl = 1.0;
    // Have to test this value in game if {z3d} is larger than one, not linear
    if(regFixScl == null) regFixScl = 1.08;
    if(color_gn == null) color_gn = "565666";

    var w = reg.width * 2.0 * regScl / Vars.tilesize;
    var h = reg.height * 2.0 * regScl / Vars.tilesize;

    let prevZ = Draw.z();
    drawP3d_room(x, y, z3d, w, h, color_gn, Object.val(z, Layer.power - 1.85));
    Draw.rect(reg, _coord_p3d(x, z3d, false), _coord_p3d(y, z3d, true), w * regFixScl, h * regFixScl);
    Draw.z(prevZ);
  };
  exports.drawP3d_region = drawP3d_region;


  const drawP3d_cylinder = function(x, y, z3d, rad, colorIn_gn, colorOut_gn, z) {
    var sideAmt = Lines.circleVertices(rad) * 2;
    var angSide = 360.0 / sideAmt;

    let ang_i;
    for(let i = 0; i < sideAmt; i++) {
      ang_i = angSide * i;
      drawP3d_wall(
        x + rad * Mathf.cosDeg(ang_i),
        y + rad * Mathf.sinDeg(ang_i),
        x + rad * Mathf.cosDeg(ang_i + angSide),
        y + rad * Mathf.sinDeg(ang_i + angSide),
        z3d,
        colorIn_gn,
        colorOut_gn,
        z,
      );
    };
  };
  exports.drawP3d_cylinder = drawP3d_cylinder;


  const drawP3d_cylinderFade = function(x, y, z3d, rad, color_gn, z) {
    let colorIn = MDL_color._color(color_gn);
    let colorOut = Tmp.c3.set(colorIn);
    colorOut.a = 0.0;
    drawP3d_cylinder(x, y, z3d, rad, colorIn, colorOut, z);
  };
  exports.drawP3d_cylinderFade = drawP3d_cylinderFade;


  /* <---------- line ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * The most normal way of drawing lines, an inner bar and the outline.
   * ---------------------------------------- */
  const drawLine_normal = function(x1, y1, x2, y2, color_gn, a, isDashed, noBot, z) {
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;

    var amtSeg = Math.round(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / Vars.tilesize * 2.0);

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    if(!noBot) {
      Lines.stroke(3.0, Pal.gray);
      Draw.alpha(a);
      isDashed ? (Lines.dashLine(x1, y1, x2, y2, amtSeg)) : (Lines.line(x1, y1, x2, y2));
    };
    Lines.stroke(1.0, MDL_color._color(color_gn));
    Draw.alpha(a);
    isDashed ? (Lines.dashLine(x1, y1, x2, y2, amtSeg)) : (Lines.line(x1, y1, x2, y2));
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawLine_normal = drawLine_normal;


  /* ----------------------------------------
   * NOTE:
   *
   * The line has no outline, and it fades in and out with time.
   * ---------------------------------------- */
  const drawLine_flicker = function(x1, y1, x2, y2, stroke, scl, color_gn, isDashed, z) {
    if(stroke == null) stroke = 1.5;
    if(scl == null) scl = 1.0;
    if(color_gn == null) color_gn = Pal.accent;

    var amtSeg = Math.round(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / Vars.tilesize * 2.0);
    var scl_fi = scl * 15.0;
    var a = 0.35 + Math.sin(Time.time / scl_fi) * 0.25;

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Lines.stroke(stroke, MDL_color._color(color_gn));
    Draw.alpha(a);
    isDashed ? (Lines.dashLine(x1, y1, x2, y2, amtSeg)) : (Lines.line(x1, y1, x2, y2));
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawLine_flicker = drawLine_flicker;


  /* ----------------------------------------
   * NOTE:
   *
   * It's laser but not vanilla mining beam.
   * ---------------------------------------- */
  const drawLine_laser = function(x1, y1, x2, y2, strokeScl, color1_gn, color2_gn, a, hasLight, z) {
    if(strokeScl == null) strokeScl = 1.0;
    if(color1_gn == null) color1_gn = Pal.accent;
    if(color2_gn == null) color2_gn = Color.white;

    var scl = (1.0 + Math.sin(Time.time * 0.065) * 0.2) * strokeScl;

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Lines.stroke(3.0 * scl, MDL_color._color(color1_gn));
    Draw.alpha(a == null ? Vars.renderer.laserOpacity : a);
    Lines.line(x1, y1, x2, y2);
    Fill.circle(x1, y1, 2.4 * scl);
    Fill.circle(x2, y2, 2.4 * scl);
    Lines.stroke(1.0 * scl, MDL_color._color(color2_gn));
    Draw.alpha(a == null ? Vars.renderer.laserOpacity : a);
    Fill.circle(x1, y1, 1.2 * scl);
    Fill.circle(x2, y2, 1.2 * scl);
    Lines.line(x1, y1, x2, y2);
    Draw.reset();
    Draw.z(prevZ);
    if(hasLight) Drawf.light(x1, y1, x2, y2);
  };
  exports.drawLine_laser = drawLine_laser;


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla laser, no color change so it's always yellow.
   * ---------------------------------------- */
  const drawLine_laserV = function(x1, y1, x2, y2, strokeScl) {
    Drawf.laser(VARGEN.laserRegs.lineReg, VARGEN.laserRegs.endReg, x1, y1, x2, y2, Object.val(strokeScl, 1.0));
  };
  exports.drawLine_laserV = drawLine_laserV;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws a wire that connects two positions.
   * ---------------------------------------- */
  const drawLine_wire = function(x1, y1, x2, y2, mat, strokeScl, glowA, z) {
    if(mat == null) mat = "copper"
    if(strokeScl == null) strokeScl = 1.0;
    if(glowA == null) glowA = 1.0;

    let wireReg = VARGEN.wireRegs.regMap.get(mat);
    let wireEndReg = VARGEN.wireRegs.endRegMap.get(mat);
    if(wireReg == null || wireEndReg == null) return;

    var ang = Mathf.angle(x2 - x1, y2 - y1);
    var dx = Mathf.cosDeg(ang) * Draw.scl * 4.0 * strokeScl;
    var dy = Mathf.sinDeg(ang) * Draw.scl * 4.0 * strokeScl;

    let prevZ = Draw.z();
    Draw.z(z != null ? z : Layer.power);
    Draw.color(Color.white, 1.0);
    Draw.rect(wireEndReg, x1, y1, wireEndReg.width * wireEndReg.scl() * 0.5 * strokeScl, wireEndReg.height * wireEndReg.scl() * 0.5 * strokeScl, ang + 180.0);
    Draw.rect(wireEndReg, x2, y2, wireEndReg.width * wireEndReg.scl() * 0.5 * strokeScl, wireEndReg.height * wireEndReg.scl() * 0.5 * strokeScl, ang);
    Lines.stroke(6.0 * strokeScl);
    Lines.line(wireReg, x1 + dx, y1 + dy, x2 - dx, y2 - dy, false);
    Draw.z(Layer.block + 0.1);
    Lines.stroke(20.0 * strokeScl);
    Draw.alpha(0.3);
    Lines.line(VARGEN.wireRegs.shaReg, x1 + dx, y1 + dy, x2 - dx, y2 - dy, false);
    Draw.z((z != null ? z : Layer.power) + 0.01);
    Lines.stroke(8.0 * strokeScl);
    Draw.alpha(glowA * (0.4 + Mathf.absin(15.0, 0.6)) * 0.25);
    Draw.blend(Blending.additive);
    Lines.line(VARGEN.wireRegs.glowReg, x1 + dx, y1 + dy, x2 - dx, y2 - dy, false);
    Draw.blend();
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawLine_wire = drawLine_wire;


  /* <---------- rect ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Ordinary rectangular range indicator.
   * {2 * r + size} is the total width in blocks.
   * ---------------------------------------- */
  const drawRect_normal = function(x, y, r, size, color_gn, a, isDashed, noBot, z) {
    if(r == null) r = 0;
    if(size == null) size = 1;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;

    var hw = (size * 0.5 + r) * Vars.tilesize;
    var amtSeg = (size + r * 2) * 2;

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    if(!noBot) {
      Lines.stroke(3.0, Pal.gray);
      Draw.alpha(a);
      if(isDashed) {
        Lines.dashLine(x - hw, y - hw, x + hw, y - hw, amtSeg);
        Lines.dashLine(x + hw, y - hw, x + hw, y + hw, amtSeg);
        Lines.dashLine(x + hw, y + hw, x - hw, y + hw, amtSeg);
        Lines.dashLine(x - hw, y + hw, x - hw, y - hw, amtSeg);
      } else {
        Lines.line(x - hw, y - hw, x + hw, y - hw);
        Lines.line(x + hw, y - hw, x + hw, y + hw);
        Lines.line(x + hw, y + hw, x - hw, y + hw);
        Lines.line(x - hw, y + hw, x - hw, y - hw);
      };
    };
    Lines.stroke(1.0, MDL_color._color(color_gn));
    Draw.alpha(a);
    if(isDashed) {
      Lines.dashLine(x - hw, y - hw, x + hw, y - hw, amtSeg);
      Lines.dashLine(x + hw, y - hw, x + hw, y + hw, amtSeg);
      Lines.dashLine(x + hw, y + hw, x - hw, y + hw, amtSeg);
      Lines.dashLine(x - hw, y + hw, x - hw, y - hw, amtSeg);
    } else {
      Lines.line(x - hw, y - hw, x + hw, y - hw);
      Lines.line(x + hw, y - hw, x + hw, y + hw);
      Lines.line(x + hw, y + hw, x - hw, y + hw);
      Lines.line(x - hw, y + hw, x - hw, y - hw);
    };
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawRect_normal = drawRect_normal;


  const drawRect_normalPlace = function(blk, tx, ty, r, color_gn, isDashed) {
    drawRect_normal(tx.toFCoord(blk.size), ty.toFCoord(blk.size), r, blk.size, color_gn, 1.0, isDashed);
  };
  exports.drawRect_normalPlace = drawRect_normalPlace;


  const drawRect_normalSelect = function(b, r, color_gn, isDashed) {
    drawRect_normal(b.x, b.y, r, b.block.size, color_gn, 1.0, isDashed);
  };
  exports.drawRect_normalSelect = drawRect_normalSelect;


  const drawRect_build = function(b, color_gn, isDashed) {
    drawRect_normal(b.x, b.y, 0, b.block.size, color_gn, 1.0, isDashed);
  };
  exports.drawRect_build = drawRect_build;


  /* <---------- circle ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Classic circular range indicator.
   * {rad} and {r} are different by the way.
   * ---------------------------------------- */
  const drawCircle_normal = function(x, y, rad, color_gn, a, isDashed, noBot, z) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    if(!noBot) {
      Lines.stroke(3.0, Pal.gray);
      Draw.alpha(a);
      isDashed ? Lines.dashCircle(x, y, rad) : Lines.circle(x, y, rad);
    };
    Lines.stroke(1.0, MDL_color._color(color_gn));
    Draw.alpha(a);
    isDashed ? Lines.dashCircle(x, y, rad) : Lines.circle(x, y, rad);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawCircle_normal = drawCircle_normal;


  const drawCircle_normalPlace = function(blk, tx, ty, rad, color_gn, isDashed) {
    drawCircle_normal(tx.toFCoord(blk.size), ty.toFCoord(blk.size), rad, color_gn, 1.0, isDashed);
  };
  exports.drawCircle_normalPlace = drawCircle_normalPlace;


  const drawCircle_normalSelect = function(b, rad, color_gn, isDashed) {
    drawCircle_normal(b.x, b.y, rad, color_gn, 1.0, isDashed);
  };
  exports.drawCircle_normalSelect = drawCircle_normalSelect;


  /* <---------- area ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A filled square, what else can it be?
   * ---------------------------------------- */
  const drawArea_normal = function(x, y, size, color_gn, a, z) {
    if(size == null) size = 1;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(a * 0.7);
    Fill.rect(x, y, size * Vars.tilesize, size * Vars.tilesize);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawArea_normal = drawArea_normal;


  /* ----------------------------------------
   * NOTE:
   *
   * The square slightly shrinks in and out with time.
   * Used as tile indicator.
   * ---------------------------------------- */
  const drawArea_tShrink = function(t, size, color_gn, a, z) {
    if(size == null) size = 1;
    var off = size % 2 === 0 ? 4.0 : 0.0;
    var size_fi = (0.75 + Math.sin(Time.time * 0.065) * 0.15) * size;
    drawArea_normal(t.worldx() + off, t.worldy() + off, size_fi, color_gn, a, z);
  };
  exports.drawArea_tShrink = drawArea_tShrink;


  /* ----------------------------------------
   * NOTE:
   *
   * A filled area that covers a building.
   * ---------------------------------------- */
  const drawArea_build = function(b, pad, color_gn, a, z) {
    if(b == null) return;
    if(pad == null) pad = 0.0;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;

    var w = b.block.size * Vars.tilesize - pad * 2.0;

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(a * 0.5);
    Fill.rect(b.x, b.y, w, w);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawArea_build = drawArea_build;


  /* <---------- disk ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A disk that expands from the center and fades out.
   * ---------------------------------------- */
  const drawDisk_expand = function(x, y, rad, scl, color_gn, a, z) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;

    var frac = Time.time % (90.0 * scl) / (90.0 * scl);

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(Mathf.lerp(a, 0.0, frac));
    Fill.circle(x, y, Mathf.lerp(0.0, rad, frac));
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawDisk_expand = drawDisk_expand;


  /* ----------------------------------------
   * NOTE:
   *
   * A disk that fades in and out.
   * Usually in red to visualize explosion range.
   * ---------------------------------------- */
  const drawDisk_warning = function(x, y, rad, scl, color_gn, a, z) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(color_gn == null) color_gn = Pal.remove;
    if(a == null) a = 1.0;

    var a_fi = a * (0.15 + Math.sin(Time.time / scl / 15.0) * 0.15);

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(a_fi);
    Fill.circle(x, y, rad);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawDisk_warning = drawDisk_warning;


  /* <---------- pulse ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * The hollow squares expand and disappear.
   * ---------------------------------------- */
  const drawPulse_rect = function(x, y, rad, scl, color_gn, a, z) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;

    var stroke_f = rad * 0.25;
    var stroke_t = 0.2;

    var frac1 = 1.0 - (Time.time / scl / 150.0) % 1.0;
    var frac2 = (frac1 + 0.5) % 1.0;
    let rads = [
      Math.min(1.0 + Math.pow(1.0 - frac1, 0.5) * rad, rad),
      Math.min(1.0 + Math.pow(1.0 - frac2, 0.5) * rad, rad),
    ];

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(a * 0.7);
    let rad_i;
    for(let i = 0; i < 2; i++) {
      rad_i = rads[i];
      Lines.stroke(Mathf.lerp(stroke_f, stroke_t, rad_i / rad));
      Lines.line(x - rad_i, y - rad_i, x + rad_i, y - rad_i);
      Lines.line(x + rad_i, y - rad_i, x + rad_i, y + rad_i);
      Lines.line(x + rad_i, y + rad_i, x - rad_i, y + rad_i);
      Lines.line(x - rad_i, y + rad_i, x - rad_i, y - rad_i);
    };
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawPulse_rect = drawPulse_rect;


  /* ----------------------------------------
   * NOTE:
   *
   * Now they are rings.
   * Used for impact range indication.
   * ---------------------------------------- */
  const drawPulse_circle = function(x, y, rad, scl, color_gn, a, z) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;

    var scl_fi = scl * 150.0;
    var a_fi = a * 0.3;
    var stroke_f = rad * 0.1;
    var stroke_t = 0.2;

    var frac1 = 1.0 - (Time.time / scl_fi) % 1.0;
    var frac2 = (frac1 + 0.25) % 1.0;
    var frac3 = (frac2 + 0.25) % 1.0;
    var frac4 = (frac3 + 0.25) % 1.0;
    let rads = [
      Math.min(1.0 + (1.0 - frac1) * rad, rad),
      Math.min(1.0 + (1.0 - frac2) * rad, rad),
      Math.min(1.0 + (1.0 - frac3) * rad, rad),
      Math.min(1.0 + (1.0 - frac4) * rad, rad),
    ];

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(a_fi);
    let rad_i;
    for(let i = 0; i < 4; i++) {
      rad_i = rads[i];
      Lines.stroke(Mathf.lerp(stroke_f, stroke_t, rad_i / rad));
      Lines.circle(x, y, rad_i);
    };
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawPulse_circle = drawPulse_circle;


  /* <---------- connector ----------> */


  const drawConnector_rect = function(b, ob) {
    if(b == null || ob == null) return;

    drawRect_build(b);
    drawRect_build(ob);
    drawLine_normal(b.x, b.y, ob.x, ob.y);
  };
  exports.drawConnector_rect = drawConnector_rect;


  const drawConnector_area = function(b, ob) {
    if(b == null || ob == null) return;

    drawArea_build(b);
    drawArea_build(ob);
    drawLine_flicker(b.x, b.y, ob.x, ob.y);
  };
  exports.drawConnector_area = drawConnector_area;


  /* ----------------------------------------
   * NOTE:
   *
   * Mass driver indicators.
   * ---------------------------------------- */
  const drawConnector_circleArrow = function(b, b_f, b_t, bs_f, bs_t) {
    if(b == null) return;

    var param = Mathf.absin(Time.time, 6.0, 1.0);
    var param1 = b.block.size === 1 ? 1.0 : b.block.size * 0.5 + 1.0;
    Drawf.circles(b.x, b.y, param1 * Vars.tilesize + param - 2.0, Pal.accent);

    if(b_f != null) {
      Drawf.circles(b_f.x, b_f.y, param1 * Vars.tilesize + param - 2.0, Pal.place);
      Drawf.arrow(b_f.x, b_f.y, b.x, b.y, b.block.size * Vars.tilesize + param, param + 4.0, Pal.place);
    };

    if(bs_f != null) {
      bs_f.forEach(ob => {
        Drawf.circles(ob.x, ob.y, param1 * Vars.tilesize + param - 2.0, Pal.place);
        Drawf.arrow(ob.x, ob.y, b.x, b.y, b.block.size * Vars.tilesize + param, param + 4.0, Pal.place);
      });
    };

    if(b_t != null) {
      let param2 = b_t.block.size === 1 ? 1.0 : b_t.block.size * 0.5 + 1.0;

      Drawf.circles(b_t.x, b_t.y, param2 * Vars.tilesize + param - 2.0, Pal.place);
      Drawf.arrow(b.x, b.y, b_t.x, b_t.y, b.block.size * Vars.tilesize + param, param + 4.0, Pal.accent);
    };

    if(bs_t != null) {
      bs_t.forEach(ob => {
        let param2 = ob.block.size === 1 ? 1.0 : ob.block.size * 0.5 + 1.0;

        Drawf.circles(ob.x, ob.y, param2 * Vars.tilesize + param - 2.0, Pal.place);
        Drawf.arrow(b.x, b.y, ob.x, ob.y, b.block.size * Vars.tilesize + param, param + 4.0, Pal.accent);
      });
    };
  };
  exports.drawConnector_circleArrow = drawConnector_circleArrow;


  /* <---------- progress ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A regular progress bar.
   * ---------------------------------------- */
  const drawProgress_bar = function(x, y, frac, size, color_gn, a, offW, offTy, z) {
    if(frac == null) return;
    if(size == null) size = 1;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;
    if(a < 0.0001) return;
    if(offW == null) offW = 0.0;
    if(offTy == null) offTy = 0;

    var w = (size + 1) * Vars.tilesize + offW;
    var offY = (offTy + size * 0.5 + 0.5) * Vars.tilesize;

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Lines.stroke(5.0, Pal.gray);
    Draw.alpha(a * 0.7);
    Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    Lines.stroke(3.0, MDL_color._color(color_gn));
    Draw.alpha(a * 0.2);
    Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    Draw.alpha(a * 0.7);
    Lines.line(x - w * 0.5, y + offY, Mathf.lerp(x - w * 0.5, x + w * 0.5, Mathf.clamp(frac)), y + offY);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawProgress_bar = drawProgress_bar;


  /* ----------------------------------------
   * NOTE:
   *
   * Progress ring.
   * ----------------------------------------
   * DEDICATION:
   *
   * Inspired by New Horizon.
   * ---------------------------------------- */
  const drawProgress_circle = function(x, y, frac, rad, ang, color_gn, a, noBot, rev, stroke_ow, z) {
    if(frac == null) return;
    if(rad == null) rad = 24.0;
    if(ang == null) ang = 0.0;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;
    if(a < 0.0001) return;

    let color = MDL_color._color(color_gn);

    var sideAmt = Lines.circleVertices(rad) * (noBot ? 2 : 1);
    var angSide = 360.0 / sideAmt * (rev ? -1.0 : 1.0);
    var iCap = Math.round(sideAmt * Mathf.clamp(frac));
    var stroke = Object.val(stroke_ow, 5.0);
    var radIn = rad - stroke * 0.5 * (noBot ? 1.0 : 0.6);
    var radOut = rad + stroke * 0.5 * (noBot ? 1.0 : 0.6);

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    if(!noBot) {
      Lines.stroke(stroke, Pal.gray);
      Draw.alpha(a * 0.7);
      Lines.circle(x, y, rad);
      Lines.stroke(stroke * 0.6, color);
      Draw.alpha(a * 0.2);
      Lines.circle(x, y, rad);
    };
    Draw.color(color);
    Draw.alpha(noBot ? 1.0 : 0.7);

    let ang_i;
    for(let i = 0; i < iCap; i++) {
      ang_i = angSide * i + ang;
      Fill.quad(
        x + radIn * Mathf.cosDeg(ang_i),
        y + radIn * Mathf.sinDeg(ang_i),
        x + radIn * Mathf.cosDeg(ang_i + angSide),
        y + radIn * Mathf.sinDeg(ang_i + angSide),
        x + radOut * Mathf.cosDeg(ang_i + angSide),
        y + radOut * Mathf.sinDeg(ang_i + angSide),
        x + radOut * Mathf.cosDeg(ang_i),
        y + radOut * Mathf.sinDeg(ang_i),
      );
    };
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawProgress_circle = drawProgress_circle;


  /* ----------------------------------------
   * NOTE:
   *
   * A filled area, the height grows as {frac} increases.
   * ---------------------------------------- */
  const drawProgress_vArea = function(x, y, frac, size, color_gn, a, offX, offY, wScl, hScl, z) {
    if(frac == null) return;
    if(size == null) size = 1;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;
    if(a < 0.0001) return;
    if(offX == null) offX = 0.0;
    if(offY == null) offY = 0.0;
    if(wScl == null) wScl = 1.0;
    if(hScl == null) hScl = 1.0;

    var frac_fi = Mathf.clamp(frac);
    if(frac_fi > 0.9999) return;

    var w = size * Vars.tilesize * wScl;
    var h = size * Vars.tilesize * hScl * frac_fi;
    var y_fi = y + offY + Mathf.lerp(w * -0.5, 0.0, frac_fi);

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw));
    Draw.color(MDL_color._color(color_gn));
    Draw.alpha(a * 0.3);
    Fill.rect(x + offX, y_fi, w, h);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawProgress_vArea = drawProgress_vArea;


  const drawProgress_vAreaMul = function(x, y, fracs, size, color_gn, a, z) {
    if(fracs == null) return;
    let iCap = fracs.iCap();
    if(iCap === 0) return;
    var segW = size * Vars.tilesize / iCap;
    var wScl = 1.0 / iCap;

    for(let i = 0; i < iCap; i++) {
      let frac_i = fracs[i];
      let offX_i = segW * (i - 0.5 * (iCap - 1.0));
      drawProgress_vArea(x, y, frac_i, size, color_gn, a, offX_i, 0.0, wScl, 1.0, z);
    };
  };
  exports.drawProgress_vAreaMul = drawProgress_vAreaMul;


  /* <---------- text ----------> */


  const drawText = function(x, y, str, sizeScl, color_gn, align, offX, offY, offZ) {
    if(str == null || str === "") return;
    if(sizeScl == null) sizeScl = 1.0;
    if(color_gn == null) color_gn = Color.white;
    if(align == null) align = Align.center;
    if(offX == null) offX = 0.0;
    if(offY == null) offY = 0.0;
    if(offZ == null) offZ = 0.0;

    let z = Drawf.text();
    let font = Fonts.outline;
    let layout = Pools.obtain(GlyphLayout, () => new GlyphLayout());
    let useInt = font.usesIntegerPositions();

    Draw.z(Layer.playerName + 0.5 + offZ);
    font.setUseIntegerPositions(false);
    font.getData().setScale(0.25 / Scl.scl(1.0) * sizeScl);
    layout.setText(font, str);
    font.setColor(MDL_color._color(color_gn));
    font.draw(str, x + offX, y + offY, 0, align, false);

    Draw.reset();
    Pools.free(layout);
    font.getData().setScale(1.0);
    font.setColor(Color.white);
    font.setUseIntegerPositions(useInt);

    Draw.z(z);
  };
  exports.drawText = drawText;


  const drawText_place = function(blk, tx, ty, str, valid, offTy) {
    if(blk == null || str == null) return;
    if(valid == null) valid = true;
    if(offTy == null) offTy = 0;

    blk.drawPlaceText(str, tx + blk.offset / Vars.tilesize, ty + blk.offset / Vars.tilesize + offTy, valid);
  };
  exports.drawText_place = drawText_place;


  const drawText_select = function(b, str, valid, offTy) {
    if(b == null || str == null) return;
    if(valid == null) valid = true;
    if(offTy == null) offTy = 0;

    b.block.drawPlaceText(str, b.x / Vars.tilesize, b.y / Vars.tilesize + offTy, valid);
  };
  exports.drawText_select = drawText_select;


  /* <---------- unit ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used to draw unit health bar and more.
   * Will draw nothing if the unit is hidden by trees.
   * Also used for buildings.
   * ---------------------------------------- */
  const drawUnit_healthBar = function(e, healthFrac, size, color_gn, a, offW, offTy, segScl, armor, shield, speedMtp, dpsMtp, z) {
    if(e == null || healthFrac == null) return;
    if(e.dead || (e instanceof Unit && MDL_cond._isCovered(e))) return;
    if(size == null) size = 1;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;
    if(a < 0.0001) return;
    if(offW == null) offW = 0.0;
    if(offTy == null) offTy = 0;
    if(segScl == null) segScl = 1.0;

    var frac = Mathf.clamp(healthFrac);
    let color_fi = Tmp.c1.set(MDL_color._color(color_gn)).lerp(Color.white, MDL_entity._flashFrac(e));
    var x = e.x;
    var y = e.y;
    var a_fi = a * 0.7;
    var w = (size + 1) * Vars.tilesize + offW;
    var offY = (offTy + size * 0.5 + 1.5) * Vars.tilesize;
    let amtSeg = Math.ceil(w / 4.0 / segScl);

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw + 1.0));
    if(PARAM.drawMinimalisticStat) {
      Lines.stroke(5.0, Pal.gray);
      Draw.alpha(a_fi);
      Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    } else {
      Lines.stroke(10.0, Pal.gray);
      Draw.alpha(a_fi);
      Lines.line(x - w * 0.5 + 2.5, y + offY + 2.5, x + w * 0.5 - 2.5, y + offY + 2.5);
    };
    Lines.stroke(3.0, color_fi);
    Draw.alpha(a_fi * 0.3);
    Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    Draw.alpha(a_fi);
    Lines.line(x - w * 0.5, y + offY, Mathf.lerp(x - w * 0.5, x + w * 0.5, frac), y + offY);

    Lines.stroke(1.0, Pal.gray);
    Draw.alpha(a_fi);
    var segW = (w + 5.0) / (amtSeg + 1);
    var x_i;
    var y1_i;
    var y2_i;
    for(let i = 0; i < amtSeg; i++) {
      x_i = x - w * 0.5 - 2.5 + segW * (i + 1);
      y1_i = y + offY + 2.0;
      y2_i = y + offY - 2.0;

      Lines.line(x_i, y1_i, x_i, y2_i);
    };

    if(armor != null) drawText(
      e.x,
      e.y,
      Strings.autoFixed(armor, 0),
      1.2,
      Color.gray,
      Align.right,
      -w * 0.5 - 4.0,
      offY + (PARAM.drawMinimalisticStat ? 2.0 : 4.0),
    );

    if(shield != null && shield > 0.0) drawText(
      e.x,
      e.y,
      Strings.autoFixed(shield, 0),
      1.2,
      Pal.techBlue,
      Align.left,
      w * 0.5 + 4.0,
      offY + (PARAM.drawMinimalisticStat ? 2.0 : 4.0),
    );

    if(!PARAM.drawMinimalisticStat) {
      drawText(
        e.x,
        e.y,
        Strings.autoFixed(e.maxHealth, 0),
        0.8,
        color_fi,
        Align.center,
        0.0,
        offY + 6.0,
      );

      if(speedMtp != null && size > 2.9999) drawText(
        e.x,
        e.y,
        "S: " + Strings.fixed(speedMtp, 2),
        0.6,
        Color.gray,
        Align.left,
        -w * 0.5 - 2.5,
        offY + 5.0,
      );

      if(dpsMtp != null && size > 2.9999) drawText(
        e.x,
        e.y,
        "D: " + Strings.fixed(dpsMtp, 2),
        0.6,
        Color.gray,
        Align.right,
        w * 0.5 + 2.5,
        offY + 5.0,
      );
    };

    if(e instanceof Unit) {
      let stackSta = MDL_entity._stackStaFirst(e);
      if(stackSta != null) {
        let y_sta = y - e.type.hitSize * 0.5 - 8.0;
        let stackStaFrac = Mathf.clamp(1.0 - (e == null ? 0.0 : e.getDuration(stackSta)) / stackSta.ex_getBurstTime());

        drawProgress_circle(x, y_sta, stackStaFrac, 2.75, 90.0, Color.white, 1.0, false, true, 2.25);
        Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw + 1.01));
        Draw.rect(stackSta.uiIcon, x, y_sta, 4.0, 4.0);
      };
    };

    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawUnit_healthBar = drawUnit_healthBar;


  const drawUnit_reload = function(e, mtIds, color_gn, a, offW, offTy, frac_ow, z) {
    if(e == null) return;
    if(e.dead || (e instanceof Unit && MDL_cond._isCovered(e))) return;
    if(color_gn == null) color_gn = Pal.techBlue;
    if(a == null) a = 1.0;
    if(a < 0.0001) return;
    if(offW == null) offW = 0.0;
    if(offTy == null) offTy = 0.0;

    var frac = 0.0;
    if(frac_ow != null) {frac = frac_ow} else {
      if(mtIds == null) return;

      frac = MDL_entity._reloadFrac(e, mtIds);
    };
    if(frac > 0.9999 || frac < 0.0001) return;

    var x = e.x;
    var y = e.y;
    var hitSize = MDL_entity._hitSize(e);
    var w = (hitSize + 8.0 + offW) * 1.7;
    var offY = hitSize * 0.5 + 4.0 + (offTy + 1.25) * Vars.tilesize;

    let prevZ = Draw.z();
    Draw.z(z != null ? z : (Layer.effect + VAR.lay_offDraw + 1.0));
    Lines.stroke(5.0, Pal.gray);
    Draw.alpha(a * 0.5);
    Lines.line(x - w * 0.5, y - offY, x + w * 0.5, y - offY);
    Lines.stroke(3.0, MDL_color._color(color_gn));
    Draw.alpha(a * 0.25);
    Lines.line(x - w * 0.5, y - offY, x + w * 0.5, y - offY);
    Draw.alpha(a * 0.5);
    Lines.line(x - w * 0.5, y - offY, Mathf.lerp(x - w * 0.5, x + w * 0.5, frac), y - offY);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawUnit_reload = drawUnit_reload;


  /* <---------- status effect ----------> */


  const drawStatus_fade = function(e, reg, color_gn) {
    if(e == null || reg == null) return;
    if(color_gn == null) color_gn = Color.white;

    var regScl = MDL_entity._hitSize(e) * 0.1;

    drawRegion_fade(e.x, e.y, reg, 0.0, regScl, 0.5, color_gn, 0.5, Layer.effect + VAR.lay_offDrawOver);
  };
  exports.drawStatus_fade = drawStatus_fade;


  /* <---------- debug ----------> */


  const drawDebug_cross = function(x, y, ang, color) {
    if(ang == null) ang = 0.0;
    if(color == null) color = Color.white;

    var x1 = x - 3.0 * Mathf.cosDeg(ang - 45.0);
    var y1 = y - 3.0 * Mathf.sinDeg(ang - 45.0);
    var x2 = x + 3.0 * Mathf.cosDeg(ang - 45.0);
    var y2 = y + 3.0 * Mathf.sinDeg(ang - 45.0);
    var y3 = y - 3.0 * Mathf.sinDeg(ang + 45.0);
    var x3 = x - 3.0 * Mathf.cosDeg(ang + 45.0);
    var x4 = x + 3.0 * Mathf.cosDeg(ang + 45.0);
    var y4 = y + 3.0 * Mathf.sinDeg(ang + 45.0);

    let prevZ = Draw.z();
    Draw.z(VAR.lay_debugTop);
    Lines.stroke(1.0);
    Draw.color(color);
    Lines.line(x1, y1, x2, y2);
    Lines.line(x3, y3, x4, y4);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawDebug_cross = drawDebug_cross;


  const drawDebug_tri = function(x, y, ang, color) {
    if(ang == null) ang = 0.0;
    if(color == null) color = Color.white;

    var x1 = x + 3.0 * Mathf.cosDeg(ang + 90.0);
    var y1 = y + 3.0 * Mathf.sinDeg(ang + 90.0);
    var x2 = x + 3.0 * Mathf.cosDeg(ang + 210.0);
    var y2 = y + 3.0 * Mathf.sinDeg(ang + 210.0);
    var x3 = x + 3.0 * Mathf.cosDeg(ang + 330.0);
    var y3 = y + 3.0 * Mathf.sinDeg(ang + 330.0);

    let prevZ = Draw.z();
    Draw.z(VAR.lay_debugTop);
    Lines.stroke(0.7);
    Draw.color(color);
    Lines.line(x1, y1, x2, y2);
    Lines.line(x2, y2, x3, y3);
    Lines.line(x3, y3, x1, y1);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawDebug_tri = drawDebug_tri;


  const drawDebug_hitSize = function(e) {
    if(e == null) return;

    var rad = MDL_entity._hitSize(e) * 0.5;
    var x1 = e.x + rad * Mathf.cosDeg(e.rotation);
    var y1 = e.y + rad * Mathf.sinDeg(e.rotation);
    var offRad = 0.01 + e.vel.len() * 24.0;
    var x2 = e.x + (rad + offRad) * Mathf.cosDeg(e.rotation);
    var y2 = e.y + (rad + offRad) * Mathf.sinDeg(e.rotation);

    let prevZ = Draw.z();
    Draw.z(VAR.lay_debugTop);
    Lines.stroke(1.0);
    Draw.color(Pal.place);
    Lines.circle(e.x, e.y, rad);
    Draw.color(Pal.accent);
    Lines.line(x1, y1, x2, y2);
    Draw.reset();
    Draw.z(prevZ);
  };
  exports.drawDebug_hitSize = drawDebug_hitSize;


  const drawDebug_target = function(unit) {
    if(unit == null) return;

    let e_tg = MDL_pos._e_tg(unit.x, unit.y, unit.team, unit.range());
    if(e_tg == null) return;

    let prevZ = Draw.z();
    Draw.z(VAR.lay_debugTop);
    Lines.stroke(0.5);
    Draw.color(Color.scarlet);
    Lines.line(unit.x, unit.y, e_tg.x, e_tg.y);
    Draw.reset();
    Draw.z(prevZ);
    drawDebug_cross(e_tg.x, e_tg.y, 0.0, Color.scarlet);
  };
  exports.drawDebug_target = drawDebug_target;


  const drawDebug_aim = function(bul) {
    if(bul == null) return;
    if(bul.aimX < 0.0 || bul.aimY < 0.0) return;

    let prevZ = Draw.z();
    Draw.z(VAR.lay_debugTop);
    Lines.stroke(0.5);
    Draw.color(Pal.heal);
    Lines.line(bul.x, bul.y, bul.aimX, bul.aimY);
    Draw.reset();
    Draw.z(prevZ);
    drawDebug_tri(bul.aimX, bul.aimY, 0.0, Pal.heal);
  };
  exports.drawDebug_aim = drawDebug_aim;
