/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Love way of {extend} using content templates.
   * ---------------------------------------- */
  extendBase = function(temp, nmCt, obj) {
    return extend(temp.getParent(), nmCt, tryValProv(obj, prov(() => temp.build())));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {extend} used for blocks.
   * ---------------------------------------- */
  extendBlock = function(temp, nmBlk, objBlk, objB) {
    let blk = extend(temp[0].getParent(), nmBlk, tryValProv(objBlk, prov(() => temp[0].build())));
    blk.buildType = () => extend(temp[1].getParent(), blk, tryValProv(objB, prov(() => temp[1].build())));

    return blk;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {extend} used for unit types.
   * ---------------------------------------- */
  extendUnit = function(temp, nmUtp, objUtp) {
    let utp = extend(temp.getParent(), nmUtp, tryValProv(objUtp, prov(() => temp.build())));
    temp.initUnit(utp);
    global.lovecUtil.db.lovecUnits.push(utp);

    return utp;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {extend} used for planets.
   * ---------------------------------------- */
  extendPlanet = function(temp, nmPla, sectorSize, objPla) {
    let pla = extend(temp.getParent(), nmPla, null, 1.0, sectorSize, tryValProv(objPla, prov(() => temp.build())));
    temp.initPlanet(pla);

    return pla;
  };
