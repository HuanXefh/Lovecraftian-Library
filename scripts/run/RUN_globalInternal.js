/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up the structure of global object before definition.
   * {global.lovecUtil} is used internally.
   * {global.lovec} is used for testing in console, which is created in {RUN_global}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  global.lovecUtil = {


    fun: {


      /* ----------------------------------------
       * NOTE:
       *
       * Bypasses {MDL_content} to resolve module coupling.
       * This one is less stable and won't warn, do not abuse it!
       * ---------------------------------------- */
      _ct(ct_gn, ctTpStr) {
        if(ct_gn == null) return null;
        if(ct_gn instanceof UnlockableContent) return ct_gn;

        return ctTpStr == null ?
          Vars.content.byName(ct_gn) :
          Vars.content.getByName(ContentType[ctTpStr], ct_gn);
      },


    },


    db: {


      abilitySetter: [],


    },


  };
