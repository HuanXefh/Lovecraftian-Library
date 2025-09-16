/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Blocks for item storage, just like {Container} and {Vault} in vanilla game.
   * Can be configured to dump particular items.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * StorageBlock
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


  const PARENT = require("lovec/blk/BLK_baseStorageBlock");
  const EFF = require("lovec/glb/GLB_eff");
  const JAVA = require("lovec/glb/GLB_java");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.selectionColumns === 4) blk.selectionColumns = 10;

    blk.update = true;

    blk.configurable = true;
    blk.saveConfig = true;
    blk.clearOnDoubleTap = false;

    blk.config(JAVA.STRING, (b, str) => {
      b.ex_accDumpTgs(str, false);
      EFF.squareFadePack[b.block.size].at(b);
    });

    blk.config(JAVA.OBJECT_ARRAY, (b, cfgArr) => {

      if(cfgArr[0] === "BLK_container") {
        let iCap = cfgArr.length;
        let i = 1;
        while(i < iCap) {
          let rs = MDL_content._ct(cfgArr[i], "rs");
          if(rs != null) b.ex_accDumpTgs(rs, true);
          i++;
        };
        EFF.squareFadePack[b.block.size].at(b);
      };

      if(cfgArr[0] === "selector") {
        let rs = cfgArr[1];
        let isAdd = cfgArr[2];
        b.ex_accDumpTgs(rs, isAdd);
        EFF.squareFadePack[b.block.size].at(b);
      };

    });
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.itemsMoved, 60.0 / blk.dumpTime, StatUnit.itemsSecond);
  };


  function comp_updateTile(b) {
    if(b.dumpTgs.length === 0) return;

    var bSpd = MDL_entity._bSpd(b);
    if(bSpd > 0.0 && b.timerDump.get(b.block.dumpTime / bSpd)) b.dump(b.dumpTgs.readRand());
  };


  function comp_acceptItem(b, b_f, itm) {
    return b_f == null || !MDL_cond._isCont(b_f.block);
  };


  function comp_warmup(b) {
    var amt = 0;
    var typeAmt = 0;
    b.items.each(itm => {
      typeAmt++;
      amt += b.items.get(itm);
    });

    return typeAmt === 0 ? 0.0 : amt / typeAmt / b.block.itemCapacity;
  };


  function comp_buildConfiguration(b, tb) {
    MDL_table.setSelector_ctMulti(tb, b.block, Vars.content.items().toArray(), () => b.dumpTgs, val => b.configure(val), false, b.block.selectionRows, b.block.selectionColumns);

    tb.row();
    MDL_table.__btnCfg_base(tb, b, b => {
      Call.tileConfig(Vars.player, b, "clear");
      b.deselect();
    }, VARGEN.icons.cross).tooltip(MDL_bundle._info("lovec", "tt-clear-selection"), true);
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
      comp_updateTile(b);
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


    /* <---------- build (specific) ----------> */


    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm) && comp_acceptItem(b, b_f, itm);
    },


    // @NOSUPER
    warmup: function(b) {
      return comp_warmup(b);
    },


    // @NOSUPER
    buildConfiguration: function(b, tb) {
      comp_buildConfiguration(b, tb);
    },


    // @NOSUPER
    config: function(b) {
      return ["BLK_container"].pushAll(b.dumpTgs.map(rs => rs == null ? "null" : rs.name)).toJavaArr();
    },


    write: function(b, wr) {
      MDL_io._wr_cts(wr, b.dumpTgs);
    },


    read: function(b, rd, revi) {
      MDL_io._rd_cts(rd, b.dumpTgs);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.funArr;
    }.setProp({
      "funArr": ["blk-cont"],
    }),


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accDumpTgs: function(b, param, isAdd) {
      if(param === "read") return b.dumpTgs;
      if(param === "clear") return b.dumpTgs.clear();
      return isAdd ? b.dumpTgs.pushUnique(param) : b.dumpTgs.remove(param);
    },


  };


  TEMPLATE._std = function() {
    return {
      init() {
        this.super$init();
        TEMPLATE.init(this);
      },
      setStats() {
        this.super$setStats();
        TEMPLATE.setStats(this);
      },
      drawPlace(tx, ty, rot, valid) {
        this.super$drawPlace(tx, ty, rot, valid);
        TEMPLATE.drawPlace(this, tx, ty, rot, valid);
      },
      outputsItems() {
        return TEMPLATE.outputsItems(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
    };
  };


  TEMPLATE._std_b = function() {
    return {
      timerDump: new Interval(1), dumpTgs: [],
      created() {
        this.super$created();
        TEMPLATE.created(this);
      },
      onDestroyed() {
        this.super$onDestroyed();
        TEMPLATE.onDestroyed(this);
      },
      updateTile() {
        this.super$updateTile();
        TEMPLATE.updateTile(this);
      },
      onProximityUpdate() {
        this.super$onProximityUpdate();
        TEMPLATE.onProximityUpdate(this);
      },
      draw() {
        this.super$draw();
        TEMPLATE.draw(this);
      },
      drawSelect() {
        this.super$drawSelect();
        TEMPLATE.drawSelect(this);
      },
      acceptItem(b_f, itm) {
        if(!this.super$acceptItem(b_f, itm)) return false;
        if(!TEMPLATE.acceptItem(this, b_f, itm)) return false;
        return true;
      },
      warmup() {
        return TEMPLATE.warmup(this);
      },
      buildConfiguration(tb) {
        TEMPLATE.buildConfiguration(this, tb);
      },
      config() {
        return TEMPLATE.config(this);
      },
      write(wr) {
        this.super$write(wr);
        TEMPLATE.write(this, wr);
      },
      read(rd, revi) {
        this.super$read(rd, revi);
        TEMPLATE.read(this, rd, revi);
      },
      ex_accDumpTgs(param, isAdd) {
        return TEMPLATE.ex_accDumpTgs(this, param, isAdd);
      },
    };
  };


  module.exports = TEMPLATE;
