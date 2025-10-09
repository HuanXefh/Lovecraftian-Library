/* ----------------------------------------
 * NOTE:
 *
 * globalScript.js is run after client load, and NOT in STRICT MODE.
 * This is mostly intended for console, do not use this in regular coding!
 * Beware of naming conflict!
 * ---------------------------------------- */


/* <---------- base ----------> */


lovec = global.lovec;


/* <---------- debug ----------> */


printKeys = function(obj) {
  Object.printKeys(obj);
};


printLiq = function(tx, ty) {
  lovec.mdl_test._i_liq(tx, ty);
};


drawTest = {
  enabled: false, safe: false,
  xGetter: Function.airZero, yGetter: Function.airZero, radGetter: Function.airZero, colorGetter: Function.airWhite,
  drawF: Function.air,
  reset() {
    drawTest.enabled = false;
    drawTest.safe = false;
    drawTest.xGetter = Function.airZero;
    drawTest.yGetter = Function.airZero;
    drawTest.radGetter = Function.airZero;
    drawTest.colorGetter = Function.airWhite;
    drawTest.drawF = Function.air;
  },
  toggle(bool) {
    if(bool == null) {
      drawTest.enabled = !drawTest.enabled;
    } else {
      drawTest.enabled = Boolean(bool);
    };
  },
  setGetter(xGetter, yGetter, radGetter, colorGetter) {
    drawTest.safe = false;
    if(xGetter != null && typeof xGetter === "function") drawTest.xGetter = xGetter;
    if(yGetter != null && typeof yGetter === "function") drawTest.yGetter = yGetter;
    if(radGetter != null && typeof radGetter === "function") drawTest.radGetter = radGetter;
    if(colorGetter != null && typeof colorGetter === "function") drawTest.colorGetter = colorGetter;
  },
  setGetter_playerPos(radGetter, colorGetter) {
    drawTest.setGetter(
      () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().x,
      () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().y,
      radGetter,
      colorGetter,
    );
  },
  setDrawF(drawF) {
    if(drawF == null || typeof drawF !== "function") return;
    drawTest.safe = false;
    drawTest.drawF = drawF;
  },
  draw() {
    if(drawTest.safe) {
      drawTest.drawF(drawTest.xGetter(), drawTest.yGetter(), drawTest.radGetter(), drawTest.colorGetter());
    } else {
      try {
        drawTest.drawF(drawTest.xGetter(), drawTest.yGetter(), drawTest.radGetter(), drawTest.colorGetter());
      } catch(err) {
        drawTest.reset();
        Log.err("[LOVEC] Failed to implement the draw function: \n" + err);
        return;
      };
      drawTest.safe = true;
    };
  },
};


/* <---------- cheat ----------> */


/* ----------------------------------------
 * NOTE:
 *
 * I won't ban these for single player, you decide how to play.
 * ---------------------------------------- */


kill = function(nm) {
  if(Vars.net.client()) return;
  let unit = lovec.mdl_pos._unit_plNm(nm);
  if(unit == null) return;

  Call.unitDestroy(unit.id);
};


toggleInvincible = function() {
  if(Vars.net.client()) return;
  let unit = Vars.player.unit();
  if(unit == null) return;

  unit.hasEffect(StatusEffects.invincible) ?
    unit.unapply(StatusEffects.invincible) :
    unit.apply(StatusEffects.invincible, Number.fMax);
  Time.run(2.0, () => {
    Log.info("[LOVEC] Player invincibility: " + (unit.hasEffect(StatusEffects.invincible) ? "ON" : "OFF").color(Pal.accent));
  });
};


changeTeam = function(nmTeam) {
  if(Vars.net.client()) return;

  let team;
  switch(nmTeam) {
    case "yellow" :
      team = Team.sharded;
      break;
    case "red" :
      team = Team.crux;
      break;
    case "purple" :
      team = Team.malis;
      break;
    default :
      try {
        team = Team[nmTeam]
      } catch(err) {
        team = null;
      };
  };
  if(team == null) return;

  Vars.player.team(team);
};


spawnUnit = function(nmUtp) {
  if(Vars.net.client()) return;
  if(typeof nmUtp !== "string" || nmUtp.equalsAny(spawnUnit.blacklist)) return;
  let unit = Vars.player.unit();
  if(unit == null) return;
  let utp = lovec.mdl_content._ct(nmUtp, "utp");
  if(utp == null || utp.internal) return;

  lovec.mdl_call.spawnUnit(unit.x, unit.y, utp, unit.team);
}
.setProp({
  "blacklist": [],
});
