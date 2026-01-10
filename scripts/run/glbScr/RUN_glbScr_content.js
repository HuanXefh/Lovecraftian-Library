/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Adds global methods that are used to modify contents.
   * Does not provide methods to create contents like block, unit type, etc. See {RUN_glbScr_extend} instead.
   *
   * {newXxx} is used to create and register some content.
   * {fetchXxx} is used to get the content created by {newXxx}.
   * {setXxx} is used to modify existing contents, where {fetchXxx} is frequently called.
   * ---------------------------------------- */


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


  /* <---------- set ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used to overwrite block flags.
   * ---------------------------------------- */
  resetBlockFlag = function(blk, flags) {
    blk.flags = EnumSet.of.apply(null, flags);
    if(blk.fogRadius > 0) blk.flags.with(BlockFlag.hasFogRadius);
    if(blk.sync) blk.flags.with(BlockFlag.synced);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * This content will be only unlockable by calling {ct.unlock()}.
   * Mostly used for contents that has a tech tree node but cannot be researched.
   * Should be called on INIT.
   * ---------------------------------------- */
  lockTechNode = function(ct) {
    if(ct.techNode == null) return;
    ct.techNode.objectives.add(extend(Objectives.Objective, {
      complete() {
        return false;
      },
      display() {
        Core.bundle.get("info.lovec-info-no-unlock.name");
      },
    }));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set weapons for some unit in JS.
   * Format for {getter}: {wpsOld => wpsNew}.
   * ---------------------------------------- */
  setWeapon = function(utp, getter) {
    Events.run(ContentInitEvent, () => {
      let wps = utp.weapons.toArray();
      try{
        utp.weapons = getter(wps).pullAll(null).flatten().toSeq();
      } catch(err) {
        Log.err("[LOVEC] Failed to set weapons for [$1]\n".format(utp.name.color(Pal.accent)) + err);
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set abilities of some unit in JS.
   * Format for {getter}: {abisOld => abisNew}.
   * ---------------------------------------- */
  setAbility = function(utp, getter) {
    Events.run(ClientLoadEvent, () => {
      let abis = utp.abilities.toArray();
      try{
        utp.abilities = getter(abis).pullAll(null).flatten().toSeq();
      } catch(err) {
        Log.err("[LOVEC] Failed to set abilities for [$1]:\n".format(utp.name.color(Pal.accent)) + err);
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set AI controller of some unit in JS.
   * Format for {getter}: {unit => ai}.
   * ---------------------------------------- */
  setAi = function(utp, getter) {
    Events.run(ClientLoadEvent, () => {
      try{
        utp.controller = func(getter);
      } catch(err) {
        Log.err("[LOVEC] Failed to set AI controller for [$1]:\n".format(utp.name.color(Pal.accent)) + err);
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set drawers of some block in JS.
   * Format for {getter}: {drawersOld => drawersNew}.
   * ---------------------------------------- */
  setDrawer = function(blk, getter) {
    Events.run(ClientLoadEvent, () => {
      if(blk.drawer == null) {
        Log.warn("[LOVEC] Can't find field [$1] in [$2]!".format("drawer".color(Pal.accent), blk.name.color(Pal.accent)));
        return;
      };

      let drawers = blk.drawer instanceof DrawMulti ? blk.drawer.drawers.cpy() : [blk.drawer];
      try {
        blk.drawer = new DrawMulti(getter(drawers).pullAll(null).flatten().toSeq());
        if(!Vars.headless) blk.drawer.load(blk);
      } catch(err) {
        Log.err("[LOVEC] Failed to set drawers for [$1]:\n".format(blk.name.color(Pal.accent)) + err);
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set consumers of some block in JS, can be called in {blk.init}.
   * Format for {getter}: {conssOld => conssNew}.
   * ---------------------------------------- */
  setConsumer = function(blk, getter) {
    Events.run(ClientLoadEvent, () => {
      let
        conss = getter(blk.consumers).pullAll(null).flatten(),
        conssNew = conss.cpy().pullAll(blk.consumers);

      blk.consumers = conss;
      blk.optionalConsumers = conss.filter(consX => consX.optional && !consX.ignore());
      blk.nonOptionalConsumers = conss.filter(consX => !consX.optional && !consX.ignore());
      blk.updateConsumers = conss.filter(consX => consX.update && !consX.ignore());
      blk.hasConsumers = conss.length > 0;

      conssNew.forEachFast(consX => consX.apply(blk));
    });
  };


  /* <---------- fetch ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a mod by name, by default it should be a loaded one.
   * ---------------------------------------- */
  fetchMod = function(nmMod, ignoreEnabled) {
    return nmMod === "vanilla" ?
      null :
      ignoreEnabled ?
        Vars.mods.getMod(nmMod) :
        Vars.mods.locateMod(nmMod);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to load texture region.
   * ---------------------------------------- */
  fetchRegion = function(ct_gn, suffix, suffixFallback) {
    let nm = ct_gn instanceof Content ? ct_gn.name : ct_gn;
    if(suffix == null) suffix = "";
    if(suffixFallback == null) suffixFallback = "";

    return Vars.headless ?
      null :
      Core.atlas.find(nm + suffix, Core.atlas.find(nm + suffixFallback));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to load sound.
   * ---------------------------------------- */
  fetchSound = function(se_gn, returnUnset) {
    return se_gn instanceof Sound ?
      se_gn :
      typeof se_gn === "string" ?
        Vars.tree.loadSound(se_gn) :
        returnUnset ?
          Sounds.unset :
          Sounds.none;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to load music.
   * ---------------------------------------- */
  fetchMusic = function(mus_gn) {
    return mus_gn instanceof Music ?
      mus_gn :
      typeof mus_gn === "string" ?
        Vars.tree.loadMusic(mus_gn) :
        Musics.none;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a weapon built from some registered weapon template.
   * ---------------------------------------- */
  fetchWeapon = function(nm, paramObj) {
    let temp = global.lovecUtil.db.weaponTemplate.read(nm);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", nm);
    return temp.build(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a bullet type built from some registered bullet template.
   * ---------------------------------------- */
  fetchBullet = function(nm, paramObj) {
    let temp = global.lovecUtil.db.bulletTemplate.read(nm);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", nm);
    return temp.build(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a part built from some registered part template.
   * ---------------------------------------- */
  fetchPart = function(nm, paramObj) {
    let temp = global.lovecUtil.db.partTemplate.read(nm);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", nm);
    return temp.build(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets an ability from registered ability getter functions.
   * ---------------------------------------- */
  fetchAbility = function(nm, paramObj) {
    return global.lovecUtil.db.abilitySetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets an AI from registered AI getter functions.
   * ---------------------------------------- */
  fetchAi = function(nm, paramObj) {
    return global.lovecUtil.db.aiSetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a drawer from registered drawer getter functions.
   * ---------------------------------------- */
  fetchDrawer = function(nm, paramObj) {
    return global.lovecUtil.db.drawerSetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a consumer from registered consumer getter functions.
   * ---------------------------------------- */
  fetchConsumer = function(nm, paramObj) {
    return global.lovecUtil.db.consumerSetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a dialog by name from registered ones.
   * ---------------------------------------- */
  fetchDialog = function(nm) {
    return global.lovecUtil.db.dialogGetter.read(nm, global.lovecUtil.db.dialogGetter.read("def"));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a dialog flow by name from registered ones.
   * ---------------------------------------- */
  fetchDialogFlow = function(nm) {
    return global.lovecUtil.db.dialFlow.read(nm, Array.air);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a setting value (must be registed through {CLS_settingTerm}).
   * ---------------------------------------- */
  fetchSetting = function(nm, useScl) {
    return global.lovecUtil.db.settingTerm.read(nm, Function.airNull)(useScl);
  };


  /* <---------- register ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used for stat value, where JavaScript arrow functions won't work.
   * ---------------------------------------- */
  newStatValue = function(tableF) {
    return new StatValue() {
      display(tb) {
        tableF(tb);
      },
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a weapon template.
   * Format for {tempGetter}: {() => temp}.
   * ---------------------------------------- */
  newWeaponTemplate = function(nm, tempGetter) {
    if(global.lovecUtil.db.weaponTemplate.includes(nm)) return;
    global.lovecUtil.db.weaponTemplate.push(nm, tempGetter());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a bullet template.
   * Format for {tempGetter}: {() => temp}.
   * ---------------------------------------- */
  newBulletTemplate = function(nm, tempGetter) {
    if(global.lovecUtil.db.bulletTemplate.includes(nm)) return;
    global.lovecUtil.db.bulletTemplate.push(nm, tempGetter());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a part template.
   * Format for {tempGetter}: {() => temp}.
   * ---------------------------------------- */
  newPartTemplate = function(nm, tempGetter) {
    if(global.lovecUtil.db.partTemplate.includes(nm)) return;
    global.lovecUtil.db.partTemplate.push(nm, tempGetter());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers an ability setter.
   * Format for {getter}: {paramObj => abi}.
   * ---------------------------------------- */
  newAbility = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.abilitySetter.includes(nm)) return;
      global.lovecUtil.db.abilitySetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers an AI controller setter.
   * Format for {getter}: {paramObj => ctrl}.
   * ---------------------------------------- */
  newAi = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.aiSetter.includes(nm)) return;
      global.lovecUtil.db.aiSetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a drawer.
   * Format for {getter}: {paramObj => drawer}.
   * ---------------------------------------- */
  newDrawer = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.drawerSetter.includes(nm)) return;
      global.lovecUtil.db.drawerSetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a consumer.
   * Format for {getter}: {paramObj => cons}.
   * ---------------------------------------- */
  newConsumer = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.consumerSetter.includes(nm)) return;
      global.lovecUtil.db.consumerSetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a dialog.
   * Format for {getter}: {() => dial}.
   * ---------------------------------------- */
  newDialog = function(nm, getter) {
    Events.run(ClientLoadEvent, () => {
      if(global.lovecUtil.db.dialogGetter.includes(nm)) return;
      global.lovecUtil.db.dialogGetter.push(nm, getter());
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a key binding.
   * Format for {scr}: {unit_pl => {...}}.
   * ---------------------------------------- */
  newKeyBind = function(nm, keyCodeDef, categ, scr) {
    Events.run(ClientLoadEvent, () => {
      Core.app.post(() => {
        global.lovec.varGen.addKeyBind(nm, keyCodeDef, categ);
        let keyBind = global.lovec.varGen.bindings[nm];
        if(global.lovecUtil.db.keyBindListener.includes(keyBind)) return;
        global.lovecUtil.db.keyBindListener.push(keyBind, scr);
      });
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a dialog flow.
   * ---------------------------------------- */
  newDialogFlow = function(nm, dialFlowArr) {
    Events.run(ContentInitEvent, () => {
      if(global.lovecUtil.db.dialFlow.includes(nm)) return;
      global.lovecUtil.db.dialFlow.push(nm, dialFlowArr);
    });
  };
