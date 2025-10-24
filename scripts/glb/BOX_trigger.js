/* ----------------------------------------
 * NOTE:
 *
 * A collection of event triggers.
 * Most triggers here will clear their listeners when map is changed, which are meant for buildings & units.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_objectBox = require("lovec/cls/struct/CLS_objectBox");
const CLS_eventTrigger = require("lovec/cls/util/CLS_eventTrigger");


const MDL_event = require("lovec/mdl/MDL_event");


/* <---------- meta ----------> */


const BOX_trigger = new CLS_objectBox({


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: x, y, team, unit
   * Triggered whenever a unit is destroyed.
   * ---------------------------------------- */
  unitDestroy: (function() {
    MDL_event._c_onUnitDestroy(unit => {
      if(unit.internal) return;

      BOX_trigger.unitDestroy.fire(unit.x, unit.y, unit.team, unit);
    });

    return new CLS_eventTrigger("lovec-unit-destroy").setClearOnMapChange(true);
  })(),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: x, y, item, loot
   * Triggered whenever a loot unit is spawned.
   * ---------------------------------------- */
  lootSpawn: new CLS_eventTrigger("lovec-loot-spawn").setClearOnMapChange(true),


});


module.exports = BOX_trigger;
