/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_block = require("lovec/db/DB_block");
  const DB_env = require("lovec/db/DB_env");
  const DB_fluid = require("lovec/db/DB_fluid");
  const DB_item = require("lovec/db/DB_item");


  /* <---------- key binding ----------> */


  const LovecBinding = {};


  const __LovecBinding = function(nm, keyBind) {
    LovecBinding[nm] = keyBind;
  };
  exports.__LovecBinding = __LovecBinding;


  /* <---------- sprite ----------> */


  MDL_event._c_onLoad(() => {


    exports.icons = {
      ohno: new TextureRegionDrawable(Core.atlas.find("error")),

      check: new TextureRegionDrawable(Core.atlas.find("lovec-icon-check")),
      cross: new TextureRegionDrawable(Core.atlas.find("lovec-icon-cross")),
      harvest: new TextureRegionDrawable(Core.atlas.find("lovec-icon-harvest")),
      play: new TextureRegionDrawable(Core.atlas.find("lovec-icon-play")),
      swap: new TextureRegionDrawable(Core.atlas.find("lovec-icon-swap")),
    };


    exports.blockHeatRegs = [
      Core.atlas.find("error"),
      MDL_content._regHeat(1),
      MDL_content._regHeat(2),
      MDL_content._regHeat(3),
      MDL_content._regHeat(4),
      MDL_content._regHeat(5),
      MDL_content._regHeat(6),
      MDL_content._regHeat(7),
      MDL_content._regHeat(8),
      MDL_content._regHeat(9),
      MDL_content._regHeat(10),
    ];


    exports.laserReg = Core.atlas.find("laser");
    exports.laserEndReg = Core.atlas.find("laser-end");


    let wireRegMap = new ObjectMap();
    let wireEndRegMap = new ObjectMap();
    DB_block.db["grpParam"]["wireMatReg"].forEachRow(2, (wireMat, nmReg) => {
      wireRegMap.put(wireMat, Core.atlas.find(nmReg));
      wireEndRegMap.put(wireMat, Core.atlas.find(nmReg + "-end"));
    });
    exports.wireRegMap = wireRegMap;
    exports.wireEndRegMap = wireEndRegMap;
    exports.wireGlowReg = Core.atlas.find("lovec-ast-wire-glow");
    exports.wireShaReg = Core.atlas.find("lovec-ast-wire-shadow");


    let loadTex = (path) => {
      Core.assets.load(path, Texture);
      return Core.assets.get(path, Texture);
    };


    let noiseTexs = {
      caustics: loadTex("sprites/caustics.png"),
      clouds: loadTex("sprites/clouds.png"),
      distortAlpha: loadTex("sprites/distortAlpha.png"),
      fog: loadTex("sprites/fog.png"),
      noise: loadTex("sprites/noise.png"),
      noiseAlpha: loadTex("sprites/noiseAlpha.png"),
    };
    Object._it(noiseTexs, (key, tex) => {
      tex.setFilter(Texture.TextureFilter.linear);
      tex.setWrap(Texture.TextureWrap.repeat);
    });
    exports.noiseTexs = noiseTexs;


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


    let wes = {};
    Vars.content.weathers().each(wea => {
      if(wea.ex_getWeaEnPermanent == null) return;

      wes[wea.name] = wea.ex_getWeaEnPermanent();
    });
    exports.wes = wes;


    exports.sandItms = Vars.content.items().select(itm => DB_item.db["group"]["sand"].includes(itm.name)).toArray();


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


    exports.fuelItms = Vars.content.items().select(itm => DB_item.db["param"]["fuel"]["level"].includes(itm.name)).toArray();
    exports.fuelLiqs = Vars.content.liquids().select(liq => !liq.gas && DB_item.db["param"]["fuel"]["fLevel"].includes(liq.name)).toArray();
    exports.fuelGas = Vars.content.liquids().select(liq => liq.gas && DB_item.db["param"]["fuel"]["fLevel"].includes(liq.name)).toArray();


    let intmds = {};
    DB_item.db["intmdTag"].forEach(tag => intmds[tag] = []);
    Vars.content.items().each(itm => {
      MDL_content._intmdTags(itm).forEach(tag => intmds[tag].push(itm));
    });
    Vars.content.liquids().each(liq => {
      MDL_content._intmdTags(liq).forEach(tag => intmds[tag].push(liq));
    });
    exports.intmds = intmds;


    exports.wasItms = Vars.content.items().select(itm => MDL_cond._isWas(itm)).toArray();
    exports.wasFlds = Vars.content.liquids().select(liq => MDL_cond._isWas(liq)).toArray();


    exports.vanillaUtps = Vars.content.units().select(utp => MDL_content._mod(utp) === "vanilla");
    exports.lovecUtps = Vars.content.units().select(utp => MDL_cond._isLovecUnit(utp));
    exports.bioticUtps = Vars.content.units().select(utp => MDL_cond._isNonRobot(utp)).toArray();
    exports.navalUtps = Vars.content.units().select(utp => utp.naval).toArray();
    exports.missileUtps = Vars.content.units().select(utp => utp instanceof MissileUnitType).toArray();


    exports.fadeStas = Vars.content.statusEffects().select(sta => MDL_cond._isFadeSta(sta)).toArray();
    exports.blkStas = Vars.content.statusEffects().select(sta => MDL_cond._isBlkSta(sta)).toArray();
    exports.deathStas = Vars.content.statusEffects().select(sta => MDL_cond._isDeathSta(sta)).toArray();
    exports.stackStas = Vars.content.statusEffects().select(sta => MDL_cond._isStackSta(sta)).toArray();


    let factions = {};
    var i = 0;
    var iCap = DB_block.db["grpParam"]["factionColor"].iCap();
    while(i < iCap) {
      let faction = DB_block.db["grpParam"]["factionColor"][i];
      if(faction !== "none") factions[faction] = MDL_content._factionCts(faction);
      i += 2;
    };
    exports.factions = factions;


    let facFamis = {};
    MDL_content._facFamisDefined().forEach(fami => {
      facFamis[fami] = MDL_content._facFamiBlks(fami);
    });
    exports.facFamis = facFamis;


  }, 79532268);


  /* <---------- misc ----------> */


  MDL_event._c_onLoad(() => {


    exports.LovecBinding = LovecBinding;


    exports.auxPres = Vars.content.liquid("loveclab-aux0aux-pressure");
    exports.auxVac = Vars.content.liquid("loveclab-aux0aux-vacuum");
    exports.auxHeat = Vars.content.liquid("loveclab-aux0aux-heat");
    exports.auxTor = Vars.content.liquid("loveclab-aux0aux-torque");


  }, 54888119);
