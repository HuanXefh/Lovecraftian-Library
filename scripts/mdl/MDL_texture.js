/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  /* <---------- region ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the default complete region for a block.
   * ---------------------------------------- */
  const _regBlk = function(blk_gn, shouldReturnName) {
    if(Vars.headless) return shouldReturnName ? "" : null;

    let blk = global.lovecUtil.fun._ct(blk_gn, "block");
    if(blk == null) return null;

    if(!shouldReturnName) {
      return Core.atlas.find(blk.name + "-full", blk.fullIcon);
    } else {
      return blk.name + "-full";
    };
  };
  exports._regBlk = _regBlk;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the block heat region for the inputted size.
   * ---------------------------------------- */
  const _regHeat = function(size) {
    return Core.atlas.find("lovec-ast-block-heat" + Math.round(size));
  }
  .setAnno(ANNO.$NON_HEADLESS$);
  exports._regHeat = _regHeat;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a random region from variant regions, based on tile position.
   * ---------------------------------------- */
  const _regVari = function(blk_gn, t, off) {
    let blk = global.lovec.mdl_content._ct(blk_gn, "block");
    if(blk == null) return null;

    if(blk.variants === 0) return blk.region;

    if(off == null) off = 0;
    return blk.variantRegions[Math.floor(Mathf.randomSeed(t.pos() + off, 0.0, Mathf.maxZero(blk.variantRegions.length - 1) + 0.9999))];
  }
  .setAnno(ANNO.$NON_HEADLESS$);
  exports._regVari = _regVari;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a the base region of a turret.
   * ---------------------------------------- */
  const _regTurBase = function(blk_gn) {
    let blk = global.lovec.mdl_content._ct(blk_gn, "block");
    if(blk == null) return null;
    if(blk.baseRegion != null) return blk.baseRegion;

    if(blk instanceof Turret) {
      if(blk.drawer instanceof DrawTurret) {
        return blk.drawer.base;
      } else if(blk.drawer instanceof DrawMulti) {
        let drawTurret = blk.drawer.drawers.find(drawer => drawer instanceof DrawTurret);
        if(drawTurret != null) return drawTurret.base;
      };
    };

    return null;
  }
  .setAnno(ANNO.$NON_HEADLESS$);
  exports._regTurBase = _regTurBase;


  /* random overlay */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a function that gets an array of random overlay regions.
   * See {DB_env.db["map"]["randRegTag"]}.
   * ---------------------------------------- */
  const _randRegsGetter = function(nm) {
    return function() {
      const arr = [];
      if(Vars.headless) return arr;

      let i = 0;
      while(Core.atlas.has(nm + (i + 1))) {
        arr.push(Core.atlas.find(nm + (i + 1)));
        i++;
      };

      return arr;
    };
  };
  exports._randRegsGetter = _randRegsGetter;


  /* <---------- pixmap ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Draws pixels from {pix2} on top of {pix1}, ignores transparent pixels.
   * ---------------------------------------- */
  const _pix_stack = function(pix1, pix2, aThr) {
    let pix = new Pixmap(pix1.width, pix1.height);
    let thr = Math.round(tryVal(aThr, 0.14) * 255);
    pix.each((x, y) => {
      pix.setRaw(x, y, pix2 == null || pix2.getA(x, y) < thr ? pix1.getRaw(x, y) : pix2.getRaw(x, y));
    });

    return pix;
  };
  exports._pix_stack = _pix_stack;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws a smaller icon of {ct_gn} on top of {pix0}.
   * ---------------------------------------- */
  const _pix_ctStack = function(pix0, ct_gn) {
    let ct = global.lovecUtil.fun._ct(ct_gn);
    if(ct == null) ERROR_HANDLER.throw("noContentFound", ct_gn);
    let pixCt = Core.atlas.getPixmap(ct instanceof Block ? _regBlk(ct) : ct.fullIcon);
    let pixCtStack = new Pixmap(pix0.width, pix0.height);
    pixCtStack.draw(pixCt, pixCtStack.width * 0.5, pixCtStack.height * 0.5, pixCtStack.width * 0.5, pixCtStack.height * 0.5);
    let pix = _pix_stack(pix0, pixCtStack);
    pixCtStack.dispose();

    return pix;
  };
  exports._pix_ctStack = _pix_ctStack;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts pixels from the icon region of {ct} to an icon tag pixmap.
   * ---------------------------------------- */
  const _pix_ctTag = function(ct_gn, w) {
    if(w == null) w = 32;
    let hw = w / 2;
    let ct = global.lovecUtil.fun._ct(ct_gn);
    if(ct == null) ERROR_HANDLER.throw("noContentFound", ct_gn);
    let reg = ct instanceof Block ? _regBlk(ct) : Core.atlas.find(ct.name);
    let pixCt = Core.atlas.getPixmap(reg);
    let wCt = pixCt.width;
    let hCt = pixCt.height;
    let pix = new Pixmap(w, w);

    for(let x = hw; x < w; x++) {
      for(let y = hw; y < w; y++) {
        let fracX = (x - hw) / hw;
        let fracY = (y - hw) / hw;
        let rawColor = pixCt.getRaw(Math.round(wCt * fracX), Math.round(hCt * fracY));

        pix.setRaw(x, y, rawColor);
      };
    };

    return pix;
  };
  exports._pix_ctTag = _pix_ctTag;


  const comp_createIcons_ctTag = function(ct, packer, ctUnd_gn, ctOv_gn, suffix) {
    let ctUnd = global.lovecUtil.fun._ct(ctUnd_gn);
    if(ctUnd == null) ERROR_HANDLER.throw("noContentFound", ctUnd_gn);
    let ctOv = global.lovecUtil.fun._ct(ctOv_gn);
    if(ctOv == null) ERROR_HANDLER.throw("noContentFound", ctOv_gn);
    let pix = _pix_ctStack(Core.atlas.getPixmap(ctUnd.name), ctOv);
    packer.add(MultiPacker.PageType.main, ct.name + suffix, pix);
    pix.dispose();
  };
  exports.comp_createIcons_ctTag = comp_createIcons_ctTag;
