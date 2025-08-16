/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");


  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_util = require("lovec/mdl/MDL_util");


  /* <---------- base ----------> */


  const timer_mem = new Interval(3);


  const timer_effc = new Interval(4);
  const timer_param = new Interval(3);


  const timer_lightning = new Interval(1);


  const timer_unit = new Interval(1);


  const timer_stackSta = new Interval(1);


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onUpdate(() => {


    exports.timerState_memUse = timer_mem.get(0, 50.0);
    exports.timerState_memUseMean = timer_mem.get(1, 450.0);
    exports.timerState_memPrint = timer_mem.get(2, 3600.0);


    exports.timerState_effc = timer_effc.get(0, MDL_util._cfg("interval-efficiency", true));
    exports.timerState_rsCur = timer_effc.get(1, 180.0);
    exports.timerState_liq = timer_effc.get(2, VAR.time_liqIntv);
    exports.timerState_heat = timer_effc.get(3, VAR.time_heatIntv);
    exports.timerState_param = timer_param.get(0, VAR.time_paramIntv);
    exports.timerState_paramGlobal = timer_param.get(1, VAR.time_paramGlobalIntv);
    exports.timerState_paramLarge = timer_param.get(2, VAR.time_paramLargeIntv);


    exports.timerState_lightning = timer_lightning.get(VAR.time_lightningIntv);


    exports.timerState_unit = timer_unit.get(VAR.time_unitIntv);


    exports.timerState_stackSta = timer_stackSta.get(VAR.time_stackStaExtDef * 0.5);


  }, 17885422);
