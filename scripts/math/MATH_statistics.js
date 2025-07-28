/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- param ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the standard deviation of {xs}.
   * ---------------------------------------- */
  const _stdDev = function(xs, notSample) {
    return Math.sqrt(_vari(xs, notSample));
  };
  exports._stdDev = _stdDev;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the relative error of {xs}.
   * ---------------------------------------- */
  const _errRel = function(xs, trueVal) {
    const stdDev = _stdDev(xs);

    return (stdDev - trueVal) / trueVal;
  };
  exports._errRel = _errRel;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the variation of {xs}.
   * ---------------------------------------- */
  const _vari = function(xs, notSample) {
    var val = 0.0;

    const mean = xs.mean();
    for(let x in xs) {
      val += Math.pow(x - mean, 2);
    };
    val /= notSample ? xs.length : (xs.length - 1);

    return val;
  };
  exports._vari = _vari;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the covariation of {xs} and {ys}.
   * ---------------------------------------- */
  const _cov = function(ys, xs, notSample) {
    var val = 0.0;
    if(xs == null) xs = ys.toIndArr(true);

    const meanX = xs.mean();
    const meanY = ys.mean();
    let iCap = xs.iCap();
    for(let i = 0; i < iCap; i++) {
      val += (xs[i] - meanX) * (ys[i] - meanY);
    };
    val /= notSample ? iCap : (iCap - 1);

    return val;
  };
  exports._cov = _cov;


  /* <---------- regression ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Linear regression, returns slope and y-intercept as a 2-tuple.
   * ---------------------------------------- */
  const linearReg = function(ys, xs) {
    if(xs == null) xs = ys.toIndArr(true);

    const meanX = xs.mean();
    const meanY = ys.mean();
    let iCap = xs.iCap();
    if(iCap < 2) return [0.0, 0.0];
    var tmp1 = 0.0;
    var tmp2 = 0.0;
    for(let i = 0; i < iCap; i++) {
      tmp1 += Math.pow(xs[i] - meanX, 2);
      tmp2 += (xs[i] - meanX) * (ys[i] - meanY);
    };
    var slp = tmp2 / tmp1;
    var intc = meanY - meanX * slp;

    return [slp, intc];
  };
  exports.linearReg = linearReg;
