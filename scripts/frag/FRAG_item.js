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
  const MDL_reaction = require("lovec/mdl/MDL_reaction");


  /* <---------- item module ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Generic {offload}.
   * ---------------------------------------- */
  const offload = function(b, b_f, itm, amt, checkAccept) {
    if(amt == null) amt = 1;
    if(amt < 1) return false;

    var bool = false;
    for(let i = 0; i < amt; i++) {
      if(checkAccept && !b.acceptItem(b_f, itm)) break;
      b.offload(itm);
      bool = true;
    };

    return bool;
  };
  exports.offload = offload;


  /* ----------------------------------------
   * NOTE:
   *
   * {offload} called on server side only for sync.
   * ---------------------------------------- */
  const offload_server = function(b, b_f, itm, amt, checkAccept) {
    if(amt == null) amt = 1;
    if(amt < 1) return false;

    let payload = packPayload([
      b.pos(),
      b_f == null ? -1 : b_f.pos(),
      itm.name,
      amt,
      checkAccept,
    ]);

    MDL_net.sendPacket("server", "lovec-server-item-offload", payload);

    return offload(b, b_f, itm, amt, checkAccept);
  }
  .setAnno(ANNO.__INIT__, null, function() {
    MDL_net.__packetHandler("client", "lovec-server-item-offload", payload => {
      let args = unpackPayload(payload);

      offload(Vars.world.build(args[0]), Vars.world.build(args[1]), Vars.content.item(args[2]), args[3], args[4]);
    });
  })
  .setAnno(ANNO.__SERVER__);
  exports.offload_server = offload_server;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds item to {b} from {b_f}.
   * ---------------------------------------- */
  const addItem = function(b, b_f, itm, amt, p, isForced) {
    if(b.items == null || (!isForced && !b.acceptItem(b_f, itm))) return false;
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;

    let amtTrans = amt.randFreq(p);

    return Vars.net.client() ?
      amtTrans > 0 :
      offload_server(b, b_f, itm, amtTrans, !isForced);
  };
  exports.addItem = addItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets {b} transfer items to {b_t}.
   * ---------------------------------------- */
  const transItem = function(b, b_t, itm, amt, p, isForced) {
    if(b_t == null) return false;
    if(b.items == null || b_t.items == null || (!isForced && !b_t.acceptItem(b, itm))) return false;
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;

    let amtCur = b.items.get(itm);
    let amtCur_t = b_t.items.get(itm);
    let amtTrans = Mathf.maxZero(Math.min(amt.randFreq(p), amtCur, b_t.block.itemCapacity - amtCur_t));
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
    if(b.items == null) return false;
    if(amt == null) amt = 1;
    if(amt < 1 || b.items.get(itm) < amt) return false;
    if(p == null) p = 1.0;

    let amtTrans = amt.randFreq(p);
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
    if(b.items == null) return false;
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;

    let amtTrans = amt.randFreq(p);

    return Vars.net.client() ?
      amtTrans > 0 :
      offload_server(b, b, itm, amtTrans, false);
  };
  exports.produceItem = produceItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Set the amount of item in {b}.
   * ---------------------------------------- */
  const setItem = function(b, itm, amt) {
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
    if(b.items == null) return false;

    var bool = false;
    let itm;
    batch.forEachRow(3, (itm_gn, amt, p) => {
      itm = MDL_content._ct(itm_gn, "rs");
      if(itm == null) return;
      if(addItem(b, b_f, itm, amt, p, isForced)) bool = true;
    });

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

    if(b.items == null) return false;
    if(mode == null) mode = "all";
    if(!mode.equalsAny(thisFun.modes)) return false;

    let iCap = batch.iCap();
    if(iCap === 0) return false;

    let itm;
    if(mode === "any") {
      for(let i = 0; i < iCap; i += 3) {
        itm = MDL_content._ct(batch[i], "rs");
        if(itm != null && itm instanceof Item) {
          if(b.acceptItem(b_f, itm)) return true;
        };
      };

      return false;
    } else {
      for(let i = 0; i < iCap; i += 3) {
        itm = MDL_content._ct(batch[i], "rs");
        if(itm != null && itm instanceof Item) {
          if(!b.acceptItem(b_f, itm)) return false;
        };
      };

      return true;
    };
  }
  .setProp({
    modes: ["any", "all"],
  });
  exports.acceptItemBatch = acceptItemBatch;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building take items from a loot unit.
   * ---------------------------------------- */
  const takeLoot = function(b, loot, max, isForced) {
    if(loot == null || b.items == null) return false;

    let itm = loot.item();
    if(itm == null || (!isForced && !b.acceptItem(b, itm))) return false;
    let amt = loot.stack.amount;
    if(amt < 1) return false;
    if(max == null) max = Infinity;

    let amtTrans = Mathf.maxZero(Math.min(amt, b.block.itemCapacity - b.items.get(itm), max));
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


  /* ----------------------------------------
   * NOTE:
   *
   * Destroys a loot unit.
   * ---------------------------------------- */
  const destroyLoot = function(loot) {
    if(loot == null) return false;
    if(!MDL_cond._isLoot(loot)) return false;

    loot.remove();

    return true;
  };
  exports.destroyLoot = destroyLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {destroyLoot} used for client side.
   * ---------------------------------------- */
  const destroyLoot_client = function(loot) {
    if(loot == null) return false;
    if(!MDL_cond._isLoot(loot)) return false;

    let payload = packPayload([
      loot.id,
    ]);

    MDL_net.sendPacket("client", "lovec-client-destroy-loot", payload, true, true);

    return true;
  }
  .setAnno(ANNO.__INIT__, null, function() {
    MDL_net.__packetHandler("server", "lovec-client-destroy-loot", payload => {
      let arr = unpackPayload(payload);
      destroyLoot(Groups.unit.getById(arr[0]));
    });
  })
  .setAnno(ANNO.__CLIENT__)
  .setAnno(ANNO.__NONCONSOLE__);
  exports.destroyLoot_client = destroyLoot_client;


  /* <---------- unit item stack ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds items to {unit}. Will overwrite previous items the unit carries.
   * ---------------------------------------- */
  const addUnitItem = function(unit, itm, amt, p) {
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;

    let amtTrans = amt.randFreq(p);
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
    if(!unit_t.acceptsItem(unit.item())) return false;
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;

    let amtTrans = Math.min(amt.randFreq(p), unit.stack.amount);
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
    if(b.items == null || !b.acceptItem(b, unit.item())) return false;
    if(max == null) max = Infinity;

    let amtTrans = Mathf.maxZero(Math.min(unit.stack.amount, b.block.itemCapacity - b.items.get(unit.item()), max));
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
    if(loot == null) return false;
    let itm = loot.item();
    if(itm == null || !unit.acceptsItem(itm)) return false;
    let amt = loot.stack.amount;
    if(amt < 1) return false;
    if(max == null) max = Infinity;

    var amtTrans = Mathf.maxZero(Math.min(amt, unit.itemCapacity() - unit.stack.amount, max));
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
    if(loot == null) return false;
    let itm = loot.item();
    if(itm == null || !unit.acceptsItem(itm)) return false;
    let amt = loot.stack.amount;
    if(amt < 1) return false;
    if(max == null) max = Infinity;

    var amtTrans = Mathf.maxZero(Math.min(amt, unit.itemCapacity() - unit.stack.amount, max));
    if(amtTrans < 1) return false;

    let payload = packPayload([
      unit.id,
      loot.id,
      max,
    ]);

    MDL_net.sendPacket("client", "lovec-client-unit-take-loot", payload, true, true);

    return true;
  }
  .setAnno(ANNO.__INIT__, null, function() {
    MDL_net.__packetHandler("server", "lovec-client-unit-take-loot", payload => {
      let arr = unpackPayload(payload);
      takeUnitLoot(Groups.unit.getById(arr[0]), Groups.unit.getById(arr[1]), arr[2]);
    });
  })
  .setAnno(ANNO.__CLIENT__)
  .setAnno(ANNO.__NONCONSOLE__);
  exports.takeUnitLoot_client = takeUnitLoot_client;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit drops its item to spawn a loot.
   * ---------------------------------------- */
  const dropUnitLoot = function(unit, max) {
    if(max == null) max = Infinity;

    let itm = unit.item();
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
    if(!Mathf.chance(0.025)) return;
    if(b.items == null || b.block.itemCapacity === 0 || !MDL_cond.isExposedBlk(b.block) || MDL_cond._isNoReacBlk(b.block)) return;

    b.items.each(itm => {
      MDL_reaction.handleReaction(itm, "GROUP: air", 40.0, b);
    });
  }
  exports.comp_updateTile_exposed = comp_updateTile_exposed;


  const comp_onDestroyed_exposed = function(b) {
    // NOTE: I still have no idea what this can do.
  }
  exports.comp_onDestroyed_exposed = comp_onDestroyed_exposed;


  /* virtual */


  const comp_updateTile_virtual = function(b) {
    // TODO
  }
  .setTodo("Virtual item, bit, and how to boom conveyors.");
  exports.comp_updateTile_virtual = comp_updateTile_virtual;
