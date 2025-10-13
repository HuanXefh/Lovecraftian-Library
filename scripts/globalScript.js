/* ----------------------------------------
 * NOTE:
 *
 * globalScript.js is run BEFORE Lovec is loaded, and NOT in STRICT MODE. Don't explicitly {require} anything!
 * This is mostly intended for console and some generic methods.
 * Beware of naming conflict!
 * ---------------------------------------- */


/* <---------- pre-load ----------> */


/* ----------------------------------------
 * NOTE:
 *
 * Methods defined here can be used anywhere, like {extend} and {prov}.
 * You can define more global methods likewise in your own globalScript.js.
 * Better use a prefix for compatibility.
 *
 * If you need temporary variables here, don't define them directly with something like {let a = 0.0}.
 * Any variables defined here are in the global scope, and will make its way to the console.
 * You should use {(function() {...})()} and define them inside of the function.
 * ----------------------------------------
 * IMPORTANT:
 *
 * Methods below should only be called after {RUN_methodExt} is called!
 * Well seems that I'm the only one possible to break it...
 * ---------------------------------------- */


/* ----------------------------------------
 * NOTE:
 *
 * Variant of {print} used for printing multiple arguments.
 *
 * These will print {1, 2, 1, 2}:
 * printAll(1, 2, 1, 2)
 * printAll([1, 2, 1, 2])
 * printAll(1, [2], [1, 2])
 * ---------------------------------------- */
printAll = function() {
  print(Array.from(arguments).flatten());
};


/* ----------------------------------------
 * NOTE:
 *
 * Variant of {print} that prints all possible keys of the object.
 * ---------------------------------------- */
printKeys = function(obj) {
  Object.printKeys(obj);
};


/* ----------------------------------------
 * NOTE:
 *
 * Converts an array into Json string for packets.
 * The array should only contain primitive values.
 * ---------------------------------------- */
packPayload = function(arr) {
  return JSON.stringify(Object.arrToObj(arr));
};


/* ----------------------------------------
 * NOTE:
 *
 * Converts a Json string back into an array of primitive values.
 * ---------------------------------------- */
unpackPayload = function(payload) {
  return Object.objToArr(JSON.parse(payload));
};


/* <---------- client load ----------> */


/* ----------------------------------------
 * NOTE:
 *
 * Methods defined here are only intended for console.
 * DO NOT use these in regular coding!
 * ---------------------------------------- */


Events.run(ClientLoadEvent, () => Core.app.post(() => {


  /* base */


  lovec = global.lovec;


  /* debug */


  /* ----------------------------------------
   * NOTE:
   *
   * Prints liquid info for building at (tx, ty).
   * ---------------------------------------- */
  printLiq = function(tx, ty) {
    lovec.mdl_test._i_liq(tx, ty);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to test some draw function in game quickly.
   * ---------------------------------------- */
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


  /* cheat */


  /* ----------------------------------------
   * NOTE:
   *
   * I won't ban these for single player, you decide how to play.
   * ---------------------------------------- */


  /* ----------------------------------------
   * NOTE:
   *
   * Kills your unit or someone's instead.
   * ---------------------------------------- */
  kill = function(nm) {
    if(Vars.net.client()) return;
    let unit = lovec.mdl_pos._unit_plNm(nm);
    if(unit == null) return;

    Call.unitDestroy(unit.id);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Literally toggles invincibility.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Changes your team.
   * ---------------------------------------- */
  changeTeam = function(nmTeam) {
    if(Vars.net.client()) return;
    // Just in case
    if(nmTeam instanceof Team) {
      Vars.player.team(nmTeam);
      return;
    };

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


  /* ----------------------------------------
   * NOTE:
   *
   * Spawns some unit at your unit.
   * Internal units are banned, which may lead to crash.
   * ---------------------------------------- */
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


}));
