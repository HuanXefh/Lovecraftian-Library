/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- trigger ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Called on after all contents are initialized (after {postInit}).
   * ---------------------------------------- */
  const _c_onInit = function(scr, id) {
    const thisFun = _c_onInit;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(ContentInitEvent, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onInit = _c_onInit;


  /* ----------------------------------------
   * NOTE:
   *
   * Called on client load.
   * ---------------------------------------- */
  const _c_onLoad = function(scr, id) {
    const thisFun = _c_onLoad;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(ClientLoadEvent, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onLoad = _c_onLoad;


  /* ----------------------------------------
   * NOTE:
   *
   * Called when starting loading a world.
   * It's known to be called before {drawBase}.
   * ---------------------------------------- */
  const _c_onWorldLoadStart = function(scr, id) {
    const thisFun = _c_onWorldLoadStart;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(WorldLoadBeginEvent, () => {
      scr();
    });
  }.
  setProp({
    ids: [],
  });
  exports._c_onWorldLoadStart = _c_onWorldLoadStart;


  /* ----------------------------------------
   * NOTE:
   *
   * Called when finishing loading a world.
   * ---------------------------------------- */
  const _c_onWorldLoad = function(scr, id) {
    const thisFun = _c_onWorldLoad;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(WorldLoadEvent, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onWorldLoad = _c_onWorldLoad;


  /* ----------------------------------------
   * NOTE:
   *
   * Called when saving a world.
   * ---------------------------------------- */
  const _c_onWorldSave = function(scr, id) {
    const thisFun = _c_onWorldSave;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(SaveWriteEvent, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onWorldSave = _c_onWorldSave;


  /* ----------------------------------------
   * NOTE:
   *
   * Called every frame when the game is not paused.
   * ---------------------------------------- */
  const _c_onUpdate = function(scr, id) {
    const thisFun = _c_onUpdate;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(Trigger.update, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onUpdate = _c_onUpdate;


  /* ----------------------------------------
   * NOTE:
   *
   * Called in the draw.
   * ---------------------------------------- */
  const _c_onDraw = function(scr, id) {
    const thisFun = _c_onDraw;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(Trigger.draw, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onDraw = _c_onDraw;


  /* ----------------------------------------
   * NOTE:
   *
   * Called whenever a building gets damaged.
   * ---------------------------------------- */
  const _c_onBDamage = function(scr, id) {
    const thisFun = _c_onBDamage;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(BuildDamageEvent, ev => {
      scr(ev.build, ev.source);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onBDamage = _c_onBDamage;


  /* ----------------------------------------
   * NOTE:
   *
   * Called whenever a building is destroyed.
   * This really returns a {Tile} this time, WTF.
   * ---------------------------------------- */
  const _c_onBDestroy = function(scr, id) {
    const thisFun = _c_onBDestroy;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(BlockDestroyEvent, ev => {
      scr(ev.tile);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onBDestroy = _c_onBDestroy;


  /* ----------------------------------------
   * NOTE:
   *
   * Called whenever a unit gets damaged.
   * ---------------------------------------- */
  const _c_onUnitDamage = function(scr, id) {
    const thisFun = _c_onUnitDamage;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(UnitDamageEvent, ev => {
      scr(ev.unit, ev.bullet);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onUnitDamage = _c_onUnitDamage;


  /* ----------------------------------------
   * NOTE:
   *
   * Called whenever a unit is destroyed.
   * ---------------------------------------- */
  const _c_onUnitDestroy = function(scr, id) {
    const thisFun = _c_onUnitDestroy;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(UnitDestroyEvent, ev => {
      scr(ev.unit);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onUnitDestroy = _c_onUnitDestroy;


  /* ----------------------------------------
   * NOTE:
   *
   * Called whenever a unit drowns.
   * ---------------------------------------- */
  const _c_onUnitDrown = function(scr, id) {
    const thisFun = _c_onUnitDrown;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(UnitDrownEvent, ev => {
      scr(ev.unit);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onUnitDrown = _c_onUnitDrown;


  /* ----------------------------------------
   * NOTE:
   *
   * Called when a tile is changed.
   * ---------------------------------------- */
  const _c_onTileChange = function(scr, id) {
    const thisFun = _c_onTileChange;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(TileChangeEvent, ev => {
      scr(ev.tile);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onTileChange = _c_onTileChange;


  /* ----------------------------------------
   * NOTE:
   *
   * Called before a tile is changed.
   * ---------------------------------------- */
  const _c_onTilePreChange = function(scr, id) {
    const thisFun = _c_onTilePreChange;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(TilePreChangeEvent, ev => {
      scr(ev.tile);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onTilePreChange = _c_onTilePreChange;


  /* ----------------------------------------
   * NOTE:
   *
   * Called when the floor block of a tile is changed.
   * ---------------------------------------- */
  const _c_onTileFloorChange = function(scr, id) {
    const thisFun = _c_onTileFloorChange;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(TileFloorChangeEvent, ev => {
      scr(ev.tile, ev.previous, ev.floor);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onTileFloorChange = _c_onTileFloorChange;


  /* ----------------------------------------
   * NOTE:
   *
   * Called when the overlay block of a tile is changed.
   * ---------------------------------------- */
  const _c_onTileOverlayChange = function(scr, id) {
    const thisFun = _c_onTileOverlayChange;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(TileOverlayChangeEvent, ev => {
      scr(ev.tile, ev.previous, ev.overlay);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onTileOverlayChange = _c_onTileOverlayChange;


  /* custom */


  /* ----------------------------------------
   * NOTE:
   *
   * Called when LMB is pressed.
   * Format for script: {(dx, dy, x_f, x_t) => {...}}.
   * ----------------------------------------
   * DEDICATION:
   *
   * Inspired by Extended-UI.
   * ---------------------------------------- */
  const _c_onDrag = function(scr, id) {
    const thisFun = _c_onDrag;

    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    let isDragged = false;
    let startX = null;
    let startY = null;
    let lastX = null;
    let lastY = null;
    let x = null;
    let y = null;
    Events.run(Trigger.update, () => {

      let isTapped = Core.input.keyTap(KeyCode.mouseLeft);
      let isReleased = Core.input.keyRelease(KeyCode.mouseLeft);

      if(!isDragged && !isTapped && !isReleased) return;

      x = Core.input.mouseX();
      y = Core.input.mouseY();

      // Drag start
      if(isTapped) {
        isDragged = true;
        startX = x;
        startY = y;
      };

      // Drag end
      if(isReleased && isDragged) {
        isDragged = false;
        startX = null;
        startY = null;
        lastX = null;
        lastY = null;
      };

      if(isDragged) {
        if(lastX != null && lastY != null) scr(x - lastX, y - lastY, startX, startY);
        lastX = x;
        lastY = y;
      };

    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onDrag = _c_onDrag;
