/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * {INTF_BLK_furnaceBlock} but instead of consuming fuel, this will consume power dynamically.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const JAVA = require("lovec/glb/GLB_java");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(!blk.hasPower) ERROR_HANDLER.throw("noPowerModule", blk.name);

    blk.clipSize += 140.0;
    blk.fuelTempRes = MDL_flow._heatRes(blk);

    MDL_event._c_onLoad(() => {
      let blkCons = new ConsumePowerDynamic(b => b.ex_calcFurnPowCons());
      blk.consumers = [blkCons];
      blk.consPower = blkCons;
    });

    blk.configurable = true;

    blk.config(JAVA.FLOAT, (b, f) => {
      b.ex_accTempRiseTg(f);
    });
  };


  function comp_load(blk) {
    blk.fuelHeatReg = fetchRegion(blk, "-fuel-heat", "-heat");
    if(!blk.fuelHeatReg.found()) {
      blk.fuelHeatReg = null;
    };
  };


  function comp_setStats(blk) {
    blk.stats.add(TP_stat.blk0heat_heatRes, blk.fuelTempRes, TP_stat.rs_heatUnits);
    blk.stats.add(Stat.powerUse, blk.powConsBase * 60.0, StatUnit.powerSecond);
    blk.stats.add(TP_stat.blk0pow_powUsePer100HU, blk.powConsPerFuelLvl * 60.0, StatUnit.powerSecond);
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
    if(b.tempRiseTg == null) b.tempRiseTg = PARAM.glbHeat;
  };


  function comp_updateTile(b) {
    // Update furnace temperature
    if(!PARAM.updateSuppressed && TIMER.secHalf) {
      b.tempCur = Mathf.lerpDelta(b.tempCur, Mathf.lerp(PARAM.glbHeat, Math.max(b.tempRiseTg, PARAM.glbHeat), b.power.status), b.block.ex_getFuelWarmupRate() * 30.0);
      if(b.tempCur > b.block.ex_getFuelTempRes()) FRAG_attack.damage(b, (VAR.blk_corDmgMin + VAR.blk_corDmgFrac * b.maxHealth) * (b.tempCur - b.block.ex_getFuelTempRes()) / 50.0, true, "heat");
    };

    // Update furnace efficiency
    b.furnEffc = Mathf.clamp(Math.min(
      Math.pow(b.tempCur / b.ex_getHeatTg(), 1.5),
      !isFinite(b.ex_getHeatAllowed()) ? Infinity : (b.ex_getHeatAllowed() - 2.0 * b.tempCur) / b.ex_getHeatAllowed() + 2.0,
    ));
    if(b.furnEffc < 0.15) b.furnEffc = 0.0;
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.furnEffc;
  };


  function comp_buildConfiguration(b, tb) {
    b.ex_buildTempSlider(tb);
  };


  function comp_draw(b) {
    if(PARAM.drawFurnaceHeat) {
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.ex_getHeatFrac(), 3) * 0.7, b.block.ex_getFuelHeatReg(), b.drawrot(), b.block.size);
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.ex_getHeatFrac(), 3) * 0.35, VARGEN.blockHeatRegs[b.block.size + 2], b.drawrot(), b.block.size);
    };

    MDL_draw._l_disk(b.x, b.y, Mathf.clamp((b.tempCur - 60.0) / 940.0), 56.0, b.block.size);
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


  function comp_ex_buildTempSlider(b, tb) {
    tb.row();
    tb.table(Styles.black3, tb1 => {
      tb1.left();
      MDL_table.__margin(tb1);
      MDL_table.__sliderCfg(tb1, b, () => "[$1]: [$2]".format(MDL_bundle._term("lovec", "temperature"), Strings.fixed(b.tempRiseTg, 2) + " " + TP_stat.rs_heatUnits.localized()), 0.0, b.block.ex_getFuelTempRes() * b.block.ex_getMaxOverheatScl(), 50.0, b.tempRiseTg);
    }).left().growX();
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
        // @PARAM: Base power consumption, regardless of temperature.
        powConsBase: 1.0,
        // @PARAM: Power consumption added for each 100 HU.
        powConsPerFuelLvl: 1.0,
        // @PARAM: Affects the maximum temperature allowed to reach. The furnace will get damaged when overheated.
        maxOverheatScl: 1.5,
        // @PARAM: See {INTF_BLK_furnaceBlock}.
        fuelWarmupRate: 0.0001,

        fuelTempRes: Infinity,
        fuelHeatReg: null,
      }),
      __GETTER_SETTER__: () => [
        "powConsBase",
        "powConsPerFuelLvl",
        "maxOverheatScl",
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


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        tempCur: null,
        tempRiseTg: null,
        furnEffc: 0.0,
      }),
      __GETTER_SETTER__: () => [
        "tempCur",
        "furnEffc",
      ],
      __ACCESSOR_SETTER__: () => [
        "tempRiseTg",
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


      warmupTarget: function() {
        return this.ex_getHeatFrac();
      }
      .setProp({
        noSuper: true,
      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      },


      draw: function() {
        comp_draw(this);
      },


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_calcFurnPowCons: function() {
        return Mathf.maxZero(this.tempRiseTg - PARAM.glbHeat) / 100.0 * this.block.ex_getPowConsPerFuelLvl() + this.block.ex_getPowConsBase();
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


      ex_buildTempSlider: function(tb) {
        comp_ex_buildTempSlider(this, tb);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_processData: function(wr0rd, lovecRevi) {
        processData(
          wr0rd, lovecRevi,

          (wr, revi) => {
            wr.f(this.tempCur);
            wr.f(this.tempRiseTg);
          },

          (rd, revi) => {
            this.tempCur = rd.f();
            this.tempRiseTg = rd.f();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
