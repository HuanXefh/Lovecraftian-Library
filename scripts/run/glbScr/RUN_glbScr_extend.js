/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Various methods which are mostly wrapped {extend} designed for content templates.
   * ---------------------------------------- */


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


  CONTENT_HANDLER = {

    __NAME_MAP__: new ObjectMap(),
    __TYPE_MAPS__: {},


    add(ct) {
      CONTENT_HANDLER.__NAME_MAP__.put(ct.name, ct);
      if(CONTENT_HANDLER.__TYPE_MAPS__[ct.getContentType()] !== undefined) {
        CONTENT_HANDLER.__TYPE_MAPS__[ct.getContentType()].put(ct.name, ct);
      } else {
        CONTENT_HANDLER.__TYPE_MAPS__[ct.getContentType()] = new ObjectMap();
      };
    },


    fetch: newMultiFunction(
      function(nm) {return CONTENT_HANDLER.__NAME_MAP__.get(nm)},
      function(nm, ctType) {return CONTENT_HANDLER.__TYPE_MAPS__[ctType].get(nm)},
    ),


  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a content that is created by using content templates.
   * This method is meant to be used before INIT.
   * ---------------------------------------- */
  fetchContent = function(nmCt, ctType) {
    let ct = ctType == null ?
      CONTENT_HANDLER.fetch(nmCt) :
      CONTENT_HANDLER.fetch(nmCt, ctType);
    if(ct == null) throw new Error("Content [$1] is not registered through template!".format(nmCt));

    return ct;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Love version of {extend} using content templates.
   * ---------------------------------------- */
  extendBase = function(temp, nmCt, obj) {
    let ct = extend(temp.getParent(), nmCt, tryValProv(obj, prov(() => temp.build())));
    CONTENT_HANDLER.add(ct);

    return ct;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {extend} used for blocks.
   * ---------------------------------------- */
  extendBlock = function(temp, nmBlk, objBlk, objB) {
    let blk = extend(temp[0].getParent(), nmBlk, tryValProv(objBlk, prov(() => temp[0].build())));
    blk.buildType = () => extend(temp[1].getParent(), blk, tryValProv(objB, prov(() => temp[1].build())));
    CONTENT_HANDLER.add(blk);

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
    CONTENT_HANDLER.add(utp);

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
    CONTENT_HANDLER.add(pla);

    return pla;
  };
