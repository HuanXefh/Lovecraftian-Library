/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_texture = require("lovec/mdl/MDL_texture");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A modified {DrawSprite} for rotators, where clockwise rotation is supported.
   * ---------------------------------------- */
  const _rotator = function(suffix, spd, ang, offX, offY, shouldFade) {
    return extend(DrawBlock, {


      suffix: tryVal(suffix, "-rotator"),
      spd: tryVal(spd, 0.0), ang: tryVal(ang, 0.0),
      offX: tryVal(offX, 0.0), offY: tryVal(offY, 0.0),
      shouldFade: tryVal(shouldFade, true),
      rotReg: null,


      load(blk) {
        this.rotReg = MDL_texture._reg(blk, this.suffix, "-rotator");
      },


      icons(blk) {
        return [this.rotReg];
      },


      drawPlan(blk, plan, planLi) {
        Draw.rect(this.rotReg, plan.drawx() + this.offX, plan.drawy() + this.offY, this.ang);
      },


      draw(b) {
        let ang_fi = Mathf.mod(tryFun(b.ex_getTProg, tryProp(b.totalProgress, b), b) * this.spd + this.ang, 90.0);
        if(!this.shouldFade) {
          Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, ang_fi);
        } else {
          if(this.spd < 0.0) {
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, -ang_fi + 90.0);
            Draw.alpha(1.0 - ang_fi / 90.0);
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, -ang_fi);
          } else {
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, ang_fi);
            Draw.alpha(ang_fi / 90.0);
            Draw.rect(this.rotReg, b.x + this.offX, b.y + this.offY, ang_fi - 90.0);
          };
          Draw.reset();
        };
      },


    });
  };
  exports._rotator = _rotator;


  /* <---------- color ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A modified {DrawLiquidRegion} where the liquid with largest amount is used.
   * ---------------------------------------- */
  const _dynamicLiquid = function(suffix, canRotate) {
    return extend(DrawBlock, {


      suffix: tryVal(suffix, "-liquid"),
      canRotate: tryVal(canRotate, false),
      liqReg: null,
      tmpLiq: null, timerCheckMap: new ObjectMap(),


      load(blk) {
        if(!blk.hasLiquids) ERROR_HANDLER.noLiq(blk);

        this.liqReg = MDL_texture._reg(blk, this.suffix, "-liquid");
      },


      draw(b) {
        const thisDrawer = this;

        if(this.timerCheckMap.get(b, new Interval(1)).get(10.0)) {
          let tmpAmt = 0.0;
          b.liquids.each(liq => {
            if(b.liquids.get(liq) > tmpAmt) {
              tmpAmt = b.liquids.get(liq);
              thisDrawer.tmpLiq = liq;
            };
          });
        };

        if(this.tmpLiq != null) {
          Draw.color(this.tmpLiq.color, b.liquids.get(this.tmpLiq) / b.block.liquidCapacity);
          Draw.rect(this.liqReg, b.x, b.y, this.canRotate ? b.drawrot() : 0.0);
          Draw.color();
        };
      },


    });
  };
  exports._dynamicLiquid = _dynamicLiquid;
