// NOTE: Be careful with any module here to avoid looped reference!
const MDL_cond = require("lovec/mdl/MDL_cond");


const db = {


  "block": {


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
    "draw0shadow-blurred", useScl => Core.settings.getBool("lovec-draw0shadow-blurred", true),
    "draw0shadow-circle", useScl => Core.settings.getBool("lovec-draw0shadow-circle", false),
    "draw0tree-alpha", useScl => Core.settings.getInt("lovec-draw0tree-alpha", 10) * (useScl ? 0.1 : 1.0),
    "draw0tree-player", useScl => Core.settings.getBool("lovec-draw0tree-player", true),
    "draw0aux-bridge", useScl => Core.settings.getBool("lovec-draw0aux-bridge", true),
    "draw0aux-router", useScl => Core.settings.getBool("lovec-draw0aux-router", true),

    "icontag-show", useScl => Core.settings.getBool("lovec-icontag-show", true),
    "icontag-interval", useScl => Core.settings.getInt("lovec-icontag-interval", 4) * (useScl ? 10.0 : 1.0),

    "damagedisplay-show", useScl => Core.settings.getBool("lovec-damagedisplay-show", true),
    "damagedisplay-min", useScl => Core.settings.getInt("lovec-damagedisplay-min", 0) * (useScl ? 20.0 : 1.0),

    "unit0stat-show", useScl => Core.settings.getBool("lovec-unit0stat-show", true),
    "unit0stat-player", useScl => Core.settings.getBool("lovec-unit0stat-player", true),
    "unit0stat-reload", useScl => Core.settings.getBool("lovec-unit0stat-reload", true),
    "unit0stat-missile", useScl => Core.settings.getBool("lovec-unit0stat-missile", false),
    "unit0stat-build", useScl => Core.settings.getBool("lovec-unit0stat-build", true),
    "unit0stat-mouse", useScl => Core.settings.getBool("lovec-unit0stat-mouse", true),
    "unit0remains-lifetime", useScl => Core.settings.getInt("lovec-unit0remains-lifetime", 12) * (useScl ? 300.0 : 1.0),

  ],


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
        Vars.content.items().each(itm => itm.hardness <= blk.tier && !(blk.blockedItems != null && blk.blockedItems.contains(itm)) && Vars.content.blocks().toArray().some(oblk => (oblk instanceof Prop || (oblk instanceof OverlayFloor && oblk.wallOre)) && oblk.itemDrop === itm), itm => dictProdItm[itm.id].push(blk, blk.size, {"icon": "lovec-icon-mining"}));
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


  "reaction": {


    /* ----------------------------------------
     * NOTE:
     *
     * List of fluid reactants and the event called.
     * This is expected to be read without order.
     * Format: {reactant1, reactant2, [reaction, param]}.
     * ---------------------------------------- */
    "fluid": [

      "GROUP: water", "GROUP: hygroscopic", ["heat", 1.0],

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * For item reaction. The first reactant is item and second is fluid.
     * ---------------------------------------- */
    "item": [

      "ITEMGROUP: denaturing", "GROUP: air", ["denaturing", 1.0],

      "ITEMGROUP: alkali metal", "GROUP: water", ["explosion", 4.0],

      "ITEMGROUP: basic", "GROUP: acidic", ["heat", 1.5],
      "ITEMGROUP: acidic", "GROUP: basic", ["heat", 1.5],

    ],


    /* ----------------------------------------
     * NOTE:
     *
     * Target item in a denaturing reaction.
     * If {null} no item will be formed.
     * ---------------------------------------- */
    "denaturingTarget": [],


  },


};


Object.mergeDB(db, "DB_misc");


Vars.mods.eachEnabled(mod => {
  if(mod.meta.dependencies.contains("lovec") || mod.meta.softDependencies.contains("lovec")) db["mod"]["lovecMod"].push(mod.name);
});


exports.db = db;
