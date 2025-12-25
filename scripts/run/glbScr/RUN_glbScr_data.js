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


  LOVEC_REVISION = 2;
  MOD_REVISION = {};                // For other mods


  /* ----------------------------------------
   * NOTE:
   *
   * Used for read & write.
   * ---------------------------------------- */
  processRevision = function(wr0rd, nmMod) {
    if(wr0rd instanceof Writes) {
      let revi = nmMod == null ?
        LOVEC_REVISION :
        MOD_REVISION[nmMod];
      wr0rd.s(revi);
      return revi;
    } else {
      return global.lovec.param.secret_revisionFix ?
        0 :
        wr0rd.s();
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * For quick definition of {ex_processData}.
   * ---------------------------------------- */
  processData = function(wr0rd, revi, wrArrowFun, rdArrowFun) {
    wr0rd instanceof Writes ?
      wrArrowFun(wr0rd, revi) :
      rdArrowFun(wr0rd, revi);
  };
