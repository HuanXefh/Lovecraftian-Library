/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TP_shader = require("lovec/tp/TP_shader");


  /* <---------- auxilliary ----------> */


  const newIns_shader = function(shader) {
    var cacheLay = new CacheLayer.ShaderLayer(shader);
    CacheLayer.add(cacheLay);

    return cacheLay;
  };
  exports.newIns_shader = newIns_shader


  /* <---------- base ----------> */


  exports.shader0surf_flr0liq_lava = newIns_shader(TP_shader.shader0surf_flr0liq_lava);
  exports.shader0surf_flr0liq_puddle = newIns_shader(TP_shader.shader0surf_flr0liq_puddle);
  exports.shader0surf_flr0liq_river = newIns_shader(TP_shader.shader0surf_flr0liq_river);
  exports.shader0surf_flr0liq_sea = newIns_shader(TP_shader.shader0surf_flr0liq_sea);
