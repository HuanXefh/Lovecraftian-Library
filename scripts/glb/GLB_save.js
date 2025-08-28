/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Lovec will create .lsav files for each save, in "Mindustry/saves/mods/data/lovec/saves".
   * To register a new field, check {DB_misc.db["lsav"]["header"]}.
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


  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_file = require("lovec/mdl/MDL_file");
  const MDL_json = require("lovec/mdl/MDL_json");
  const MDL_net = require("lovec/mdl/MDL_net");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  let lsavJsonVal = null;
  let lsav = {};


  const loadLsav = function() {
    Time.run(20.0, () => {
      if(Vars.state.isEditor()) return;

      if(Vars.net.client()) {
        requestSync();
        return;
      };

      try {
        lsavJsonVal = MDL_json.parseEx(MDL_file._lsav());
      } catch(err) {
        lsavJsonVal = null;
      };

      if(lsavJsonVal == null) return;

      DB_misc.db["lsav"]["header"].forEachRow(3, (header, def, arrMode) => {
        lsav[header] = Object.val(MDL_json.fetch(lsavJsonVal, header, false, arrMode), def);
      });
    });
  };


  const saveLsav = function() {
    if(Vars.state.isEditor()) return;

    MDL_json.write(MDL_file._lsav(), lsav);
  }
  .setAnno(ANNO.__SERVER__);


  const setLsav = function(obj) {
    lsav = obj;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the local LSAV object, only used for testing.
   * ---------------------------------------- */
  const _lsav = function() {
    return lsav;
  }
  .setAnno(ANNO.__DEBUG__);
  exports._lsav = _lsav;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a value in LSAV.
   * ---------------------------------------- */
  const set = function(header, val, suppressWarning) {
    if(header == null) return;

    var cond = false;
    if(suppressWarning) {
      cond = true;
    } else {
      if(val === undefined) {
        Log.warn("[LOVEC] Passing " + "undefined".color(Pal.remove) + " as LSAV value!");
      } else if(lsav[header] === undefined) {
        Log.warn("[LOVEC] The referenced field is " + "undefined".color(Pal.remove) + "!");
      } else if(typeof val !== typeof lsav[header]) {
        Log.warn("[LOVEC] LSAV value changed to a different type!");
      } else {
        cond = true;
      };
    };

    if(cond) {
      lsav[header] = val;
      sync();
    };
  }
  .setAnno(ANNO.__SERVER__);
  exports.set = set;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a LSAV value only if it's marked as safe.
   * ---------------------------------------- */
  const setSafe = function(header, val) {
    if(header == null) return;

    if(!DB_misc.db["lsav"]["safe"].includes(header)) return;

    set(header, val, false);
  }
  .setAnno(ANNO.__SERVER__);
  exports.setSafe = setSafe;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a value in local LSAV.
   * ---------------------------------------- */
  const get = function(header) {
    return lsav[header];
  };
  exports.get = get;


  /* ----------------------------------------
   * NOTE:
   *
   * Called on server side, synchronizes LSAV on all client sides.
   * ---------------------------------------- */
  const sync = function() {
    let payload = JSON.stringify(lsav);
    MDL_net.sendPacket("server", "lovec-server-lsav-sync", payload, true);
  }
  .setAnno(ANNO.__INIT__, null, function() {
    MDL_net.__packetHandler("client", "lovec-server-lsav-sync", payload => {
      setLsav(JSON.parse(payload));
    });
  })
  .setAnno(ANNO.__SERVER__);
  exports.sync = sync;


  /* ----------------------------------------
   * NOTE:
   *
   * Requests the server to send sync packets.
   * ---------------------------------------- */
  const requestSync = function() {
    MDL_net.sendPacket("client", "lovec-client-lsav-sync-request", "", true, true);
  }
  .setAnno(ANNO.__INIT__, null, function() {
    MDL_net.__packetHandler("server", "lovec-client-lsav-sync-request", payload => {
      sync();
    });
  })
  .setAnno(ANNO.__CLIENT__)
  .setAnno(ANNO.__NONCONSOLE__);
  exports.requestSync = requestSync;


  /* ----------------------------------------
   * NOTE:
   *
   * Requests the server to set an LSAV value.
   * Only safe properties are allowed.
   * ---------------------------------------- */
  const requestSet = function(header, val) {
    let payload = Array.toPayload([header, val]);

    MDL_net.sendPacket("client", "lovec-client-lsav-set-request", payload, true, true);
  }
  .setAnno(ANNO.__INIT__, null, function() {
    MDL_net.__packetHandler("server", "lovec-client-lsav-set-request", payload => {
      setSafe.apply(this, Array.fromPayload(payload));
    });
  })
  .setAnno(ANNO.__CLIENT__)
  .setAnno(ANNO.__NONCONSOLE__);
  exports.requestSet = requestSet;


/*
  ========================================
  Section: Application
  ========================================
*/


  DB_misc.db["lsav"]["header"].forEachRow(3, (header, def, arrMode) => {
    lsav[header] = def;
  });
  exports.lsav = lsav;


  MDL_event._c_onWorldLoad(() => {

    loadLsav();

  }, 75122009);


  MDL_event._c_onWorldSave(() => {

    saveLsav();

  }, 45111187);
