/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Collection of cache layers.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TP_shader = require("lovec/tp/TP_shader");


  /* <---------- auxiliay ----------> */


  const newIns_shader = function(shader, cacheLayFallback) {
    if(shader == null) return tryVal(cacheLayFallback, CacheLayer.normal);
    let cacheLay = new CacheLayer.ShaderLayer(shader);
    CacheLayer.add(cacheLay);

    return cacheLay;
  };
  exports.newIns_shader = newIns_shader


  /* <---------- base ----------> */


  exports.shader0surf_flr0liq_lava = newIns_shader(TP_shader.shader0surf_flr0liq_lava, CacheLayer.water);
  exports.shader0surf_flr0liq_puddle = newIns_shader(TP_shader.shader0surf_flr0liq_puddle, CacheLayer.water);
  exports.shader0surf_flr0liq_river = newIns_shader(TP_shader.shader0surf_flr0liq_river, CacheLayer.water);
  exports.shader0surf_flr0liq_sea = newIns_shader(TP_shader.shader0surf_flr0liq_sea, CacheLayer.water);
