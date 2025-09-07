/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const JAVA = require("lovec/glb/GLB_java");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");
  const MDL_text = require("lovec/mdl/MDL_text");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const TP_dial = require("lovec/tp/TP_dial");
  const TP_stat = require("lovec/tp/TP_stat");


  /* <---------- base ----------> */


  /* spacing */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets margin for the cell quickly.
   * ---------------------------------------- */
  const __margin = function(tb, scl) {
    if(scl == null) scl = 1.0;

    return tb.marginLeft(12.0 * scl).marginRight(12.0 * scl).marginTop(15.0 * scl).marginBottom(15.0 * scl);
  };
  exports.__margin = __margin;


  /* new line */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds empty lines.
   * ---------------------------------------- */
  const __break = function(tb, repeat) {
    if(repeat == null) repeat = 2;

    for(let i = 0; i < repeat; i++) {tb.add("").row()};
  };
  exports.__break = __break;


  /* ----------------------------------------
   * NOTE:
   *
   * A horizonal bar.
   * ---------------------------------------- */
  const __bar = function(tb, color, w, stroke) {
    if(color == null) color = Color.darkGray;
    if(stroke == null) stroke = 4.0;

    if(w == null) {
      tb.image().color(color).height(stroke).pad(0.0).growX().fillX().row();
    } else {
      tb.image().color(color).width(w).height(stroke).pad(0.0).fillX().row();
    };
  };
  exports.__bar = __bar;


  /* ----------------------------------------
   * NOTE:
   *
   * A vertical bar.
   * ---------------------------------------- */
  const __barV = function(tb, color, h, stroke) {
    if(color == null) color = Color.darkGray;
    if(stroke == null) stroke = 4.0;

    if(h == null) {
      return tb.image().color(color).width(stroke).pad(0.0).growY().fillY();
    } else {
      return tb.image().color(color).width(stroke).height(h).pad(0.0).fillY();
    };
  };
  exports.__barV = __barV;


  /* text */


  /* ----------------------------------------
   * NOTE:
   *
   * A text line that is wrapped.
   * ---------------------------------------- */
  const __wrapLine = function(tb, str, align, ord, padLeft) {
    if(align == null) align = Align.left;
    if(ord == null) ord = 0;
    if(padLeft == null) padLeft = 0.0;

    tb.add(str).center().labelAlign(align).wrap().width(MDL_ui._uiW(null, null, ord * VAR.rad_ordRad)).padLeft(padLeft).row();
  };
  exports.__wrapLine = __wrapLine;


  /* ----------------------------------------
   * NOTE:
   *
   * Used when a dialog has no contents.
   * ---------------------------------------- */
  const __textNothing = function(tb) {
    tb.add(MDL_bundle._info("lovec", "nothing")).center().row();
  };
  exports.__textNothing = __textNothing;


  /* input */


  /* ----------------------------------------
   * NOTE:
   *
   * The basic button template.
   * ---------------------------------------- */
  const __btnBase = function(tb, nm, scr, w, h) {
    if(w == null) w = 200.0;
    if(h == null) h = 50.0;

    return tb.button(nm, scr).size(w, h).center().pad(12.0);
  };
  exports.__btnBase = __btnBase;


  /* ----------------------------------------
   * NOTE:
   *
   * Template for icon button.
   * ---------------------------------------- */
  const __btnSmallBase = function(tb, icon, scr) {
    return tb.button(icon, scr).size(42.0).center().pad(12.0);
  };
  exports.__btnSmallBase = __btnSmallBase;


  /* ----------------------------------------
   * NOTE:
   *
   * A button to close the dialog.
   * ---------------------------------------- */
  const __btnClose = function(tb, dial, w, h) {
    dial.addCloseListener();

    return __btnBase(tb, "@close", () => {
      dial.hide();
    }, w, h);
  };
  exports.__btnClose = __btnClose;


  /* ----------------------------------------
   * NOTE:
   *
   * A button to visit a website.
   * ---------------------------------------- */
  const __btnLink = function(tb, nm, url, w, h) {
    return __btnBase(tb, nm, () => {
      Core.app.openURI(url);
    }, w, h);
  };
  exports.__btnLink = __btnLink;


  /* ----------------------------------------
   * NOTE:
   *
   * Base for config buttons.
   * ---------------------------------------- */
  const __btnCfg_base = function(tb, b, scr, icon, w) {
    if(w == null) w = 24.0;

    return tb.button(icon, w, () => scr(b)).center();
  };
  exports.__btnCfg_base = __btnCfg_base;


  /* ----------------------------------------
   * NOTE:
   *
   * A config button to switch {bool} property in a building.
   * ---------------------------------------- */
  const __btnCfg_toggle = function(tb, b, icon1, icon2, bool, w) {
    if(w == null) w = 24.0;

    return tb.button(bool ? icon1 : icon2, w, () => {

      Call.tileConfig(Vars.player, b, !bool);
      b.deselect();

    }).center();
  };
  exports.__btnCfg_toggle = __btnCfg_toggle;


  /* ----------------------------------------
   * NOTE:
   *
   * Simply a slider.
   * ---------------------------------------- */
  const __slider = function(tb, valCaller, min, max, step, def) {
    if(valCaller == null) valCaller = Function.air;
    if(min == null) min = 0;
    if(max == null) max = 2;
    if(step == null) step = 1;
    if(def == null) def = min;

    tb.slider(min, max, step, ini, valCaller).row();
  };
  exports.__slider = __slider;


  /* content */


  /* ----------------------------------------
   * NOTE:
   *
   * Like what's done in {Stat.tiles}, but displays the attribute in tooltip.
   * ---------------------------------------- */
  const __blkEffc = function(tb, blk, mtp, nmAttr, w, dial) {
    if(blk == null) return;

    if(w == null) w = 64.0;

    var str = (Math.abs(mtp) < 0.0001) ? "" : (Strings.autoFixed(mtp * 100.0, 2) + "%");
    return tb.table(Styles.none, tb1 => {

      tb.left();

      tb1.table(Styles.none, tb2 => {

        tb2.left();

        var btn = tb2.button(new TextureRegionDrawable(blk.uiIcon), w, () => {
          Vars.ui.content.show(blk);
          if(dial != null) dial.hide();
        })
        .tooltip(blk.localizedName + ((nmAttr == null) ? "" : ("\n\n[green]" + MDL_attr._attrB(nmAttr) + "[]")))
        .padRight(-18.0)
        .get();
        tb2.table(Styles.none, tb3 => {

          tb3.left();

          __break(tb3);

          tb3.add(str)
          .fontScale(0.85)
          .left()
          .style(Styles.outlineLabel)
          .color(mtp < 0.0 ? Pal.remove : Pal.accent);

        });

        btn.margin(0.0);
        var btnStyle = btn.getStyle();
        btnStyle.up = Styles.none;
        btnStyle.down = Styles.none;
        btnStyle.over = Styles.flatOver;

      }).padRight(4.0);

    }).left().padRight(8.0).padTop(4.0).padBottom(4.0);
  };
  exports.__blkEffc = __blkEffc;


  /* ----------------------------------------
   * NOTE:
   *
   * A content icon that can be clicked to show its stat page.
   * Set {dial} to hide some dialog when clicked.
   * ---------------------------------------- */
  const __ct = function(tb, ct, w, pad, dial) {
    if(ct == null) return;

    if(w == null) w = 32.0;
    if(pad == null) pad = 4.0;

    var btnCell = tb.button(new TextureRegionDrawable(ct.uiIcon), w, () => {
      Vars.ui.content.show(ct);
      if(dial != null) dial.hide();
    })
    .pad(pad)
    .tooltip(ct.localizedName, true);
    var btn = btnCell.get();

    btn.margin(0.0);
    var btnStyle = btn.getStyle();
    btnStyle.up = Styles.none;
    btnStyle.down = Styles.none;
    btnStyle.over = Styles.flatOver;

    return btnCell;
  };
  exports.__ct = __ct;


  /* ----------------------------------------
   * NOTE:
   *
   * Used by recipe factories to replace consumer-based table.
   * ---------------------------------------- */
  const __reqRs = function(tb, b, rs, amt) {
    let reqImg = new ReqImage(
      rs instanceof Item ? StatValues.stack(rs, amt) : rs.uiIcon,
      rs instanceof Item ? () => b.items.get(rs) >= amt : () => b.liquids.get(rs) > 0.0,
    );

    return tb.add(reqImg).size(32.0);
  };
  exports.__reqRs = __reqRs;


  /* ----------------------------------------
   * NOTE:
   *
   * Used by recipe factories to replace consumer-based table.
   * ---------------------------------------- */
  const __reqMultiRs = function(tb, b, rss) {
    let multiReqImg = new MultiReqImage();
    rss.forEach(rs => {
      if(rs.unlockedNow()) multiReqImg.add(new ReqImage(
        rs.uiIcon,
        rs instanceof Item ? () => b.items.has(rs) : () => b.liquids.get(rs) > 0.0,
      ));
    });

    return tb.add(multiReqImg).size(32.0);
  };
  exports.__reqMultiRs = __reqMultiRs;


  /* ----------------------------------------
   * NOTE:
   *
   * A group of elements mainly used by recipe tables.
   * ---------------------------------------- */
  const __rcCt = function(tb, ct, amt, p, cancelLiq, w, dial) {
    if(ct == null) return;

    if(amt == null) amt = -1;
    if(p == null) p = 1.0;
    if(cancelLiq == null) cancelLiq = false;
    if(w == null) w = 32.0;

    var str = (amt < 0) ? " ": ((ct instanceof Liquid && !cancelLiq) ? Strings.autoFixed(amt * 60.0, 2) + "/s" : Strings.autoFixed(amt, 0));

    return tb.table(Styles.none, tb1 => {

      tb1.left();

      tb1.table(Styles.none, tb2 => {

        tb2.left();

        var btn = tb2.button(new TextureRegionDrawable(ct.uiIcon), w, () => {
          if(dial != null) dial.hide();
          Vars.ui.content.show(ct);
        })
        .tooltip(ct.localizedName)
        .padRight(-4.0)
        .get();
        tb2.table(Styles.none, tb3 => {

          tb3.left();

          tb3.add((Math.abs(p - 1.0) > 0.0001) ? (Strings.autoFixed(p * 100.0, 2) + "%") : "")
          .left()
          .fontScale(0.85)
          .style(Styles.outlineLabel)
          .color(Color.gray)
          .row();

          tb3.add(str)
          .left()
          .fontScale(0.85)
          .style(Styles.outlineLabel);

        });

        btn.margin(0.0);
        var btnStyle = btn.getStyle();
        btnStyle.up = Styles.none;
        btnStyle.down = Styles.none;
        btnStyle.over = Styles.flatOver;

      }).padRight(6.0);

    }).left().padRight(12.0).padTop(4.0).padBottom(4.0);
  };
  exports.__rcCt = __rcCt;


  /* <---------- text ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a gray area holding text lines.
   * ---------------------------------------- */
  const setDisplay_note = function(tb, str, ord, padLeft, noGrow) {
    if(str == null) return;

    if(ord == null) ord = 1;
    if(padLeft == null) padLeft = 0.0;

    let cell = tb.table(Tex.whiteui, tb1 => {

      tb1.center().setColor(Pal.darkestGray);
      __margin(tb1, 1.5);

      __wrapLine(tb1, str.color(Color.gray), Align.left, ord, padLeft);

    }).padTop(8.0).padBottom(8.0);
    if(!noGrow) cell.growX();
    cell.row();
  };
  exports.setDisplay_note = setDisplay_note;


  /* <---------- table ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up an outlined table for data display.
   * ---------------------------------------- */
  const setTable_base = function(tb, matArr, colorLine, colorTitle, colorBase, stroke, imgW) {
    if(colorLine == null) colorLine = Color.darkGray;
    if(colorTitle == null) colorTitle = colorLine;
    if(colorBase == null) colorBase = Pal.darkestGray;
    if(stroke == null) stroke = 2.0;
    if(imgW = 32.0);

    let rowAmt = matArr.iCap();
    let colAmt = matArr[0].iCap();
    if(rowAmt === 0 || colAmt === 0) return;

    const cont =  new Table();
    tb.add(cont);

    for(let i = 0; i < colAmt; i++) {
      let tbCol = cont.table(Styles.none, tb1 => {}).grow().get();
      for(let j = 0; j < rowAmt; j++) {
        let tbRow = tbCol.table(Tex.whiteui, tb1 => {
          tb1.left().setColor(colorLine);
        }).left().grow().get();
        tbCol.row();

        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.row();

        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.table(Tex.whiteui, tbCell => {

          tbCell.left().setColor(j === 0 ? colorTitle : colorBase);
          __margin(tbCell, 0.25);

          let tmp = matArr[j][i];

          if(tmp instanceof TextureRegion) {
            tbCell.image(tmp).width(imgW).height(imgW);
          } else if(tmp instanceof UnlockableContent) {
            __ct(tbCell, tmp, imgW);
          } else if(typeof tmp === "function") {
            tmp(tbCell);
          } else if(typeof tmp === "string") {
            tbCell.add(tmp).padLeft(8.0).padRight(8.0);
          } else if(typeof tmp === "number") {
            tbCell.add(Strings.autoFixed(tmp, 2)).padLeft(8.0).padRight(8.0);
          } else {
            tb3.add("!ERR");
          };

        }).growX().height(j === 0 ? 24.0 : (imgW + 8.0));
        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.row();

        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.table(Styles.none, tb => {}).width(stroke).height(stroke);
        tbRow.row();
      };
    };
  };
  exports.setTable_base = setTable_base;


  /* <---------- content ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a list that shows contents in rows.
   * ---------------------------------------- */
  const setDisplay_ctRow = function(tb, cts_gn_p, showOrd) {
    let cts_gn;
    if(showOrd == null) showOrd = false;
    if(cts_gn_p instanceof Array) {cts_gn = cts_gn_p} else {
      cts_gn = [cts_gn_p];
      showOrd = false;
    };

    var ordCur = 0;

    __break(tb, 1);

    cts_gn.forEach(ct_gn => {
      let ct = MDL_content._ct(ct_gn, null, true);
      if(ct != null) {

        tb.table(Tex.whiteui, tb1 => {

          tb1.left().setColor(Pal.darkestGray);
          __margin(tb1);

          // @TABLE: order
          if(showOrd) tb1.table(Styles.none, tb2 => {

            tb2.left();

            tb2.table(Styles.none, tb3 => {

              tb3.center();

              tb3.add("[" + Strings.fixed(ordCur + 1.0, 0) + "]").color(Pal.accent);

            }).width(48.0);

          }).marginRight(18.0).growY();

          // @TABLE: content icon
          tb1.table(Styles.none, tb2 => {

            tb2.left();

            tb2.image(ct.uiIcon).size(Vars.iconLarge).padRight(18.0);
            __barV(tb2).padRight(18.0);
            tb2.add(ct.localizedName);

          });

          // @TABLE: spacing
          tb1.table(Styles.none, tb2 => {}).width(80.0).growX().growY();

          // @TABLE: "?" button
          tb1.table(Styles.none, tb2 => {

            tb2.left();

            tb2.button("?", () => Vars.ui.content.show(ct)).size(VAR.rad_charBtnRad);

          });

        }).growX().row();

        __break(tb, 1);

        ordCur++;

      };
    });
  };
  exports.setDisplay_ctRow = setDisplay_ctRow;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a list that shows content just like in the database.
   * ---------------------------------------- */
  const setDisplay_ctLi = function(tb, cts_gn_p, iconW, colAmt, dial) {
    if(iconW == null) iconW = 32.0;
    if(colAmt == null) colAmt = MDL_ui._colAmt(iconW, 0.0, 2);

    let cts_gn;
    if(cts_gn_p instanceof Array) {cts_gn = cts_gn_p} else {
      cts_gn = [cts_gn_p];
    };

    tb.table(Tex.whiteui, tb1 => {

      tb1.left().setColor(Pal.darkestGray);
      __margin(tb1, 0.5);

      let iCap = cts_gn.length;
      if(iCap === 0) return;
      for(let i = 0, j = 0; i < iCap; i++) {
        (function(i) {
          let ct = MDL_content._ct(cts_gn[i], null, true);
          if(ct == null) return;
          __ct(tb1, ct, iconW, null, dial);
        })(i);

        if(j % colAmt === colAmt - 1) tb1.row();
        j++;
      };

    }).left().row();
  };
  exports.setDisplay_ctLi = setDisplay_ctLi;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a selector for choosing a content.
   * Improved vanilla {ItemSelection} with better text search.
   * ---------------------------------------- */
  const setSelector_ct = function(tb, blk, cts, ctGetter, cfgCaller, closeSelect, rowAmt, colAmt) {
    if(closeSelect == null) closeSelect = false;
    if(rowAmt == null) rowAmt = 4;
    if(colAmt == null) colAmt = 4;

    let search = null;
    let countRow = 0;
    let btnGrp = new ButtonGroup();
    btnGrp.setMinCheckCount(0);
    btnGrp.setMaxCheckCount(1);
    const cont = new Table().top();
    cont.defaults().size(40.0);

    const rebuild = () => {
      btnGrp.clear();
      cont.clearChildren();

      let text = search == null ? "" : search.getText().replace("=", "");
      countRow = 0;

      let arr = cts.filter(ct => text === "" || MDL_text._searchValid(ct, text));
      let iCap = arr.iCap();
      if(iCap > 0) {
        for(let i = 0, j = 0; i < iCap; i++) {

          j += (function(i) {
            let ct = arr[i];
            if(!MDL_cond._isRsAvailable(ct)) return 0;

            let btn = cont.button(Tex.whiteui, Styles.clearNoneTogglei, Mathf.clamp(ct.selectionSize, 0.0, 40.0), () => {
              if(closeSelect) Vars.control.input.config.hideConfig();
            }).tooltip(ct.localizedName, true).group(btnGrp).get();
            btn.changed(() => cfgCaller(btn.isChecked() ? ct : null));
            btn.getStyle().imageUp = new TextureRegionDrawable(ct.uiIcon);
            btn.update(() => btn.setChecked(ctGetter() === ct));

            return 1;
          })(i);

          if((j - 1) % colAmt == colAmt - 1) {
            cont.row();
            j = 0;
            countRow++;
          };

        };
      };

    };
    rebuild();

    const root = new Table().background(Styles.black6);
    if(countRow > rowAmt * 1.5) root.table(Styles.none, tb1 => {

      tb1.image(Icon.zoom).padLeft(4.0);
      search = tb1.field(null, text => {
        if(text.endsWith("=")) rebuild();
      }).padBottom(4.0).left().growX().get();
      search.setMessageText("@info.lovec-info-search.name");

    }).growX().row();

    const pn = new ScrollPane(cont, Styles.smallPane);
    pn.setScrollingDisabled(true, false);
    pn.exited(() => {
      if(pn.hasScroll()) Core.scene.setScrollFocus(null);
    });
    if(blk != null) {
      pn.setScrollYForce(blk.selectScroll);
      pn.update(() => blk.selectScroll = pn.getScrollY());
    };
    pn.setOverscroll(false, false);

    root.add(pn).maxHeight(rowAmt * 40.0).growX();
    tb.top().add(root).width(colAmt * 40.0 + 28.0);
  };
  exports.setSelector_ct = setSelector_ct;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a selector for choosing multiple contents.
   * ---------------------------------------- */
  const setSelector_ctMulti = function(tb, blk, cts, ctsGetter, cfgCaller, closeSelect, rowAmt, colAmt, max) {
    if(closeSelect == null) closeSelect = false;
    if(rowAmt == null) rowAmt = 4;
    if(colAmt == null) colAmt = 4;
    if(max == null) max = Number.intMax;

    let search = null;
    let countRow = 0;
    let btnGrp = new ButtonGroup();
    btnGrp.setMinCheckCount(0);
    btnGrp.setMaxCheckCount(max);
    const cont = new Table().top();
    cont.defaults().size(40.0);

    const rebuild = () => {
      btnGrp.clear();
      cont.clearChildren();

      let text = search == null ? "" : search.getText().replace("=", "");
      countRow = 0;

      let arr = cts.filter(ct => text === "" || MDL_text._searchValid(ct, text));
      let iCap = arr.iCap();
      if(iCap > 0) {
        for(let i = 0, j = 0; i < iCap; i++) {

          j += (function(i) {
            let ct = arr[i];
            if(!MDL_cond._isRsAvailable(ct)) return 0;

            let btn = cont.button(Tex.whiteui, Styles.clearNoneTogglei, Mathf.clamp(ct.selectionSize, 0.0, 40.0), () => {
              if(closeSelect) Vars.control.input.config.hideConfig();
            }).tooltip(ct.localizedName, true).group(btnGrp).get();
            btn.changed(() => cfgCaller((btn.isChecked() ? ["selector", ct, true] : ["selector", ct, false]).toJavaArr()));
            btn.getStyle().imageUp = new TextureRegionDrawable(ct.uiIcon);
            btn.update(() => btn.setChecked(ctsGetter().includes(ct)));

            return 1;
          })(i);

          if((j - 1) % colAmt == colAmt - 1) {
            cont.row();
            j = 0;
            countRow++;
          };

        };
      };

    };
    rebuild();

    const root = new Table().background(Styles.black6);
    if(countRow > rowAmt * 1.5) root.table(Styles.none, tb1 => {

      tb1.image(Icon.zoom).padLeft(4.0);
      search = tb1.field(null, text => {
        if(text.endsWith("=")) rebuild();
      }).padBottom(4.0).left().growX().get();
      search.setMessageText("@info.lovec-info-search.name");

    }).growX().row();

    const pn = new ScrollPane(cont, Styles.smallPane);
    pn.setScrollingDisabled(true, false);
    pn.exited(() => {
      if(pn.hasScroll()) Core.scene.setScrollFocus(null);
    });
    if(blk != null) {
      pn.setScrollYForce(blk.selectScroll);
      pn.update(() => blk.selectScroll = pn.getScrollY());
    };
    pn.setOverscroll(false, false);

    root.add(pn).maxHeight(rowAmt * 40.0).growX();
    tb.top().add(root).width(colAmt * 40.0 + 28.0);
  };
  exports.setSelector_ctMulti = setSelector_ctMulti;


  /* <---------- misc stat ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets attribute display that supports multiple attributes.
   * ---------------------------------------- */
  const setDisplay_attr = function(tb, attrs_gn_p, iconW, colAmt, dial) {
    if(iconW == null) iconW = 64.0;
    if(colAmt == null) colAmt = MDL_ui._colAmt(iconW, 0.0, 2);

    let map = MDL_attr._blkAttrMap(attrs_gn_p);

    tb.table(Styles.none, tb1 => {

      tb1.left();
      __margin(tb1, 0.5);

      let iCap = map.length;
      if(iCap === 0) return;
      for(let i = 0, j = 0; i < iCap; i += 3) {
        (function(i) {
          let blk = map[i];
          let attrVal = map[i + 1];
          let nmAttr = map[i + 2];
          __blkEffc(tb1, blk, attrVal, nmAttr, iconW, dial);
        })(i);

        if(j % colAmt === colAmt - 1) tb1.row();
        j++;
      };

    }).left().row();
  };
  exports.setDisplay_attr = setDisplay_attr;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a gray area holding faction icon and name.
   * ---------------------------------------- */
  const setDisplay_faction = function(tb, ct) {
    if(ct == null) return;

    let faction = MDL_content._faction(ct);
    let factionB = MDL_content._factionB(faction);
    let factionColor = MDL_content._factionColor(faction);

    tb.table(Tex.whiteui, tb1 => {

      tb1.center().setColor(Pal.darkestGray);
      __margin(tb1);

      let btn = tb1.button(
        new TextureRegionDrawable(Core.atlas.find(
          faction === "none" ?
            "lovec-faction-none" :
            MDL_content._mod(ct) + "-faction-" + faction,
        )),
        () => TP_dial.cts.ex_show(
          factionB.color(factionColor),
          VARGEN.factions[faction],
          true,
        ),
      )
      .padLeft(-4.0)
      .padRight(24.0)
      .get();
      btn.margin(2.0);
      let btnStyle = btn.getStyle();
      btnStyle.up = Styles.none;
      btnStyle.down = Styles.none;
      btnStyle.over = Styles.flatOver;

      tb1.add(factionB).fontScale(1.1).color(factionColor);

    }).padTop(8.0).padBottom(8.0).growX().row();
  };
  exports.setDisplay_faction = setDisplay_faction;


  const setDisplay_facFami = function(tb, blk) {
    const root = new Table();
    __break(tb, 1);
    tb.left().add(root).row();
    __break(tb, 1);

    MDL_content._facFamis(blk).forEach(fami => {
      let cont = new Table();
      root.left().add(cont).width(420.0).growX().row();

      cont.table(Tex.whiteui, tb1 =>{

        tb1.center().setColor(Color.darkGray);
        __margin(tb1, 0.5);

        tb1.add(MDL_content._facFamiB(fami)).pad(4.0);

      }).left().growX().row();

      cont.table(Tex.whiteui, tb1 => {

        tb1.left().setColor(Pal.darkestGray);
        __margin(tb1, 0.5);

        setDisplay_ctLi(tb1, VARGEN.facFamis[fami], 48.0);

      }).left().growX().row();
    });
  };
  exports.setDisplay_facFami = setDisplay_facFami;


  /* <---------- recipe ----------> */


  const setDisplay_recipe = function(tb, rcMdl, blk) {
    if(MDL_recipe._rcSize(rcMdl) === 0) {
      __textNothing(tb);
      return;
    };

    const cont = new Table();
    tb.left();
    __break(tb, 1);
    tb.add(cont).row();
    __break(tb, 1);

    const categHeaderObj = MDL_recipe._categHeaderObj(rcMdl);
    let i = 1;
    for(let categ in categHeaderObj) {

      let chunk = new Table();
      cont.left().add(chunk).growX().row();

      // @TABLE: category title
      chunk.table(Tex.whiteui, tb1 => {

        tb1.center().setColor(Color.darkGray);
        __margin(tb1, 0.5);

        tb1.add(MDL_recipe._categB(categ)).pad(4.0);

      }).left().growX().row();

      categHeaderObj[categ].forEach(rcHeader => {

        let timeScl = MDL_recipe._timeScl(rcMdl, rcHeader);
        let isGen = MDL_recipe._isGen(rcMdl, rcHeader);

        let lockedByCts = MDL_recipe._lockedBy(rcMdl, rcHeader, true);

        let tempReq = MDL_recipe._tempReq(rcMdl, rcHeader);
        let tempAllowed = MDL_recipe._tempAllowed(rcMdl, rcHeader);
        let durabDecMtp = MDL_recipe._durabDecMtp(rcMdl, rcHeader);

        let ci = MDL_recipe._ci(rcMdl, rcHeader);
        let bi = MDL_recipe._bi(rcMdl, rcHeader);
        let aux = MDL_recipe._aux(rcMdl, rcHeader);
        let reqOpt = MDL_recipe._reqOpt(rcMdl, rcHeader);
        let opt = MDL_recipe._opt(rcMdl, rcHeader);
        let co = MDL_recipe._co(rcMdl, rcHeader);
        let bo = MDL_recipe._bo(rcMdl, rcHeader);
        let failP = MDL_recipe._failP(rcMdl, rcHeader);
        let fo = MDL_recipe._fo(rcMdl, rcHeader);

        // @TABLE: recipe root
        chunk.table(Tex.whiteui, tb1 => {

          tb1.left().setColor(Pal.darkestGray);

          // @TABLE: order
          tb1.table(Styles.none, tb2 => {

            tb2.left();

            tb2.table(Styles.none, tb3 => {

              tb3.center();

              tb3.add("[" + Strings.fixed(i, 0) + "]").color(Pal.accent);

            }).width(72.0);

            __barV(tb2, Pal.accent);

          }).left().growY();

          // @TABLE: spacing
          tb1.table(Styles.none, tb2 => {}).left().width(36.0).growY();

          // @TABLE: input root
          tb1.table(Styles.none, tb2 => {

            tb2.left();

            // @TABLE: BI
            if(bi.length > 0) {
              tb2.table(Styles.none, tb3 => {

                tb3.left();
                __margin(tb3);

                tb3.add("BI:").left().tooltip(MDL_bundle._term("lovec", "bi"), true).row();
                tb3.table(Styles.none, tb4 => {
                  let i = 0;
                  let iCap = bi.iCap();
                  while(i < iCap) {
                    let tmp = bi[i];
                    if(!(tmp instanceof Array)) {
                      let amt = bi[i + 1];
                      let p = bi[i + 2];
                      __rcCt(tb4, tmp, amt, p, true);
                    } else {
                      tb4.table(Tex.whiteui, tb5 => {
                        tb5.left().setColor(Color.darkGray);
                        let j = 0;
                        let jCap = tmp.iCap();
                        while(j < jCap) {
                          let tmp1 = tmp[j];
                          let amt = tmp[j + 1];
                          let p = tmp[j + 2];
                          __rcCt(tb5, tmp1, amt, p, true).row();
                          j += 3;
                        };
                      }).padRight(16.0);
                    };
                    i += 3;
                  };
                }).left().marginRight(24.0);

              });
            };

            // @TABLE: CI
            if(ci.length > 0) {
              tb2.table(Styles.none, tb3 => {

                tb3.left();
                __margin(tb3);

                tb3.add("CI:").left().tooltip(MDL_bundle._term("lovec", "ci"), true).row();
                tb3.table(Styles.none, tb4 => {
                  let i = 0;
                  let iCap = ci.iCap();
                  while(i < iCap) {
                    let tmp = ci[i];
                    let amt = ci[i + 1];
                    __rcCt(tb4, tmp, amt);
                    i += 2;
                  };
                });

              }).left().marginRight(24.0);
            };

            // @TABLE: AUX
            if(aux.length > 0) {
              tb2.table(Styles.none, tb3 => {

                tb3.left();
                __margin(tb3);

                tb3.add("AUX:").left().tooltip(MDL_bundle._term("lovec", "aux"), true).row();
                tb3.table(Styles.none, tb4 => {
                  let i = 0;
                  let iCap = aux.iCap();
                  while(i < iCap) {
                    let tmp = aux[i];
                    let amt = aux[i + 1];
                    __rcCt(tb4, tmp, amt);
                    i += 2;
                  };
                });

              }).left().marginRight(24.0);
            };

            // @TABLE: OPT
            if(opt.length > 0) {
              tb2.table(Styles.none, tb3 => {

                tb3.left();
                __margin(tb3);

                tb3.add("OPT:").left().tooltip(MDL_bundle._term("lovec", "opt"), true).row();
                tb3.button("?", () => TP_dial.rcOpt.ex_show(MDL_bundle._term("lovec", "opt"), opt)).size(34.0).pad(3.0);

              }).left().marginRight(24.0);
            };

            // @TABLE: spacing
            tb2.table(Styles.none, tb3 => {}).left().width(24.0).growX().growY();

          }).left().growX().growY();

          // @TABLE: spacing
          tb1.table(Styles.none, tb2 => {}).width(48.0).growX().growY();

          // @TABLE: output base
          tb1.table(Styles.none, tb2 => {

            tb2.left();

            // @TABLE: BO
            if(bo.length > 0) {
              tb2.table(Styles.none, tb3 => {

                tb3.left();
                __margin(tb3);

                tb3.add("BO:").left().tooltip(MDL_bundle._term("lovec", "bo"), true).row();
                tb3.table(Styles.none, tb4 => {
                  let i = 0;
                  let iCap = bo.iCap();
                  while(i < iCap) {
                    let tmp = bo[i];
                    let amt = bo[i + 1];
                    let p = bo[i + 2];
                    __rcCt(tb4, tmp, amt, p, true);
                    i += 3;
                  };
                });

              }).left().marginRight(24.0);
            };

            // @TABLE: CO
            if(co.length > 0) {
              tb2.table(Styles.none, tb3 => {

                tb3.left();
                __margin(tb3);

                tb3.add("CO:").left().tooltip(MDL_bundle._term("lovec", "co"), true).row();
                tb3.table(Styles.none, tb4 => {
                  let i = 0;
                  let iCap = co.iCap();
                  while(i < iCap) {
                    let tmp = co[i];
                    let amt = co[i + 1];
                    __rcCt(tb4, tmp, amt);
                    i += 2;
                  };
                });

              }).left().marginRight(24.0);
            };

            // @TABLE: FO
            if(fo.length > 0) {
              tb2.table(Styles.none, tb3 => {

                tb3.left();
                __margin(tb3);

                tb3.add("FO:").left().tooltip(MDL_bundle._term("lovec", "fo"), true).row();
                tb3.table(Styles.none, tb4 => {
                  let i = 0;
                  let iCap = fo.iCap();
                  while(i < iCap) {
                    let tmp = fo[i];
                    let amt = fo[i + 1];
                    let p = fo[i + 2];
                    __rcCt(tb4, tmp, amt, p, true);
                    i += 3;
                  };
                });

              }).left().marginRight(24.0);
            };

          }).left().growY();

          // @TABLE: recipe stats
          tb1.table(Styles.none, tb2 => {

            __barV(tb2, Pal.accent);

            // @TABLE: spacing
            tb2.table(Styles.none, tb3 => {}).width(24.0);

            tb2.table(Styles.none, tb3 => {

              tb3.left();

              if(isGen) tb3.add(MDL_bundle._term("lovec", "generated-recipe").color(Color.gray)).left().row();

              if(!timeScl.fEqual(1.0)) tb3.add(MDL_text._statText(
                MDL_bundle._term("lovec", "time-required"),
                Strings.fixed(timeScl, 1) + "x (" + Strings.autoFixed(blk.craftTime * timeScl / 60.0, 2) + "s)",
              )).left().row();

              if(reqOpt) tb3.add(MDL_text._statText(
                MDL_bundle._term("lovec", "require-optional"),
                MDL_bundle._base("yes"),
              )).left().row();

              if(failP > 0.0) tb3.add(MDL_text._statText(
                MDL_bundle._term("lovec", "chance-to-fail"),
                failP.perc(1),
              )).left().row();

              if(tempReq > 0.0) tb3.add(MDL_text._statText(
                MDL_bundle._term("lovec", "temperature-required"),
                Strings.fixed(tempReq, 2),
                TP_stat.rs_heatUnits.localized(),
              )).left().row();

              if(tempAllowed < Infinity) tb3.add(MDL_text._statText(
                MDL_bundle._term("lovec", "temperature-allowed"),
                Strings.fixed(tempAllowed, 2),
                TP_stat.rs_heatUnits.localized(),
              )).left().row();

              if(!durabDecMtp.fEqual(1.0)) tb3.add(MDL_text._statText(
                MDL_bundle._term("lovec", "abrasion-multiplier"),
                durabDecMtp.perc(),
              )).left().row();

              if(lockedByCts.length > 0) {
                tb3.table(Styles.none, tb4 => {

                  tb4.left();

                  tb4.add(MDL_text._statText(MDL_bundle._term("lovec", "require-unlocking"), "")).left();
                  lockedByCts.forEach(ct => __ct(tb4, ct, 28.0, 0.0));

                }).left().row();
              };

            }).left().width(360.0).growX();

            // @TABLE: spacing
            tb2.table(Styles.none, tb3 => {}).width(20.0);

          }).growY();

        }).left().growX().row();

        __bar(chunk, Color.valueOf("303030"), null, 1.0);
        i++;

      });

    };
  };
  exports.setDisplay_recipe = setDisplay_recipe;


  const setSelector_recipe = function(tb, b, headerGetter, cfgCaller, closeSelect, colAmt) {
    if(closeSelect == null) closeSelect = true;
    if(colAmt == null) colAmt = 4;

    let btnGrp = new ButtonGroup();
    btnGrp.setMinCheckCount(0);
    btnGrp.setMaxCheckCount(1);
    let rcMdl = b.block.ex_getRcMdl();
    let categHeaderObj = MDL_recipe._categHeaderObj(rcMdl);

    tb.button("?", () => Vars.ui.content.show(b.block)).left().size(42.0).row();

    const root = new Table().background(Styles.black6);
    root.margin(4.0);
    tb.top().add(root);

    const rebuild = () => {
      btnGrp.clear();
      root.clearChildren();

      for(let categ in categHeaderObj) {

        root.add(MDL_recipe._categB(categ)).left().pad(4.0).row();

        let i = 0;
        let chunk = new Table();
        categHeaderObj[categ].forEach(rcHeader => {

          let ct = MDL_content._ct(MDL_recipe._iconNm(rcMdl, rcHeader), null, true);
          let icon = MDL_recipe._icon(rcMdl, rcHeader);
          let validGetter = MDL_recipe._validGetter_fi(rcMdl, rcHeader);
          let ttStr = MDL_recipe._ttStr(rcMdl, rcHeader, validGetter(b));

          let btn = chunk.button(Tex.whiteui, Styles.clearNoneTogglei, 40.0, () => {
            if(closeSelect) Vars.control.input.config.hideConfig();
          }).tooltip(ttStr, true).group(btnGrp).get();
          btn.changed(() => cfgCaller(rcHeader));
          btn.getStyle().imageUp = validGetter(b) ? icon : Icon.lock;
          btn.update(() => {
            btn.setChecked(headerGetter() == rcHeader);
            if(TIMER.timerState_effc) {
              btn.getStyle().imageUp = validGetter(b) ? icon : Icon.lock;
            };
          });

          i++;
          if((i - 1) % colAmt == colAmt - 1) {
            chunk.row();
            i = 0;
          };

        });

        root.add(chunk).left().row();

      };
    };
    rebuild();
  };
  exports.setSelector_recipe = setSelector_recipe;
