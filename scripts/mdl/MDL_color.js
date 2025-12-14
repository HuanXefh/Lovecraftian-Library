/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  const tmpColors = [
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
  ];


  /* ----------------------------------------
   * NOTE:
   *
   * Generalized color thing.
   * If given {colorMod}, this will try overwriting it instead of using default temporary color object.
   * If {colorMod} is {"new"}, this will create a new color object.
   * ---------------------------------------- */
  const _color = function(color_gn, colorMod) {
    if(color_gn === "null") return null;
    if(colorMod == null) colorMod = tmpColors[9];
    if(color_gn == null) return colorMod === "new" ? Color.white.cpy() : Color.white;

    return _color.tmpGetter(color_gn, colorMod);
  }
  .setProp({
    tmpGetter: newMultiFunction(
      [Tile, null], (t, colorMod) => colorMod === "new" ? new Color(t.floor().mapColor) : t.floor().mapColor,
      [Item, null], (itm, colorMod) => colorMod === "new" ? itm.color.cpy() : itm.color,
      [Liquid, null], (liq, colorMod) => colorMod === "new" ? liq.color.cpy() : liq.color,
      [Team, null], (team, colorMod) => colorMod === "new" ? team.color.cpy() : team.color,
      ["number", null], (num, colorMod) => colorMod === "new" ? new Color(Math.round(num)) : colorMod.set(Math.round(num)),
      ["boolean", null], (bool, colorMod) => colorMod === "new" ? (bool ? Pal.accent : Pal.remove).cpy() : (bool ? Pal.accent : Pal.remove),
      ["string", null], (str, colorMod) => colorMod === "new" ? Color.valueOf(str) : Color.valueOf(colorMod, str),
      [Color, null], (color, colorMod) => colorMod === "new" ? color.cpy() : color,
    ),
  });
  exports._color = _color;


  /* ----------------------------------------
   * NOTE:
   *
   * Checks if two colors are the same in RGBA.
   * ---------------------------------------- */
  const _isSameColor = function(color1_gn, color2_gn) {
    return _color(color1_gn, tmpColors[0]).rgba() === _color(color2_gn, tmpColors[1]).rgba();;
  };
  exports._isSameColor = _isSameColor;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the default color from the icon of a content.
   * For 32x32 sprite, this returns color at (15, 15).
   * ---------------------------------------- */
  const _iconColor = function(ct_gn, useTmp) {
    let color = useTmp ? tmpColors[2].set(0, 0, 0, 1) : new Color(0, 0, 0, 1);
    if(Vars.headless) return color;
    let ct = global.lovecUtil.fun._ct(ct_gn);
    if(ct == null) return color;
    let pix = Core.atlas.getPixmap(ct.fullIcon);

    return color.set(pix.get(Math.round(pix.width * 0.5) - 1, Math.round(pix.height * 0.5) - 1));
  };
  exports._iconColor = _iconColor;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the color for some character.
   * ---------------------------------------- */
  const _charaColor = function thisFun(nmMod, nmChara) {
    thisFun.tmpArgs.clear().push(nmMod, nmChara);
    return _color(global.lovec.db_misc.db["drama"]["chara"]["color"].read(thisFun.tmpArgs));
  }
  .setProp({
    tmpArgs: [],
  });
  exports._charaColor = _charaColor;
