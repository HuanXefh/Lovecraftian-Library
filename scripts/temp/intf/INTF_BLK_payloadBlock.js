/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Lovec version of payload block as interface, since I cannot extend a Java class.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.acceptsUnitPayload = true;
  };


  function comp_ex_pushOutput(blk, pay, pushProg) {
    let pushThr = 0.55;
    if(pushProg < pushThr) return;

    let
      allowLegStep = pay instanceof UnitPayload && pay.unit.type.allowLegStep,
      hitSize = pay.size(),
      rad = hitSize * 0.5,
      x = pay.x(),
      y = pay.y(),
      scl = Mathf.clamp((pushProg - pushThr) / (1.0 - pushThr) * 1.1);

    let dst, radSum;
    MDL_pos._it_unitsRect(x, y, rad / Vars.tilesize, 0, null, ounit => ounit.isGrounded() && ounit.type.allowLegStep === allowLegStep, ounit => {
      dst = ounit.dst(pay);
      radSum = rad + ounit.hitSize * 0.5;
      if(dst >= radSum) return;
      ounit.vel.add(Tmp.v1.set(ounit.x - x, ounit.y - y).setLength(Math.min(radSum - dst, 1.0)).scl(scl));
    });
  };


  function comp_onRemoved(b) {
    if(b.payCur != null && b.isPayCarried) b.payCur.dump();
  };


  function comp_onDestroyed(b) {
    if(b.payCur != null) b.payCur.destroyed();
    b.super$onDestroyed();
  };


  function comp_pickedUp(b) {
    b.isPayCarried = true;
  };


  function comp_canControlSelect(b, unit_pl) {
    return !unit_pl.spawnedByCore && unit_pl.type.allowedInPayloads
      && b.payCur == null && b.ex_allowUnitEntrance(unit_pl)
      && unit_pl.tileOn() != null && unit.tileOn().build === b;
  };


  function comp_onControlSelect(b, unit_pl) {
    let
      x = unit_pl.x,
      y = unit_pl.y;

    b.handleUnitPayload(unit_pl, pay => b.payCur = pay);
    b.payVec.set(x, y).sub(b).clamp(-b.block.size * Vars.tilesize * 0.5, -b.block.size * Vars.tilesize * 0.5, b.block.size * Vars.tilesize * 0.5, b.block.size * Vars.tilesize * 0.5);
    b.payRot = unit_pl.rotation;
  };


  function comp_updateTile(b) {
    if(b.payCur != null) b.payCur.update(null, b);
  };


  function comp_acceptPayload(b, b_f, pay) {
    return b.payCur == null;
  };


  function comp_handlePayload(b, b_f, pay) {
    b.payCur = pay;
    b.payVec.set(b_f).sub(b).clamp(-b.block.size * Vars.tilesize * 0.5, -b.block.size * Vars.tilesize * 0.5, b.block.size * Vars.tilesize * 0.5, b.block.size * Vars.tilesize * 0.5);
    b.payRot = pay.rotation();

    b.ex_updatePayload();
  };


  function comp_takePayload(b) {
    let pay = b.payCur;
    b.payCur = null;
    return pay;
  };


  function comp_drawTeamTop(b) {
    b.isPayCarried = false;
  };


  function comp_ex_updatePayload(b) {
    if(b.payCur == null) return;

    b.payCur.set(b.x + b.payVec.x, b.y + b.payVec.y, b.payRot);
  };


  function comp_ex_moveInPayload(b, shouldRot) {
    if(b.payCur == null) return false;

    b.ex_updatePayload();
    if(shouldRot) b.payRot = Angles.moveToward(b.payRot, b.block.rotate ? b.rotdeg() : 90.0, 5.0 * b.delta());
    b.payVec.approach(Vec2.ZERO, 0.7 * b.delta());

    return b.ex_payloadArrived();
  };


  function comp_ex_moveOutPayload(b) {
    if(b.payCur == null) return;

    b.ex_updatePayload();
    let vec_t = Tmp.v1.trns(b.rotdeg(), b.block.size * Vars.tilesize * 0.5);
    b.payRot = Angles.moveToward(b.payRot, b.rotdeg(), 5.0 * b.delta());
    b.payVec.approach(vec_t, 0.7 * b.delta());

    let b_t = b.front();
    let cond1 = b_t == null || !b_t.tile.solid();
    let cond2 = b_t != null && (b_t.block.outputsPayload || b_t.block.acceptsPayload);
    if(cond1 && !cond2) {
      b.block.ex_pushOutput(b.payCur, 1.0 - (b.payVec.dst(vec_t) / (b.block.size * Vars.tilesize * 0.5)));
    };
    if(b.payVec.within(vec_t, 0.001)) {
      b.payVec.clamp(-b.block.size * Vars.tilesize * 0.5, -b.block.size * Vars.tilesize * 0.5, b.block.size * Vars.tilesize * 0.5, b.block.size * Vars.tilesize * 0.5);
      if(cond2) {
        if(b.movePayload(b.payCur)) b.payCur = null;
      } else if(cond1) {
        b.ex_dumpPayload();
      };
    };
  };


  function comp_ex_dumpPayload(b) {
    let
      offX = Angles.trnsx(b.payCur.rotation(), 0.1),
      offY = Angles.trnsy(b.payCur.rotation(), 0.1);

    b.payCur.set(b.payCur.x() + offX, b.payCur.y() + offY, b.payCur.rotation());
    b.payCur.dump() ?
      b.payCur = null :
      b.payCur.set(b.payCur.x() - offX, b.payCur.y() - offY, b.payCur.rotation());
  };


  function comp_ex_payloadArrived(b) {
    return b.payVec.isZero(0.01);
  };


  function comp_ex_drawPayload(b) {
    if(b.payCur == null) return;

    b.ex_updatePayload();
    processZ(Layer.blockOver);

    b.payCur.draw();

    processZ(Layer.blockOver);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      init: function() {
        comp_init(this);
      },


      ex_pushOutput: function(pay, pushProg) {
        comp_ex_pushOutput(this, pay, pushProg);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        payCur: null,
        payVec: prov(() => new Vec2()),
        payRot: 0.0,
        isPayCarried: false,
      }),
      __GETTER_SETTER__: () => [
        "payVec",
      ],
      __ACCESSOR_SETTER__: () => [
        "payCur",
        "payRot",
      ],


      onRemoved: function() {
        comp_onRemoved(this);
      },


      onDestroyed: function() {
        comp_onDestroyed(this);
      }
      .setProp({
        noSuper: true,
      }),


      pickedUp: function() {
        comp_pickedUp(this);
      },


      canControlSelect: function(unit_pl) {
        return comp_canControlSelect(this, unit_pl);
      }
      .setProp({
        noSuper: true,
      }),


      onControlSelect: function(unit_pl) {
        comp_onControlSelect(this, unit_pl);
      }
      .setProp({
        noSuper: true,
      }),


      updateTile: function() {
        comp_updateTile(this);
      },


      acceptPayload: function(b_f, pay) {
        return comp_acceptPayload(this, b_f, pay);
      }
      .setProp({
        noSuper: true,
      }),


      handlePayload: function(b_f, pay) {
        comp_handlePayload(this, b_f, pay);
      }
      .setProp({
        noSuper: true,
      }),


      takePayload: function() {
        return comp_takePayload(this);
      }
      .setProp({
        noSuper: true,
      }),


      getPayload: function() {
        return this.payCur;
      }
      .setProp({
        noSuper: true,
      }),


      drawTeamTop: function() {
        comp_drawTeamTop(this);
      },


      ex_updatePayload: function() {
        comp_ex_updatePayload(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_moveInPayload: function(shouldRot) {
        return comp_ex_moveInPayload(this, shouldRot);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_moveOutPayload: function() {
        comp_ex_moveOutPayload(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_dumpPayload: function() {
        comp_ex_dumpPayload(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_payloadArrived: function() {
        return comp_ex_payloadArrived(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_allowUnitEntrance: function(unit) {
        return false;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_drawPayload: function() {
        comp_ex_drawPayload(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, lovecRevi) {
        processData(
          wr0rd, lovecRevi,
          (wr, revi) => {
            wr.f(this.payVec.x);
            wr.f(this.payVec.y);
            wr.f(this.payRot);
            Payload.write(this.payCur, wr);
          },

          (rd, revi) => {
            this.payVec.set(rd.f(), rd.f());
            this.payRot = rd.f();
            this.payCur = Payload.read(rd);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
