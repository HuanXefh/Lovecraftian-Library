/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- auxilliary ----------> */


  const newIns_surf = function(nmFrag) {
    return new Shaders.SurfaceShader(nmFrag);
  };
  exports.newIns_surf = newIns_surf;


  /* <---------- base ----------> */


  exports.shader0surf_flr0liq_sea = newIns_surf("shader0surf-flr0liq-sea");
  exports.shader0surf_flr0liq_river = newIns_surf("shader0surf-flr0liq-river");
