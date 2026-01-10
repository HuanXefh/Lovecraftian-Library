/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new drawers.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_color = require("lovec/mdl/MDL_color");


  /* <---------- region ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A modified {DrawSprite} for rotators, where clockwise rotation is supported.
   * ---------------------------------------- */
  newDrawer(
    "DrawRotator",
    (paramObj) => extend(DrawBlock, {


      suffix: readParam(paramObj, "suffix", "-rotator"),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      ang: readParam(paramObj, "ang", 0.0),
      spd: readParam(paramObj, "spd", 0.0),
      shouldFade: readParam(paramObj, "shouldFade", true),
      rotReg: null,


      load(blk) {
        this.rotReg = fetchRegion(blk, this.suffix, "-rotator");
      },


      icons(blk) {
        return [this.rotReg];
      },


      drawPlan(blk, plan, planLi) {
        Draw.rect(this.rotReg, plan.drawx() + this.offX, plan.drawy() + this.offY, this.ang);
      },


      draw(b) {
        let ang_fi = Mathf.mod(tryFun(b.ex_getTProg, b, tryProp(b.totalProgress, b)) * this.spd + this.ang, 90.0);
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


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * Draws the icon of some content.
   * ---------------------------------------- */
  newDrawer(
    "DrawContentIcon",
    (paramObj) => extend(DrawBlock, {


      ctGetterTup: readParam(paramObj, "ctGetterTup", null),
      colorGetterTup: readParam(paramObj, "colorGetterTup", null),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      regScl: readParam(paramObj, "regScl", 1.0),


      load(blk) {
        if(this.ctGetterTup instanceof UnlockableContent) {
          let ct = this.ctGetterTup;
          this.ctGetterTup = [b => ct];
        };
        if(this.colorGetterTup instanceof Color) {
          let color = this.colorGetterTup;
          this.colorGetterTup = [b => color];
        };
      },


      draw(b) {
        if(this.ctGetterTup == null || this.ctGetterTup[0](b) == null) return;
        let reg = this.ctGetterTup[0](b).uiIcon;

        if(this.colorGetterTup == null) {
          Draw.rect(reg, b.x + this.offX, b.y + this.offY, reg.width * 2.0 * regScl / Vars.tilesize, reg.height * 2.0 * regScl / Vars.tilesize);
        } else {
          Draw.color(MDL_color._color(this.colorGetterTup[0](b)));
          Draw.rect(reg, b.x + this.offX, b.y + this.offY, reg.width * 2.0 * regScl / Vars.tilesize, reg.height * 2.0 * regScl / Vars.tilesize);
          Draw.color();
        };
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * A modified {DrawLiquidRegion} where the liquid with largest amount is used.
   * ---------------------------------------- */
  newDrawer(
    "DrawDynamicLiquid",
    (paramObj) => extend(DrawBlock, {


      suffix: readParam(paramObj, "suffix", "-liquid"),
      offX: readParam(paramObj, "offX", 0.0),
      offY: readParam(paramObj, "offY", 0.0),
      canRot: readParam(paramObj, "canRot", false),
      liqReg: null,
      tmpLiq: null,
      timerCheckMap: new ObjectMap(),


      load(blk) {
        if(!blk.hasLiquids) ERROR_HANDLER.throw("noLiquidModule", blk.name);
        this.liqReg = fetchRegion(blk, this.suffix, "-liquid");
      },


      draw(b) {
        const thisDrawer = this;

        if(!this.timerCheckMap.containsKey(b)) this.timerCheckMap.put(b, new Interval(1));

        if(this.timerCheckMap.get(b).get(10.0)) {
          let tmpAmt = 0.0;
          b.liquids.each(liq => {
            if(b.liquids.get(liq) > tmpAmt) {
              tmpAmt = b.liquids.get(liq);
              thisDrawer.tmpLiq = liq;
            };
          });
        };

        if(this.tmpLiq != null) {
          Draw.color(this.tmpLiq.color, Mathf.clamp(b.liquids.get(this.tmpLiq) / b.block.liquidCapacity));
          Draw.rect(this.liqReg, b.x + this.offX, b.y + this.offY, this.canRot ? b.drawrot() : 0.0);
          Draw.color();
        };
      },


    }),
  );
