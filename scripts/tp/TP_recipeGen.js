/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VARGEN = require("lovec/glb/GLB_varGen");


  const CLS_recipeGenerator = require("lovec/cls/util/CLS_recipeGenerator");
  const CLS_recipeBuilder = require("lovec/cls/util/builder/CLS_recipeBuilder");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_fuel = require("lovec/mdl/MDL_fuel");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- generator ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: alloy furnace.
   * Converts materials into alloy metal.
   * ---------------------------------------- */
  const _g_alloyFurnace = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity);

    DB_item.db["map"]["recipe"]["alloying"].forEachRow(3, (nmItm, tempReq, arr) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(!boolF(itm) || tempReq > maxTemp) return;

      let amt = amtO * pO;
      let bi = [];
      arr.forEachRow(3, (tmp, frac, p) => {
        if(!(tmp instanceof Array)) {
          let tmp1 = MDL_content._ct(tmp, "rs");
          if(tmp1 == null) return;
          bi.push(tmp1.name, Math.round(amt * frac * (1.0 / p)), p);
        } else {
          let subBi = [];
          tmp.forEachRow(3, (tmp1, frac1, p1) => {
            let tmp2 = MDL_content._ct(tmp1, "rs");
            if(tmp2 == null) return;
            subBi.push(tmp2.name, Math.round(amt * frac1 * (1.0 / p1)), p1);
          });
          bi.push(subBi, -1.0, -1.0);
        };
      });

      this.addRc(
        rc, itm.name, "alloying", null,
        obj => {obj.tempReq = tempReq; objF(obj)},
        new CLS_recipeBuilder()
        .__bi(bi)
        .__bo([itm.name, amtO, pO])
        .build(),
      );
    });
  });
  exports._g_alloyFurnace = _g_alloyFurnace;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: brick kiln.
   * Converts brick blend to brick.
   * ---------------------------------------- */
  const _g_brickKiln = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity);

    DB_item.db["map"]["recipe"]["brickBaking"].forEachRow(2, (nmItm, tup) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      let itmTg = MDL_content._ct(tup[0], "rs");
      if(itmTg == null) return;
      if(!boolF(itm, itmTg) || tup[1] > maxTemp) return;

      this.addRc(
        rc, itm.name, "brick-baking", null,
        obj => {obj["tempReq"] = tup[1]; objF(obj)},
        new CLS_recipeBuilder()
        .__bi([itm, amtI, pI])
        .__bo([itmTg, amtO, pO])
        .build(),
      );
    });
  });
  exports._g_brickKiln = _g_brickKiln;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: caster.
   * Converts materials into casting target items.
   * ---------------------------------------- */
  const _g_caster = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity);

    DB_item.db["map"]["recipe"]["casting"].forEachRow(2, (nmItm, tup) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(!boolF(itm) || tup[1] > maxTemp) return;

      let amt = amtO * pO;
      let bi = [];
      tup[0].forEachRow(3, (tmp, frac, p) => {
        if(!(tmp instanceof Array)) {
          let tmp1 = MDL_content._ct(tmp, "rs");
          if(tmp1 == null) return;
          bi.push(tmp1.name, Math.round(amt * frac * (1.0 / p)), p);
        } else {
          let subBi = [];
          tmp.forEachRow(3, (tmp1, frac1, p1) => {
            let tmp2 = MDL_content._ct(tmp1, "rs");
            if(tmp2 == null) return;
            subBi.push(tmp2.name, Math.round(amt * frac1 * (1.0 / p1)), p1);
          });
          bi.push(subBi, -1.0, -1.0);
        };
      });

      this.addRc(
        rc, itm.name, "casting", null,
        obj => {obj["tempReq"] = tup[1]; objF(obj)},
        new CLS_recipeBuilder()
        .__bi(bi)
        .__bo([itm, amtO, pO])
        .build(),
      );
    });
  });
  exports._g_caster = _g_caster;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: forge.
   * Converts materials into forging target items.
   * ---------------------------------------- */
  const _g_forge = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity);

    DB_item.db["map"]["recipe"]["forging"].forEachRow(2, (nmItm, tup) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(!boolF(itm) || tup[1] > maxTemp) return;

      let amt = amtO * pO;
      let bi = [];
      tup[0].forEachRow(3, (tmp, frac, p) => {
        if(!(tmp instanceof Array)) {
          let tmp1 = MDL_content._ct(tmp, "rs");
          if(tmp1 == null) return;
          bi.push(tmp1.name, Math.round(amt * frac * (1.0 / p)), p);
        } else {
          let subBi = [];
          tmp.forEachRow(3, (tmp1, frac1, p1) => {
            let tmp2 = MDL_content._ct(tmp1, "rs");
            if(tmp2 == null) return;
            subBi.push(tmp2.name, Math.round(amt * frac1 * (1.0 / p1)), p1);
          });
          bi.push(subBi, -1.0, -1.0);
        };
      });

      this.addRc(
        rc, itm.name, "forging", null,
        obj => {obj["tempReq"] = tup[1]; objF(obj)},
        new CLS_recipeBuilder()
        .__bi(bi)
        .__bo([itm, amtO, pO])
        .build(),
      );
    });
  });
  exports._g_forge = _g_forge;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: heater.
   * Consumes fuels to produce heat as abstract fluid.
   * ---------------------------------------- */
  const _g_heater = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      mode = readParam(paramObj, "mode", "item"),
      mtpI = readParam(paramObj, "mtpI", readParam(paramObj, "amtI", 1)),
      pI = readParam(paramObj, "pI", 1.0),
      mtpO = readParam(paramObj, "mtpO", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity);

    (function() {
      switch(mode) {
        case "item" : return VARGEN.fuelItms;
        case "liquid" : return VARGEN.fuelLiqs;
        case "gas" : return VARGEN.fuelGases;
        default : return VARGEN.fuelItms.concat(VARGEN.fuelLiqs).concat(VARGEN.fuelGases);
      };
    })()
    .sort((ct1, ct2) => MDL_fuel._fuelLvl(ct1) - MDL_fuel._fuelLvl(ct2))
    .forEachFast(ct => {
      let fuelPon = MDL_fuel._fuelPon(ct);
      let fuelLvl = MDL_fuel._fuelLvl(ct);
      if(!boolF(ct) || fuelLvl * 100.0 > maxTemp) return;

      if(ct instanceof Item) {
        this.addRc(
          rc, ct.name, "heating", null,
          obj => {obj["timeScl"] = fuelPon; obj["tempReq"] = fuelLvl * 100.0 - 50.0; objF(obj)},
          new CLS_recipeBuilder()
          .__bi([ct.name, mtpI, pI])
          .__co([VARGEN.auxHeat, fuelLvl / 60.0 * mtpO])
          .build(),
        );
      } else {
        this.addRc(
          rc, ct.name, "heating", null,
          obj => {obj["tempReq"] = fuelLvl * 100.0 - 50.0; objF(obj)},
          new CLS_recipeBuilder()
          .__ci(ct.name, fuelPon * mtpI)
          .__co([VARGEN.auxHeat, fuelLvl / 60.0 * mtpO])
          .build(),
        );
      };
    });
  });
  exports._g_heater = _g_heater;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: mixer.
   * Mixes materials into blend.
   * ---------------------------------------- */
  const _g_mixer = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      isBallMill = readParam(paramObj, "isBallMill", false),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      minHardness = readParam(paramObj, "minHardness", 0),
      maxHardness = readParam(paramObj, "maxHardness", Infinity),
      abrasionFactor = readParam(paramObj, "abrasionFactor", 1.0);

    DB_item.db["map"]["recipe"][isBallMill ? "ballMillMixing" : "mixing"].forEachRow(2, (nmItm, arr) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(!boolF(itm)) return;

      let amt = amtO * pO;
      let hardness = 0;
      let bi = [];
      arr.forEachRow(3, (tmp, frac, p) => {
        if(!(tmp instanceof Array)) {
          let tmp1 = MDL_content._ct(tmp, "rs");
          if(tmp1 == null) return;
          if(isBallMill && tmp1 instanceof Item && tmp1.hardness > hardness) hardness = tmp1.hardness;
          bi.push(tmp1.name, Math.round(amt * frac * (1.0 / p)), p);
        } else {
          let subBi = [];
          tmp.forEachRow(3, (tmp1, frac1, p1) => {
            let tmp2 = MDL_content._ct(tmp1, "rs");
            if(tmp2 == null) return;
            if(isBallMill && tmp2 instanceof Item && tmp2.hardness > hardness) hardness = tmp2.hardness;
            subBi.push(tmp2.name, Math.round(amt * frac1 * (1.0 / p1)), p1);
          });
          bi.push(subBi, -1.0, -1.0);
        };
      });

      this.addRc(
        rc, itm.name, isBallMill ? "ball-mill-mixing" : "mixing", null,
        obj => {if(isBallMill) obj["durabDecMtp"] = Mathf.lerp(1.0, 1.5 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0); objF(obj)},
        new CLS_recipeBuilder()
        .__bi(bi)
        .__bo([itm.name, amtO, pO])
        .build(),
      );
    });
  });
  exports._g_mixer = _g_mixer;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: purifier.
   * Purifies ore chunks/dusts. Specially designed for magnetic separators.
   * ---------------------------------------- */
  const _g_purifierMagnetic = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0);

    DB_item.db["map"]["recipe"]["purificationMagnetic"].forEachRow(2, (nmItm, arr) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(!boolF(itm)) return;

      let amt = amtI * pI;
      let bo = [];
      arr.forEachRow(3, (nmRs, frac, p) => {
        let rs = MDL_content._ct(nmRs, "rs");
        if(rs == null) return;
        bo.push(rs, Math.round(amt * frac * (1.0 / p)), p);
      });

      this.addRc(
        rc, itm.name, "purification", null,
        objF,
        new CLS_recipeBuilder()
        .__bi([itm.name, amtI, pI])
        .__bo(bo)
        .build(),
      );
    });
  });
  exports._g_purifierMagnetic = _g_purifierMagnetic;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: rock crusher.
   * Converts ore items into chunks.
   * ---------------------------------------- */
  const _g_rockCrusher = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      minHardness = readParam(paramObj, "minHardness", 0),
      maxHardness = readParam(paramObj, "maxHardness", Infinity),
      abrasionFactor = readParam(paramObj, "abrasionFactor", 1.0);

    VARGEN.intmds["rs-chunks"].forEachCond(itm => !MDL_content._hasAnyTag(itm, "rs-p1", "rs-p2"), itm => {
      let itmParent = itm.ex_getIntmdParent();
      let hardness = itmParent.hardness;
      if(!boolF(itm, itmParent) || hardness < minHardness || hardness > maxHardness) return;

      this.addRc(
        rc, itm.name, "rock-crushing", null,
        obj => {obj["durabDecMtp"] = Mathf.lerp(1.0, 2.0 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0); objF(obj)},
        new CLS_recipeBuilder()
        .__bi([itmParent.name, amtI, pI])
        .__bo([itm.name, amtO, pO])
        .build(),
      );
    });
  });
  exports._g_rockCrusher = _g_rockCrusher;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: rock crusher.
   * Converts some rocks into aggregate.
   * See {DB_item.db["group"]["aggregate"]}.
   * ---------------------------------------- */
  const _g_rockCrusherAggregate = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      minHardness = readParam(paramObj, "minHardness", 0),
      maxHardness = readParam(paramObj, "maxHardness", Infinity),
      abrasionFactor = readParam(paramObj, "abrasionFactor", 1.0);

    // Coarse aggregate to fine aggregate on top of everything
    this.addRc(
      rc, "loveclab-item0buil-coarse-aggregate", "aggregate-crushing", null,
      objF,
      new CLS_recipeBuilder()
      .__bi(["loveclab-item0buil-coarse-aggregate", amtI, pI])
      .__bo(["loveclab-item0buil-fine-aggregate", amtO, pO])
      .build(),
    );

    DB_item.db["group"]["aggregate"].forEachRow(2, (nmItm, mtp) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      let hardness = itm.hardness;
      if(!boolF(itm) || hardness < minHardness || hardness > maxHardness) return;

      this.addRc(
        rc, nmItm, "aggregate-crushing", null,
        obj => {obj["durabDecMtp"] = Mathf.lerp(1.0, 2.0 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0); objF(obj)},
        new CLS_recipeBuilder()
        .__bi([nmItm, Math.round(amtI * Math.max(mtp, 1.0)), pI * Math.min(mtp, 1.0)])
        .__bo(["loveclab-item0buil-coarse-aggregate", amtO, pO])
        .build(),
      );
    });
  });
  exports._g_rockCrusherAggregate = _g_rockCrusherAggregate;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: pulverizer.
   * Converts ore items into dust.
   * ---------------------------------------- */
  const _g_pulverizer = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      minHardness = readParam(paramObj, "minHardness", 0),
      maxHardness = readParam(paramObj, "maxHardness", Infinity),
      abrasionFactor = readParam(paramObj, "abrasionFactor", 1.0);

    VARGEN.intmds["rs-dust"].forEachCond(itm => !MDL_content._hasAnyTag(itm, "rs-p1", "rs-p2"), itm => {
      let itmParent = itm.ex_getIntmdParent();
      let hardness = itmParent.hardness;
      if(!boolF(itm, itmParent) || hardness < minHardness || hardness > maxHardness) return;

      this.addRc(
        rc, itm.name, "pulverization", null,
        obj => {obj["durabDecMtp"] = Mathf.lerp(1.0, 1.5 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0); objF(obj)},
        new CLS_recipeBuilder()
        .__bi([itmParent.name, amtI, pI])
        .__bo([itm.name, amtO, pO])
        .build(),
      );
    });
  });
  exports._g_pulverizer = _g_pulverizer;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: roasting furnace.
   * Converts items to their roasted form.
   * ---------------------------------------- */
  const _g_roastingFurnace = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity),
      maxFlam = readParam(paramObj, "maxFlam", Infinity);

    DB_item.db["map"]["recipe"]["roasting"].forEachRow(2, (nmItm, tup) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      let itmTg = MDL_content._ct(tup[0], "rs");
      if(itmTg == null) return;
      if(!boolF(itm, itmTg) || tup[1] > maxTemp || itm.flammability > maxFlam || itmTg.flammability > maxFlam) return;

      this.addRc(
        rc, itm.name, "roasting", null,
        obj => {obj["tempReq"] = tup[1]; objF(obj)},
        new CLS_recipeBuilder()
        .__bi([itm, amtI, pI])
        .__bo([itmTg, amtO, pO])
        .build(),
      );
    });
  });
  exports._g_roastingFurnace = _g_roastingFurnace;


  /* ----------------------------------------
  * NOTE:
  *
  * Recipe generator: sintering furnace.
  * Converts dust items back into their parent items (the ore at most time).
  * ---------------------------------------- */
  const _g_sinteringFurnace = new CLS_recipeGenerator(function(rc, paramObj) {
    let
      objF = readParam(paramObj, "objF", Function.air),
      boolF = readParam(paramObj, "boolF", Function.airTrue),
      isConcentrate = readParam(paramObj, "isConcentrate", false),
      amtI = readParam(paramObj, "amtI", 1),
      pI = readParam(paramObj, "pI", 1.0),
      amtO = readParam(paramObj, "amtO", 1),
      pO = readParam(paramObj, "pO", 1.0),
      maxTemp = readParam(paramObj, "maxTemp", Infinity),
      maxFlam = readParam(paramObj, "maxFlam", Infinity);

    if(!isConcentrate) {
      VARGEN.intmds["rs-dust"].forEachCond(itm => !MDL_content._hasAnyTag(itm, "rs-p1", "rs-p2"), itm => {
        let itmParent = itm.ex_getIntmdParent();
        let tempReq = MDL_content._sintTemp(itmParent);
        if(!boolF(itm, itmParent) || tempReq > maxTemp || itm.flammability > maxFlam || itmParent.flammability > maxFlam) return;

        this.addRc(
          rc, itm.name, "sintering", null,
          obj => {obj["tempReq"] = tempReq; objF(obj)},
          new CLS_recipeBuilder()
          .__bi([itm.name, amtI, pI])
          .__bo([itmParent.name, amtO, pO])
          .build(),
        );
      });
    } else {
      VARGEN.intmds["rs-chunks"].concat(VARGEN.intmds["rs-dust"]).filter(itm => MDL_content._hasAnyTag(itm, "rs-p1", "rs-p2")).forEachFast(itm => {
        let itmParent = itm.ex_getIntmdParent();
        if(itmParent == null) return;
        let itmTg = MDL_content._intmd(itm, "rs-ore0conc");
        if(itmTg == null) return;
        let tempReq = MDL_content._sintTemp(itmParent);
        if(!boolF(itm, itmParent, itmTg) || tempReq > maxTemp || itm.flammability > maxFlam || itmParent.flammability > maxFlam || itmTg.flammability > maxFlam) return;

        this.addRc(
          rc, itmTg.name, "concentrate-sintering", null,
          obj => {obj["tempReq"] = tempReq; objF(obj)},
          new CLS_recipeBuilder()
          .__bi([itm.name, amtI, pI])
          .__bo([itmTg.name, amtO, pO])
          .build(),
        );
      });
    };
  });
  exports._g_sinteringFurnace = _g_sinteringFurnace;
