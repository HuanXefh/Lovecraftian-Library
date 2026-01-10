/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods to process reactions (mostly chemical) between resource.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const ANNO = require("lovec/glb/BOX_anno");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_net = require("lovec/mdl/MDL_net");


  const DB_reaction = require("lovec/db/DB_reaction");


  /* <---------- auxiliay ----------> */


  function _isReac(reac) {
    return typeof reac === "string" && (reac.startsWith("GROUP: ") || reac.startsWith("ITEMGROUP: ") || reac.startsWith("CONST: "));
  };


  /* <---------- parameter ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a list of reaction groups.
   * ---------------------------------------- */
  const _reacGrps = function(reac) {
    const arr = [];

    !(reac instanceof UnlockableContent) ?
      arr.push(reac) :
      DB_reaction.db["groupCond"].forEachRow(2, (grp, boolF) => {
        if(boolF(reac)) arr.push(grp);
      });

    return arr;
  };
  exports._reacGrps = _reacGrps;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads possible reactions between {reac1} and {reac2}.
   * The final result is an array with arrays of reaction type and parameter.
   * ---------------------------------------- */
  const _reactions = function(reac1, reac2) {
    let arr = [];
    let grps1 = _reacGrps(reac1);
    let grps2 = _reacGrps(reac2);

    Array.forEachPair(grps1, grps2, (grp1, grp2) => {
      arr.pushNonNull(DB_reaction.db["fluid"].read([grp1, grp2], null, true));
      arr.pushNonNull(DB_reaction.db["item"].read([grp1, grp2], null, true));
    });

    return arr;
  }
  .setCache();
  exports._reactions = _reactions;


  /* <---------- application ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Actually calls the reactions.
   * Called on server side only.
   * ---------------------------------------- */
  const applyReaction = function(reactions, pMtp, x, y, b, rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");

    let tup;
    reactions.forEachFast(tup0 => {
      tup = DB_reaction.db["reaction"].read(tup0[0], null);
      if(tup == null) return;
      if(!Mathf.chance(tup[0] * pMtp)) return;

      tup[1](tup0[1], x, y, b, rs);
    });
  }
  .setAnno(ANNO.$SERVER$);
  exports.applyReaction = applyReaction;


  /* ----------------------------------------
   * NOTE:
   *
   * Request the host to apply some reactions.
   * ---------------------------------------- */
  const requestReaction = function(reactions, pMtp, x, y, b, rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");

    MDL_net.sendPacket(
      "client", "lovec-client-reaction",
      packPayload([
        reactions, pMtp, x, y,
        b == null ? -1 : b.pos(),
        rs == null ? "null" : rs.name,
      ]),
      true, true,
    );
  }
  .setAnno(ANNO.$INIT$, function() {
    MDL_net.__packetHandler("server", "lovec-client-reaction", payload => {
      let args = unpackPayload(payload);
      applyReaction(args[0], args[1], args[2], args[3], Vars.world.build(args[4]), args[5]);
    });
  })
  .setAnno(ANNO.$CLIENT$)
  .setAnno(ANNO.$NON_CONSOLE$);
  exports.requestReaction = requestReaction;


  /* ----------------------------------------
   * NOTE:
   *
   * Calls possible reactions between {reac1} and {reac2}, at {t0b}.
   * ---------------------------------------- */
  const handleReaction = function(reac1, reac2, pMtp, t0b) {
    applyReaction(
      _reactions(reac1, reac2),
      pMtp,
      t0b instanceof Building ? t0b.x : t0b.worldx(),
      t0b instanceof Building ? t0b.y : t0b.worldy(),
      t0b instanceof Building ? t0b : null,
      _isReac(reac1) ? null : reac1,
    );
  };
  exports.handleReaction = handleReaction;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {handleReaction} for sync.
   * ---------------------------------------- */
  const handleReaction_global = function(reac1, reac2, pMtp, t0b) {
    if(!Vars.net.client()) {
      handleReaction(reac1, reac2, pMtp, t0b);
    } else {
      requestReaction(
        _reactions(reac1, reac2),
        pMtp,
        t0b instanceof Building ? t0b.x : t0b.worldx(),
        t0b instanceof Building ? t0b.y : t0b.worldy(),
        t0b instanceof Building ? t0b : null,
        _isReac(reac1) ? null : reac1,
      );
    };
  }
  .setAnno(ANNO.$NON_CONSOLE$);
  exports.handleReaction_global = handleReaction_global;
