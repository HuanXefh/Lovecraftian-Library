/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- constant ----------> */


  const maxDst = 99999999.0;
  exports.maxDst = maxDst;


  const maxTime = 99999999.0;
  exports.maxTime = maxTime;


  /* <---------- function ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gaussian function.
   * ---------------------------------------- */
  const _f_gaussian = function(x, mu, sigma) {
    if(mu == null) mu = 0.0;
    if(sigma == null) sigma = 1.0;

    return 1.0 / Math.sqrt(2.0 * Math.PI * Math.pow(sigma, 2))
      * Math.exp(-1.0 * Math.pow(x - mu, 2) / (2.0 * Math.pow(sigma, 2)));
  };
  exports._f_gaussian = _f_gaussian;


  /* ----------------------------------------
   * NOTE:
   *
   * Derivative of {mathFun} at x.
   * ---------------------------------------- */
  const _f_deri = function(x, mathFun) {
    const delta = 0.00001;

    if(mathFun == null) mathFun = Function.self;

    return (mathFun(x + delta) - mathFun(x)) / delta;
  };
  exports._f_deri = _f_deri;


  /* <---------- condition ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Float equality.
   * ---------------------------------------- */
  const fEqual = function(num, param, tol) {
    if(tol == null) tol = 0.0001;

    return Math.abs(num - param) < tol;
  };
  exports.fEqual = fEqual;


  /* <---------- interpolation ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Simply calculates distance.
   * ---------------------------------------- */
  const _paramFrac = function(param, param_f, param_t) {
    if(param_f == null) param_f = 0.0;
    if(param_t == null) param_t = 1.0;
    if(param == null) param = 0.0;
    if(fEqual(param_f, param_t)) return 0.0;

    return (param - param_f) / (param_t - param_f);
  };
  exports._paramFrac = _paramFrac;


  /* ----------------------------------------
   * NOTE:
   *
   * More generalized lerp method.
   * ---------------------------------------- */
  const lerp = function(val_f, val_t, param, param_f, param_t) {
    return val_f + (val_t - val_f) * _paramFrac(param, param_f, param_t);
  };
  exports.lerp = lerp;


  /* ----------------------------------------
   * NOTE:
   *
   * Lerp on two lines.
   * ---------------------------------------- */
  const biLerp = function(val1_f, val1_t, val2_f, val2_t, param1, param2, a_12, param1_f, param1_t, param2_f, param2_t) {
    return lerp(
      lerp(val1_f, val1_t, param1, param1_f, param1_t),
      lerp(val2_f, val2_t, param2, param2_f, param2_t),
      a_12,
    );
  };
  exports.biLerp = biLerp;


  /* ----------------------------------------
   * NOTE:
   *
   * More generalized interpolation method.
   * ---------------------------------------- */
  const applyInterp = function(val_f, val_t, param, interp, param_f, param_t) {
    if(interp == null) interp = Interp.linear;

    return val_f + (val_f - val_t) * interp.apply(_paramFrac(param, param_f, param_t));
  };
  exports.applyInterp = applyInterp;
