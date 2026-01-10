/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods for fuel consumption.
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


  const CLS_window = require("lovec/cls/ui/CLS_window");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");
  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_fuel = require("lovec/mdl/MDL_fuel");
  const MDL_pollution = require("lovec/mdl/MDL_pollution");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.clipSize += 140.0;
    blk.fuelTempRes = MDL_flow._heatRes(blk);

    MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        MDL_fuel._fuelArr(blk).forEachFast(rs => {
          rs instanceof Item ?
            MDL_recipeDict.addItmConsTerm(blk, rs, 1, 1.0, {icon: "lovec-icon-fuel", item: MDL_fuel._fuelPon(rs) * 60.0 / blk.fuelConsMtp}) :
            MDL_recipeDict.addFldConsTerm(blk, rs, MDL_fuel._fuelPon(rs) * blk.fuelConsMtp, {icon: "lovec-icon-fuel"});
        });
      });
    });
  };


  function comp_load(blk) {
    blk.fuelHeatReg = fetchRegion(blk, "-fuel-heat", "-heat");
    if(!blk.fuelHeatReg.found()) {
      blk.fuelHeatReg = null;
    };
  };


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk0fac_fuel, newStatValue(tb => {
      tb.row();
      MDL_table.__btnSmall(tb, "?", () => {
        new CLS_window(
          "[$1] ([$2])".format(MDL_bundle._term("lovec", "fuel"), blk.localizedName),
          tb1 => MDL_table.setDisplay_ctLi(tb1, MDL_fuel._fuelArr(blk), null, 10),
        ).add();
      }).left().padLeft(28.0);
    }));

    if(!blk.fuelConsMtp.fEqual(1.0)) blk.stats.add(TP_stat.blk0fac_fuelConsMtp, blk.fuelConsMtp.perc());
    if(!blk.fuelLvlMtp.fEqual(1.0)) blk.stats.add(TP_stat.blk0fac_fuelLvlMtp, blk.fuelLvlMtp.perc());
    blk.stats.add(TP_stat.blk0heat_heatRes, blk.fuelTempRes, TP_stat.rs_heatUnits);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-furnace-temp", b => new Bar(
      prov(() => Core.bundle.format("bar.heatpercent", Strings.fixed(b.ex_getTempCur(), 2) + " " + TP_stat.rs_heatUnits.localized(), b.ex_getFurnEffc().roundFixed(2) * 100.0)),
      prov(() => Tmp.c2.set(Color.darkGray).lerp(Pal.lightOrange, b.ex_getHeatFrac())),
      () => b.ex_getHeatFrac(),
    ));
  };


  function comp_created(b) {
    if(b.tempCur == null) b.tempCur = PARAM.glbHeat;
  };


  function comp_updateTile(b) {
    // Update currently used fuel
    if(TIMER.secFive) {
      b.fuelTup = MDL_fuel._fuelTup(b);
      b.fuelPolProd = b.fuelTup == null ?
        0.0 :
        MDL_pollution._rsPol(b.fuelTup[0]);
    };

    // Add dynamic pollution
    if(TIMER.sec && b.fuelPonCur > 0.0) {
      MDL_pollution.addDynaPol(b.fuelPolProd);
    };

    // Update furnace temperature and apply damage if overheated
    if(!PARAM.updateSuppressed && TIMER.secHalf) {
      b.tempCur = Mathf.lerpDelta(b.tempCur, Mathf.lerp(PARAM.glbHeat, b.fuelTup == null ? PARAM.glbHeat : b.fuelTup[2] * 100.0 * b.block.ex_getFuelLvlMtp(), b.fuelTup == null ? 0.0 : b.ex_calcTempTgFrac(b.fuelTup[0])), b.block.ex_getFuelWarmupRate() * 30.0);
      if(b.tempCur > b.block.ex_getFuelTempRes()) FRAG_attack.damage(b, (VAR.blk_corDmgMin + VAR.blk_corDmgFrac * b.maxHealth) * (b.tempCur - b.block.ex_getFuelTempRes()) / 50.0, 0.0, "heat");
    };

    // Occasionally update fuel consumption status
    if(TIMER.heat && b.fuelTup != null && b.fuelTup != null && b.fuelTup[0] != null) {
      b.ex_updateFuelConsumption(b.fuelTup[0], b.fuelTup[1]);
    };

    // Update furnace efficiency
    b.furnEffc = b.fuelTup == null ?
      0.0 :
      Mathf.clamp(Math.min(
        Math.pow(b.tempCur / b.ex_getHeatTg(), 1.5),
        !isFinite(b.ex_getHeatAllowed()) ? Infinity : (b.ex_getHeatAllowed() - 2.0 * b.tempCur) / b.ex_getHeatAllowed() + 2.0,
      ));
    if(b.furnEffc < 0.15) b.furnEffc = 0.0;
    b.furnEffc *= b.fuelEffc;
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.furnEffc;
  };


  function comp_acceptItem(b, b_f, itm) {
    return b.items != null && b.items.get(itm) < b.getMaximumAccepted(itm) && MDL_fuel._hasFuelInput(b.block, itm);
  };


  function comp_acceptLiquid(b, b_f, liq) {
    return b.liquids != null && b.liquids.get(liq) < b.block.liquidCapacity && MDL_fuel._hasFuelInput(b.block, liq);
  };


  function comp_draw(b) {
    if(PARAM.drawFurnaceHeat) {
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.ex_getHeatFrac(), 3) * 0.7, b.block.ex_getFuelHeatReg(), b.drawrot(), b.block.size);
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.ex_getHeatFrac(), 3) * 0.35, VARGEN.blockHeatRegs[b.block.size + 2], b.drawrot(), b.block.size);
    };

    MDL_draw._l_disk(b.x, b.y, Mathf.clamp((b.tempCur - 60.0) / 940.0), 56.0, b.block.size);
  };


  function comp_ex_calcTempTgFrac(b, rs) {
    if(rs == null || b.fuelPonCur < 0.0001) return 0.0;
    if(rs instanceof Item) {
      if(b.items == null || !b.items.has(rs)) return 0.0;
    } else {
      if(b.liquids == null || !b.liquids.get(rs) < 0.01) return 0.0;
    };

    return 1.0;
  };


  function comp_ex_updateFuelConsumption(b, fuel, pon) {
    b.fuelEffc = 1.0;

    if(fuel instanceof Item) {
      if(b.fuelPonCur < 1.0 && pon > 0.0 && FRAG_item.consumeItem(b, fuel, 1)) b.fuelPonCur += pon;
      if(b.fuelPonCur < 1.0) b.fuelEffc = 0.0;
      b.fuelPonCur = Mathf.maxZero(b.fuelPonCur - VAR.time_heatIntv / 60.0 * b.block.ex_getFuelConsMtp());
    } else {
      b.fuelPonCur = FRAG_fluid.addLiquid(b, b, fuel, pon * b.block.ex_getFuelConsMtp() * VAR.time_heatIntv, false, false, true);
      b.fuelEffc = Math.min(b.fuelPonCur, 1.0);
    };
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
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
        // @PARAM: Type of fuel to consume. Possible values: "item", "liquid", "gas", "any".
        fuelType: "item",
        // @PARAM: List of resources that cannot be consumed as fuel.
        blockedFuels: prov(() => []),
        // @PARAM: Multiplier on fuel consumption.
        fuelConsMtp: 1.0,
        // @PARAM: Multiplier on fuel level.
        fuelLvlMtp: 1.0,
        // @PARAM: How fast the furnace reaches target temperature.
        fuelWarmupRate: 0.0001,

        fuelTempRes: Infinity,
        fuelHeatReg: null,
      }),
      __GETTER_SETTER__: () => [
        "fuelType",
        "blockedFuels",
        "fuelConsMtp",
        "fuelLvlMtp",
        "fuelWarmupRate",
        "fuelTempRes",
        "fuelHeatReg",
      ],


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      consumesItem: function(itm) {
        return MDL_fuel._hasFuelInput(this, itm);
      }
      .setProp({
        boolMode: "or",
      }),


      consumesLiquid: function(liq) {
        return MDL_fuel._hasFuelInput(this, liq);
      }
      .setProp({
        boolMode: "or",
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        tempCur: null,
        fuelPonCur: 0.0,
        fuelTup: null,
        fuelEffc: 0.0,
        furnEffc: 0.0,
        fuelPolProd: 0.0,
      }),
      __GETTER_SETTER__: () => [
        "tempCur",
        "furnEffc",
      ],


      created: function() {
        comp_created(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      acceptItem: function(b_f, itm) {
        return comp_acceptItem(this, b_f, itm);
      }
      .setProp({
        boolMode: "or",
      }),


      acceptLiquid: function(b_f, itm) {
        return comp_acceptLiquid(this, b_f, itm);
      }
      .setProp({
        boolMode: "or",
      }),


      warmupTarget: function() {
        return this.ex_getHeatFrac();
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      },


      ex_calcTempTgFrac: function(rs) {
        return comp_ex_calcTempTgFrac(this, rs);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_updateFuelConsumption: function(fuel, pon) {
        comp_ex_updateFuelConsumption(this, fuel, pon);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getHeatTmp: function() {
        return this.tempCur;
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Returns the target temperature that this furnace is expected to have, based on the building status.
       * ---------------------------------------- */
      ex_getHeatTg: function() {
        return PARAM.glbHeat;
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Returns the maximum heat allowed for the recipe, based on the building status.
       * ---------------------------------------- */
      ex_getHeatAllowed: function() {
        return Infinity;
      }
      .setProp({
        noSuper: true,
      }),


      ex_getHeatFrac: function() {
        return Mathf.clamp(this.tempCur / Math.max(this.ex_getHeatTg(), 0.01), 0.0, 1.0);
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,

          (wr, revi) => {
            wr.f(this.tempCur);
          },

          (rd, revi) => {
            if(revi < 1) {
              rd.s();
            };

            this.tempCur = rd.f();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
