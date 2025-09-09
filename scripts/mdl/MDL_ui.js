/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- base ----------> */


  var shouldMuteMusic = false;
  const setMute = function(bool) {
    shouldMuteMusic = bool;
  };
  exports.setMute = setMute;


  const _cameraX = function() {
    return Core.camera.position.x;
  };
  exports._cameraX = _cameraX;


  const _cameraY = function() {
    return Core.camera.position.y;
  };
  exports._cameraY = _cameraY;


  const _screenW = function() {
    return Core.graphics.getWidth();
  };
  exports._screenW = _screenW;


  const _screenH = function() {
    return Core.graphics.getHeight();
  };
  exports._screenH = _screenH;


  const _centerX = function() {
    return Core.graphics.getWidth() * 0.5;
  };
  exports._centerX = _centerX;


  const _centerY = function() {
    return Core.graphics.getHeight() * 0.5;
  };
  exports._centerY = _centerY;


  const _zoom = function() {
    return Vars.renderer.getDisplayScale();
  };
  exports._zoom = _zoom;


  const _uiW = function(pad, cap, offW, offH) {
    if(pad == null) pad = 20.0;
    if(cap == null) cap = 760.0;
    if(offW == null) offW = 0.0;
    if(offH == null) offH = 0.0;

    return Math.max(Math.min(_screenW() - pad * 2.0, cap), 64.0) - offW;
  };
  exports._uiW = _uiW;


  const _uiH = function(pad, cap, offW, offH) {
    if(pad == null) pad = 20.0;
    if(cap == null) cap = 760.0;
    if(offW == null) offW = 0.0;
    if(offH == null) offH = 0.0;

    return h_fi = Math.max(Math.min(_screenH() - pad * 2.0, cap), 64.0) - offH;
  };
  exports._uiH = _uiH;


  const _uiScl = function() {
    return Math.min(_screenW() / VAR.len_bgW, _screenH() / VAR.len_bgH);
  };
  exports._uiScl = _uiScl;


  /* ----------------------------------------
   * NOTE:
   *
   * How many columns is suitable for current window size.
   * ---------------------------------------- */
  const _colAmt = function(w, pad, ord) {
    if(w == null) w = 32.0;
    if(pad == null) pad = 4.0;
    if(ord == null) ord = 1;

    return Math.max(Math.floor(_uiW(null, null, ord * VAR.rad_ordRad, 0.0) / (w + pad)), 7);
  };
  exports._colAmt = _colAmt;


  /* <---------- info ----------> */


  const show_announce = function(nmMod, bp, timeS) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.announce(MDL_bundle._info(nmMod, bp), timeS);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.show_announce = show_announce;


  const show_fadeInfo = function(nmMod, bp, timeS) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.showInfoFade(MDL_bundle._info(nmMod, bp), timeS);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.show_fadeInfo = show_fadeInfo;


  const show_toast = function(nmMod, bp, icon, w) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(icon == null) icon = VARGEN.icons.ohno;
    if(w == null) w = -1.0;

    Vars.ui.hudfrag.showToast(icon, w, MDL_bundle._info(nmMod, bp));
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.show_toast = show_toast;


  const show_label = function(x, y, nmMod, bp, timeS) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";
    if(timeS == null) timeS = 3.0;

    Vars.ui.showLabel(MDL_bundle._info(nmMod, bp), timeS, x, y);
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.show_label = show_label;


  const show_error = function(nmMod, bp) {
    if(nmMod == null) nmMod = "lovec";
    if(bp == null) bp = "test";

    Core.app.post(() => {
      Vars.ui.showErrorMessage(MDL_bundle._info(nmMod, bp));
    });
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports.show_error = show_error;


  /* <---------- drama ----------> */


  const setPos_center = function(tb) {
    var done = false;
    tb.update(() => {
      if(!done) {
        tb.setPosition(_centerX(), _centerY(), Align.center);
        done = true;
      };
    });
  };
  exports.setPos_center = setPos_center;


  const setActor = function(tb, delay, acts, permanent) {
    let acts_fi = [Actions.fadeOut(0.0), Actions.delay(delay)].pushAll(acts);
    if(!permanent) acts_fi.push(Actions.remove());
    tb.actions.apply(tb, acts_fi);
    tb.pack();
    tb.act(0.1);
    if(Core.scene != null) Core.scene.add(tb);
  };
  exports.setActor = setActor;


  const removeActor = function(tb) {
    tb.actions(Actions.remove());
  };
  exports.removeActor = removeActor;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a color transition.
   * ---------------------------------------- */
  const _d_fade = function(delay, color, inTimeS, outTimeS, susTimeS) {
    if(color == null) color = Color.black;
    if(inTimeS == null) inTimeS = 1.0;
    if(outTimeS == null) outTimeS = inTimeS;
    if(susTimeS == null) susTimeS = 0.5;

    const tb = new Table();
    tb.touchable = Touchable.disabled;

    tb.table(Tex.whiteui, tb1 => {
      tb1.setColor(color);
    })
    .width(_screenW() * 1.2)
    .height(_screenH() * 1.2)
    .row();

    setPos_center(tb);
    setActor(tb, delay, [
      Actions.fadeIn(inTimeS),
      Actions.delay(susTimeS),
      Actions.fadeOut(outTimeS),
    ]);

    return inTimeS + susTimeS;
  };
  exports._d_fade = _d_fade;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a simple flash.
   * ---------------------------------------- */
  const _d_flash = function(delay, color) {
    if(color == null) color = Color.white;

    _d_fade(delay, color, 0.1, 0.1, 0.0);
  };
  exports._d_flash = _d_flash;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a background image display.
   * ---------------------------------------- */
  const _d_bg = function(delay, nmBg, endGetter, inTimeS) {
    if(inTimeS == null) inTimeS = 1.0;

    const tb = new Table();
    tb.touchable = Touchable.disabled;

    tb.table(new TextureRegionDrawable(Core.atlas.find(nmBg)), tb1 => {})
    .width(VAR.len_bgW * _uiScl())
    .height(VAR.len_bgH * _uiScl())
    .row();

    setPos_center(tb);
    setActor(tb, delay, [
      Actions.fadeIn(inTimeS),
      Actions.run(() => tb.update(() => {
        if(endGetter()) removeActor(tb);
      })),
    ], true);

    return inTimeS;
  };
  exports._d_bg = _d_bg;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a background music player.
   * This temporarily mutes vanilla sound control.
   * ---------------------------------------- */
  const _d_bgm = function(delay, song, endGetter) {
    const tb = new Table();

    setActor(tb, delay, [
      Actions.run(() => {
        shouldMuteMusic = true;
        song.play();
      }),
      Actions.run(() => tb.update(() => {
        if(endGetter()) {
          shouldMuteMusic = false;
          song.stop();
          removeActor(tb);
        };
      })),
    ], true);

    return 0.0;
  };
  exports._d_bgm = _d_bgm;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a character art display.
   * ---------------------------------------- */
  const _d_chara = function(
    delay, nmMod, chara, endGetter,
    fracX, isDark0color, anim, animParam,
    customActs, customActTimeS
  ) {
    if(customActs == null) customActs = [];
    if(customActTimeS == null) customActTimeS = 0.0;

    const tb = new Table();
    tb.touchable = Touchable.disabled;

    tb.table(new TextureRegionDrawable(Core.atlas.find(nmMod + "-chara-" + chara, Core.atlas.find("lovec-chara-error"))), tb1 => {

      if(isDark0color instanceof Color) {
        tb1.setColor(isDark0color);
      } else if(isDark0color) {
        tb1.setColor(Color.valueOf("606060"));
      };

    })
    .width(VAR.len_charaW * _uiScl())
    .height(VAR.len_charaH * _uiScl())
    .row();

    var done = false;
    tb.update(() => {
      if(!done) {
        tb.setPosition(_screenW() *(Object.val(fracX, 0.5)), _screenH() * 0.4, Align.center);
        done = true;
      };
    });

    let animTup;
    /* ----------------------------------------
     * NOTE:
     *
     * I have to hard-code this or it's bugged, WTF.
     * ---------------------------------------- */
    let transTimeS;
    let tup;
    switch(anim) {


      /* ----------------------------------------
       * NOTE:
       *
       * Lets the chara fades in or out.
       * {param} should be the time of transition.
       * ---------------------------------------- */
      case "fade-in" :
        transTimeS = typeof param !== "number" ? 0.75 : param;
        animTup = [transTimeS, [
          Actions.fadeIn(transTimeS),
        ]];
        break;


      case "fade-out" :
        transTimeS = typeof param !== "number" ? 0.75 : param;
        animTup = [transTimeS, [
          Actions.fadeIn(0.0),
          Actions.fadeOut(transTimeS),
        ]];
        break;


      /* ----------------------------------------
       * NOTE:
       *
       * Lets the chara move somewhere else, no y-coordinate.
       * {param} should be a 2-tup.
       * Format: {transTimeS, fracX_f, fracX_t}.
       * ---------------------------------------- */
      case "move" :
        tup = (param instanceof Array && param.length === 2) ? param : [0.75, 0.5, 0.5];
        animTup = [tup[0], [
          Actions.fadeIn(0.0),
          Actions.translateBy((tup[2] - tup[1]) * _screenW() * 0.5, 0.0, tup[0] * 0.5, Interp.pow2In),
          Actions.translateBy((tup[2] - tup[1]) * _screenW() * 0.5, 0.0, tup[0] * 0.5, Interp.pow2Out),
        ]];
        break;


      /* ----------------------------------------
       * NOTE:
       *
       * Lets the chara jump twice.
       * ---------------------------------------- */
      case "jump" :
        animTup = [0.5, [
          Actions.fadeIn(0.0),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
          Actions.translateBy(0.0, 40.0, 0.125),
          Actions.translateBy(0.0, -40.0, 0.125),
        ]];
        break;


      /* ----------------------------------------
       * NOTE:
       *
       * Lets the chara shake horizonally.
       * ---------------------------------------- */
      case "shake" :
        animTup = [0.5, [
          Actions.fadeIn(0.0),
          Actions.translateBy(-20.0, 0.0, 0.125),
          Actions.translateBy(40.0, 0.0, 0.125),
          Actions.translateBy(-40.0, 0.0, 0.125),
          Actions.translateBy(20.0, 0.0, 0.125),
        ]];
        break;


      default :
        animTup = [0.0, []];

    };
    setActor(tb, delay, animTup[1].concat(customActs).concat([
      Actions.run(() => tb.update(() => {
        if(endGetter()) removeActor(tb);
      })),
    ]), true);

    return animTup[0] + customActTimeS;
  };
  exports._d_chara = _d_chara;


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onUpdate(() => {


    if(shouldMuteMusic) Vars.control.sound.stop();


  }, 77586623);
