/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Items and liquids are both resource.
   * Resource in Lovec does not support animated sprite by default to allow icon tags.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");
  const PARAM = require("lovec/glb/GLB_param");


  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  /* <---------- component ----------> */


  function comp_loadIcon(rs) {
    if(rs.skipIconTagGen) return;
    let iCap = rs.alts;
    if(iCap === 0) return;

    let regs = [Core.atlas.find(rs.name + "-t0")];
    iCap._it(1, i => {
      regs.push(Core.atlas.find(rs.name + "-t" + (i + 1)));
    });

    // Copy the texture region to keep "ohno" intact
    if(rs.fullIcon === Core.atlas.find("error")) {
      rs.fullIcon = rs.uiIcon = new TextureRegion();
    };

    let regInd;
    MDL_event._c_onUpdate(() => {
      regInd = !PARAM.flickerIconTag ?
        1 :
        (Math.floor((Time.globalTime / PARAM.iconTagIntv) % regs.length));

      rs.fullIcon.set(regs[regInd]);
      rs.uiIcon.set(regs[regInd]);
    });
  };


  function comp_createIcons(rs, packer) {
    // {rs.intmdParent} is still a string at this moment
    let parent = !rs.useParentRegion ? null : tryVal(rs.intmdParent, null);
    // Set resource color based on sprite color
    if(!rs.skipColorAssign) {
      rs.color = MDL_color._iconColor(tryVal(parent, rs));
    };

    if(rs.skipIconTagGen) return;
    let tags = MDL_content._intmdTags(rs);
    if(tags.length === 0) return;

    let pixBase = Core.atlas.getPixmap(tryVal(parent, rs.name));
    let pix0 = MDL_texture._pix_stack(pixBase);
    packer.add(MultiPacker.PageType.main, rs.name + "-t0", pix0);
    pix0.dispose();
    let alts = 0, nmMod, pixTag, pix;
    tags.forEachFast(tag => {
      nmMod = MDL_content._mod(rs);
      if(nmMod == null) return;
      if(!Core.atlas.has(nmMod + "-rs0tag-" + tag)) return;

      pixTag = Core.atlas.getPixmap(nmMod + "-rs0tag-" + tag);
      pix = MDL_texture._pix_stack(pixBase, pixTag);
      packer.add(MultiPacker.PageType.main, rs.name + "-t" + (alts + 1), pix);
      pix.dispose();
      alts++;
    });

    rs.alts = alts;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(null)
  .setTags()
  .setParam({
    // @PARAM: Whether to skip color assignment based on sprite.
    skipColorAssign: false,
    // @PARAM: Whether to skip icon tag generation, to allow vanilla animated sprite.
    skipIconTagGen: false,
    // @PARAM: Whether to clear vanilla stats for the resource (e.g. flammability will be shown only when larger than 0.0).
    overwriteVanillaStat: true,
    // @PARAM: Whether to automatically set values of some vanilla properties.
    overwriteVanillaProp: true,

    alts: 0,
    intmdParent: null,
    useParentRegion: false,
  })
  .setMethod({


    loadIcon: function() {
      comp_loadIcon(this);
    },


    createIcons: function(packer) {
      comp_createIcons(this, packer);
    },


  });
