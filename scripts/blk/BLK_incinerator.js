/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Incinerator but actually a crafter.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * GenericCrafter
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


  const PARENT = require("lovec/blk/BLK_baseItemBlock");
  const EFF = require("lovec/glb/GLB_eff");
  const JAVA = require("lovec/glb/GLB_java");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.selectionColumns = 10;

    blk.configurable = true;
    blk.saveConfig = false;
    blk.clearOnDoubleTap = false;

    blk.config(JAVA.STRING, (b, str) => {
      b.ex_accRsTgs(str, false);
      EFF.squareFadePack[b.block.size].at(b);
    });

    blk.config(JAVA.OBJECT_ARRAY, (b, cfgArr) => {

      if(cfgArr[0] === "BLK_itemIncinerator") {
        let iCap = cfgArr.length;
        let i = 1;
        while(i < iCap) {
          let rs = MDL_content._ct(cfgArr[i], "rs");
          if(rs != null) b.ex_accRsTgs(rs, true);
          i++;
        };
        EFF.squareFadePack[b.block.size].at(b);
      };

      if(cfgArr[0] === "selector") {
        let rs = cfgArr[1];
        let isAdd = cfgArr[2];
        b.ex_accRsTgs(rs, isAdd);
        EFF.squareFadePack[b.block.size].at(b);
      };

    });
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-prog", b => new Bar(
      MDL_bundle._term("lovec", "progress"),
      Pal.ammo,
      () => Mathf.clamp(b.progress, 0.0, 1.0),
    ));
  };


  function comp_acceptItem(b, b_f, itm) {
    if(b.rsTgs.length === 0) {
      return b.items.total() < b.block.itemCapacity;
    } else {
      return b.rsTgs.includes(itm) && b.items.total() < b.block.itemCapacity;
    };
  };


  function comp_craft(b) {
    MDL_effect.playAt(b.x, b.y, b.craftSound, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);

    let flam = 0.0, explo = 0.0, pow = 0.0, amt = 0;
    b.items.each(itm => {
      if(b.block.consumesItem(itm)) return;
      if(b.block.outputItems != null && b.block.outputItems.some(itmStack => itmStack.item === itm)) return;

      amt = b.items.get(itm);
      flam += itm.flammability * amt * 3.0;
      explo += itm.explosiveness * amt * 3.0;
      pow += itm.charge * amt * 3.0;
      b.items.set(itm, 0);
    });

    if(flam > 0.0 || explo > 0.0 || pow > 0.0) {
      Sounds.bang.at(b);
      Damage.dynamicExplosion(b.x, b.y, flam, explo, pow, FRAG_attack._presExploRad(b.block.size) / Vars.tilesize, true);
    };
  };


  function comp_buildConfiguration(b, tb) {
    MDL_table.setSelector_ctMulti(tb, b.block, Vars.content.items().toArray(), () => b.rsTgs, val => b.configure(val), false, b.block.selectionRows, b.block.selectionColumns);

    tb.row();
    MDL_table.__btnCfg_base(tb, b, b => {
      b.configure("clear");
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


    setBars: function(blk) {
      comp_setBars(blk);
    },


    // @NOSUPER
    outputsItems: function(blk) {
      return blk.outputItems != null && blk.outputItems.length > 0;
    },


    /* <---------- build (specific) ----------> */


    // @NOSUPER
    acceptItem: function(b, b_f, itm) {
      return PARENT.acceptItem(b, b_f, itm) && comp_acceptItem(b, b_f, itm);
    },


    craft: function(b) {
      comp_craft(b);
    },


    // @NOSUPER
    buildConfiguration: function(b, tb) {
      comp_buildConfiguration(b, tb);
    },


    // @NOSUPER
    config: function(b) {
      return ["BLK_itemIncinerator"].pushAll(b.rsTgs.map(rs => rs == null ? "null" : rs.name)).toJavaArr();
    },


    write: function(b, wr) {
      processRevision(wr);
      MDL_io._wr_cts(wr, b.rsTgs);
    },


    read: function(b, rd, revi) {
      processRevision(rd);
      MDL_io._rd_cts(rd, b.rsTgs);
    },


    /* <---------- block (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(blk) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: [],
    }),


    /* <---------- build (extended) ----------> */


    // @NOSUPER
    ex_accRsTgs: function(b, param, isAdd) {
      if(param === "read") return b.rsTgs;
      if(param === "clear") {b.block.lastConfig = "clear"; return b.rsTgs.clear()};
      return isAdd ? b.rsTgs.pushUnique(param) : b.rsTgs.remove(param);
    },


  };


  TEMPLATE._std = function(craftEff, updateEff, updateEffP) {
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
      setBars() {
        this.super$setBars();
        TEMPLATE.setBars(this);
      },
      outputsItems() {
        return TEMPLATE.outputsItems(this);
      },
      ex_getTags() {
        return TEMPLATE.ex_getTags(this);
      },
      // @SPEC
      craftEffect: tryVal(craftEff, Fx.none), updateEffect: tryVal(updateEff, Fx.none), updateEffectChance: tryVal(updateEffP, 0.02),
    };
  };


  TEMPLATE._std_b = function(craftSe) {
    return {
      craftSound: tryVal(craftSe, Sounds.none),
      rsTgs: [],
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
        if(!TEMPLATE.acceptItem(this, b_f, itm)) return false;
        return true;
      },
      craft() {
        this.super$craft();
        TEMPLATE.craft(this);
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
      ex_accRsTgs(param, isAdd) {
        return TEMPLATE.ex_accRsTgs(this, param, isAdd);
      },
    };
  };


  module.exports = TEMPLATE;
