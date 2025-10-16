/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VARGEN = require("lovec/glb/GLB_varGen");


  const CLS_recipeBuilder = require("lovec/cls/util/builder/CLS_recipeBuilder");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_content = require("lovec/mdl/MDL_content");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Generates a recipe header.
   * ---------------------------------------- */
  const genRcHeader = function(nmCt, categ) {
    return categ.toUpperCase() + ": <" + nmCt + ">";
  };
  exports.genRcHeader = genRcHeader;


  /* ----------------------------------------
   * NOTE:
   *
   * Used in recipe generator, adds recipe to the recipe object.
   * Any recipe added by this method will be tagged as GENERATED.
   * Use {CLS_recipeBuilder} to modify the I/O fields.
   * ----------------------------------------
   * IMPORTANT:
   *
   * Recipe generators should be called on CLIENT LOAD.
   * ---------------------------------------- */
  const addRc = function(rc, nmCt, categ, objF, rcBuilderObj) {
    let rcObj = {
      "icon": nmCt,
      "category": categ,
      "isGenerated": true,
    };

    if(rcBuilderObj != null) {
      for(let key in rcBuilderObj) {
        rcObj[key] = rcBuilderObj[key];
      };
    };

    if(objF != null) objF(rcObj);

    rc["recipe"].push(genRcHeader(nmCt, categ), rcObj);
  };
  exports.addRc = addRc;


  /* <---------- generator ----------> */


  /* ----------------------------------------
  * NOTE:
  *
  * Recipe generator: alloy furnace.
  * Converts materials into alloy metal.
  * ---------------------------------------- */
  const _gen_alloyFurnace = function(rc, objF, boolF, amtO, pO, maxTemp) {
    if(boolF == null) boolF = Function.airTrue;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(maxTemp == null) maxTemp = Infinity;

    DB_item.db["map"]["recipe"]["alloying"].forEachRow(3, (nmItm, tempReq, arr) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(tempReq > maxTemp || !boolF(itm)) return;

      let amt = amtO * pO;
      let bi = [];
      arr.forEachRow(3, (tmp, frac, p) => {
        if(!(tmp instanceof Array)) {
          let rs = MDL_content._ct(tmp, "rs");
          if(rs == null) return;
          bi.push(rs.name, Math.round(amt * frac * (1.0 / p)), p);
        } else {
          let subBi = [];
          tmp.forEachRow(3, (tmp1, frac1, p1) => {
            let rs = MDL_content._ct(tmp1, "rs");
            if(rs == null) return;
            subBi.push(rs.name, Math.round(amt * frac1 * (1.0 / p1)), p1);
          });
          bi.push(subBi, -1.0, -1.0);
        };
      });

      addRc(
        rc,
        itm.name,
        "alloying",
        obj => {
          obj["tempReq"] = tempReq;
          if(objF != null) objF(obj);
        },
        new CLS_recipeBuilder()
        .__bi(bi)
        .__bo([itm.name, amtO, pO])
        .build(),
      );
    });
  };
  exports._gen_alloyFurnace = _gen_alloyFurnace;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: brick kiln.
   * Converts brick blend to brick.
   * ---------------------------------------- */
  const _gen_brickKiln = function(rc, objF, boolF, amtI, pI, amtO, pO, maxTemp) {
    if(boolF == null) boolF = Function.airTrue;
    if(amtI == null) amtI = 1;
    if(pI == null) pI = 1.0;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(maxTemp == null) maxTemp = Infinity;

    DB_item.db["map"]["recipe"]["brickBaking"].forEachRow(2, (nmItm, tup) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      let itmTg = MDL_content._ct(tup[0], "rs");
      if(itmTg == null) return;
      if(tup[1] > maxTemp || !boolF(itm, itmTg)) return;

      addRc(
        rc,
        itm.name,
        "brick-baking",
        obj => {
          obj["tempReq"] = tup[1];
          if(objF != null) objF(obj);
        },
        new CLS_recipeBuilder()
        .__bi([itm, amtI, pI])
        .__bo([itmTg, amtO, pO])
        .build(),
      );
    });
  };
  exports._gen_brickKiln = _gen_brickKiln;


  /* ----------------------------------------
  * NOTE:
  *
  * Recipe generator: caster.
  * Converts materials into casting target items.
  * ---------------------------------------- */
  const _gen_caster = function(rc, objF, boolF, amtO, pO, maxTemp) {
    if(boolF == null) boolF = Function.airTrue;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(maxTemp == null) maxTemp = Infinity;

    DB_item.db["map"]["recipe"]["casting"].forEachRow(2, (nmItm, tup) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(tup[1] > maxTemp || !boolF(itm)) return;

      let amt = amtO * pO;
      let bi = [];
      tup[0].forEachRow(3, (tmp, frac, p) => {
        if(!(tmp instanceof Array)) {
          let rs = MDL_content._ct(tmp, "rs");
          if(rs == null) return;
          bi.push(rs.name, Math.round(amt * frac * (1.0 / p)), p);
        } else {
          let subBi = [];
          tmp.forEachRow(3, (tmp1, frac1, p1) => {
            let rs = MDL_content._ct(tmp1, "rs");
            if(rs == null) return;
            subBi.push(rs.name, Math.round(amt * frac1 * (1.0 / p1)), p1);
          });
          bi.push(subBi, -1.0, -1.0);
        };
      });

      addRc(
        rc,
        itm.name,
        "casting",
        obj => {
          obj["tempReq"] = tup[1];
          if(objF != null) objF(obj);
        },
        new CLS_recipeBuilder()
        .__bi(bi)
        .__bo([itm, amtO, pO])
        .build(),
      );
    });
  };
  exports._gen_caster = _gen_caster;


  /* ----------------------------------------
  * NOTE:
  *
  * Recipe generator: forge.
  * Converts materials into forging target items.
  * ---------------------------------------- */
  const _gen_forge = function(rc, objF, boolF, amtO, pO, maxTemp) {
    if(boolF == null) boolF = Function.airTrue;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(maxTemp == null) maxTemp = Infinity;

    DB_item.db["map"]["recipe"]["forging"].forEachRow(2, (nmItm, tup) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(tup[1] > maxTemp || !boolF(itm)) return;

      let amt = amtO * pO;
      let bi = [];
      tup[0].forEachRow(3, (tmp, frac, p) => {
        if(!(tmp instanceof Array)) {
          let rs = MDL_content._ct(tmp, "rs");
          if(rs == null) return;
          bi.push(rs.name, Math.round(amt * frac * (1.0 / p)), p);
        } else {
          let subBi = [];
          tmp.forEachRow(3, (tmp1, frac1, p1) => {
            let rs = MDL_content._ct(tmp1, "rs");
            if(rs == null) return;
            subBi.push(rs.name, Math.round(amt * frac1 * (1.0 / p1)), p1);
          });
          bi.push(subBi, -1.0, -1.0);
        };
      });

      addRc(
        rc,
        itm.name,
        "forging",
        obj => {
          obj["tempReq"] = tup[1];
          if(objF != null) objF(obj);
        },
        new CLS_recipeBuilder()
        .__bi(bi)
        .__bo([itm, amtO, pO])
        .build(),
      );
    });
  };
  exports._gen_forge = _gen_forge;


  /* ----------------------------------------
  * NOTE:
  *
  * Recipe generator: heater.
  * Consumes fuels to produce heat as abstract fluid.
  * ---------------------------------------- */
  const _gen_heater = function(rc, objF, boolF, amtI0mtpI, pI, mode, mtpO, maxTemp) {
    const thisFun = _gen_heater;

    if(mode == null) mode = "item";
    if(!mode.equalsAny(thisFun.modes)) return;
    if(boolF == null) boolF = Function.airTrue;
    if(amtI0mtpI == null) amtI0mtpI = 1.0;
    if(pI == null) pI = 1.0;
    if(mtpO == null) mtpO = 1.0;
    if(maxTemp == null) maxTemp = Infinity;

    (function() {
      switch(mode) {
        case "item" : return VARGEN.fuelItms;
        case "liquid" : return VARGEN.fuelLiqs;
        case "gas" : return VARGEN.fuelGases;
        case "any" : return VARGEN.fuelItms.concat(VARGEN.fuelLiqs).concat(VARGEN.fuelGases);
      };
    })().sort((ct1, ct2) => FRAG_faci._fuelLvl(ct1) - FRAG_faci._fuelLvl(ct2)).forEachFast(ct => {
      let fuelPon = FRAG_faci._fuelPon(ct);
      let fuelLvl = FRAG_faci._fuelLvl(ct);
      if(fuelLvl * 100.0 > maxTemp || !boolF(ct)) return;

      if(ct instanceof Item) {
        addRc(
          rc,
          ct.name,
          "heating",
          obj => {
            obj["timeScl"] = fuelPon;
            obj["tempReq"] = fuelLvl * 100.0 - 50.0;
            if(objF != null) objF(obj);
          },
          new CLS_recipeBuilder()
          .__bi([ct.name, amtI0mtpI, pI])
          .__co([VARGEN.auxHeat, fuelLvl / 60.0 * mtpO])
          .build(),
        );
      } else {
        addRc(
          rc,
          ct.name,
          "heating",
          obj => {
            obj["tempReq"] = fuelLvl * 100.0 - 50.0;
            if(objF != null) objF(obj);
          },
          new CLS_recipeBuilder()
          .__ci(ct.name, fuelPon * amtI0mtpI)
          .__co([VARGEN.auxHeat, fuelLvl / 60.0 * mtpO])
          .build(),
        );
      };
    });
  }
  .setProp({
    modes: ["item", "liquid", "gas", "any"],
  });
  exports._gen_heater = _gen_heater;


  /* ----------------------------------------
  * NOTE:
  *
  * Recipe generator: mixer.
  * Mixes materials into blend.
  * ---------------------------------------- */
  const _gen_mixer = function(rc, objF, boolF, amtO, pO, isBallMill, minHardness, maxHardness, abrasionFactor) {
    if(boolF == null) boolF = Function.airTrue;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(minHardness == null) minHardness = 0;
    if(maxHardness == null) maxHardness = Infinity;
    if(abrasionFactor == null) abrasionFactor = 1.0;

    DB_item.db["map"]["recipe"][isBallMill ? "ballMillMixing" : "mixing"].forEachRow(2, (nmItm, arr) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      if(!boolF(itm)) return;

      let amt = amtO * pO;
      let hardness = 0;
      let bi = [];
      arr.forEachRow(3, (tmp, frac, p) => {
        if(!(tmp instanceof Array)) {
          let rs = MDL_content._ct(tmp, "rs");
          if(rs == null) return;
          if(isBallMill && rs instanceof Item && rs.hardness > hardness) hardness = rs.hardness;
          bi.push(rs.name, Math.round(amt * frac * (1.0 / p)), p);
        } else {
          let subBi = [];
          tmp.forEachRow(3, (tmp1, frac1, p1) => {
            let rs = MDL_content._ct(tmp1, "rs");
            if(rs == null) return;
            if(isBallMill && rs instanceof Item && rs.hardness > hardness) hardness = rs.hardness;
            subBi.push(rs.name, Math.round(amt * frac1 * (1.0 / p1)), p1);
          });
          bi.push(subBi, -1.0, -1.0);
        };
      });

      addRc(
        rc,
        itm.name,
        isBallMill ? "ball-mill-mixing" : "mixing",
        obj => {
          if(isBallMill) obj["durabDecMtp"] = Mathf.lerp(1.0, 1.5 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0);
          if(objF != null) objF(obj);
        },
        new CLS_recipeBuilder()
        .__bi(bi)
        .__bo([itm.name, amtO, pO])
        .build(),
      );
    });
  };
  exports._gen_mixer = _gen_mixer;


  /* ----------------------------------------
  * NOTE:
  *
  * Recipe generator: purifier.
  * Purifies ore chunks/dusts. Specially designed for magnetic separators.
  * ---------------------------------------- */
  const _gen_purifier_magnetic = function(rc, objF, boolF, amtI, pI) {
    if(boolF == null) boolF = Function.airTrue;
    if(amtI == null) amtI = 1;
    if(pI == null) pI = 1.0;

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

      addRc(
        rc,
        itm.name,
        "purification",
        objF,
        new CLS_recipeBuilder()
        .__bi([itm.name, amtI, pI])
        .__bo(bo)
        .build(),
      );
    });
  };
  exports._gen_purifier_magnetic = _gen_purifier_magnetic;


  /* ----------------------------------------
  * NOTE:
  *
  * Recipe generator: rock crusher.
  * Converts ore items into chunks.
  * ---------------------------------------- */
  const _gen_rockCrusher = function(rc, objF, boolF, amtI, pI, amtO, pO, minHardness, maxHardness, abrasionFactor) {
    if(boolF == null) boolF = Function.airTrue;
    if(amtI == null) amtI = 1;
    if(pI == null) pI = 1.0;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(minHardness == null) minHardness = 0;
    if(maxHardness == null) maxHardness = Infinity;
    if(abrasionFactor == null) abrasionFactor = 1.0;

    VARGEN.intmds["rs-chunks"].forEachCond(itm => !MDL_content._hasAnyTag(itm, "rs-p1", "rs-p2"), itm => {
      let itmParent = itm.ex_getParent();
      let hardness = itmParent.hardness;
      if(hardness < minHardness || hardness > maxHardness || !boolF(itm, itmParent)) return;

      addRc(
        rc,
        itm.name,
        "rock-crushing",
        obj => {
          obj["durabDecMtp"] = Mathf.lerp(1.0, 2.0 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0);
          if(objF != null) objF(obj);
        },
        new CLS_recipeBuilder()
        .__bi([itmParent.name, amtI, pI])
        .__bo([itm.name, amtO, pO])
        .build(),
      );
    });
  };
  exports._gen_rockCrusher = _gen_rockCrusher;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: rock crusher.
   * Converts some rocks into aggregate.
   * See {DB_item.db["group"]["aggregate"]}.
   * ---------------------------------------- */
  const _gen_rockCrusher_aggregate = function(rc, objF, boolF, amtI, pI, amtO, pO, minHardness, maxHardness, abrasionFactor) {
    if(boolF == null) boolF = Function.airTrue;
    if(amtI == null) amtI = 1;
    if(pI == null) pI = 1.0;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(minHardness == null) minHardness = 0;
    if(maxHardness == null) maxHardness = Infinity;
    if(abrasionFactor == null) abrasionFactor = 1.0;

    // Coarse aggregate to fine aggregate on top of everything
    addRc(
      rc,
      "loveclab-item0buil-coarse-aggregate",
      "aggregate-crushing",
      obj => {
        if(objF != null) objF(obj);
      },
      new CLS_recipeBuilder()
      .__bi(["loveclab-item0buil-coarse-aggregate", amtI, pI])
      .__bo(["loveclab-item0buil-fine-aggregate", amtO, pO])
      .build(),
    );

    DB_item.db["group"]["aggregate"].forEachRow(2, (nmItm, mtp) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      let hardness = itm.hardness;
      if(hardness < minHardness || hardness > maxHardness || !boolF(itm)) return;

      addRc(
        rc,
        nmItm,
        "aggregate-crushing",
        obj => {
          obj["durabDecMtp"] = Mathf.lerp(1.0, 2.0 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0);
          if(objF != null) objF(obj);
        },
        new CLS_recipeBuilder()
        .__bi([nmItm, Math.round(amtI * Math.max(mtp, 1.0)), pI * Math.min(mtp, 1.0)])
        .__bo(["loveclab-item0buil-coarse-aggregate", amtO, pO])
        .build(),
      );
    });
  };
  exports._gen_rockCrusher_aggregate = _gen_rockCrusher_aggregate;


  /* ----------------------------------------
  * NOTE:
  *
  * Recipe generator: pulverizer.
  * Converts ore items into dust.
  * ---------------------------------------- */
  const _gen_pulverizer = function(rc, objF, boolF, amtI, pI, amtO, pO, minHardness, maxHardness, abrasionFactor) {
    if(boolF == null) boolF = Function.airTrue;
    if(amtI == null) amtI = 1;
    if(pI == null) pI = 1.0;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(minHardness == null) minHardness = 0;
    if(maxHardness == null) maxHardness = Infinity;
    if(abrasionFactor == null) abrasionFactor = 1.0;

    VARGEN.intmds["rs-dust"].forEachCond(itm => !MDL_content._hasAnyTag(itm, "rs-p1", "rs-p2"), itm => {
      let itmParent = itm.ex_getParent();
      let hardness = itmParent.hardness;
      if(hardness < minHardness || hardness > maxHardness || !boolF(itm, itmParent)) return;

      addRc(
        rc,
        itm.name,
        "pulverization",
        obj => {
          obj["durabDecMtp"] = Mathf.lerp(1.0, 1.5 * abrasionFactor, Mathf.maxZero(hardness - minHardness) / 10.0);
          if(objF != null) objF(obj);
        },
        new CLS_recipeBuilder()
        .__bi([itmParent.name, amtI, pI])
        .__bo([itm.name, amtO, pO])
        .build(),
      );
    });
  };
  exports._gen_pulverizer = _gen_pulverizer;


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe generator: roasting furnace.
   * Converts items to their roasted form.
   * ---------------------------------------- */
  const _gen_roastingFurnace = function(rc, objF, boolF, amtI, pI, amtO, pO, maxTemp, maxFlam) {
    if(boolF == null) boolF = Function.airTrue;
    if(amtI == null) amtI = 1;
    if(pI == null) pI = 1.0;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(maxTemp == null) maxTemp = Infinity;
    if(maxFlam == null) maxFlam = Infinity;

    DB_item.db["map"]["recipe"]["roasting"].forEachRow(2, (nmItm, tup) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;
      let itmTg = MDL_content._ct(tup[0], "rs");
      if(itmTg == null) return;
      if(tup[1] > maxTemp || itm.flammability > maxFlam || itmTg.flammability > maxFlam || !boolF(itm, itmTg)) return;

      addRc(
        rc,
        itm.name,
        "roasting",
        obj => {
          obj["tempReq"] = tup[1];
          if(objF != null) objF(obj);
        },
        new CLS_recipeBuilder()
        .__bi([itm, amtI, pI])
        .__bo([itmTg, amtO, pO])
        .build(),
      );
    });
  };
  exports._gen_roastingFurnace = _gen_roastingFurnace;


  /* ----------------------------------------
  * NOTE:
  *
  * Recipe generator: sintering furnace.
  * Converts dust items back into their parent items (the ore at most time).
  * ---------------------------------------- */
  const _gen_sinteringFurnace = function(rc, objF, boolF, isConcentrate, amtI, pI, amtO, pO, maxTemp, maxFlam) {
    if(boolF == null) boolF = Function.airTrue;
    if(amtI == null) amtI = 1;
    if(pI == null) pI = 1.0;
    if(amtO == null) amtO = 1;
    if(pO == null) pO = 1.0;
    if(maxTemp == null) maxTemp = Infinity;
    if(maxFlam == null) maxFlam = Infinity;

    if(!isConcentrate) {
      VARGEN.intmds["rs-dust"].forEachCond(itm => !MDL_content._hasAnyTag(itm, "rs-p1", "rs-p2"), itm => {
        let itmParent = itm.ex_getParent();
        let tempReq = MDL_content._sintTemp(itmParent);
        if(tempReq > maxTemp || itm.flammability > maxFlam || itmParent.flammability > maxFlam || !boolF(itm, itmParent)) return;

        addRc(
          rc,
          itm.name,
          "sintering",
          obj => {
            obj["tempReq"] = tempReq;
            if(objF != null) objF(obj);
          },
          new CLS_recipeBuilder()
          .__bi([itm.name, amtI, pI])
          .__bo([itmParent.name, amtO, pO])
          .build(),
        );
      });
    } else {
      VARGEN.intmds["rs-chunks"].concat(VARGEN.intmds["rs-dust"]).filter(itm => MDL_content._hasAnyTag(itm, "rs-p1", "rs-p2")).forEachFast(itm => {
        let itmParent = itm.ex_getParent();
        if(itmParent == null) return;
        let itmTg = MDL_content._intmd(itm, "rs-ore0conc");
        if(itmTg == null) return;
        let tempReq = MDL_content._sintTemp(itmParent);
        if(tempReq > maxTemp || itm.flammability > maxFlam || itmParent.flammability > maxFlam || itmTg.flammability > maxFlam || !boolF(itm, itmParent, itmTg)) return;

        addRc(
          rc,
          itmTg.name,
          "concentrate-sintering",
          obj => {
            obj["tempReq"] = tempReq;
            if(objF != null) objF(obj);
          },
          new CLS_recipeBuilder()
          .__bi([itm.name, amtI, pI])
          .__bo([itmTg.name, amtO, pO])
          .build(),
        );
      });
    };
  };
  exports._gen_sinteringFurnace = _gen_sinteringFurnace;
