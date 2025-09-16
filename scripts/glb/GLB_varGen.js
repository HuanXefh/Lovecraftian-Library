/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  const DB_block = require("lovec/db/DB_block");
  const DB_env = require("lovec/db/DB_env");
  const DB_fluid = require("lovec/db/DB_fluid");
  const DB_item = require("lovec/db/DB_item");
  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- key binding ----------> */


  const bindings = {};


  const __bindings = function(nm, keyBind) {
    bindings[nm] = keyBind;
  };
  exports.__bindings = __bindings;


  /* <---------- sprite ----------> */


  MDL_event._c_onLoad(() => {


    exports.iconRegs = (function() {
      const obj = {};
      DB_misc.db["texture"]["icon"].forEachRow(2, (nm, nmReg) => {
        obj[nm] = Core.atlas.find(nmReg);
      });
      return obj;
    })();


    exports.icons = (function() {
      const obj = {};
      Object._it(module.exports.iconRegs, (nm, reg) => {
        obj[nm] = new TextureRegionDrawable(reg);
      });
      return obj;
    })();


    exports.blockHeatRegs = [
      Core.atlas.find("error"),
      MDL_texture._regHeat(1),
      MDL_texture._regHeat(2),
      MDL_texture._regHeat(3),
      MDL_texture._regHeat(4),
      MDL_texture._regHeat(5),
      MDL_texture._regHeat(6),
      MDL_texture._regHeat(7),
      MDL_texture._regHeat(8),
      MDL_texture._regHeat(9),
      MDL_texture._regHeat(10),
    ];


    exports.laserRegs = (function() {
      const obj = {};
      obj.lineReg = Core.atlas.find("laser");
      obj.endReg = Core.atlas.find("laser-end");
      return obj;
    })();


    exports.wireRegs = (function() {
      const obj = {};
      obj.regMap = new ObjectMap();
      obj.endRegMap = new ObjectMap();
      DB_block.db["grpParam"]["wireMatReg"].forEachRow(2, (wireMat, nmReg) => {
        obj.regMap.put(wireMat, Core.atlas.find(nmReg));
        obj.endRegMap.put(wireMat, Core.atlas.find(nmReg + "-end"));
      });
      obj.glowReg = Core.atlas.find("lovec-ast-wire-glow");
      obj.shaReg = Core.atlas.find("lovec-ast-wire-shadow");
      return obj;
    })();


    exports.noiseTexs = (function() {
      const obj = {};
      let load = path => {
        Core.assets.load(path, Texture);
        return Core.assets.get(path, Texture);
      };
      DB_misc.db["texture"]["noise"].forEachRow(2, (nm, path) => {
        try {
          obj[nm] = load(path);
          obj[nm].setFilter(Texture.TextureFilter.linear);
          obj[nm].setWrap(Texture.TextureWrap.repeat);
        } catch(err) {
          Log.warn("[LOVEC] Cannot load noise texture for: " + path);
        };
      });
      return obj;
    })();


  }, 25777741);


  /* <---------- list ----------> */


  MDL_event._c_onLoad(() => {


    exports.mainTeams = [
      Team.sharded,
      Team.crux,
      Team.malis,
      Team.green,
      Team.blue,
      Team.neoplastic,
    ].pushAll(DB_env.db["extraMainTeam"]);


    exports.lovecPlas = Vars.content.planets().select(pla => pla.accessible && (pla.minfo.mod == null ? "" : pla.minfo.mod.name) === "loveclab").toArray();


    exports.weaEns = (function() {
      const obj = {};
      Vars.content.weathers().each(wea => {
        let weaEn = new Weather.WeatherEntry(wea);
        weaEn.always = true;
        obj[wea.name] = weaEn;
      });
      return obj;
    })();


    exports.sandItms = (function() {
      const arr = [];
      DB_item.db["group"]["sand"].forEachFast(nm => {
        let itm = MDL_content._ct(nm, "rs");
        if(itm != null) arr.push(itm);
      });
      return arr;
    })();


    exports.hotFlds = (function() {
      const arr = [];
      let li = DB_fluid.db["param"]["fHeat"];
      let i = 0;
      let iCap = li.iCap();
      while(i < iCap) {
        if(li[i + 1] > 49.9999) {
          let ct = MDL_content._ct(li[i], "rs");
          if(ct != null) arr.push(ct);
        };
        i += 2;
      };

      return arr;
    })();


    exports.fuelItms = (function() {
      const arr = [];
      DB_item.db["param"]["fuel"]["item"].forEachRow(2, (nm, params) => {
        let itm = MDL_content._ct(nm, "rs");
        if(itm != null) arr.push(itm);
      });
      return arr;
    })();
    exports.fuelLiqs = (function() {
      const arr = [];
      DB_item.db["param"]["fuel"]["fluid"].forEachRow(2, (nm, params) => {
        let liq = MDL_content._ct(nm, "rs");
        if(liq != null && !liq.gas) arr.push(liq);
      });
      return arr;
    })();
    exports.fuelGases = (function() {
      const arr = [];
      DB_item.db["param"]["fuel"]["fluid"].forEachRow(2, (nm, params) => {
        let liq = MDL_content._ct(nm, "rs");
        if(liq != null && liq.gas) arr.push(liq);
      });
      return arr;
    })();


    exports.intmds = (function() {
      const obj = {};
      DB_item.db["intmdTag"].forEachFast(tag => obj[tag] = []);
      Vars.content.items().each(itm => MDL_content._intmdTags(itm).forEachFast(tag => obj[tag].push(itm)));
      Vars.content.liquids().each(liq => MDL_content._intmdTags(liq).forEachFast(tag => obj[tag].push(liq)));
      return obj;
    })();


    exports.wasItms = Vars.content.items().select(itm => MDL_cond._isWas(itm)).toArray();
    exports.wasFlds = Vars.content.liquids().select(liq => MDL_cond._isWas(liq)).toArray();


    exports.vanillaUtps = Vars.content.units().select(utp => MDL_content._mod(utp) === "vanilla");
    exports.lovecUtps = Vars.content.units().select(utp => MDL_cond._isLovecUnit(utp));
    exports.bioticUtps = Vars.content.units().select(utp => MDL_cond._isNonRobot(utp)).toArray();
    exports.navalUtps = Vars.content.units().select(utp => utp.naval).toArray();
    exports.missileUtps = Vars.content.units().select(utp => utp instanceof MissileUnitType).toArray();


    exports.fadeStas = Vars.content.statusEffects().select(sta => MDL_cond._isFadeSta(sta)).toArray();
    exports.deathStas = Vars.content.statusEffects().select(sta => MDL_cond._isDeathSta(sta)).toArray();
    exports.stackStas = Vars.content.statusEffects().select(sta => MDL_cond._isStackSta(sta)).toArray();



    exports.factions = (function() {
      const obj = {};
      DB_block.db["grpParam"]["factionColor"].forEachRow(2, (faction, colorStr) => {
        if(faction === "none") return;
        obj[faction] = MDL_content._factionCts(faction);
      });
      return obj;
    })();


    exports.facFamis = (function() {
      const obj = {};
      MDL_content._facFamisDefined().forEachFast(fami => obj[fami] = MDL_content._facFamiBlks(fami));
      return obj;
    })();


  }, 79532268);


  /* <---------- misc ----------> */


  MDL_event._c_onLoad(() => {


    exports.bindings = bindings;


    exports.auxPres = Vars.content.liquid("loveclab-aux0aux-pressure");
    exports.auxVac = Vars.content.liquid("loveclab-aux0aux-vacuum");
    exports.auxHeat = Vars.content.liquid("loveclab-aux0aux-heat");
    exports.auxTor = Vars.content.liquid("loveclab-aux0aux-torque");
    exports.auxRpm = Vars.content.liquid("loveclab-aux0aux-rpm");


  }, 54888119);
