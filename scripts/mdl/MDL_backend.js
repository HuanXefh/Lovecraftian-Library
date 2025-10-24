/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets/sets clipboard text.
   * ---------------------------------------- */
  const accClipboard = function(param) {
    if(param === "read") {
      return Core.app.getClipboardText();
    } else {
      let str = String(param);
      Core.app.setClipboardText(str);

      return str;
    };
  };
  exports.accClipboard = accClipboard;


  /* <---------- window ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Minimizes a window.
   * ---------------------------------------- */
  const _w_min = function(winLong) {
    SDL.SDL_MinimizeWindow(tryVal(winLong, Core.app.window));
  }
  .setAnno(ANNO.__NONMOBILE__);
  exports._w_min = _w_min;


  /* ----------------------------------------
   * NOTE:
   *
   * Maximizes a window.
   * ---------------------------------------- */
  const _w_max = function(winLong) {
    SDL.SDL_MaximizeWindow(tryVal(winLong, Core.app.window));
  }
  .setAnno(ANNO.__NONMOBILE__);
  exports._w_max = _w_max;


  /* ----------------------------------------
   * NOTE:
   *
   * Restores a window.
   * ---------------------------------------- */
  const _w_restor = function(winLong) {
    SDL.SDL_RestoreWindow(tryVal(winLong, Core.app.window));
  }
  .setAnno(ANNO.__NONMOBILE__);
  exports._w_restor = _w_restor;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets the title of a window.
   * ---------------------------------------- */
  const setWinTitle = function(winLong, str) {
    SDL.SDL_SetWindowTitle(tryVal(winLong, Core.app.window), tryVal(str, "Mindustry"));
  }
  .setAnno(ANNO.__NONMOBILE__);
  exports.setWinTitle = setWinTitle;


  /* ----------------------------------------
   * NOTE:
   *
   * Simply creates a message window.
   * ---------------------------------------- */
  const showMessage = function(mode, title, str) {
    const thisFun = showMessage;

    if(mode != null) mode = "info";
    if(!mode.equalsAny(thisFun.modes)) return;

    SDL.SDL_ShowSimpleMessageBox(
      mode === "info" ?
        0x00000040 :
        mode === "warn" ?
          0x00000020 :
          0x00000010,
      tryVal(title, ""),
      tryVal(str, ""),
    );
  }
  .setAnno(ANNO.__NONMOBILE__)
  .setProp({
    modes: ["info", "warn", "err"],
  });
  exports.showMessage = showMessage;
