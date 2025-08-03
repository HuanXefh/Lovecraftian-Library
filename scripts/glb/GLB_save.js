/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Lovec will create .lsav files for each save, in "Mindustry/saves/mods/data/lovec/saves".
   * To register a new field, check {DB_misc.db["lsav"]}.
   * You can use {set} method defined here to change a value, and it will be saved finally.
   * ----------------------------------------
   * IMPORTANT:
   *
   * LSAV is only saved on server side, don't use it directly on client side.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_file = require("lovec/mdl/MDL_file");
  const MDL_json = require("lovec/mdl/MDL_json");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  let lsavJsonVal = null;
  let lsav = {};


  const loadLsav = function() {
    Time.run(20.0, () => {
      if(Vars.net.client()) {
        requestSync();
        return;
      };

      try {
        lsavJsonVal = MDL_json.parseEx(MDL_file._lsav());
      } catch(err) {
        lsavJsonVal = null;
        throw err;
      };

      if(lsavJsonVal == null) return;

      DB_misc.db["lsav"].forEachRow(3, (header, def, arrMode) => {
        lsav[header] = Object.val(MDL_json.fetch(lsavJsonVal, header, false, arrMode), def);
      });
    });
  };


  const saveLsav = function() {
    MDL_json.write(MDL_file._lsav(), lsav);
  }
  .setAnno(ANNO.__SERVER__);


  const setLsav = function(obj) {
    lsav = obj;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the LSAV object.
   * I don't recommend using this directly.
   * ---------------------------------------- */
  const _lsav = function() {
    return lsav;
  }
  .setAnno(ANNO.__SERVER__);
  exports._lsav = _lsav;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a value in LSAV.
   * ---------------------------------------- */
  const set = function(header, val, suppressWarning) {
    if(header == null) return;

    if(!suppressWarning) {
      if(val === undefined) {
        Log.warn("[LOVEC] Passing " + "undefined".color(Pal.remove) + " as LSAV value!");
      } else if(typeof val !== typeof lsav[header]) {
        Log.warn("[LOVEC] LSAV value changed to a different type!");
      };
    };

    lsav[header] = val;
  }
  .setAnno(ANNO.__SERVER__);
  exports.set = set;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a value in LSAV.
   * ---------------------------------------- */
  const get = function(header) {
    return lsav[header];
  }
  .setAnno(ANNO.__SERVER__);
  exports.get = get;


  /* ----------------------------------------
   * NOTE:
   *
   * Called on server side, synchronizes LSAV on all client sides.
   * ---------------------------------------- */
  const sync = function() {
    let payload = JSON.stringify(lsav);
    MDL_call.sendPacket("server", "lovec-server-lsav-sync", payload, true);
  }
  .setAnno(ANNO.__INIT__(function() {
    MDL_call.__packetHandler("client", "lovec-server-lsav-sync", payload => {
      setLsav(JSON.parse(payload));
    });
  }))
  .setAnno(ANNO.__SERVER__);
  exports.sync = sync;


  /* ----------------------------------------
   * NOTE:
   *
   * Requests the server to send sync packets.
   * ---------------------------------------- */
  const requestSync = function() {
    MDL_call.sendPacket("client", "lovec-client-lsav-sync-request", "", true, true);
  }
  .setAnno(ANNO.__INIT__(function() {
    MDL_call.__packetHandler("server", "lovec-client-lsav-sync-request", payload => {
      sync();
    });
  }))
  .setAnno(ANNO.__CLIENT__);
  exports.requestSync = requestSync;


/*
  ========================================
  Section: Application
  ========================================
*/


  DB_misc.db["lsav"].forEachRow(3, (header, def, arrMode) => {
    lsav[header] = def;
  });
  exports.lsav = lsav;


  MDL_event._c_onWorldLoad(() => {

    loadLsav();

  }, 75122009);


  MDL_event._c_onWorldSave(() => {

    saveLsav();

  }, 45111187);
