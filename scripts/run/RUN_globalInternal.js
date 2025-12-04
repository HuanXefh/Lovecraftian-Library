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


    prop: {


      locale: Core.settings.getString("locale"),


      debug: (function() {
        if(Core.settings.getString("lovec-misc-secret-code", "").includes("<anuke-mode>")) {
          Log.info("[LOVEC] " + "Debug mode".color(Pal.accent) + " is enabled.");
          return true;
        } else {
          return false;
        };
      })(),


    },


    fun: {


      /* ----------------------------------------
       * NOTE:
       *
       * Gets current planet as string.
       * ---------------------------------------- */
      _plaCur() {
        let nm = "";
        if(!Vars.state.isMenu() && Vars.state.getPlanet() != null) {
          nm = Vars.state.getPlanet().name;
        };

        return nm;
      },


      /* ----------------------------------------
       * NOTE:
       *
       * Gets current map as string.
       * ---------------------------------------- */
      _mapCur() {
        let nm = "";
        if(!Vars.state.isMenu()) {
          if(Vars.state.sector != null && Vars.state.sector.preset != null) {
            nm = Vars.state.sector.preset.name;
          } else if(Vars.state.map != null) {
            nm = Vars.state.map.plainName();
          };
        };

        return nm;
      },


      /* ----------------------------------------
       * NOTE:
       *
       * Bypasses {MDL_content} to resolve module coupling.
       * This one is less stable and won't warn, do not abuse it! Use {global.lovec.mdl_content._ct} instead whenever possible.
       * ---------------------------------------- */
      _ct(ct_gn, ctTpStr) {
        if(ct_gn == null) return null;
        if(ct_gn instanceof UnlockableContent) return ct_gn;

        return ctTpStr == null ?
          Vars.content.byName(ct_gn) :
          Vars.content.getByName(ContentType[ctTpStr], ct_gn);
      },


      _glbHeat() {
        let nmPla = global.lovecUtil.fun._plaCur();
        if(nmPla === "") return 26.0;
        let nmMap = Vars.state.map.plainName();

        return global.lovec.db_env.db["param"]["map"]["heat"].read(
          nmMap,
          global.lovec.db_env.db["param"]["pla"]["heat"].read(nmPla, 0.26)
        ) * 100.0;
      },


    },


    db: {


      oreDict: new ObjectMap(),


      lovecUnits: [],


      keyBindListener: [],


      abilitySetter: [],


      aiSetter: [],


      drawerSetter: [],


      consumerSetter: [],


      dialogGetter: [],


    },


  };
