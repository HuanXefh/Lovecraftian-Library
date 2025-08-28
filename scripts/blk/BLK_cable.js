/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * A block that conducts power.
   * ----------------------------------------
   * DEDICATION:
   *
   * Inspried by Asthosus.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * ArmoredConveyor
   * ---------------------------------------- */


  /* ----------------------------------------
   * KEY:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * DB_block.db["group"]["shortCircuit"]    // @PARAM
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_basePowerTransmitter");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.conductivePower = true;
    blk.connectedPower = false;
    blk.enableDrawStatus = false;

    blk.pushUnits = false;
    blk.junctionReplacement = null;
    blk.bridgeReplacement = null;

    blk.addBar("power", PowerNode.makePowerBalance());
    blk.addBar("batteries", PowerNode.makeBatteryBalance());
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.itemsMoved);
  };


  function comp_blends() {
    let blk, t, rot, dir, bPlan, cond;
    let oblk, ob, otx, oty, orot;

    switch(arguments.length) {


      // ARGS: blk, t, rot, dir
      case 4 :
        blk = arguments[0];
        t = arguments[1];
        rot = arguments[2];
        dir = arguments[3];

        ob = t.nearbyBuild(Mathf.mod(rot - dir, 4));
        return ob != null && ob.team == t.team() && blk.blends(t, rot, ob.tileX(), ob.tileY(), ob.rotation, ob.block);


      // ARGS: blk, t, rot, bPlan, dir, shouldCheckWorld
      case 6 :
        blk = arguments[0];
        t = arguments[1];
        rot = arguments[2];
        bPlan = arguments[3];
        dir = arguments[4];
        cond = arguments[5];

        if(bPlan != null) {
          let bPlanReq = bPlan[Mathf.mod(rot - dir, 4)];
          if(bPlanReq != null && blk.blends(t, rot, bPlanReq.x, bPlanReq.y, bPlanReq.rotation, bPlanReq.block)) return true;
        };
        return cond && blk.blends(t, rot, dir);


      // @ARGS: blk, t, rot, otx, oty, orot, oblk
      case 7 :
        blk = arguments[0];
        t = arguments[1];
        rot = arguments[2];
        otx = arguments[3];
        oty = arguments[4];
        orot = arguments[5];
        oblk = arguments[6];

        return (oblk.consPower != null || oblk.outputsPower)
          || (blk.lookingAt(t, rot, otx, oty, oblk) && oblk.hasPower);


      default :
        return false;


    };
  };


  function comp_unitOn(b, unit) {
    if(!Mathf.chance(0.03) || b.power == null || b.power.status < 0.1) return;
    if(!MDL_cond._isWet(unit)) return;

    FRAG_attack.apply_lightning(b.x, b.y, null, null, null, 6, 4);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = {


    /* <---------- block ----------> */


    init: function(blk) {
      PARENT.init(blk);
      comp_init(blk);
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
      comp_setStats(blk);
    },


    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
    },


    /* <---------- build ----------> */


    created: function(b) {
      PARENT.created(b);
    },


    onDestroyed: function(b) {
      PARENT.onDestroyed(b);
    },


    updateTile: function(b) {
      PARENT.updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    // @NOSUPER
    outputsItems: function(blk) {
      return true;
    },


    canPlaceOn: function(blk, t, team, rot) {
      return PARENT.canPlaceOn(blk, t, team, rot);
    },


    // @NOSUPER
    // @MULTIEXTEND
    blends: function() {
      return comp_blends.apply(null, arguments);
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    acceptItem: function(b, b_f, itm) {
      return false;
    },


    unitOn: function(b, unit) {
      comp_unitOn(b, unit);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return module.exports.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-pow", "blk-pow0trans", "blk-cable"],
    }),


    /* <---------- build (extended) ----------> */


  };
