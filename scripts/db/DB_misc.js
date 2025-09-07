// NOTE: Be careful with any module here to avoid looped reference!
const PINYIN = require("lovec/lib/pinyin");
const MDL_bundle = require("lovec/mdl/MDL_bundle");
const MDL_cond = require("lovec/mdl/MDL_cond");


const db = {


  "block": {


    /* ----------------------------------------
     * NOTE:
     *
     * Extra text information shown when mouse hovered over a tile.
     * Put functions that return string here to build final string. Yep string only.
     * Tile won't be {null} here. It's safe to return {undefined} or {null}.
     * Format: {(t, b) => str}.
     * ---------------------------------------- */
    "extraInfo": [

      // Ore item info
      (t, b) => {
        let itm = t.wallDrop() || t.drop();
        if(itm == null) return;

        var str = ""
        + (MDL_cond._isDepthOre(t.overlay()) ? "" : (MDL_bundle._term("lovec", "ore") + ": " + Strings.stripColors(itm.localizedName) + "\n"))
        + MDL_bundle._term("lovec", "ore-hardness") + ": " + itm.hardness + "\n";

        return str;
      },

      // Ore liquid info
      (t, b) => {
        let liq = t.floor().liquidDrop;
        if(liq == null) return;

        var str = ""
        + MDL_bundle._term("lovec", "liquid") + ": " + Strings.stripColors(liq.localizedName)
        + "\n"
        + MDL_bundle._term("lovec", "liquid-multiplier") + ": " + t.floor().liquidMultiplier.perc()
        + "\n";

        return str;
      },

      // Conveyor info
      (t, b) => {
        if(b == null || b.items == null || (!(b.block instanceof Conveyor) && !(b.block instanceof Duct) && !(b.block instanceof StackConveyor))) return;
        let itm = b.items.first();
        if(itm == null) return;

        var str = ""
        + MDL_bundle._term("lovec", "item") + ": " + Strings.stripColors(itm.localizedName) + "\n";

        return str;
      },

    ],


    "nodeLinkFilter": [

      "any", (b, b_t) => true,

      "cons", (b, b_t) => MDL_cond._isPowTrans(b.block) && !MDL_cond._isPowTrans(b_t.block),

      "trans", (b, b_t) => MDL_cond._isPowTrans(b.block) && MDL_cond._isPowTrans(b_t.block),

      "self", (b, b_t) => b.block === b_t.block,

      "node", (b, b_t) => MDL_cond._isPowNode(b.block) && MDL_cond._isPowNode(b_t.block),

      "relay", (b, b_t) => MDL_cond._isPowRelay(b_t.block),

      "remote-node", (b, b_t) => MDL_cond._isPowRelay(b_t.block) || b.block === b_t.block,

    ],


  },


  "mod": {


    /* ----------------------------------------
     * NOTE:
     *
     * @CONTENTGEN
     * List of names of Lovec-based mods.
     * {PARAM.modded} will be {true} if any of these exists, which enables extra mechanics.
     * You don't need put your mod name here, just use write {dependencies} or {softDependencies} in your mod.json.
     * ---------------------------------------- */
    "lovecMod": [],


  },


  /* ----------------------------------------
   * NOTE:
   *
   * Used to generate new key bindings.
   * Format: {nm, keyCode, categ}.
   * ---------------------------------------- */
  "keyBind": [

    "lovec-setting-toggle-win", KeyCode.semicolon, "lovec",
    "lovec-setting-toggle-unit-stat", KeyCode.unset, "lovec",
    "lovec-setting-toggle-damage-display", KeyCode.unset, "lovec",

    "lovec-player-drop-loot", KeyCode.l, "lovec",
    "lovec-player-take-loot", KeyCode.k, "lovec",

  ],


  /* ----------------------------------------
   * NOTE:
   *
   * List of config names and their value getters.
   * Used in {MDL_util._cfg}.
   * ---------------------------------------- */
  "config": [

    "test-draw", useScl => Core.settings.getBool("lovec-test-draw", false),
    "test-memory", useScl => Core.settings.getBool("lovec-test-memory", false),

    "load-colored-name", useScl => Core.settings.getBool("lovec-load-colored-name", true),
    "load-force-modded", useScl => Core.settings.getBool("lovec-load-force-modded", false),

    "interval-efficiency", useScl => Core.settings.getInt("lovec-interval-efficiency", 5) * (useScl ? 6.0 : 1.0),

    "draw-wobble", useScl => Core.settings.getBool("lovec-draw-wobble", false),
    "draw0loot-static", useScl => Core.settings.getBool("lovec-draw0loot-static", true),
    "draw0loot-amount", useScl => Core.settings.getBool("lovec-draw0loot-amount", true),
    "draw0tree-alpha", useScl => Core.settings.getInt("lovec-draw0tree-alpha", 10) * (useScl ? 0.1 : 1.0),
    "draw0tree-player", useScl => Core.settings.getBool("lovec-draw0tree-player", true),
    "draw0aux-extra-info", useScl => Core.settings.getBool("lovec-draw0aux-extra-info", true),
    "draw0aux-bridge", useScl => Core.settings.getBool("lovec-draw0aux-bridge", true),
    "draw0aux-router", useScl => Core.settings.getBool("lovec-draw0aux-router", true),
    "draw0aux-scanner", useScl => Core.settings.getBool("lovec-draw0aux-scanner", true),
    "draw0aux-fluid-heat", useScl => Core.settings.getBool("lovec-draw0aux-fluid-heat", true),

    "icontag-flicker", useScl => Core.settings.getBool("lovec-icontag-flicker", true),
    "icontag-interval", useScl => Core.settings.getInt("lovec-icontag-interval", 4) * (useScl ? 10.0 : 1.0),

    "damagedisplay-show", useScl => Core.settings.getBool("lovec-damagedisplay-show", true),
    "damagedisplay-min", useScl => Core.settings.getInt("lovec-damagedisplay-min", 0) * (useScl ? 20.0 : 1.0),

    "unit0stat-show", useScl => Core.settings.getBool("lovec-unit0stat-show", true),
    "unit0stat-player", useScl => Core.settings.getBool("lovec-unit0stat-player", true),
    "unit0stat-reload", useScl => Core.settings.getBool("lovec-unit0stat-reload", true),
    "unit0stat-missile", useScl => Core.settings.getBool("lovec-unit0stat-missile", false),
    "unit0stat-build", useScl => Core.settings.getBool("lovec-unit0stat-build", true),
    "unit0stat-mouse", useScl => Core.settings.getBool("lovec-unit0stat-mouse", true),
    "unit0stat-minimalistic", useScl => Core.settings.getBool("lovec-unit0stat-minimalistic", false),
    "unit0remains-lifetime", useScl => Core.settings.getInt("lovec-unit0remains-lifetime", 12) * (useScl ? 300.0 : 1.0),

    "window-show", useScl => Core.settings.getBool("lovec-window-show", true),

    "misc-secret-code", useScl => Core.settings.getString("lovec-misc-secret-code", ""),

  ],


  "search": {


    "tag": [

      "no:", (ct, str) => !ct.name.toLowerCase().includes(str) && !Strings.stripColors(ct.localizedName).toLowerCase().includes(str) && (!Core.settings.getString("locale") === "zh_CN" || !PINYIN.get(Strings.stripColors(ct.localizedName)).toLowerCase().includes(str)),

      "mod:", (ct, str) => ct.minfo.mod !== null && ct.minfo.mod.name === str,

      "hardness:", (ct, str) => ct instanceof Item && ct.hardness == str,

    ],


  },


  "recipe": {


    /* ----------------------------------------
     * NOTE:
     *
     * Used to read a particular consumer.
     * Format: {cls, (blk, cons, dictConsItm, dictConsFld) => {...}}.
     * ---------------------------------------- */
    "consumeReader": [

      /* <---------- item ----------> */

      ConsumeItemFilter, (blk, cons, dictConsItm, dictConsFld) => {
        Vars.content.items().each(itm => {
          if(blk.itemFilter[itm.id]) dictConsItm[itm.id].push(blk, 1, {});
        });
      },

      ConsumeItems, (blk, cons, dictConsItm, dictConsFld) => {
        cons.items.forEach(itmStack => dictConsItm[itmStack.item.id].push(blk, itmStack.amount, {"icon": cons.optional ? "lovec-icon-optional" : null}));
      },

      ConsumeItemFlammable, (blk, cons, dictConsItm, dictConsFld) => {
        Vars.content.items().each(itm => itm.flammability >= cons.minFlammability, itm => dictConsItm[itm.id].push(blk, 1, {}));
      },

      ConsumeItemExplosive, (blk, cons, dictConsItm, dictConsFld) => {
        Vars.content.items().each(itm => itm.explosiveness >= cons.minExplosiveness && !(consFlam != null && itm.flammability >= consFlam.minFlammability), itm => dictConsItm[itm.id].push(blk, 1, {}));
      },

      ConsumeItemRadioactive, (blk, cons, dictConsItm, dictConsFld) => {
        Vars.content.items().each(itm => itm.radioactivity >= cons.minRadioactivity, itm => dictConsItm[itm.id].push(blk, 1, {}));
      },

      ConsumeItemCharged, (blk, cons, dictConsItm, dictConsFld) => {
        Vars.content.items().each(itm => itm.charge >= cons.minCharge, itm => dictConsItm[itm.id].push(blk, 1, {}));
      },

      ConsumeItemExplode, (blk, cons, dictConsItm, dictConsFld) => {
        // Do nothing
      },

      /* <---------- liquid ----------> */

      ConsumeLiquidFilter, (blk, cons, dictConsItm, dictConsFld) => {
        Vars.content.liquids().each(liq => {
          if(blk.liquidFilter[liq.id]) dictConsFld[liq.id].push(blk, cons.amount, {});
        });
      },

      ConsumeLiquid, (blk, cons, dictConsItm, dictConsFld) => {
        if(blk instanceof LandingPad) {
          // NOTE: Why it is not another consumer class...
          dictConsFld[blk.consumeLiquid.id].push(blk, blk.consumeLiquidAmount / blk.cooldownTime, {});
        } else {
          dictConsFld[cons.liquid.id].push(blk, cons.amount, {"icon": cons.optional ? "lovec-icon-optional" : null});
        };
      },

      ConsumeLiquids, (blk, cons, dictConsItm, dictConsFld) => {
        cons.liquids.forEach(liqStack => dictConsFld[liqStack.liquid.id].push(blk, liqStack.amount, {"icon": cons.optional ? "lovec-icon-optional" : null}));
      },

      ConsumeCoolant, (blk, cons, dictConsItm, dictConsFld) => {
        Vars.content.liquids().each(liq => liq.coolant && (!liq.gas && cons.allowLiquid || liq.gas && cons.allowGas) && liq.temperature <= cons.maxTemp && liq.flammability < cons.maxFlammability, liq => {
          dictConsFld[liq.id].push(blk, cons.amount, {"icon": "lovec-icon-coolant"});
        });
      },

      ConsumeLiquidFlammable, (blk, cons, dictConsItm, dictConsFld) => {
        Vars.content.liquids().each(liq => liq.flammability >= cons.minFlammability, liq => dictConsFld[liq.id].push(blk, cons.amount, {}));
      },

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Used to read a particular class of blocks to get production list.
     * Format: {cls, (blk, dictProdItm, dictProdFld) => {...}}.
     * ---------------------------------------- */
    "produceReader": [

      Drill, (blk, dictProdItm, dictProdFld) => {
        Vars.content.items().each(itm => itm.hardness <= blk.tier && !(blk.blockedItems != null && blk.blockedItems.contains(itm)) && Vars.content.blocks().toArray().some(oblk => ((oblk instanceof Floor && !(oblk instanceof OverlayFloor)) || (oblk instanceof OverlayFloor && !oblk.wallOre)) && oblk.itemDrop === itm), itm => dictProdItm[itm.id].push(blk, Math.pow(blk.size, 2) * (blk instanceof BurstDrill ? 1.0 : blk.drillTime / blk.getDrillTime(itm)), {"icon": "lovec-icon-mining"}));
      },

      BeamDrill, (blk, dictProdItm, dictProdFld) => {
        Vars.content.items().each(itm => itm.hardness <= blk.tier && !(blk.blockedItems != null && blk.blockedItems.contains(itm)) && Vars.content.blocks().toArray().some(oblk => (oblk instanceof Prop || oblk instanceof TallBlock || (oblk instanceof OverlayFloor && oblk.wallOre)) && oblk.itemDrop === itm), itm => dictProdItm[itm.id].push(blk, blk.size, {"icon": "lovec-icon-mining"}));
      },

      WallCrafter, (blk, dictProdItm, dictProdFld) => {
        dictProdItm[blk.output.id].push(blk, 1, {"icon": "lovec-icon-mining"});
      },

      Pump, (blk, dictProdItm, dictProdFld) => {
        Vars.content.liquids().each(liq => Vars.content.blocks().toArray().some(blk => blk instanceof Floor && blk.liquidDrop === liq), liq => dictProdFld[liq.id].push(blk, blk.pumpAmount * Math.pow(blk.size, 2), {"icon": "lovec-icon-pumping"}));
      },

      SolidPump, (blk, dictProdItm, dictProdFld) => {
        dictProdFld[blk.result.id].push(blk, blk.pumpAmount * Math.pow(blk.size, 2), {"icon": "lovec-icon-pumping"});
      },

      ConsumeGenerator, (blk, dictProdItm, dictProdFld) => {
        if(blk.outputLiquid != null) dictProdFld[blk.outputLiquid.liquid.id].push(blk, blk.outputLiquid.amount, {});
      },

      ThermalGenerator, (blk, dictProdItm, dictProdFld) => {
        if(blk.outputLiquid != null) dictProdFld[blk.outputLiquid.liquid.id].push(blk, blk.outputLiquid.amount * Math.pow(blk.size, 2), {});
      },

      GenericCrafter, (blk, dictProdItm, dictProdFld) => {
        if(blk.outputItems != null) blk.outputItems.forEach(itmStack => dictProdItm[itmStack.item.id].push(blk, itmStack.amount, {}));
        if(blk.outputLiquids != null) blk.outputLiquids.forEach(liqStack => dictProdFld[liqStack.liquid.id].push(blk, liqStack.amount, {}));
      },

    ],


  },


  "lsav": {


    /* ----------------------------------------
     * NOTE:
     *
     * Properties that is saved in a .lsav file.
     * Format: {header, def, arrMode}.
     * ---------------------------------------- */
    "header": [

      "useless-field", "ohno", null,

      "dynamic-pollution", 0.0, null,
      "bits", [], "string",
      "bit-hash", 48.0, null,

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Properties here are safe (or required) to be set by client sides.
     * ---------------------------------------- */
    "safe": [

      "bits",
      "bit-hash",

    ],


  },


  "texture": {


    /* ----------------------------------------
     * NOTE:
     *
     * Icons polulated in {VARGEN.icons}.
     * Format: {nm, nmReg}.
     * ---------------------------------------- */
    "icon": [

      "ohno", "error",

      "check", "lovec-icon-check",
      "cross", "lovec-icon-cross",
      "harvest", "lovec-icon-harvest",
      "play", "lovec-icon-play",
      "questionMark", "lovec-icon-question-mark",
      "swap", "lovec-icon-swap",

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Icons polulated in {VARGEN.noiseTexs}.
     * Format: {nm, path}.
     * ---------------------------------------- */
    "noise": [

      "caustics", "sprites/caustics.png",
      "clouds", "sprites/clouds.png",
      "distortAlpha", "sprites/distortAlpha.png",
      "fog", "sprites/fog.png",
      "noise", "sprites/noise.png",
      "noiseAlpha", "sprites/noiseAlpha.png",

    ],


  },


  "drama": {


    "chara": {


      /* ----------------------------------------
       * NOTE:
       *
       * The color used for a character.
       * Format: {nmMod, chara, colorStr}.
       * ---------------------------------------- */
      "color": [],


    },


  },


};


Object.mergeDB(db, "DB_misc");


Vars.mods.eachEnabled(mod => {
  if(mod.meta.dependencies.contains("lovec") || mod.meta.softDependencies.contains("lovec")) db["mod"]["lovecMod"].push(mod.name);
});


exports.db = db;
