/* ----------------------------------------
 * NOTE:
 *
 * Database of reaction properties used in {MDL_reaction}.
 * ---------------------------------------- */


const EFF = require("lovec/glb/GLB_eff");


const FRAG_attack = require("lovec/frag/FRAG_attack");
const FRAG_puddle = require("lovec/frag/FRAG_puddle");


const MDL_content = require("lovec/mdl/MDL_content");
const MDL_effect = require("lovec/mdl/MDL_effect");


const DB_fluid = require("lovec/db/DB_fluid");
const DB_item = require("lovec/db/DB_item");


const db = {


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


  /* ----------------------------------------
   * NOTE:
   *
   * Reaction definition, {b} and {rs} can be {null}.
   * Note that the script is called on server side only.
   * Format: {reaction, [p, (param, x, y, b, rs) => {...}]}.
   * ---------------------------------------- */
  reaction: [

    // Create explosion
    "explosion", [0.001, (param, x, y, b, rs) => {
      FRAG_attack._a_explosion_global(
        x, y,
        Mathf.lerp(40.0, 200.0, ct1.explosiveness) * param,
        16.0 * param,
        2.0 + param * 3.0,
      );
    }],

    // Create fire
    "heat", [0.01, (param, x, y, b, rs) => {
      MDL_effect.showAt_global(x, y, EFF.heatSmog, 0.0);
      Bullets.fireball.createNet(Team.derelict, x, y, Mathf.random(360.0), -1.0, 1, 1);
    }],

    // Item changed to another item
    "denaturing", [0.002, (param, x, y, b, rs) => {
      if(b == null || rs == null) return;
      if(b.items == null) return;
      let itm = db["denaturingTarget"].read(rs.name);
      if(itm == null) return;

      let amt = Math.round(param);
      b.removeStack(rs, amt);
      b.handleStack(itm, amt, b);
      Call.setItem(b, rs, b.items.get(rs));
      Call.setItem(b, itm, b.items.get(itm));
    }],

    // Change puddle liquid
    "solvation", [0.01, (param, x, y, b, rs) => {
      if(rs == null) return;
      let liq = db["solvationTarget"].read(rs.name);
      if(liq == null) return;
      let puddle = Puddles.get(Vars.world.tileWorld(x, y));
      if(puddle == null) return;

      let amt = Math.round(param);
      b.removeStack(rs, amt);
      Call.setItem(b, rs, b.items.get(rs));
      FRAG_puddle.changePuddle_global(puddle, liq, param);
    }],

  ],


  /* ----------------------------------------
   * NOTE:
   *
   * Conditions for each reaction group.
   * ---------------------------------------- */
  groupCond: [

    "GROUP: air", (rs) => DB_fluid.db["group"]["air"].includes(rs.name),
    "GROUP: water", (rs) => DB_fluid.db["group"]["aqueous"].includes(rs.name),
    "GROUP: dehydrative", (rs) => DB_fluid.db["group"]["fTag"]["dehydrative"].includes(rs.name),
    "GROUP: acidic", (rs) => DB_fluid.db["group"]["acidic"].includes(rs.name),
    "GROUP: basic", (rs) => DB_fluid.db["group"]["basic"].includes(rs.name),

    "ITEMGROUP: denaturing", (rs) => db["denaturingTarget"].colIncludes(rs.name, 2, 0),
    "ITEMGROUP: solvation", (rs) => db["solvationTarget"].colIncludes(rs.name, 2, 0),
    "ITEMGROUP: acidic", (rs) => DB_item.db["group"]["acidic"].includes(rs.name),
    "ITEMGROUP: basic", (rs) => DB_item.db["group"]["basic"].includes(rs.name),
    "ITEMGROUP: sodium", (rs) => DB_item.db["group"]["sodium"].includes(rs.name),

  ],


  /* ----------------------------------------
   * NOTE:
   *
   * List of fluid reactants and the event called.
   * This is expected to be read without order.
   * Format: {reactant1, reactant2, [reaction, param]}.
   * ---------------------------------------- */
  fluid: [

    "GROUP: water", "GROUP: dehydrative", ["heat", 1.0],

  ],


  /* ----------------------------------------
   * NOTE:
   *
   * For item reaction. The first reactant is item and second is fluid.
   * ---------------------------------------- */
  item: [

    "ITEMGROUP: denaturing", "GROUP: air", ["denaturing", 1.0],
    "ITEMGROUP: solvation", "GROUP: water", ["solvation", 0.75],

    "ITEMGROUP: sodium", "GROUP: water", ["explosion", 4.0],

    "ITEMGROUP: acidic", "GROUP: basic", ["heat", 1.0],
    "ITEMGROUP: basic", "GROUP: acidic", ["heat", 1.0],

  ],


  /* ----------------------------------------
   * NOTE:
   *
   * Target item in a denaturing reaction.
   * If {null} no item will be formed.
   * ---------------------------------------- */
  denaturingTarget: [],


  /* ----------------------------------------
   * NOTE:
   *
   * Target liquid in a solvation reaction.
   * If {null} no liquid puddle will be changed.
   * ---------------------------------------- */
  solvationTarget: [],


  /* <------------------------------ CHUNK SPLITTER ------------------------------ */


};


Object.mergeDB(db, "DB_reaction");


exports.db = db;
