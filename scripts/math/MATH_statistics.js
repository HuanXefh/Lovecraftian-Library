/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const DB_math = require("lovec/db/DB_math");


  /* <---------- param ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the mean difference between {xs} and {ys}.
   * ---------------------------------------- */
  const _diffMean = function(xs, ys) {
    return xs.subWith(ys).mean();
  };
  exports._diffMean = _diffMean;


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
   * Returns the standard deviation of differences between {xs} and {ys}.
   * ---------------------------------------- */
  const _diffStdDev = function(xs, ys, notSample) {
    return Math.sqrt(_diffVari(xs, ys, notSample));
  };
  exports._diffStdDev = _diffStdDev;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the relative error of {xs}.
   * ---------------------------------------- */
  const _errRel = function(xs, trueVal) {
    let stdDev = _stdDev(xs);

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

    let mean = xs.mean();
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
   * Returns the variation of differences between {xs} and {ys}.
   * ---------------------------------------- */
  const _diffVari = function(xs, ys, notSample) {
    return _vari(xs.subWith(ys), notSample);
  };
  exports._diffVari = _diffVari;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the covariation of {xs} and {ys}.
   * ---------------------------------------- */
  const _cov = function(ys, xs, notSample) {
    var val = 0.0;
    if(xs == null) xs = Array.getIndArr(ys.length, true);

    let meanX = xs.mean();
    let meanY = ys.mean();
    let iCap = xs.iCap();
    for(let i = 0; i < iCap; i++) {
      val += (xs[i] - meanX) * (ys[i] - meanY);
    };
    val /= notSample ? iCap : (iCap - 1);

    return val;
  };
  exports._cov = _cov;


  /* <---------- test ----------> */


  const _rd_t = function(val, df, table) {
    let x, y;

    let i = 2;
    let iCap = table[0].iCap();
    let j = 2;
    let jCap = table.iCap();

    while(j < jCap) {
      if(table[j - 1][0] <= df && table[j][0] > df) {
        y = j - 1;
      } else break;
      j++;
    };

    while(i < iCap) {
      if(table[y][i - 1] <= val && table[y][i] > val) {
        x = i - 1;
      } else break;
      i++;
    };

    return 1.0 - table[0][x];
  };


  const _rd_f = function(val, df1, df2, table) {
    let x, y;

    let i = 2;
    let iCap = table[0].iCap();
    let j = 2;
    let jCap = table.iCap();

    while(j < jCap) {
      if(table[j - 1][0] <= df2 && table[j][0] > df2) {
        y = j - 1;
      } else break;
      j++;
    };

    while(i < iCap) {
      if(table[0][i - 1] <= df1 && table[0][i] > df1) {
        x = i - 1;
      } else break;
      i++;
    };

    return val >= table[y][x];
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Performs t-test on {xs}.
   * T-tests defined here return significance of difference.
   * ---------------------------------------- */
  const test_t_oneSample = function(xs, meanRef, isTwoTailed) {
    let mean = xs.mean();
    let stdDev = _stdDev(xs);
    let iCap = xs.iCap();

    let val = Math.abs(mean - meanRef) / stdDev / Math.sqrt(iCap);

    return _rd_t(val, iCap - 1, DB_math.db["table"]["distribution"][isTwoTailed ? "t-two-tail" : "t-one-tail"]);
  };
  exports.test_t_oneSample = test_t_oneSample;


  /* ----------------------------------------
   * NOTE:
   *
   * Performs t-test on {xs} and {ys}.
   * ---------------------------------------- */
  const test_t_twoSample = function(xs, ys, isTwoTailed) {
    let meanX = xs.mean();
    let meanY = ys.mean();
    let variX = _vari(xs);
    let variY = _vari(ys);
    let iCapX = xs.iCap();
    let iCapY = ys.iCap();

    let val = Math.abs(meanX - meanY) / Math.sqrt(variX / iCapX + variY / iCapY);

    return _rd_t(val, iCapX + iCapY - 2, DB_math.db["table"]["distribution"][isTwoTailed ? "t-two-tail" : "t-one-tail"]);
  };
  exports.test_t_twoSample = test_t_twoSample;


  /* ----------------------------------------
   * NOTE:
   *
   * Performs t-test on {xs} and {ys} when they are similar yet not dependent of each other.
   * ---------------------------------------- */
  const test_t_twoSamplePair = function(xs, ys, inTwoTailed) {
    let diffMean = _diffMean(xs, ys);
    let diffStdDev = _diffStdDev(xs, ys);
    let iCap = xs.iCap();

    let val = Math.abs(diffMean) / diffStdDev / Math.sqrt(iCap);

    return _rd_t(val, iCap - 1, DB_math.db["table"]["distribution"][isTwoTailed ? "t-two-tail" : "t-one-tail"]);
  };
  exports.test_t_twoSamplePair = test_t_twoSamplePair;


  /* ----------------------------------------
   * NOTE:
   *
   * Performs f-test on {xs} and {ys}.
   * Checks whether there is significant difference in the variances.
   * ---------------------------------------- */
  const test_f = function(xs, ys, isPrecise) {
    let variX = _vari(xs);
    let variY = _vari(ys);
    let iCapX = xs.iCap();
    let iCapY = ys.iCap();

    let val = variX / variY;

    return _rd_f(val, iCapX - 1, iCapY - 1, DB_math.db["table"]["distribution"][isPrecise ? "f-0.01" : "f-0.05"]);
  };
  exports.test_f = test_f;


  /* <---------- regression ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Linear regression, returns slope and y-intercept as a 2-tuple.
   * ---------------------------------------- */
  const linearReg = function(ys, xs) {
    if(xs == null) xs = Array.getIndArr(ys.length, true);

    let meanX = xs.mean();
    let meanY = ys.mean();
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
