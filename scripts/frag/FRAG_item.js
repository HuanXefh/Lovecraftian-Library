/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_net = require("lovec/mdl/MDL_net");


  /* <---------- item module ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds item to {b} from {b_f}.
   * ---------------------------------------- */
  const addItem = function(b, b_f, itm, amt, p, isForced) {
    if(b == null || itm == null) return false;
    if(b.items == null || (!isForced && !b.acceptItem(b_f, itm))) return false;

    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;

    var bool = false;
    for(let i = 0; i < amt; i++) {
      if(!isForced && !b.acceptItem(b_f, itm)) break;

      if(Mathf.chance(p)) {
        b.offload(itm);
        bool = true;
      };
    };
    Call.setItem(b, itm, b.items.get(itm));

    return bool;
  };
  exports.addItem = addItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets {b} transfer items to {b_t}.
   * ---------------------------------------- */
  const transItem = function(b, b_t, itm, amt, p, isForced) {
    if(b == null || b_t == null || itm == null) return false;
    if(b.items == null || b_t.items == null || (!isForced && !b_t.acceptItem(b, itm))) return false;

    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;

    let amtCur = b.items.get(itm);
    let amtCur_t = b_t.items.get(itm);
    let amtTrans = Math.max(Math.min(Number(amt).randFreq(p), amtCur, b_t.block.itemCapacity - amtCur_t), 0);
    if(amtTrans < 1) return false;
    Call.setItem(b, itm, amtCur - amtTrans);
    Call.setItem(b_t, itm, amtCur_t + amtTrans);

    return true;
  };
  exports.transItem = transItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building consume some items.
   * ---------------------------------------- */
  const consumeItem = function(b, itm, amt, p) {
    if(b == null || itm == null) return false;
    if(b.items == null) return false;

    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;

    let amtTrans = Number(amt).randFreq(p);
    if(amtTrans < 1) return false;
    b.items.remove(itm, amtTrans);
    Call.setItem(b, itm, b.items.get(itm));

    return true;
  };
  exports.consumeItem = consumeItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building produce some items.
   * ---------------------------------------- */
  const produceItem = function(b, itm, amt, p) {
    if(b == null || itm == null) return false;
    if(b.items == null) return false;

    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;

    var bool = false;
    for(let i = 0; i < amt; i++) {
      if(Mathf.chance(p)) {
        b.offload(itm);
        bool = true;
      };
    };
    Call.setItem(b, itm, b.items.get(itm));

    return bool;
  };
  exports.produceItem = produceItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Set the amount of item in {b}.
   * ---------------------------------------- */
  const setItem = function(b, itm, amt) {
    if(b == null || itm == null) return false;
    if(b.items == null) return false;

    Call.setItem(b, itm, amt);

    return true;
  };
  exports.setItem = setItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Removes all items in {b}.
   * ---------------------------------------- */
  const clearItems = function(b) {
    if(b == null) return false;

    Call.clearItems(b);

    return true;
  };
  exports.clearItems = clearItems;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds items in a batch to {b}.
   * ---------------------------------------- */
  const addItemBatch = function(b, b_f, batch, isForced) {
    if(b == null || batch == null) return false;
    if(b.items == null) return false;

    let iCap = batch.iCap();
    if(iCap === 0) return false;
    var bool = false;
    for(let i = 0; i < iCap; i += 3) {
      let itm = MDL_content._ct(batch[i], "rs");
      let amt = batch[i + 1];
      let p = batch[i + 2];

      if(itm != null && itm instanceof Item) {
        if(addItem(b, b_f, itm, amt, p, isForced)) bool = true;
      };
    };

    return bool;
  };
  exports.addItemBatch = addItemBatch;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {b} can accept the item batch.
   * Use {mode} carefully, if set to {"any"}, some items may go to the void.
   * ---------------------------------------- */
  const acceptItemBatch = function(b, b_f, batch, mode) {
    const thisFun = acceptItemBatch;

    if(b == null || batch == null) return false;
    if(b.items == null) return false;

    if(mode == null) mode = "all";
    if(!mode.equalsAny(thisFun.modes)) return false;

    let iCap = batch.iCap();
    if(iCap === 0) return false;
    if(mode === "any") {

      for(let i = 0; i < iCap; i += 3) {
        let itm = MDL_content._ct(batch[i], "rs");

        if(itm != null && itm instanceof Item) {
          if(b.acceptItem(b_f, itm)) return true;
        };
      };

      return false;

    } else {

      for(let i = 0; i < iCap; i += 3) {
        let itm = MDL_content._ct(batch[i], "rs");

        if(itm != null && itm instanceof Item) {
          if(!b.acceptItem(b_f, itm)) return false;
        };
      };

      return true;

    };
  }
  .setProp({
    "modes": ["any", "all"],
  });
  exports.acceptItemBatch = acceptItemBatch;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building take items from a loot unit.
   * ---------------------------------------- */
  const takeLoot = function(b, loot, max, isForced) {
    if(b == null || loot == null) return false;
    if(b.items == null) return false;

    let itm = loot.item();
    if(itm == null || (!isForced && !b.acceptItem(b, itm))) return false;
    let amt = loot.stack.amount;
    if(amt < 1) return false;
    if(max == null) max = Infinity;

    var amtTrans = Math.max(Math.min(amt, b.block.itemCapacity - b.items.get(itm), max), 0);
    if(amtTrans < 1) return false;

    addItem(b, b, itm, amtTrans, 1.0, true);
    amtTrans < amt ? loot.stack.amount -= amtTrans : loot.remove();

    return true;
  };
  exports.takeLoot = takeLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building drops its item to spawn a loot.
   * ---------------------------------------- */
  const dropLoot = function(b, itm, max) {
    if(b == null || itm == null) return false;
    if(b.items == null) return false;

    if(max == null) max = Infinity;

    let amtCur = b.items.get(itm);
    let amtTrans = Math.min(amtCur, max);
    if(amtTrans < 1) return false;

    setItem(b, itm, amtCur - amtTrans);
    MDL_call.spawnLoot(b.x, b.y, itm, amtTrans, b.block.size * Vars.tilesize * 0.7);

    return true;
  };
  exports.dropLoot = dropLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building drops its item at (x, y) and spawn a loot there.
   * ---------------------------------------- */
  const dropLootAt = function(x, y, b, itm, max, ignoreLoot) {
    if(b == null || itm == null) return false;
    if(b.items == null) return false;

    if(max == null) max = Infinity;

    let amtCur = b.items.get(itm);
    let amtTrans = Math.min(amtCur, max);
    if(amtTrans < 1) return false;

    if(MDL_cond._posHasLoot(x, y) && !ignoreLoot) return false;
    setItem(b, itm, amtCur - amtTrans);
    MDL_call.spawnLoot(b.x, b.y, itm, amtTrans, b.block.size * Vars.tilesize * 0.7);

    return true;
  };
  exports.dropLootAt = dropLootAt;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building technically produce a loot.
   * ---------------------------------------- */
  const produceLoot = function(b, itm, amt) {
    if(b == null || itm == null) return false;
    if(b.items == null) return false;

    if(amt == null) amt = 0;
    if(amt < 1) return false;

    b.produced(itm, amt);
    MDL_call.spawnLoot(b.x, b.y, itm, amt, b.block.size * Vars.tilesize * 0.7);

    return true;
  };
  exports.produceLoot = produceLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building produce a loot at (x, y).
   * ---------------------------------------- */
  const produceLootAt = function(x, y, b, itm, amt, ignoreLoot) {
    if(b == null || itm == null) return false;
    if(b.items == null) return false;

    if(amt == null) amt = 0;
    if(amt < 1) return false;

    if(MDL_cond._posHasLoot(x, y) && !ignoreLoot) return false;
    b.produced(itm, amt);
    MDL_call.spawnLoot(x, y, itm, amt, 0.0);

    return true;
  };
  exports.produceLootAt = produceLootAt;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building converts the content of a loot.
   * This resets lifetime by default.
   * ---------------------------------------- */
  const convertLoot = function(b, loot, itm, amt, noReset) {
    if(b == null || loot == null || itm == null) return false;

    if(amt == null) amt = 0;
    if(amt < 1) {
      loot.remove()
    } else {
      if(!noReset) {
        MDL_call.spawnLoot(loot.x, loot.y, itm, amt, 0.0);
        loot.remove();
      } else {
        loot.stack.item = itm;
        loot.stack.amount = amt;
      };
      b.produced(itm, amt);
    };

    return true;
  };
  exports.convertLoot = convertLoot;


  /* <---------- unit item stack ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds items to {unit}. Will overwrite previous items the unit carries.
   * ---------------------------------------- */
  const addUnitItem = function(unit, itm, amt, p) {
    if(unit == null || itm == null) return false;

    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;

    let amtTrans = Number(amt).randFreq(p);
    if(amtTrans < 1) return false;

    unit.addItem(itm, amtTrans);

    return true;
  };
  exports.addUnitItem = addUnitItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Used for unit mining.
   * ---------------------------------------- */
  const addUnitItem_mine = function(unit, x, y, itm) {
    if(unit == null || itm == null) return false;

    Call.transferItemToUnit(itm, x, y, unit);

    return true;
  };
  exports.addUnitItem_mine = addUnitItem_mine;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit transfer its items to another unit.
   * ---------------------------------------- */
  const transUnitItem = function(unit, unit_t, amt, p) {
    if(unit == null || unit_t == null) return false;
    if(!unit_t.acceptsItem(unit.item())) return false;

    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;

    let amtTrans = Math.min(Number(amt).randFreq(p), unit.stack.amount);
    if(amtTrans < 1) return false;

    unit.stack.amount -= amtTrans;
    addUnitItem(unit_t, unit.item(), amtTrans);

    return true;
  };
  exports.transUnitItem = transUnitItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit take items from a building, the first item by default.
   * No need for effect.
   * ---------------------------------------- */
  const takeBuildItem = function(unit, b, itm, max) {
    if(unit == null || b == null) return false;
    if(b.items == null) return false;

    if(itm == null) itm = b.items.first();
    if(itm == null || !unit.acceptsItem(itm)) return false;
    if(max == null) max = Infinity;

    Call.takeItems(b, itm, max, unit);

    return true;
  };
  exports.takeBuildItem = takeBuildItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit drops its items to a building.
   * No need for effect.
   * ---------------------------------------- */
  const dropBuildItem = function(unit, b, max, alwaysClearStack) {
    if(unit == null || b == null) return false;
    if(b.items == null || !b.acceptItem(b, unit.item())) return false;

    if(max == null) max = Infinity;

    let amtTrans = Math.max(Math.min(unit.stack.amount, b.block.itemCapacity - b.items.get(unit.item()), max), 0);
    if(amtTrans < 1) return false;

    Call.transferItemTo(unit, unit.item(), amtTrans, unit.x, unit.y, b);
    if(alwaysClearStack) unit.clearItem();

    return true;
  };
  exports.dropBuildItem = dropBuildItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit take items from a loot unit.
   * ---------------------------------------- */
  const takeUnitLoot = function(unit, loot, max) {
    if(unit == null || loot == null) return false;

    let itm = loot.item();
    if(itm == null || !unit.acceptsItem(itm)) return false;
    let amt = loot.stack.amount;
    if(amt < 1) return false;
    if(max == null) max = Infinity;

    var amtTrans = Math.max(Math.min(amt, unit.itemCapacity() - unit.stack.amount, max), 0);
    if(amtTrans < 1) return false;

    addUnitItem(unit, itm, amtTrans);
    amtTrans < amt ? loot.stack.amount -= amtTrans : loot.remove();

    return true;
  };
  exports.takeUnitLoot = takeUnitLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {takeUnitLoot} used for client side.
   * ---------------------------------------- */
  const takeUnitLoot_client = function(unit, loot, max) {
    if(unit == null || loot == null) return false;

    let itm = loot.item();
    if(itm == null || !unit.acceptsItem(itm)) return false;
    let amt = loot.stack.amount;
    if(amt < 1) return false;
    if(max == null) max = Infinity;

    var amtTrans = Math.max(Math.min(amt, unit.itemCapacity() - unit.stack.amount, max), 0);
    if(amtTrans < 1) return false;

    let payload = Array.toPayload([
      unit.id,
      loot.id,
      max,
    ]);

    MDL_net.sendPacket("client", "lovec-client-unit-take-loot", payload, true, true);

    return true;
  }
  .setAnno(ANNO.__INIT__, null, function() {
    MDL_net.__packetHandler("server", "lovec-client-unit-take-loot", payload => {
      let arr = Array.fromPayload(payload);
      takeUnitLoot(Groups.unit.getById(arr[0]), Groups.unit.getById(arr[1]), arr[2]);
    });
  })
  .setAnno(ANNO.__CLIENT__);
  exports.takeUnitLoot_client = takeUnitLoot_client;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit drops its item to spawn a loot.
   * ---------------------------------------- */
  const dropUnitLoot = function(unit, max) {
    if(unit == null) return false;

    let itm = unit.item();
    if(itm == null) return false;
    if(max == null) max = Infinity;

    let amtTrans = Math.min(unit.stack.amount, max);
    if(amtTrans < 1) return false;

    unit.stack.amount -= amtTrans;
    MDL_call.spawnLoot(unit.x, unit.y, itm, amtTrans);

    return true;
  };
  exports.dropUnitLoot = dropUnitLoot;


  /* <---------- component ----------> */


  /* exposed */


  const comp_updateTile_exposed = function(b) {
    // TODO
  }
  .setTodo("Explosed item reaction.");
  exports.comp_updateTile_exposed = comp_updateTile_exposed;


  const comp_onDestroyed_exposed = function(b) {
    // TODO
  }
  .setTodo("How exposed reaction happens when building is dead.");
  exports.comp_onDestroyed_exposed = comp_onDestroyed_exposed;


  /* virtual */


  const comp_updateTile_virtual = function(b) {
    // TODO
  }
  .setTodo("Virtual item, bit, and how to boom conveyors.");
  exports.comp_updateTile_virtual = comp_updateTile_virtual;
