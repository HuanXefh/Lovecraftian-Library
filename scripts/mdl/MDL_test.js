/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  const _i_invalidArgs = function() {
    Log.info("[LOVEC] " + "Invalid arguments!".color(Pal.remove));
  };
  exports._i_invalidArgs = _i_invalidArgs;


  const _i_notInGame = function() {
    Log.info("[LOVEC] " + "Method unavailable outside of game.".color(Pal.remove));
  };
  exports._i_notInGame = _i_notInGame;


  const _i_noBuild = function(tx, ty) {
    Log.info("[LOVEC] " + ("There's no building at (" + tx + ", " + ty + ").").color(Pal.remove));
  };
  exports._i_noBuild = _i_noBuild;


  /* <---------- content ----------> */


  const _w_forceModded = function() {
    Log.warn("[LOVEC] Lovec has been forced to " + "MODDED".color(Pal.remove) + " mode, but there's no mod that requires Lovec to run.");
  };
  exports._w_forceModded = _w_forceModded;


  const _w_ctNotFound = function(nmCt) {
    Log.warn("[LOVEC] Content not found for " + nmCt);
  };
  exports._w_ctNotFound = _w_ctNotFound;


  const _w_costySearch = function(nmCt) {
    Log.warn("[LOVEC] Costy search for " + nmCt + ", better add a mode argument!");
  };
  exports._w_costySearch = _w_costySearch;


  /* <---------- print ----------> */


  const _i_liq = function(tx, ty) {
    if(!Vars.state.isGame()) {
      _i_notInGame();
      return;
    };

    var b = Vars.world.build(tx, ty);
    if(b == null) {
      _i_noBuild(tx, ty);
      return;
    };

    if(b.liquids == null) {
      Log.info("[LOVEC] " + b.block.localizedName.color(b.team.color) + " at (" + tx + ", " + ty + ") does not have liquid module.");
    } else {
      let cap = b.block.liquidCapacity;
      let str = "[LOVEC] liquid info for " + b.block.localizedName.color(b.team.color) + " at (" + tx + ", " + ty + ")"
        + "\n- Liquid capacity: " + Strings.fixed(cap, 2);
      if(b.liquids.currentAmount() > 0.0001) {
        str += "\n- Current liquid: " + b.liquids.current().localizedName
          + "\n- Liquids: ";
        b.liquids.each(liq => {
          let amt = b.liquids.get(liq);
          str += "\n  > " + liq.localizedName + ": " + Strings.fixed(amt, 4) + " (" + (amt / cap).perc() + ")";
        });
      };

      Log.info(str);
    };
  };
  exports._i_liq = _i_liq;
