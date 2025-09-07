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
   * If given {color}, this will try overwriting it instead of using default temporary color object.
   * If {color} is {"new"}, this will create new color.
   * ---------------------------------------- */
  const _color = function(color_gn, color) {
    if(color == null) color = tmpColors[9];

    if(color_gn == null) return color === "new" ? Color.white.cpy() : Color.white;
    if(color_gn instanceof Color) return color === "new" ? color_gn.cpy() : color_gn;
    if(typeof color_gn == "boolean") return color === "new" ? (color_gn ? Pal.accent : Pal.remove).cpy() : (color_gn ? Pal.accent : Pal.remove);
    if(typeof color_gn == "string") return color === "new" ? Color.valueOf(color_gn) : Color.valueOf(color, color_gn);
    if(typeof color_gn == "number") return color === "new" ? new Color(Math.round(color_gn)) : color.set(Math.round(color_gn));
    if((color_gn instanceof Item) || (color_gn instanceof Liquid) || (color_gn instanceof Team)) return color === "new" ? color_gn.color.cpy() : color_gn.color;

    return color === "new" ? Color.white.cpy() : Color.white;
  };
  exports._color = _color;


  /* ----------------------------------------
   * NOTE:
   *
   * Checks if two colors are the same in RGBA.
   * ---------------------------------------- */
  const _isSameColor = function(color1_gn, color2_gn) {
    if(color1_gn == null || color2_gn == null) return;

    let rawColor1 = _color(color1_gn, tmpColors[0]).rgba();
    let rawColor2 = _color(color2_gn, tmpColors[1]).rgba();

    return rawColor1 === rawColor2;
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
