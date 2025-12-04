/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  const _w_invalidArgs = function() {
    Log.warn("[LOVEC] " + "Invalid arguments!".color(Pal.remove));
  };
  exports._w_invalidArgs = _w_invalidArgs;


  const _w_notInGame = function() {
    Log.warn("[LOVEC] " + "Method unavailable outside of game.".color(Pal.remove));
  };
  exports._w_notInGame = _w_notInGame;


  const _w_noBuild = function(tx, ty) {
    Log.warn("[LOVEC] " + ("There's no building at ([$1], [$2]).").format(tx, ty).color(Pal.remove));
  };
  exports._w_noBuild = _w_noBuild;


  /* <---------- content ----------> */


  const _w_forceModded = function() {
    Log.warn("[LOVEC] Lovec has been forced to " + "MODDED".color(Pal.remove) + " mode, but there's no mod that requires Lovec to run.");
  };
  exports._w_forceModded = _w_forceModded;


  const _w_ctNotFound = function(nmCt) {
    Log.warn("[LOVEC] Content not found for [$1].".format(nmCt.color(Pal.accent)));
  };
  exports._w_ctNotFound = _w_ctNotFound;


  const _w_costySearch = function(nmCt) {
    Log.warn("[LOVEC] Costy search for [$1], better add a mode argument!".format(nmCt.color(Pal.accent)));
  };
  exports._w_costySearch = _w_costySearch;


  const _w_noCusSha = function(ct) {
    Log.warn("[LOVEC] No [$1] region found for [$2]!".format("-shadow".color(Pal.remove), ct.name.color(Pal.accent)));
  };
  exports._w_noCusSha = _w_noCusSha;


  /* <---------- print ----------> */


  const _i_liq = function(tx, ty) {
    if(!Vars.state.isGame()) {
      _w_notInGame();
      return;
    };

    let b = Vars.world.build(tx, ty);
    if(b == null) {
      _w_noBuild(tx, ty);
      return;
    };

    if(b.liquids == null) {
      Log.info("[LOVEC] " + b.block.localizedName.color(b.team.color) + " at (" + tx + ", " + ty + ") does not have liquid module.");
    } else {
      let cap = b.block.liquidCapacity;
      let str = String.multiline(
        "[LOVEC] Liquid info for [$1] at ([$2], [$3]):".format(b.block.localizedName.plain().color(b.team.color), tx, ty),
        "- Liquid capacity: " + Strings.fixed(cap, 2),
        (function() {
          if(b.liquids.currentAmount() < 0.0001) return null;
          let amt, arr = ["- Current liquid: " + b.liquids.current().localizedName, "- Liquids:"];
          b.liquids.each(liq => {
            amt = b.liquids.get(liq);
            arr.push("  > [$1]: [$2] ([$3])".format(liq.localizedName, Strings.fixed(amt, 4), (amt / cap).perc()));
          });
          return arr;
        })(),
      );

      Log.info(str);
    };
  };
  exports._i_liq = _i_liq;
