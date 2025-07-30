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


    exports.sandItms = Vars.content.items().select(itm => DB_item.db["group"]["sand"].includes(itm.name)).toArray();


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


  }, 54888119);
