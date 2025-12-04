/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods for pressure.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_flow = require("lovec/mdl/MDL_flow");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.presRes = MDL_flow._presRes(blk);
    blk.vacRes = MDL_flow._vacRes(blk);
  };


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk0liq_presRes, blk.presRes);
    blk.stats.add(TP_stat.blk0liq_vacRes, -blk.vacRes);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-pressure", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-pressure-amt", Strings.fixed(b.ex_getPresTmp(), 2))),
      prov(() => b.ex_getPresTmp() > 0.0 ? VARGEN.auxPres.color : VARGEN.auxVac.color),
      () => Mathf.clamp(Math.abs(b.ex_getPresTmp()) / Math.max(b.ex_getPresTmp() > 0.0 ? blk.presRes : -blk.vacRes, 0.0001)),
    ));
  };


  function comp_onDestroyed(b) {
    if(Math.abs(b.presTmp) > 0.5) {
      Damage.damage(b.x, b.y, b.block.size * Vars.tilesize * 2.5, b.maxHealth * Math.abs(b.presTmp) * 0.2);
      Fx.explosion.at(b.x, b.y, b.block.size * Vars.tilesize * 2.5);
    };
  };


  function comp_remove(b) {
    if(b.liquids.currentAmount() < 0.01) {
      b.presBase = 0.0;
      b.presTmp = 0.0;
    };

    b.super$remove();
  };


  function comp_onProximityUpdate(b) {
    b.ex_updatePresFetchTgs();
    b.ex_updatePresSupplyTgs();
  };


  function comp_pickedUp(b) {
    b.presFetchTgs.clear();
    b.presSupplyTgs.clear();
  };


  function comp_updateTile(b) {
    if(PARAM.updateSuppressed) return;

    if(TIMER.secQuarter) {
      b.ex_updatePresTg();
      b.presTmp = (b.presTmp + b.presTg) * 0.5;
    };

    // Apply damage if over limit
    if(
      !PARAM.updateDeepSuppressed && TIMER.secQuarter && Mathf.chance(0.25)
        && (
          b.presTmp > 0.0 ?
            b.presTmp > b.block.ex_getPresRes() + 0.5 :
            b.presTmp < b.block.ex_getVacRes() - 0.5
        )
    ) {
      b.damagePierce(Time.delta * (b.maxHealth * VAR.blk_presDmgFrac + VAR.blk_presDmgMin) * (
        b.presTmp > 0.0 ?
          b.presTmp / Math.max(b.block.ex_getPresRes(), 0.0001) :
          -b.presTmp / Math.max(-b.block.ex_getVacRes(), 0.0001)
      ));
    };

    // Pressure drop
    b.presBase -= b.presBase.fEqual(0.0, 0.005) ? b.presBase : b.presBase * 0.01666667 * Time.delta;

    // Occasionally supply abstract fluid
    if(TIMER.liq && b.presSupplyTgs.length > 0 && !b.presTmp.fEqual(0.0, 0.005)) {
      b.presSupplyIncre++;
      let b_t = b.presSupplyTgs[b.presSupplyIncre % b.presSupplyTgs.length];
      if(b_t.added) {
        FRAG_fluid.addLiquid(b_t, null, b.presTmp > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, Math.abs(b.presTmp.roundFixed(0)) / 60.0 * VAR.time_liqIntv);
      };
    };
  };


  function comp_acceptLiquid(b, b_f, liq) {
    let presThr = b.block.ex_getPresThr();
    if(presThr.fEqual(0.0)) return true;

    return presThr > 0.0 ?
      b.presTmp >= presThr - 0.1 :
      b.presTmp <= presThr + 0.1;
  };


  function comp_ex_updatePresFetchTgs(b) {
    b.presFetchTgs.clear();
    // Find all possible pressure sources
    b.proximity.each(ob => {
      if(
        ob.ex_getPresTmp != null
          && (!ob.block.rotate ? true : (ob.relativeTo(b) === ob.rotation))
          && (!b.block.rotate ? true : (!MDL_cond._isNoSideBlock(b.block) ? b.relativeTo(ob) !== b.rotation : (ob.relativeTo(b) === b.rotation || (
            MDL_cond._isFluidConduit(b.block) ?
              MDL_cond._isFluidConduit(ob.block) :
              false
          ))))
      ) {
        b.presFetchTgs.push(ob);
      };
    });
  };


  function comp_ex_updatePresSupplyTgs(b) {
    let aux = b.presTmp > 0.0 ? VARGEN.auxPres : VARGEN.auxVac;
    b.presSupplyTgs.clear();
    // Find all possible pressure consumers
    b.proximity.each(ob => {
      ob = ob.getLiquidDestination(b, aux);
      if(
        (!b.block.rotate ? true : (b.relativeTo(ob) === b.rotation))
          && ob.acceptLiquid(b, aux)
      ) {
        b.presSupplyTgs.push(ob);
      };
    });
  };


  function comp_ex_updatePresTg(b) {
    b.presTg = b.presBase;
    b.presFetchTgs.forEachFast(ob => {
      if(!ob.added) return;
      b.presTg += ob.ex_getPresTmp();
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Pressure required for this block to operate, can be negative for vacuum requirement.
        presThr: 0.0,

        presRes: 0.0,
        vacRes: 0.0,
      }),
      __GETTER_SETTER__: () => [
        "presThr",
        "presRes",
        "vacRes",
      ],


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        presBase: 0.0,
        presTmp: 0.0,
        presTg: 0.0,
        presFetchTgs: prov(() => []),
        presSupplyTgs: prov(() => []),
        presSupplyIncre: 0,
      }),
      __GETTER_SETTER__: () => [
        "presTmp",
      ],
      __ACCESSOR_SETTER__: () => [
        "presBase",
      ],


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


      remove: function() {
        comp_remove(this);
      }
      .setProp({
        noSuper: true,
      }),


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
      }
      .setProp({
        boolMode: "and",
      }),


      ex_updatePresFetchTgs: function() {
        comp_ex_updatePresFetchTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_updatePresSupplyTgs: function() {
        comp_ex_updatePresSupplyTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_updatePresTg: function() {
        comp_ex_updatePresTg(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, lovecRevi) {
        processData(
          wr0rd, lovecRevi,

          (wr, revi) => {
            wr.f(this.presTmp);
          },

          (rd, revi) => {
            if(revi < 1) {
              return;
            };

            let pres = rd.f();
            this.presTmp = pres;
            this.presTg = pres;
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
