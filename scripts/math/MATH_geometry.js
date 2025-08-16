/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MATH_base = require("lovec/math/MATH_base");


  /* <---------- distance ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: x1, y1, x2, y2 | x1, y1, z1, x2, y2, z2 | ...
   * Simply calculates distance.
   * ---------------------------------------- */
  const _dst = function() {
    var val = 0.0;
    let i = 0;
    let iCap = arguments.length / 2;
    while(i < iCap) {
      val += Math.pow(arguments[i + iCap] - arguments[i], 2);
      i++;
    };

    return Math.sqrt(val);
  };
  exports._dst = _dst;


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: x1, y1, x2, y2 | x1, y1, z1, x2, y2, z2 | ...
   * Manhattan distance.
   * ---------------------------------------- */
  const _dstManh = function() {
    var val = 0.0;
    let i = 0;
    let iCap = arguments.length / 2;
    while(i < iCap) {
      val += Math.abs(arguments[i + iCap] - arguments[i]);
      i++;
    };

    return val;
  };
  exports._dstManh = _dstManh;


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: x1, y1, x2, y2 | x1, y1, z1, x2, y2, z2 | ...
   * Chebyshev distance.
   * ---------------------------------------- */
  const _dstCheb = function() {
    var val = 0.0;
    let i = 0;
    let iCap = arguments.length / 2;
    while(i < iCap) {
      val = Math.max(val, arguments[i + iCap] - arguments[i]);
      i++;
    };

    return val;
  };
  exports._dstCheb = _dstCheb;


  /* <---------- area ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * @ARG: x1, y1, x2, y2, x3, y3, ...
   * Calculates the area of a polygon.
   * Point coorinates should be arranged clockwise or anticlockwise.
   * See Shoelace Theorem.
   * ---------------------------------------- */
  const _area = function() {
    let iCap = arguments.length;
    if(iCap < 6) return 0.0;
    var tmp1 = 0.0;
    var tmp2 = 0.0;
    for(let i = 0; i < iCap; i += 2) {
      let x_i = arguments[i];
      let y_i = arguments[i + 1];
      let x_ii = (i + 2 > iCap - 1) ? arguments[0] : arguments[i + 2];
      let y_ii = (i + 3 > iCap - 1) ? arguments[1] : arguments[i + 3];

      tmp1 += x_i * y_ii;
      tmp2 += x_ii * y_i;
    };

    return Math.abs(tmp1 - tmp2) * 0.5;
  };
  exports._area = _area;


  /* <---------- condition ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether (x, y) is inside a rectangle at (cx, cy).
   * ---------------------------------------- */
  const _inRect = function(x, y, cx, cy, hw, hh) {
    if(hw == null) hw = 0.0;
    if(hh == null) hh = hw;
    if(hw < 0.0001 || hh < 0.0001) return false;

    return x > cx - hw
      && x < cx + hw
      && y > cy - hh
      && y < cy + hh;
  };
  exports._inRect = _inRect;


  /* ----------------------------------------
   * NOTE:
   *
   * @ARG: x, y, x1, y1, x2, y2, x3, y3, ...
   * Whether (x, y) is in the range of a polygon.
   * ---------------------------------------- */
  const _inPolygon = function() {
    let iCap = arguments.length;
    if(iCap < 8) return true;

    const x = arguments[0];
    const y = arguments[1];
    const coords = [];
    for(let i = 2; i < iCap; i++) {
      coords.push(arguments[i]);
    };
    const area = _area.apply(null, coords);

    let iCap1 = coords.iCap();
    var tmpArea = 0.0;
    for(let i = 0; i < iCap1; i += 2) {
      let x_i = coords[i];
      let y_i = coords[i + 1];
      let x_ii = (i + 2 > iCap1 - 1) ? coords[0] : coords[i + 2];
      let y_ii = (i + 3 > iCap1 - 1) ? coords[1] : coords[i + 3];

      tmpArea += _area(x, y, x_i, y_i, x_ii, y_ii);
    };

    return Math.abs(area - tmpArea) < 0.0000001;
  };
  exports._inPolygon = _inPolygon;
