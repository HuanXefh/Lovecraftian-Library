/* ----------------------------------------
 * NOTE:
 *
 * The Lovec version of {EventType}.
 * ---------------------------------------- */


/* <---------- import ----------> */


const MDL_event = require("lovec/mdl/MDL_event");


/* <---------- meta ----------> */


const CLS_eventTrigger = function() {
  this.init.apply(this, arguments);
}.initClass();


CLS_eventTrigger.prototype.init = function(nm, scr) {
  if(nm == null || insNms.includes(nm)) ERROR_HANDLER.noNm("event trigger");
  insNms.push(nm);
  this.name = nm;

  this.updateScr = tryVal(scr, null);

  this.idListenerArr = [];
  this.listenerIds = [];

  this.tmpMap = "";
  this.clearOnMapChange = false;
  this.clearOnFire = false;

  MDL_event._c_onUpdate(() => {
    if(this.tmpMap !== global.lovecUtil.fun._mapCur()) {
      this.tmpMap = global.lovecUtil.fun._mapCur();
      if(this.clearOnMapChange) this.clearListener();
      global.lovec.trigger.mapChange.fire(this.tmpMap);
    };

    if(this.updateScr != null) this.updateScr();
  }, "eventTrigger: [$1]".format(nm));
};


const insNms = [];


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_eventTrigger.prototype;


/* util */


/* ----------------------------------------
 * NOTE:
 *
 * Adds a listener to the trigger.
 * ---------------------------------------- */
ptp.addListener = function(listener, id) {
  if(id == null) {
    this.idListenerArr.push(null, listener);
  } else {
    if(this.listenerIds.includes(id)) return this;

    this.idListenerArr.push(id, listener);
    this.listenerIds.push(id);
  };

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Removes a listener from the trigger, which should be added with id given beforehead.
 * ---------------------------------------- */
ptp.removeListener = function(id) {
  if(id == null) return this;

  this.idListenerArr.removeRow(id);
  this.listenerIds.remove(id);

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Removes all listeners from the trigger.
 * ---------------------------------------- */
ptp.clearListener = function() {
  this.idListenerArr.clear();
  this.listenerIds.clear();

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * If {true}, listeners will be cleared when map is changed.
 * ---------------------------------------- */
ptp.setClearOnMapChange = function(bool) {
  this.clearOnMapChange = bool;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * If {true}, listeners will be cleared when the trigger is fired.
 * ---------------------------------------- */
ptp.setClearOnFire = function(bool) {
  this.clearOnFire = bool;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Calls all listeners of the trigger with the arguments passed down.
 * ---------------------------------------- */
ptp.fire = function() {
  this.idListenerArr.forEachRow(2, (id, listener) => listener.apply(null, arguments));

  if(this.clearOnFire) this.clearListener();
};


module.exports = CLS_eventTrigger;
