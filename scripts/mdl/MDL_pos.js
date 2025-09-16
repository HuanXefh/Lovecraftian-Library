/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MATH_base = require("lovec/math/MATH_base");
  const MATH_geometry = require("lovec/math/MATH_geometry");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");


  /* <---------- meta ----------> */


  const sizeOffsetPons2 = [

    [],

    [
      new Point2(0, 0),
    ],

    [
      new Point2(0, 0), new Point2(1, 0),
      new Point2(0, 1), new Point2(1, 1),
    ],

    [
      new Point2(-1, -1), new Point2(0, -1), new Point2(1, -1),
      new Point2(-1, 0), new Point2(0, 0), new Point2(1, 0),
      new Point2(-1, 1), new Point2(0, 1), new Point2(1, 1),
    ],

    [
      new Point2(-1, -1), new Point2(0, -1), new Point2(1, -1), new Point2(2, -1),
      new Point2(-1, 0), new Point2(0, 0), new Point2(1, 0), new Point2(2, 0),
      new Point2(-1, 1), new Point2(0, 1), new Point2(1, 1), new Point2(2, 1),
      new Point2(-1, 2), new Point2(0, 2), new Point2(1, 2), new Point2(2, 2),
    ],

    [
      new Point2(-2, -2), new Point2(-1, -2), new Point2(0, -2), new Point2(1, -2), new Point2(2, -2),
      new Point2(-2, -1), new Point2(-1, -1), new Point2(0, -1), new Point2(1, -1), new Point2(2, -1),
      new Point2(-2, 0), new Point2(-1, 0), new Point2(0, 0), new Point2(1, 0), new Point2(2, 0),
      new Point2(-2, 1), new Point2(-1, 1), new Point2(0, 1), new Point2(1, 1), new Point2(2, 1),
      new Point2(-2, 2), new Point2(-1, 2), new Point2(0, 2), new Point2(1, 2), new Point2(2, 2),
    ],

  ];
  exports.sizeOffsetPons2 = sizeOffsetPons2;


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a coordinate float to tile integer.
   * ---------------------------------------- */
  const _tCoord = function(coord) {
    return Math.round(coord / Vars.tilesize);
  };
  exports._tCoord = _tCoord;


  const _playerX = function() {
    var unit_pl = Vars.player.unit();
    return unit_pl == null ? Infinity : unit_pl.x;
  };
  exports._playerX = _playerX;


  const _playerY = function() {
    var unit_pl = Vars.player.unit();
    return unit_pl == null ? Infinity : unit_pl.y;
  };
  exports._playerY = _playerY;


  /* <---------- distance ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Distance calculation for tile coordinates.
   * ---------------------------------------- */
  const _dstT = function(tx1, ty1, tx2, ty2) {
    if(tx1 == null || ty1 == null || tx2 == null || ty2 == null) return MATH_base.maxDst;

    return Mathf.dst(tx1, ty1, tx2, ty2) * Vars.tilesize;
  };
  exports._dstT = _dstT;


  /* <---------- rotation ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Diverted rotation.
   * ---------------------------------------- */
  const _rotDiv = function(rot, offRot, ord) {
    if(offRot == null) offRot = 0;
    if(ord == null) ord = 4;

    return Mathf.mod(rot + offRot, ord);
  };
  exports._rotDiv = _rotDiv;


  /* ----------------------------------------
   * NOTE:
   *
   * Conjugated rotation, or the opposite side.
   * ---------------------------------------- */
  const _rotConj = function(rot, ord) {
    return _rotDiv(rot, ord * 0.5, ord);
  };
  exports._rotConj = _rotConj;


  /* <---------- raycast ----------> */


  /* raycast boolean function */


  /* ----------------------------------------
   * NOTE:
   *
   * The basic raycast boolean function.
   * Filter is given as {boolF}.
   * ---------------------------------------- */
  const _rayBool_base = function(x1, y1, x2, y2, boolF) {
    return World.raycast(_tCoord(x1), _tCoord(y1), _tCoord(x2), _tCoord(y2), boolF);
  };
  exports._rayBool_base = _rayBool_base;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the ray passes insulated blocks.
   * ---------------------------------------- */
  const _rayBool_insulated = function(x1, x2, y1, y2, team) {
    return _rayBool_base(x1, y1, x2, y2, (tx, ty) => {
      let ob = Vars.world.build(tx, ty);

      if(ob == null) return false;
      if(ob.isInsulated()) return team == null ? true : ob.team !== team;
    });
  };
  exports._rayBool_insulated = _rayBool_insulated;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the ray passes laser absorbers.
   * ---------------------------------------- */
  const _rayBool_laser = function(x1, x2, y1, y2, team) {
    return _rayBool_base(x1, y1, x2, y2, (tx, ty) => {
      let ob = Vars.world.build(tx, ty);

      if(ob == null) return false;
      if(ob.block.absorbLasers) return team == null ? true : ob.team !== team;
    });
  };
  exports._rayBool_laser = _rayBool_laser;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the ray passes solid blocks.
   * ---------------------------------------- */
  const _rayBool_solid = function(x1, y1, x2, y2) {
    return _rayBool_base(x1, y1, x2, y2, (tx, ty) => {
      let ot = Vars.world.tile(tx, ty);

      return ot != null && ot.solid();
    });
  };
  exports._rayBool_solid = _rayBool_solid;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the ray passes mobile floor blocks.
   * Liquid floor and empty floor are considered mobile, which may reduce the transmission of impact wave.
   * Use {minRad} to set the minimum range required to return {true}.
   * ---------------------------------------- */
  const _rayBool_mobileFlr = function(x1, y1, x2, y2, minRad) {
    if(minRad == null) minRad = 0.0;

    return _rayBool_base(x1, y1, x2, y2, (tx, ty) => {
      let ot = Vars.world.tile(tx, ty);
      if(Mathf.dst(x1, y1, x2, y2) < minRad) return false;

      return ot != null && (ot.floor() instanceof EmptyFloor || ot.floor().isLiquid);
    });
  };
  exports._rayBool_mobileFlr = _rayBool_mobileFlr;


  /* raycast getter */


  let tmpRayGet = null;


  /* ----------------------------------------
   * NOTE:
   *
   * The basic raycast getter function.
   * You should include {tmpRayGet} in {boolF}, or it only returns {null}.
   * ---------------------------------------- */
  const _rayGet_base = function(x1, y1, x2, y2, boolF) {
    tmpRayGet = null;

    return _rayBool_base(x1, y1, x2, y2, boolF) ? tmpRayGet : null;
  };
  exports._rayGet_base = _rayGet_base;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the first insulated building on the way.
   * ---------------------------------------- */
  const _rayGet_insulated = function(x1, y1, x2, y2, team) {
    return _rayGet_base(x1, y1, x2, y2, (tx, ty) => {
      tmpRayGet = Vars.world.build(tx, ty);

      if(tmpRayGet == null) return true;
      if(tmpRayGet.isInsulated()) return team == null ? true : tmpRayGet.team !== team;
    });
  };
  exports._rayGet_insulated = _rayGet_insulated;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the first laser-absorbing building on the way.
   * ---------------------------------------- */
  const _rayGet_laser = function(x1, y1, x2, y2, team) {
    return _rayGet_base(x1, y1, x2, y2, (tx, ty) => {
      tmpRayGet = Vars.world.build(tx, ty);

      if(tmpRayGet == null) return false;
      if(tmpRayGet.block.absorbLasers) return team == null ? true : tmpRayGet.team !== team;
    });
  };
  exports._rayGet_laser = _rayGet_laser;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the first solid tile on the way.
   * ---------------------------------------- */
  const _rayGet_solid = function(x1, y1, x2, y2) {
    return _rayGet_base(x1, y1, x2, y2, (tx, ty) => {
      tmpRayGet = Vars.world.tile(tx, ty);

      return tmpRayGet == null || tmpRayGet.solid();
    });
  };
  exports._rayGet_solid = _rayGet_solid;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the last non-solid tile on the way.
   * On rare occasions the result can be {null}.
   * ---------------------------------------- */
  const _rayGet_nonSolid = function(x1, y1, x2, y2) {
    let tmp = Vars.world.tile(x1, y1);

    if(!_rayBool_base(x1, y1, x2, y2, (tx, ty) => {
      tmpRayGet = Vars.world.tile(tx, ty);

      if(tmpRayGet != null && !tmpRayGet.solid()) {
        tmp = tmpRayGet;
        return false;
      } else return true;
    })) {
      tmp = Vars.world.tile(x2, y2);
    };

    return tmp;
  };
  exports._rayGet_nonSolid = _rayGet_nonSolid;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the first matching unit on the way.
   * ---------------------------------------- */
  const _rayGet_unit = function(x1, y1, x2, y2, boolF, caller) {
    return _rayGet_base(x1, y1, x2, y2, (tx, ty) => {
      tmpRayGet = _unit(tx * Vars.tilesize, ty * Vars.tilesize, 4.0, caller);

      if(tmpRayGet == null) return false;
      return boolF(tmpRayGet);
    });
  };
  exports._rayGet_unit = _rayGet_unit;


  /* <---------- coordinate ----------> */


  const setCoord_back = function(x, y, size, rot, xSetter, ySetter) {
    if(size == null) size = 1;
    if(rot == null) rot = 0;

    let off = (size + 0.5) * Vars.tilesize * 0.5;
    let tgX = x;
    let tgY = y;
    switch(rot) {
      case 0 :
        tgX = x - off;
        tgY = y;
        break;
      case 1 :
        tgX = x;
        tgY = y - off;
        break;
      case 2 :
        tgX = x + off;
        tgY = y;
        break;
      case 3 :
        tgX = x;
        tgY = y + off;
        break;
    };

    xSetter(tgX);
    ySetter(tgY);
  };
  exports.setCoord_back = setCoord_back;


  /* <---------- tile ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the tile at given world position.
   * ---------------------------------------- */
  const _tPos = function(x, y) {
    return Vars.world.tileWorld(x, y);
  };
  exports._tPos = _tPos;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets another tile based on rotation.
   * ---------------------------------------- */
  const _tRot = function(t, rot) {
    if(t == null) return null;

    return t.nearby(Geometry.d4[rot]);
  };
  exports._tRot = _tRot;


  /* ----------------------------------------
   * NOTE:
   *
   * Randomly selects a tile from a list of tiles, using {boolF} as the filter function.
   * Use {iCap} to manually set the max attempts to try.
   * ---------------------------------------- */
  const _tRand_base = function(ts, boolF, iCap) {
    if(iCap == null) iCap = ts.iCap();
    if(iCap === 0) return null;

    let i = 0;
    var t = null;
    while((i < iCap && !boolF(t)) || i === 0) {
      t = ts[(iCap - 1.0).randInt()];
      i++;
    };

    return t;
  };
  exports._tRand_base = _tRand_base;


  const _tRand_ground = function(ts, iCap) {
    return _tRand_base(ts, t => {
      return !(t.solid() || (t.floor().isLiquid && !t.floor().shallow));
    }, iCap);
  };
  exports._tRand_ground = _tRand_ground;


  const _tRand_naval = function(ts, iCap) {
    return _tRand_base(ts, t => {
      return !(t.solid() || !t.floor().isLiquid);
    }, iCap);
  };
  exports._tRand_naval = _tRand_naval;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the closest tile that has an ore for {itm_gn}.
   * ---------------------------------------- */
  const _tOre = function(x, y, itm_gn) {
    if(itm_gn == null) return null;

    return Vars.indexer.findClosestOre(x, y, MDL_content._ct(itm_gn, "rs"));
  };
  exports._tOre = _tOre;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the tile under your cursor.
   * ---------------------------------------- */
  const _tMouse = function() {
    return _tPos(Core.input.mouseWorldX(), Core.input.mouseWorldY());
  };
  exports._tMouse = _tMouse;


  /* <---------- tiles ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the tiles on a specific edge, according to {rot}.
   * Imagine a large WallCrafter.
   * ---------------------------------------- */
  const _tsRot = function(t, rot, size, useTmp) {
    const thisFun = _tsRot;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(t == null) return arr;
    if(rot == null) rot = 0;
    if(size == null) size = 1;

    let iBase, iCap;
    if(size % 2 === 0) {
      iBase = (size * 0.5 - 1) * -1;
      iCap = size * 0.5 + 1;
    } else {
      iBase = (size - 1) * -0.5;
      iCap = (size - 1) * 0.5 + 1;
    };

    let px, py;
    for(let i = iBase; i < iCap; i++) {
      if(size % 2 === 0) {
        switch(rot) {
          case 0 :
            px = size * 0.5 + 1;
            py = i;
            break;
          case 1 :
            px = i;
            py = size * 0.5 + 1;
            break;
          case 2 :
            px = size * -0.5;
            py = i;
            break;
          case 3 :
            px = i;
            py = size * -0.5;
            break;
        };
      } else {
        switch(rot) {
          case 0 :
            px = (size + 1) * 0.5;
            py = i;
            break;
          case 1 :
            px = i;
            py = (size + 1) * 0.5;
            break;
          case 2 :
            px = (size + 1) * -0.5;
            py = i;
            break;
          case 3 :
            px = i;
            py = (size + 1) * -0.5;
            break;
        };
      };

      let ot = t.nearby(px, py);
      if(ot != null) arr.push(ot);
    };

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._tsRot = _tsRot;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets all tiles on the edges, use {isInside} to get inner edges instead.
   * ---------------------------------------- */
  const _tsEdge = function(t, size, isInside, useTmp) {
    const thisFun = _tsEdge;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(t == null) return arr;
    if(size == null) size = 1;

    var iCap = size * 4;
    let pons2 = isInside ? Edges.getInsideEdges(size) : Edges.getEdges(size);
    for(let i = 0; i < iCap; i++) {
      let ot = t.nearby(pons2[i]);
      if(ot != null) arr.push(ot);
    };

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._tsEdge = _tsEdge;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles in a rectangular range, which is a very common idea.
   * ---------------------------------------- */
  const _tsRect = function(t, r, size, useTmp) {
    const thisFun = _tsRect;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(t == null) return arr;
    if(r == null) r = 0;
    if(size == null) size = 1;

    let iBase, iCap;
    if(size % 2 == 0) {
      iBase = -(size * 0.5 - 1 + r);
      iCap = -iBase + 2;
    } else {
      iBase = -((size - 1) * 0.5 + r);
      iCap = -iBase + 1;
    };

    for(let i = iBase; i < iCap; i++) {
      for(let j = iBase; j < iCap; j++) {
        let ot = t.nearby(i, j);
        if(ot != null) arr.push(ot);
      };
    };

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._tsRect = _tsRect;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles the block will occupy.
   * ---------------------------------------- */
  const _tsBlock = function(blk, tx, ty, useTmp) {
    return _tsRect(Vars.world.tile(tx, ty), 0, blk.size, useTmp);
  };
  exports._tsBlock = _tsBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles the building occupies.
   * ---------------------------------------- */
  const _tsBuild = function(b, useTmp) {
    return _tsRect(b.tile, 0, b.block.size, useTmp);
  };
  exports._tsBuild = _tsBuild;


  /* ----------------------------------------
   * NOTE:
   *
   * Like {_tsRect}, but rotation is included.
   * Image a UnitAssemblier.
   * ---------------------------------------- */
  const _tsRectRot = function(t, r, rot, size, useTmp) {
    const thisFun = _tsRectRot;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(t == null) return arr;
    if(r == null) r = 0;
    if(rot == null) rot = 0;
    if(size == null) size = 1;

    let px = 0, py = 0;
    switch(rot) {
      case 0 :
        px = r + size;
        break;
      case 1 :
        py = r + size;
        break;
      case 2 :
        px = (size % 2 === 0) ? -(r + size) + 1 : -(r + size);
        break;
      case 3 :
        py = (size % 2 === 0) ? -(r + size) + 1 : -(r + size);
        break;
    };
    let ot = t.nearby(px, py);

    return ot == null ? arr : _tsRect(ot, r, size, useTmp);
  }
  .setProp({
    "funArr": [],
  });
  exports._tsRectRot = _tsRectRot;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles in a circular range, like what's done for a Mender.
   * ---------------------------------------- */
  const _tsCircle = function(t, r, size, useTmp) {
    const thisFun = _tsCircle;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(t == null) return arr;
    if(r == null) r = 0;
    if(size == null) size = 1;

    var w = Vars.world.width();
    var h = Vars.world.height();

    if(size % 2 !== 0) {
      Geometry.circle(t.x, t.y, w, h, r, (tx, ty) => {
        let ot = Vars.world.tile(tx, ty);
        if(ot != null) arr.push(ot);
      });
    } else {
      var ot0;
      for(let i = 0; i < 4; i++) {
        ot0 = t.nearby(sizeOffsetPons2[2][i]);
        if(ot0 == null) continue;
        Geometry.circle(ot0.x, ot0.y, w, h, r, (tx, ty) => {
          let ot = Vars.world.tile(tx, ty);
          if(ot != null && !arr.includes(ot)) arr.push(ot);
        });
      };
    };

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._tsCircle = _tsCircle;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles in a quilateral triangular range... weired.
   * ---------------------------------------- */
  const _tsTri = function(t, rad, ang, useTmp) {
    const thisFun = _tsTri;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(t == null) return arr;
    if(rad == null) rad = 0.0;
    if(ang == null) ang = 0.0;

    let x = t.worldx();
    let y = t.worldy();
    let x1 = x + rad * Mathf.cosDeg(ang + 90.0);
    let y1 = y + rad * Mathf.sinDeg(ang + 90.0);
    let x2 = x + rad * Mathf.cosDeg(ang + 210.0);
    let y2 = y + rad * Mathf.sinDeg(ang + 210.0);
    let x3 = x + rad * Mathf.cosDeg(ang + 330.0);
    let y3 = y + rad * Mathf.sinDeg(ang + 330.0);
    let r = Math.ceil(Math.abs(Mathf.dst(x1, y1, x2, y2) * Mathf.sinDeg(120.0 - ang) * 0.5) / Vars.tilesize);

    let iBase = -r;
    let iCap = r + 1;
    for(let i = iBase; i < iCap; i++) {
      for(let j = iBase; j < iCap; j++) {
        let ot = t.nearby(i, j);
        if(ot != null && MATH_geometry._inPolygon(ot.worldx(), ot.worldy(), x1, y1, x2, y2, x3, y3)) arr.push(ot);
      };
    };

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._tsTri = _tsTri;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles with Manhattan distance less than or equal to {r}.
   * ---------------------------------------- */
  const _tsDstManh = function(t, r, useTmp) {
    const thisFun = _tsDstManh;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(t == null) return arr;
    if(r == null) r = 0;

    let iBase = -r;
    let iCap = r + 1;
    let jBase, jCap;
    for(let i = iBase; i < iCap; i++) {
      jBase = -(r - Math.abs(i));
      jCap = -jBase + 1;
      for(let j = jBase; j < jCap; j++) {
        let ot = t.nearby(i, j);
        if(ot != null) arr.push(ot);
      };
    };

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._tsDstManh = _tsDstManh;


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through linked tiles of {t}.
   * ---------------------------------------- */
  const _it_linked = function(t, scr) {
    if(t == null || scr == null) return;

    t.getLinkedTiles(scr);
  };
  exports._it_linked = _it_linked;


  /* <---------- entity ----------> */


  /* filter */


  const _f_base = function(es, scr) {
    return es.filter(e => scr(e));
  };
  exports._f_base = _f_base;


  const _f_nm = function(es, nm) {
    return _f_base(es, e => {
      if(e instanceof Building) return e.block.name === nm;
      if(e instanceof Unit) return e.type.name === nm;

      return false;
    });
  };
  exports._f_nm = _f_nm;


  const _f_team = function(es, team) {
    return _f_base(es, e => {
      return e.team === team;
    });
  };
  exports._f_team = _f_team;


  const _f_enemy = function(es, team) {
    return _f_base(es, e => {
      return (e.team !== Team.derelict) && (e.team !== team) && ((e instanceof Building) ? e.block.targetable : e.type.targetable);
    });
  };
  exports._f_enemy = _f_enemy;


  const _f_same = function(es, nm, team) {
    return _f_base(es, e => {
      if(e.team !== team) return false;

      if(e instanceof Building) return e.block.name === nm;
      if(e instanceof Unit) return e.type.name === nm;

      return false;
    });
  };
  exports._f_same = _f_same;


  /* building */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets all buildings in {ts}, no duplicates.
   * ---------------------------------------- */
  const _bs = function(ts, useTmp) {
    const thisFun = _bs;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    ts.forEachFast(ot => {
      if(ot.build != null && !arr.includes(ot.build)) arr.push(ot.build);
    });

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._bs = _bs;


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through buildings in range that match {boolF}.
   * Much less costy than using {ts}!
   * ---------------------------------------- */
  const _it_bs = function(x, y, rad, team, boolF, scr) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(team == null) team = null;
    if(boolF == null) boolF = Function.airTrue;

    Vars.indexer.eachBlock(team, x, y, rad, boolF, scr);
  };
  exports._it_bs = _it_bs;


  /* ----------------------------------------
   * NOTE:
   *
   * Base for methods that find a building with {boolF}.
   * {team} is required.
   * ---------------------------------------- */
  const _b_base = function(x, y, team, rad, boolF) {
    if(team == null) return null;
    if(rad == null) rad = MATH_base.maxDst;
    if(rad < 0.0001) return null;

    return Vars.indexer.findTile(team, x, y, rad, boolF);
  };
  exports._b_base = _b_base;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a container for item transfer.
   * ---------------------------------------- */
  const _b_cont = function(x, y, team, rad, itm, amt) {
    if(itm == null) return null;
    if(amt == null) amt = 0;
    if(amt < 1) return null;

    return _b_base(x, y, team, rad, b => MDL_cond._isCont(b.block) && b.acceptStack(itm, amt) >= amt);
  };
  exports._b_cont = _b_cont;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets an active ore scanner in range.
   * ---------------------------------------- */
  const _b_scan = function(x, y, team, rad) {
    return _b_base(x, y, team, rad, b => MDL_cond._isOreScanner(b.block) && b.efficiency > 0.0 && Mathf.dst(x, y, b.x, b.y) < b.block.ex_getScanR() * Vars.tilesize);
  };
  exports._b_scan = _b_scan;


  /* unit */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a random non-loot unit near (x, y), return {null} if not found.
   * ---------------------------------------- */
  const _unit = function(x, y, rad, caller) {
    return _units(x, y, rad, caller, true).readRand();
  };
  exports._unit = _unit;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets all units in a circular range.
   * This will filter out loot units.
   * ---------------------------------------- */
  const _units = function(x, y, rad, caller, useTmp) {
    const thisFun = _units;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return arr;

    Units.nearby(null, x, y, rad, unit => {
      if(unit !== caller && !MDL_cond._isLoot(unit)) arr.push(unit);
    });

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._units = _units;


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through units in range that match {boolF}.
   * This will filter out loot units.
   * ---------------------------------------- */
  const _it_units = function(x, y, rad, team, boolF, scr) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(team == null) team = null;
    if(boolF == null) boolF = Function.airTrue;

    Units.nearby(team, x, y, rad, unit => {
      if(!MDL_cond._isLoot(unit) && boolF(unit)) scr(unit);
    });
  };
  exports._it_units = _it_units;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the closest unit controlled by any player.
   * Set {team} to {null} to ignore player team.
   *
   * Don't abuse {Vars.player} in blocks and units!
   * ---------------------------------------- */
  const _unit_pl = function(x, y, team, rad) {
    let unit_pl = null;

    if(rad == null) rad = MATH_base.maxDst;
    if(rad < 0.0001) return unit_pl;

    let tmpRad = rad;
    let unit, dst;
    Groups.player.each(pl => {
      unit = pl.unit();
      if(unit != null && (team == null || unit.team === team)) {
        dst = Mathf.dst(x, y, unit.x, unit.y);
        if(dst < tmpRad) {
          tmpRad = dst;
          unit_pl = unit;
        };
      };
    });

    return unit_pl;
  };
  exports._unit_pl = _unit_pl;


  /* loot unit */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a random loot unit near (x, y), return {null} if not found.
   * ---------------------------------------- */
  const _loot = function(x, y, rad, caller) {
    return _loots(x, y, rad, caller, true).readRand();
  };
  exports._loot = _loot;


  /* ----------------------------------------
   * NOTE:
   *
   * {_units} but for loot unit.
   * ---------------------------------------- */
  const _loots = function(x, y, rad, caller, useTmp) {
    const thisFun = _loots;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return arr;

    Units.nearby(null, x, y, rad, unit => {
      if(unit !== caller && MDL_cond._isLoot(unit)) arr.push(unit);
    });

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._loots = _loots;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a random loot unit in {ts}.
   * ---------------------------------------- */
  const _lootTs = function(ts, caller) {
    return _lootsTs(ts, caller, true).readRand();
  };
  exports._lootTs = _lootTs;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {_loots} that uses {ts} instead.
   * ---------------------------------------- */
  const _lootsTs = function(ts, caller, useTmp) {
    const thisFun = _lootsTs;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(ts == null) return arr;

    ts.forEachFast(ot => {
      _loots(ot.worldx(), ot.worldy(), 6.0, caller, useTmp).forEach(loot => arr.pushUnique(loot));
    });

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._lootsTs = _lootsTs;


  /* entity */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the closest unit/building that is a valid target.
   * ---------------------------------------- */
  const _e_tg = function(x, y, team, rad) {
    if(team == null) return;
    if(rad == null) rad = MATH_base.maxDst;
    if(rad < 0.0001) return;

    return Units.closestTarget(team, x, y, rad);
  };
  exports._e_tg = _e_tg;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets all units and buildings that are valid targets.
   * ---------------------------------------- */
  const _es_tg = function(x, y, team, rad, size, useTmp) {
    const thisFun = _es_tg;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(team == null) return arr;
    if(rad == null) rad = MATH_base.maxDst;
    if(rad < 0.0001) return arr;
    if(size == null) size = 1;

    arr.pushAll(_f_enemy(_units(x, y, rad, null, useTmp), team));
    arr.pushAll(_f_enemy(_bs(_tsCircle(_tPos(x, y), rad / Vars.tilesize, size, useTmp), useTmp), team));

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._es_tg = _es_tg;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets targets in a chain, like chained lightning.
   * {chainRayBool} is a raycast boolean function used to determine whether the chain is blocked.
   * By default you may want {_rayBool_insulated} which is used for lightnings.
   * ---------------------------------------- */
  const _es_tgChain = function(x, y, team, rad, rad_chain, size, chainCap, chainRayBool, useTmp) {
    const thisFun = _es_tgChain;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(team == null) return arr;
    if(rad == null) rad = MATH_base.maxDst;
    if(rad < 0.0001) return arr;
    if(rad_chain == null) rad_chain = 0.0;
    if(size == null) size = 1;
    if(chainCap == null) chainCap = -1;
    if(chainRayBool == null) chainRayBool = Function.airFalse;

    let es = _es_tg(x, y, team, rad * 2.0, size, useTmp);
    let tmpTg;
    let tmpX = x;
    let tmpY = y;
    let isFirst = true;
    let i = 0;
    while(chainCap < 0 ? true : i < chainCap) {
      tmpTg = Geometry.findClosest(tmpX, tmpY, es);
      if(tmpTg == null) break;
      if(Mathf.dst(tmpX, tmpY, tmpTg.x, tmpTg.y) > (isFirst ? rad : rad_chain) + 0.0001) break;
      if(chainRayBool(tmpX, tmpY, tmpTg.x, tmpTg.y)) break;

      arr.push(tmpTg);
      es.remove(tmpTg);
      tmpX = tmpTg.x;
      tmpY = tmpTg.y;

      isFirst = false;
      i++;
    };

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._es_tgChain = _es_tgChain;


  /* bullet */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets all bullets in a circular range.
   * ---------------------------------------- */
  const _buls = function(x, y, rad, caller, useTmp) {
    const thisFun = _buls;
    const arr = useTmp ? thisFun.funArr.clear() : [];

    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return arr;

    Groups.bullet
    .intersect(x - rad, y - rad, rad * 2.0, rad * 2.0)
    .each(bul => {
      if(bul !== caller) arr.push(bul);
    });

    return arr;
  }
  .setProp({
    "funArr": [],
  });
  exports._buls = _buls;


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through all nearby bullets that match {boolF}.
   * ---------------------------------------- */
  const _it_buls = function(x, y, rad, team, boolF, scr) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(boolF == null) boolF = Function.airTrue;

    Groups.bullet
    .intersect(x - rad, y - rad, rad * 2.0, rad * 2.0)
    .select(bul => bul.team !== Team.derelict && (team == null ? true : bul.team !== team) && boolF(bul))
    .each(bul => scr(bul));
  };
  exports._it_buls = _it_buls;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the closest hittable enemy bullet.
   * ---------------------------------------- */
  const _bul_tg = function(x, y, team, rad, ignoreHittable, caller) {
    if(team == null) return null;
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return null;

    let tmpDst = MATH_base.maxDst;
    let bulTg = null, dst;
    Groups.bullet
    .intersect(x - rad, y - rad, rad * 2.0, rad * 2.0)
    .select(bul => bul.team !== Team.derelict && bul.team !== team && (ignoreHittable ? true : bul.type.hittable) && bul !== caller)
    .each(bul => {
      dst = Mathf.dst(x, y, bul.x, bul.y);
      if(dst < tmpDst) {
        tmpDst = dst;
        bulTg = bul;
      };
    });

    return bulTg;
  };
  exports._bul_tg = _bul_tg;
