/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  TMP_Z = 0;
  TMP_Z_A = 0;
  TMP_Z_B = 0;
  TMP_XSCL = 1.0;
  TMP_YSCL = 1.0;
  TMP_REG = new TextureRegion();


  /* ----------------------------------------
   * NOTE:
   *
   * Used for draw methods to control z-layer.
   * Should always be called twice in a method!
   * ---------------------------------------- */
  processZ = function(z) {
    if(z == null) return;

    if(!processZ.isTail) {
      TMP_Z = Draw.z();
      Draw.z(z);
    } else {
      Draw.z(TMP_Z);
    };

    processZ.isTail = !processZ.isTail;
  };
  processZ.isTail = false;


  /* ----------------------------------------
   * NOTE:
   *
   * Basically {Draw.scl}, which cannot be called in JS cauz it's name of both field and method.
   * ---------------------------------------- */
  processScl = function(xscl, yscl) {
    if(!processScl.isTail) {
      TMP_XSCL = Draw.xscl;
      TMP_YSCL = Draw.yscl;
      Draw.xscl = tryVal(xscl, 1.0);
      Draw.yscl = tryVal(yscl, tryVal(xscl, 1.0));
    } else {
      Draw.xscl = TMP_XSCL;
      Draw.yscl = TMP_YSCL;
    };

    processScl.isTail = !processScl.isTail;
  };
  processScl.isTail = false;


  /* ----------------------------------------
   * NOTE:
   *
   * Container of basic draw methods for convenience.
   * ---------------------------------------- */
  LCDraw = {


    line: function(x1, y1, x2, y2, isDashed) {
      isDashed ?
        Lines.dashLine(x1, y1, x2, y2, Math.round(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / Vars.tilesize * 2.0)) :
        Lines.line(x1, y1, x2, y2);
    },


    rect: function(x, y, r, size, isDashed) {
      let
        hw = (size * 0.5 + r) * Vars.tilesize,
        amtSeg = !isDashed ? 0 : (size + r * 2) * 2;

      if(isDashed) {
        Lines.dashLine(x - hw, y - hw, x + hw, y - hw, amtSeg);
        Lines.dashLine(x + hw, y - hw, x + hw, y + hw, amtSeg);
        Lines.dashLine(x + hw, y + hw, x - hw, y + hw, amtSeg);
        Lines.dashLine(x - hw, y + hw, x - hw, y - hw, amtSeg);
      } else {
        Lines.line(x - hw, y - hw, x + hw, y - hw);
        Lines.line(x + hw, y - hw, x + hw, y + hw);
        Lines.line(x + hw, y + hw, x - hw, y + hw);
        Lines.line(x - hw, y + hw, x - hw, y - hw);
      };
    },


    area: function(x, y, size) {
      Fill.rect(x, y, size * Vars.tilesize, size * Vars.tilesize);
    },


    circle: function(x, y, rad, isDashed) {
      isDashed ?
        Lines.dashCircle(x, y, rad) :
        Lines.circle(x, y, rad);
    },


    ring: function(x, y, radIn, radOut, ang, frac, rev) {
      let
        sideAmt = Lines.circleVertices((radIn + radOut) * 0.5),
        angSide = 360.0 / sideAmt * (rev ? -1.0 : 1.0),
        iCap = Math.round(sideAmt * Mathf.clamp(frac));

      let i = 0, ang_i;
      while(i < iCap) {
        ang_i = angSide * i + ang;
        Fill.quad(
          x + radIn * Mathf.cosDeg(ang_i),
          y + radIn * Mathf.sinDeg(ang_i),
          x + radIn * Mathf.cosDeg(ang_i + angSide),
          y + radIn * Mathf.sinDeg(ang_i + angSide),
          x + radOut * Mathf.cosDeg(ang_i + angSide),
          y + radOut * Mathf.sinDeg(ang_i + angSide),
          x + radOut * Mathf.cosDeg(ang_i),
          y + radOut * Mathf.sinDeg(ang_i),
        );
        i++;
      };
    },


    disk: function(x, y, rad) {
      Fill.circle(x, y, rad);
    },


  };
