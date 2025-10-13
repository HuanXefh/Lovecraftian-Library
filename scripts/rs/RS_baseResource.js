/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Items and liquids are both resource.
   * ---------------------------------------- */


  /* ----------------------------------------
   * BASE:
   *
   * !NOTHING
   * ---------------------------------------- */


  /* ----------------------------------------
   * PARAM:
   *
   * !NOTHING
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");


  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  /* <---------- component ----------> */


  function comp_loadIcon(rs) {
    let iCap = rs.alts;
    if(iCap === 0) return;

    const regs = [Core.atlas.find(rs.name + "-t0")];
    for(let i = 0; i < iCap; i++) {
      regs.push(Core.atlas.find(rs.name + "-t" + (i + 1)));
    };

    // Keep "ohno" intact
    if(rs.fullIcon === Core.atlas.find("error")) {
      rs.fullIcon = new TextureRegion();
      rs.uiIcon = new TextureRegion();
    };

    MDL_event._c_onUpdate(() => {
      let ind = !PARAM.flickerIconTag ? 1 : (Math.floor((Time.globalTime / PARAM.iconTagIntv) % regs.length));
      rs.fullIcon.set(regs[ind]);
      rs.uiIcon.set(regs[ind]);
    });
  };


  function comp_createIcons(rs, packer) {
    // Still a string here
    let parent = !rs.useParentRegion ? null : Object.val(rs.intmdParent, null);

    // Have to put it here.
    if(MDL_color._isSameColor(rs.color, Color.black)) rs.color = MDL_color._iconColor(Object.val(parent, rs));

    const tags = MDL_content._intmdTags(rs);
    let iCap = tags.iCap();
    if(iCap !== 0) {
      let pixBase = Core.atlas.getPixmap(Object.val(parent, rs.name));
      let pix0 = MDL_texture._pix_stack(pixBase);
      packer.add(MultiPacker.PageType.main, rs.name + "-t0", pix0);
      pix0.dispose();

      let alts = 0;
      for(let i = 0; i < iCap; i++) {
        let nmMod = MDL_content._mod(rs);
        if(nmMod == null) continue;

        if(Core.atlas.has(nmMod + "-rs0tag-" + tags[i])) {
          let pixTag = Core.atlas.getPixmap(nmMod + "-rs0tag-" + tags[i]);
          let pix = MDL_texture._pix_stack(pixBase, pixTag);
          packer.add(MultiPacker.PageType.main, rs.name + "-t" + (alts + 1), pix);
          pix.dispose();
          alts++;
        };
      };

      rs.alts = alts;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  const TEMPLATE = {


    /* <---------- resource ----------> */


    init: function(rs) {

    },


    setStats: function(rs) {

    },


    loadIcon: function(rs) {
      comp_loadIcon(rs);
    },


    createIcons: function(rs, packer) {
      comp_createIcons(rs, packer);
    },


    /* <---------- resource (specific) ----------> */


    /* <---------- resource (extended) ----------> */


    // @NOSUPER
    ex_getTags: function(rs) {
      return TEMPLATE.ex_getTags.tempTags;
    }.setProp({
      tempTags: [],
    }),


  };


  module.exports = TEMPLATE;
