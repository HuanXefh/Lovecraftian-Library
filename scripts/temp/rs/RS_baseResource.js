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
    // Use a new texture region to keep "ohno" intact
    if(rs.fullIcon === Core.atlas.find("error")) {
      rs.fullIcon = rs.uiIcon = new TextureRegion();
    };

    // If recolored sprite is created, use it instead
    if(rs.recolorRegStr != null) {
      let reg = Core.atlas.find(rs.name + "-recolor");
      rs.fullIcon.set(reg);
      rs.uiIcon.set(reg);
    };

    if(rs.skipIconTagGen) return;
    let iCap = rs.alts;
    if(iCap === 0) return;

    // Set up icon tag-based sprites
    let regs = [Core.atlas.find(rs.name + "-t0")], regInd;
    iCap._it(1, i => {
      regs.push(Core.atlas.find(rs.name + "-t" + (i + 1)));
    });
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
    let parent = !rs.useParentReg ? null : tryVal(rs.intmdParent, null);
    // Set resource color based on sprite color
    if(!rs.skipColorAssign) {
      rs.color = MDL_color._iconColor(tryVal(parent, rs));
    };

    let pixBase = Core.atlas.getPixmap(tryVal(parent, rs.name));

    if(rs.recolorRegStr != null && parent != null && global.lovecUtil.prop.useRecolorSpr) {
      // Generate recolored sprite
      let pix = MDL_texture._pix_gsColor(
        Core.atlas.getPixmap(rs.recolorRegStr),
        Core.atlas.getPixmap(parent),
      );
      packer.add(MultiPacker.PageType.main, rs.name + "-recolor", pix);
      pix.dispose();
      pixBase = Core.atlas.getPixmap(rs.name + "-recolor");
    } else {
      rs.recolorRegStr = null;
    };

    if(rs.skipIconTagGen) return;
    let tags = MDL_content._intmdTags(rs);
    if(tags.length === 0) return;

    // Generate icon tag-based sprites
    let pixOri = MDL_texture._pix_stack(pixBase);
    packer.add(MultiPacker.PageType.main, rs.name + "-t0", pixOri);
    pixOri.dispose();
    let alts = 0, pixCombine;
    if(rs.recolorRegStr != null && parent != null) {
      // For recolored sprites, use parent as the icon tag
      pixCombine = MDL_texture._pix_ctStack(pixBase, parent);
      packer.add(MultiPacker.PageType.main, rs.name + "-t1", pixCombine);
      pixCombine.dispose();
      alts++;
    } else {
      let nmMod = MDL_content._mod(rs), pixTag;
      // For other sprites, use text label as the icon tag
      if(nmMod != null) {
        tags.forEachFast(tag => {
          if(!Core.atlas.has(nmMod + "-rs0tag-" + tag)) return;

          pixTag = Core.atlas.getPixmap(nmMod + "-rs0tag-" + tag);
          pixCombine = MDL_texture._pix_stack(pixBase, pixTag);
          packer.add(MultiPacker.PageType.main, rs.name + "-t" + (alts + 1), pixCombine);
          pixCombine.dispose();
          alts++;
        });
      };
    };
    // Extra resource icon tags, if used
    rs.extraIntmdParents.forEachFast(nmRs => {
      pixCombine = MDL_texture._pix_ctStack(pixBase, nmRs);
      packer.add(MultiPacker.PageType.main, rs.name + "-t" + (alts + 1), pixCombine);
      pixCombine.dispose();
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
    extraIntmdParents: prov(() => []),
    useParentReg: false,
    recolorRegStr: null,
  })
  .setMethod({


    loadIcon: function() {
      comp_loadIcon(this);
    },


    createIcons: function(packer) {
      comp_createIcons(this, packer);
    },


  });
