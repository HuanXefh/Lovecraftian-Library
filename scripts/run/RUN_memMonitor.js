/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Memory monitor for testing purpose.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");


  const MATH_statistics = require("lovec/math/MATH_statistics");


  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- base ----------> */


  const memUseData = [];
  const memUseMeanData = [];
  var memUseMax = 0.0;
  var memMonitorCount = 1;
  var memMonitorRunning = false;
  var memMonitorInit = false;


  const _memUse = function() {
    return Math.round(Core.app.getJavaHeap() / 1048576);
  };
  exports._memUse = _memUse;


  const _memUseMax = function() {
    return memUseMax;
  };
  exports._memUseMax = _memUseMax;


  const _memUseMean = function() {
    return memUseData.mean();
  };
  exports._memUseMean = _memUseMean;


  const _memIncSlp = function() {
    return MATH_statistics.linearReg(memUseMeanData, null)[0];
  };
  exports._memIncSlp = _memIncSlp;


  const _memLeakSig = function() {
    var memUseMeanMean = memUseMeanData.mean();

    return (memUseMeanMean - MATH_statistics.linearReg(memUseMeanData, null)[1]) / memUseMeanMean;
  };
  exports._memLeakSig = _memLeakSig;


  const initMemMonitor = function() {
    memUseData.clear();
    memUseMeanData.clear();
    memUseMax = 0.0;
    memMonitorCount = 1;
    memMonitorRunning = false;
    memMonitorInit = true;

    _i_memMonitorInit();
  };
  exports.initMemMonitor = initMemMonitor;


  const _i_memMonitor = function() {
    Log.info(
      "[LOVEC] Memory monitor result (" + memMonitorCount + ")"
        + "\n- Sample points: " + memUseData.length
        + "\n- Mean sample points: " + memUseMeanData.length
        + "\n- Memory use mean: " + Strings.fixed(memUseMeanData.mean(), 3) + " MB"
        + "\n- Max memory used: " + _memUseMax() + " MB"
        + "\n- Memory increase slope: " + Strings.fixed(_memIncSlp(), 8)
        + "\n- Memory leak significance: " + Number(_memLeakSig()).perc(3)
    );
    memMonitorCount++;
  };
  exports._i_memMonitor = _i_memMonitor;


  const _i_memMonitorStart = function() {
    Log.info("[LOVEC] Memory monitor started.");
  };
  exports._i_memMonitorStart = _i_memMonitorStart;


  const _i_memMonitorEnd = function() {
    Log.info("[LOVEC] Memory monitor ended.");
  };
  exports._i_memMonitorEnd = _i_memMonitorEnd;


  const _i_memMonitorInit = function() {
    Log.info("[LOVEC] Memory monitor initialized.");
  };
  exports._i_memMonitorInit = _i_memMonitorInit;


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onUpdate(() => {
    if(PARAM.enableMemoryMonitor) {


      if(Vars.state.isGame()) {

        if(!memMonitorInit) initMemMonitor();
        if(!memMonitorRunning) {
          _i_memMonitorStart();
          memMonitorRunning = true;
        };
        if(_memUse() > memUseMax) memUseMax = _memUse();
        if(TIMER.timerState_memUse) memUseData.push(_memUse());
        if(TIMER.timerState_memUseMean) memUseMeanData.push(_memUseMean());
        if(TIMER.timerState_memPrint) _i_memMonitor();


      } else {


        if(memMonitorRunning) {
          _i_memMonitorEnd();
          memMonitorRunning = false;
          memMonitorInit = false;
        };


      };


    } else {


      if(memMonitorRunning) {
        _i_memMonitorEnd();
        memMonitorRunning = false;
        memMonitorInit = false;
      };


    };
  }, 75912248);
