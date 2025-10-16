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
   * Gets a region matching the suffix, that's it.
   * ---------------------------------------- */
  const _reg = function(ct_gn, suffix, suffixFallback) {
    let ct = global.lovecUtil.fun._ct(ct_gn);
    if(ct == null) return null;
    if(suffix == null) suffix = "";
    if(suffixFallback == null) suffixFallback = "";

    return Core.atlas.find(ct.name + suffix, Core.atlas.find(ct.name + suffixFallback, ct.region));
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports._reg = _reg;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the default complete region for a block.
   * -icon sprite should always be created.
   * ---------------------------------------- */
  const _regBlk = function(blk_gn, shouldReturnName) {
    let blk = global.lovecUtil.fun._ct(blk_gn, "block");
    if(blk == null) return null;

    if(!shouldReturnName) {

      return Core.atlas.find(blk.name + "-icon", blk.fullIcon);

    } else {

      let nm = blk.name + "-icon";
      return Core.atlas.has(nm) ? nm : blk.name + "-full";

    };
  }
  .setAnno(ANNO.__NONHEADLESS__);
  exports._regBlk = _regBlk;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the block heat region for the inputted size.
   * ---------------------------------------- */
  const _regHeat = function(size) {
    return Core.atlas.find("lovec-ast-block-heat" + Math.round(size));
  }
  .setAnno(ANNO.__NONHEADLESS__);
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
  .setAnno(ANNO.__NONHEADLESS__);
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
  .setAnno(ANNO.__NONHEADLESS__);
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
   * Draws pixels from {pix2} on top of {pix1}.
   * ---------------------------------------- */
  const _pix_stack = function(pix1, pix2) {
    var w = pix1.width;
    var h = pix1.height;
    let pix = new Pixmap(w, h);

    for(let x = 0; x < w; x++) {
      for(let y = 0; y < h; y++) {
        let rawColor;
        let rawColor1 = pix1.getRaw(x, y);
        let rawColor2;
        if(pix2 == null) {rawColor = Tmp.c1.set(rawColor1).rgba()} else {
          rawColor2 = pix2.getRaw(x, y);
          rawColor = (pix2.getA(x, y) < 36) ? Tmp.c1.set(rawColor1).rgba() : Tmp.c1.set(rawColor2).rgba();
        };

        pix.setRaw(x, y, rawColor);
      };
    };

    return pix;
  };
  exports._pix_stack = _pix_stack;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts pixels from the icon region of {ct} to an icon tag pixmap.
   * ---------------------------------------- */
  const _pix_ctTag = function(ct_gn, w) {
    if(w == null) w = 32;
    let hw = w / 2;
    let ct = global.lovecUtil.fun._ct(ct_gn);
    if(ct == null) ERROR_HANDLER.noCt(ct_gn);
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


  const comp_createIcons_ctTag = function(ct, packer, nmCtBot, nmCtOv, suffix) {
    let pixBase = Core.atlas.getPixmap(nmCtBot);
    let pixOv = _pix_ctTag(nmCtOv, pixBase.width);
    let pix = _pix_stack(pixBase, pixOv);
    packer.add(MultiPacker.PageType.main, ct.name + suffix, pix);
    pixOv.dispose();
    pix.dispose();
  };
  exports.comp_createIcons_ctTag = comp_createIcons_ctTag;
