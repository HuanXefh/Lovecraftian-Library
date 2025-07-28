/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * This file defines dialogs, which are closely related to tables.
   * Dialogs are only created after load event, to ensure {Core.scene} is not {null}.
   * Do NOT call a dialog before that!
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const FRAG_recipe = require("lovec/frag/FRAG_recipe");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_text = require("lovec/mdl/MDL_text");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const TP_table = require("lovec/tp/TP_table");


  /* <---------- content ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Calls a dialog that shows a list of contents.
   * If the dialog is shown after content database dialog, better set {isAfterCt} to {true}.
   * ---------------------------------------- */
  let cts;
  MDL_event._c_onLoad(() => {
    cts = extend(BaseDialog, "", {


      ex_show(title, cts_gn, isAfterCt) {
        this.cont.clear();
        this.buttons.clear();

        // @TABLE: title
        this.title.setText("[accent]" + title + "[]");
        this.title.getStyle().fontColor = Color.white;

        // @TABLE: content
        MDL_table.__break(this.cont);
        var thisDial = this;
        this.cont.pane(pn => {

          MDL_table.__margin(pn);

          let iCap = cts_gn.iCap();
          let colAmt = MDL_ui._colAmt(32.0, 4.0, 2);
          if(iCap > 0) {

            for(let i = 0, j = 0; i < iCap; i++) {
              (function(i) {
                MDL_table.__ct(pn, MDL_content._ct(cts_gn[i], null, true), null, null, !isAfterCt ? null : thisDial);
              })(i);

              if(j % colAmt === colAmt - 1) pn.row();
              j++;
            };

          } else {

            MDL_table.__textNothing(pn);

          };

        }).width(MDL_ui._uiW()).row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    });
    exports.cts = cts;
  }, 524126);


  /* ----------------------------------------
   * NOTE:
   *
   * Calls a dialog for content display in rows.
   * ---------------------------------------- */
  let ctsRow;
  MDL_event._c_onLoad(() => {
    ctsRow = extend(BaseDialog, "", {


      ex_show(title, cts_gn) {
        this.cont.clear();
        this.buttons.clear();

        // @TABLE: title
        this.title.setText("[accent]" + title + "[]");
        this.title.getStyle().fontColor = Color.white;

        // @TABLE: content
        MDL_table.__break(this.cont);
        this.cont.pane(pn => {

          MDL_table.setDisplay_ctRow(pn, cts_gn, true);

        }).width(MDL_ui._uiW()).row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    });
    exports.ctsRow = ctsRow;
  }, 124877);


  /* <---------- misc stat ----------> */


  let rcOpt;
  MDL_event._c_onLoad(() => {
    rcOpt = extend(BaseDialog, "", {


      ex_show(title, opt) {
        this.cont.clear();
        this.buttons.clear();

        const thisDial = this;

        // @TABLE: title
        this.title.setText("[accent]" + title + "[]");
        this.title.getStyle().fontColor = Color.white;

        // @TABLE: info
        MDL_table.__break(this.cont);
        MDL_table.setDisplay_note(this.cont, MDL_bundle._info("lovec", "opt"), null, null, true);

        // @TABLE: bar
        MDL_table.__break(this.cont);
        MDL_table.__bar(this.cont, null, MDL_ui._uiW());

        // @TABLE: content
        MDL_table.__break(this.cont);
        this.cont.pane(pn => {

          MDL_table.__margin(pn);
          let iCap = opt.iCap();
          if(iCap > 0) {

            for(let i = 0; i < iCap; i += 4) {
              let tmp = opt[i];
              let amt = opt[i + 1];
              let p = opt[i + 2];
              let mtp = opt[i + 3];
              pn.add("[" + Strings.fixed(i / 4.0 + 1.0, 0) + "]").center().color(Pal.accent).padRight(36.0);
              MDL_table.__rcCt(pn, tmp, amt, p, null, null, thisDial).padRight(72.0);
              pn.add(MDL_text._statText(
                MDL_bundle._term("lovec", "efficiency-multiplier"),
                Number(mtp).perc(0),
              )).center().padRight(6.0);
              pn.row();
            };

          } else {

            MDL_table.__textNothing(pn);

          };

        }).width(MDL_ui._uiW()).row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    });
    exports.rcOpt = rcOpt;
  }, 198872);


  let rcDict;
  MDL_event._c_onLoad(() => {
    rcDict = extend(BaseDialog, "", {


      ex_show(title, rs_gn) {
        const thisDial = this;

        this.cont.clear();
        this.buttons.clear();

        this.title.setText("[accent]" + title + "[]");
        this.title.getStyle().fontColor = Color.white;

        let rs = MDL_content._ct(rs_gn, "rs");
        if(rs == null) return;

        // @TABLE: content
        MDL_table.__break(this.cont);
        this.cont.pane(pn => {

          MDL_table.__margin(pn);

          let cont = new Table();
          cont.button(new TextureRegionDrawable(rs.uiIcon), 48.0, () => {
            thisDial.hide();
            Vars.ui.content.show(rs);
          }).left().row();
          pn.add(cont).growX();

          let rebuildList = (tb, rcDictArr) => {

            let i = 0;
            let j = 0;
            let iCap = rcDictArr.iCap();
            while(i < iCap) {
              tb.table(Styles.none, tb1 => {

                tb1.left();

                tb1.table(Styles.none, tb2 => {

                  MDL_table.__ct(tb2, rcDictArr[i], 48.0, 8.0, thisDial);

                });

                tb1.table(Styles.none, tb2 => {

                  let data = rcDictArr[i + 2];

                  let craftTime = data.time != null ? data.time : MDL_content._craftTime(rcDictArr[i], data.icon === "lovec-icon-mining");
                  let craftRate = (!isFinite(craftTime) && rs instanceof Item) ? null : (rs instanceof Item ? (rcDictArr[i + 1] / craftTime * 60.0) : (rcDictArr[i + 1] * 60.0));
                  tb2.add(MDL_text._statText(
                    MDL_bundle._term("lovec", "rate"),
                    craftRate == null ? "-" : ((craftRate < 0.01 ? "<0.01" : Number(craftRate).deciDigit(2)) + "/s"),
                  )).left().tooltip(Number(craftRate).deciDigit(7) + "/s", true).row();

                  tb2.table(Styles.none, tb3 => {

                    tb3.left();

                    // Content
                    let ors = MDL_content._ct(data.ct, null, true);
                    if(ors != null) {
                      let btn = tb3.button(Tex.whiteui, Styles.clearNoneTogglei, 28.0, () => {
                        thisDial.hide();
                        Vars.ui.content.show(ors);
                      }).left().get();
                      btn.getStyle().imageUp = new TextureRegionDrawable(ors.uiIcon);
                    };

                    // Icon
                    if(data.icon != null) {
                      // Make it smaller so you feel sick
                      tb3.image(Core.atlas.find(data.icon)).left().width(26.0).height(26.0);
                    };

                  }).left().height(30.0).row();

                });

              }).left().width(240.0).height(60.0);
              i += 3;
              if(j % 3 === 2) tb.row();
              j++;
            };

          };

          // @TABLE: producer
          let prodArr = FRAG_recipe._producers(rs, true);
          if(prodArr.length > 0) {

            // @TABLE: consumer title
            cont.table(Tex.whiteui, tb => {

              tb.center().setColor(Color.darkGray);
              MDL_table.__margin(tb, 0.5);

              tb.add(MDL_bundle._term("lovec", "produced-in")).pad(4.0);

            }).left().growX().row();

            // @TABLE: consumer list
            cont.table(Tex.whiteui, tb => {

              tb.left().setColor(Pal.darkestGray);
              MDL_table.__margin(tb);

              rebuildList(tb, prodArr);

            }).left().growX().row();

          };

          // @TABLE: consumer
          let consArr = FRAG_recipe._consumers(rs, true);
          if(consArr.length > 0) {

            // @TABLE: consumer title
            cont.table(Tex.whiteui, tb => {

              tb.center().setColor(Color.darkGray);
              MDL_table.__margin(tb, 0.5);

              tb.add(MDL_bundle._term("lovec", "used-in")).pad(4.0);

            }).left().growX().row();

            // @TABLE: consumer list
            cont.table(Tex.whiteui, tb => {

              tb.left().setColor(Pal.darkestGray);
              MDL_table.__margin(tb);

              rebuildList(tb, consArr);

            }).left().growX().row();

          };

          // @TABLE: building
          let reqBlks = MDL_content._reqBlks(rs);
          if(reqBlks.length > 0) {

            // @TABLE: building title
            cont.table(Tex.whiteui, tb => {

              tb.center().setColor(Color.darkGray);
              MDL_table.__margin(tb, 0.5);

              tb.add(MDL_bundle._term("lovec", "building")).pad(4.0);

            }).left().growX().row();

            // @TABLE: building list
            cont.table(Tex.whiteui, tb => {

              tb.center().setColor(Pal.darkestGray);

              MDL_table.setDisplay_ctLi(tb, reqBlks, 48.0, null, thisDial);

            }).left().growX().row();

          };

        }).row();

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);
        MDL_table.__btnBase(this.buttons, MDL_bundle._term("lovec", "new-window"), () => {
          this.hide();
          Core.scene.add(TP_table._winDial(rs.localizedName, tb => {

            tb.center();

            let tmpRs = rs;
            tb.button(new TextureRegionDrawable(tmpRs.uiIcon), 48.0, () => {
              rcDict.ex_show(tmpRs.localizedName, tmpRs);
            }).center();

          }));
        });

        this.show();
      },


    });
    exports.rcDict = rcDict;
  }, 726991);


  /* <---------- info ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Calls a dialog for basic information display.
   * {infoStr} is the text shown above content. {null} to disable it.
   * {cont} is a table.
   * ---------------------------------------- */
  let baseInfo;
  MDL_event._c_onLoad(() => {
    baseInfo = extend(BaseDialog, "", {


      ex_show(title, infoStr, tableF) {
        this.cont.clear();
        this.buttons.clear();

        this.title.setText("[accent]" + title + "[]");
        this.title.getStyle().fontColor = Color.white;

        // @TABLE: info
        if(infoStr != null) {
          MDL_table.__break(this.cont);
          MDL_table.setDisplay_note(this.cont, infoStr, null, null, true);
        };

        // @TABLE: bar
        if(infoStr != null && tableF != null) {
          MDL_table.__break(this.cont);
          MDL_table.__bar(this.cont, null, MDL_ui._uiW());
        };

        // @TABLE: content
        if(tableF != null) {
          MDL_table.__break(this.cont);
          this.cont.pane(pn => {

            MDL_table.__margin(pn);

            tableF(pn);

          }).width(MDL_ui._uiW()).row();
        };

        // @TABLE: buttons
        MDL_table.__break(this.cont);
        MDL_table.__btnClose(this.buttons, this);

        this.show();
      },


    });
    exports.baseInfo = baseInfo;
  }, 426331);
