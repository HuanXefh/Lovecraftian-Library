/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A crafter that outputs some resource based on current attribute.
   * Essentially not a crafter, more like a miner.
   * Not used directly for content!
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * !NOTHING
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/blk/BLK_baseFactory");


  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_table = require("lovec/mdl/MDL_table");


  const TP_stat = require("lovec/tp/TP_stat");


  const MOD_tmi = require("lovec/mod/MOD_tmi");


  /* <---------- component ----------> */


  function comp_init(blk) {
    MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        blk.attrRsMap.forEachRow(2, (nmAttr, nmRs) => {
          let rs = MDL_content._ct(nmRs, "rs");
          if(rs == null) return;

          rs instanceof Item ?
            MDL_recipeDict.addItmProdTerm(blk, rs, blk.ex_getProdAmt(), 1.0, {"time": blk.ex_getCraftTime()}) :
            MDL_recipeDict.addFldProdTerm(blk, rs, blk.ex_getProdAmt());
        });
      });
    });

    MOD_tmi._r_dynaAttr(blk, blk.attrRsMap);
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.tiles);
    blk.stats.remove(Stat.affinities);

    blk.stats.add(TP_stat.blk_attrReq, extend(StatValue, {display(tb) {
      tb.row();
      MDL_table.setDisplay_attr(tb, MDL_attr._attrs_attrRsMap(blk.attrRsMap));
    }}));
    blk.stats.add(TP_stat.blk_attrOutput, extend(StatValue, {display(tb) {
      tb.row();
      MDL_table.setTable_base(tb, (function() {
        const matArr = [];

        matArr.push(["", MDL_bundle._term("lovec", "resource"), TP_stat.blk_attrReq.localized()]);
        blk.attrRsMap.forEachRow(2, (nmAttr, nmRs) => {
          let rs = MDL_content._ct(nmRs, "rs");
          if(rs == null) return;

          let rowArr = [];
          rowArr.push(rs, rs.localizedName, MDL_attr._attrB(nmAttr));
          matArr.push(rowArr);
        });

        return matArr;
      })());
    }}));
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw.comp_drawPlace_baseBlock(blk, tx, ty, rot, valid);
    MDL_draw.drawText_place(blk, tx, ty, Core.bundle.format(
      "bar.efficiency",
      Math.round(blk.ex_getAttrSum(tx, ty, rot) / MDL_attr._limit(blk.size, 1.0) * 100.0),
    ), valid);
  };


  function comp_updateTile(b) {
    b.ex_updateAttrRs();

    if(b.attrRs instanceof Item && b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) b.dump(b.attrRs);
    if(b.attrRs instanceof Liquid) b.dumpLiquid(b.attrRs, 2.0);
  };


  function comp_onProximityUpdate(b) {
    let tup = MDL_attr._dynaAttrTup(b.block.ex_getAttrRsMap(), b.block.ex_getTs(b.tileX(), b.tileY(), b.rotation), b.block.ex_getAttrMode());
    if(tup == null) {
      b.attrSum = 0.0;
      b.attrRs = null;
    } else {
      b.attrSum = tup[1];
      b.attrRs = tup[2];
    };
  };


  function comp_setBars(blk) {
    blk.removeBar("efficiency");
    blk.addBar("efficiency", b => new Bar(
      Core.bundle.format("bar.efficiency", Math.round(b.ex_getEffc() * 100.0)),
      Pal.lightOrange,
      () => Mathf.clamp(b.ex_getEffc()),
    ));
  };


  function comp_canPlaceOn(blk, t, team, rot) {
    return t != null && blk.ex_getAttrSum(t.x, t.y, rot) > 0.0;
  };


  function comp_shouldConsume(b) {
    if(b.attrRs instanceof Liquid) {
      return b.liquids != null && b.liquids.get(b.attrRs) < b.block.liquidCapacity;
    } else if(b.attrRs instanceof Item) {
      return b.items != null && b.items.get(b.attrRs) <= b.getMaximumAccepted(b.attrRs) - b.ex_getProdAmt();
    } else return true;
  };


  function comp_getProgressIncrease(b, time) {
    return 1.0 / time * b.edelta();
  };


  function comp_efficiencyScale(b) {
    return b.shouldScaleCons ? b.ex_getEffc() : 1.0;
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.ex_getEffc();
  };


  const comp_ex_getAttrSum = function(blk, tx, ty, rot) {
    const thisFun = comp_ex_getAttrSum;

    if(thisFun.funTup.length === 0 || thisFun.funTup[0] !== blk || thisFun.funTup[1] !== tx || thisFun.funTup[2] !== ty || thisFun.funTup[3] !== rot) {
      thisFun.funTup[0] = blk;
      thisFun.funTup[1] = tx;
      thisFun.funTup[2] = ty;
      thisFun.funTup[3] = rot;

      let tup = MDL_attr._dynaAttrTup(blk.attrRsMap, blk.ex_getTs(tx, ty, rot), blk.attrMode);
      thisFun.funTup[4] = tup == null ? 0.0 : tup[1];
    };

    return thisFun.funTup[4];
  }
  .setProp({
    "funTup": [],
  });


  function comp_ex_getEffc(b) {
    return b.attrSum / MDL_attr._limit(b.block.size, 1.0);
  };


  function comp_ex_updateAttrRs(b) {
    if(b.attrRs == null) return;

    b.prog += b.getProgressIncrease(b.block.ex_getCraftTime());
    if(b.prog > 1.0) {
      b.prog %= 1.0;
      b.ex_craftAttrRs();
    };
    if(b.attrRs instanceof Liquid && b.liquids != null && b.liquids.get(b.attrRs) < b.block.liquidCapacity) {
      b.handleLiquid(b, b.attrRs, b.block.ex_getProdAmt() * b.getProgressIncrease(1.0));
    };
  };


  function comp_ex_craftAttrRs(b) {
    if(b.attrRs instanceof Item && b.items != null) {
      FRAG_item.produceItem(b, b.attrRs, b.block.ex_getProdAmt());
      PARENT.craft(b);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- block ----------> */


    init: function(blk) {
      PARENT.init(blk);
      comp_init(blk);
    },


    setStats: function(blk) {
      PARENT.setStats(blk);
      comp_setStats(blk);
    },


    // @NOSUPER
    drawPlace: function(blk, tx, ty, rot, valid) {
      PARENT.drawPlace(blk, tx, ty, rot, valid);
      comp_drawPlace(blk, tx, ty, rot, valid);
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
      comp_updateTile(b);
    },


    onProximityUpdate: function(b) {
      PARENT.onProximityUpdate(b);
      comp_onProximityUpdate(b);
    },


    draw: function(b) {
      PARENT.draw(b);
    },


    drawSelect: function(b) {
      PARENT.drawSelect(b);
    },


    /* <---------- block (specific) ----------> */


    setBars: function(blk) {
      comp_setBars(blk);
    },


    // @NOSUPER
    canPlaceOn: function(blk, t, team, rot) {
      return comp_canPlaceOn(blk, t, team, rot);
    },


    /* <---------- build (specific) ----------> */


    shouldConsume: function(b) {
      return comp_shouldConsume(b);
    },


    // @NOSUPER
    getProgressIncrease: function(b, time) {
      return comp_getProgressIncrease(b, time);
    },


    // @NOSUPER
    efficiencyScale: function(b) {
      return comp_efficiencyScale(b);
    },


    updateEfficiencyMultiplier: function(b) {
      comp_updateEfficiencyMultiplier(b);
    },


    write: function(b, wr) {
      wr.f(b.prog);
    },


    read: function(b, rd, revi) {
      b.prog = rd.f();
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": [],
    }),


    // @LATER
    // @NOSUPER
    ex_getTs: function(blk, tx, ty, rot) {
      return Array.air;
    },


    // @NOSUPER
    ex_getAttrRsMap: function(blk) {
      return blk.attrRsMap;
    },


    // @NOSUPER
    ex_getAttrMode: function(blk) {
      return blk.attrMode;
    },


    // @LATER
    // @NOSUPER
    ex_getCraftTime: function(blk) {
      return 60.0;
    },


    // @LATER
    // @NOSUPER
    ex_getProdAmt: function(blk) {
      return 1.0;
    },


    // @NOSUPER
    ex_getAttrSum: function(blk, tx, ty, rot) {
      return comp_ex_getAttrSum(blk, tx, ty, rot);
    },


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_getAttrRs: function(b) {
      return b.attrRs;
    },


    // @NOSUPER
    ex_getEffc: function(b) {
      return comp_ex_getEffc(b);
    },


    // @NOSUPER
    ex_updateAttrRs: function(b) {
      comp_ex_updateAttrRs(b);
    },


    // @NOSUPER
    ex_craftAttrRs: function(b) {
      comp_ex_craftAttrRs(b);
    },


  };


  module.exports = TEMPLATE;
