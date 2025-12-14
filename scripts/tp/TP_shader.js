/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- auxiliay ----------> */


  function throwDebugError() {
    if(Core.settings.getBool("lovec-test0error-shader", false)) ERROR_HANDLER.throw("debug", "shader");
  };


  function _w_shaderLoad(nm, err) {
    Log.warn("[LOVEC] Failed to load shader " + nm.color(Pal.accent) + ":\n" + err);
  };


  const newIns_surf = function(nmFrag) {
    let shader;
    try {
      throwDebugError();
      shader = new Shaders.SurfaceShader(nmFrag);
    } catch(err) {
      shader = null;
      _w_shaderLoad(nmFrag, err);
    };

    return shader;
  };
  exports.newIns_surf = newIns_surf;


  const newIns_reg = function(nmFrag) {
    let shader;
    try {
      throwDebugError();
      shader = extend(Shaders.LoadShader, nmFrag, "default", {
        region: new TextureRegion(), mulColor: new Color(), a: 1.0, off: 0.0, offCap: 1.0,
        apply() {
          if(this.region.texture == null) {
            this.setUniformf("u_uv", 0.0, 0.0);
            this.setUniformf("u_uv2", 1.0, 1.0);
            this.setUniformf("u_texsize", 1, 1);
          } else {
            this.setUniformf("u_uv", this.region.u, this.region.v);
            this.setUniformf("u_uv2", this.region.u2, this.region.v2);
            this.setUniformf("u_texsize", this.region.texture.width, this.region.texture.height);
            this.setUniformf("u_mulColor", this.mulColor.r, this.mulColor.g, this.mulColor.b, this.mulColor.a);
            this.setUniformf("u_a", this.a);
            this.setUniformf("u_off", this.off);
            this.setUniformf("u_offCap", this.offCap);
          };
        },
        ex_accRegion(param) {
          return param === "read" ? this.region : (this.region = param);
        },
        ex_accMulColor(param) {
          return param === "read" ? this.mulColor : (this.mulColor.set(param));
        },
        ex_accA(param) {
          return param === "read" ? this.a : (this.a = param);
        },
        ex_accOff(param) {
          return param === "read" ? this.off : (this.off = param);
        },
        ex_accOffCap(param) {
          return param === "read" ? this.offCap : (this.offCap = param);
        },
      });
    } catch(err) {
      shader = null;
      _w_shaderLoad(nmFrag, err);
    };

    return shader;
  };
  exports.newIns_reg = newIns_reg;


  /* <---------- base ----------> */


  exports.shader0surf_flr0liq_lava = newIns_surf("shader0surf-flr0liq-lava");
  exports.shader0surf_flr0liq_puddle = newIns_surf("shader0surf-flr0liq-puddle");
  exports.shader0surf_flr0liq_river = newIns_surf("shader0surf-flr0liq-river");
  exports.shader0surf_flr0liq_sea = newIns_surf("shader0surf-flr0liq-sea");


  exports.shader0reg_debris = newIns_reg("shader0reg-debris");
