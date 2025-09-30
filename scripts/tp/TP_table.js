/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  let mouseMoveX = 0.0;
  let mouseMoveY = 0.0;
  let mouseMoveStartX = 0.0;
  let mouseMoveStartY = 0.0;


  /* <---------- actor ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a draggable table.
   * ---------------------------------------- */
  const _dragger = function(x, y, tableF) {
    const tb = new Table();
    tb.dragged((dx, dy) => {
      tb.translation.x += mouseMoveX;
      tb.translation.y += mouseMoveY;
    });
    tb.setPosition(x, y, Align.center);

    tableF(tb);

    return _dragger;
  };
  exports._dragger = _dragger;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a draggable group of buttons.
   * See {DB_misc.db["mod"]["dragButton"]}.
   * ---------------------------------------- */
  const _dragBtn = function(x, y) {
    if(x == null) x = MDL_ui._centerX() * 1.4;
    if(y == null) y = MDL_ui._centerY() * 0.4;

    const root = extend(Table, {
      isHidden: false,
      timeScl: 1.0,
      mapCur: "",
      ex_rebuild() {
        const thisTb = this;
        this.clearChildren();
        this.left();

        const btns = this.table(Styles.none, tb => tb.left()).left().get();
        this.row();

        btns.button(Icon.move, Styles.cleari, () => {}).size(42.0).get().dragged((dx, dy) => {
          thisTb.translation.x += mouseMoveX;
          thisTb.translation.y += mouseMoveY;
        });
        btns.button(this.isHidden ? Icon.downOpen : Icon.upOpen, Styles.cleari, () => {
          thisTb.isHidden = !thisTb.isHidden;
          thisTb.ex_rebuild();
        }).size(42.0);
        btns.row();

        if(!this.isHidden) {
          let arr = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
          ];
          DB_misc.db["mod"]["dragButton"].forEachRow(2, (nm, tup) => {
            arr[tup[0]].push([
              !Core.bundle.has("drag." + nm) ? null : Core.bundle.get("drag." + nm),
              (function() {
                let icon;
                try {icon = Icon[tup[1]]} catch(err) {icon = new TextureRegionDrawable(Core.atlas.find(tup[1]))};
                return icon;
              })(),
              tup[2],
              tup[3],
              tup[4],
            ]);
          });

          let i = 0;
          let iCap = arr.iCap();
          let btnCell;
          while(i < iCap) {
            arr[i].forEachFast(tup => {
              btnCell = btns.button(tup[1], tup[2] ? Styles.clearTogglei : Styles.cleari, tup[3]).size(42.0);
              if(tup[0] != null) btnCell.tooltip(tup[0], true);
              if(tup[4] != null) {
                let btn = btnCell.get();
                btnCell.update(() => tup[4].call(btn));
              };
            });
            btns.row();
            i++;
          };

          this.table(Tex.whiteui, tb => {
            tb.left().setColor(Pal.darkestGray);
            tb.add("").get().setText(prov(() => Strings.fixed(thisTb.timeScl, 2) + "x"));
            tb.row();
            MDL_table.__slider(tb, val => {
              if(Groups.player.size() < 2) Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0 * val);
              thisTb.timeScl = val;
              thisTb.mapCur = PARAM.mapCur;
            }, 0.25, 3.0, 0.25, thisTb.timeScl, thisTb.prefWidth);
          }).left().row();
        };
      },
      ex_accTimeScl(param) {
        return param === "read" ? this.timeScl : (this.timeScl = param);
      },
      ex_accMapCur(param) {
        return param === "read" ? this.mapCur : (this.mapCur = param);
      },
    });

    root.ex_rebuild();
    root.setPosition(x, y, Align.center);
    root.visibility = () => Vars.ui.hudfrag.shown;

    MDL_event._c_onUpdate(() => {
      if(root.ex_accMapCur("read") !== PARAM.mapCur) {
        root.ex_accTimeScl(1.0);
        root.ex_accMapCur(PARAM.mapCur);
        Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0);
        root.ex_rebuild();
      };
      if(Groups.player.size() > 1) {
        Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0);
      };
    });

    return root;
  };
  exports._dragBtn = _dragBtn;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a window.
   * ---------------------------------------- */
  const _winDial = function(title, tableF, alreadyHidden, dx, dy) {
    const thisFun = _winDial;

    if(title == null) title = "";

    const winDial = new Table();
    winDial.tapped(() => {
      VARGEN.__winCur(winDial);
    });
    winDial.dragged((dx, dy) => {
      winDial.translation.x += mouseMoveX;
      winDial.translation.y += mouseMoveY;
    });
    winDial.setPosition(MDL_ui._centerX(), MDL_ui._centerY(), Align.center);
    winDial.visibility = () => Vars.ui.hudfrag.shown && PARAM.showWindow;
    if(dx != null && dy != null) Time.run(1.0, () => {
      winDial.translation.x = dx;
      winDial.translation.y = dy;
    });

    const root = new Table(Tex.whiteui);

    let hidden = Boolean(alreadyHidden);
    let prefW = 0.0, prefH = 0.0, prefWCont = 0.0;
    const rebuild = () => {

      winDial.clearChildren();
      root.clearChildren();
      root.update(() => {
        root.setColor(VARGEN.winCur === winDial ? Pal.accent : Color.white);
      });

      root.table(Styles.none, tb => {}).width(2.0).height(2.0);
      root.table(Styles.none, tb => {}).width(2.0).height(2.0);
      root.table(Styles.none, tb => {}).width(2.0).height(2.0);

      root.row();

      root.table(Styles.none, tb => {}).width(2.0).height(2.0);

      let cont = new Table();
      cont.table(Tex.whiteui, tb => {

        tb.left().setColor(Color.darkGray);

        tb.table(Styles.none, tb1 => {

          tb1.left();
          MDL_table.__margin(tb1, 0.25);

          tb1.table(Styles.none, tb2 => {}).width(8.0);
          tb1.button("X", thisFun.funStyleArr[0], () => {
            winDial.actions(Actions.remove());
            winDial.act(0.1);
          }).size(8.0).padRight(4.0).tooltip(MDL_bundle._term("lovec", "win-close"), true);

          tb1.table(Styles.none, tb2 => {}).width(8.0);
          tb1.button(hidden ? "L" : "S", thisFun.funStyleArr[hidden ? 2 : 1], () => {
            hidden = !hidden;
            rebuild();
          }).size(8.0).padRight(4.0).tooltip(MDL_bundle._term("lovec", hidden ? "win-restore" : "win-minimize"), true);

          tb1.table(Styles.none, tb2 => {}).width(8.0);
          tb1.button("T", thisFun.funStyleArr[3], () => {
            Core.scene.add(_winDial(title, tableF, hidden, winDial.translation.x, winDial.translation.y));
            winDial.actions(Actions.remove());
            winDial.act(0.1);
          }).size(8.0).padRight(4.0).tooltip(MDL_bundle._term("lovec", "win-top"), true);

          tb1.table(Styles.none, tb2 => {}).width(16.0);
          tb1.table(Styles.none, tb2 => tb2.add(Strings.stripColors(title)));

          tb1.table(Styles.none, tb2 => {}).width(16.0);

        });

      }).width(prefWCont).growX().row();

      if(!hidden) cont.table(Tex.whiteui, tb => {

        tb.left().setColor(Pal.darkestGray);
        MDL_table.__margin(tb);

        tb.pane(pn => {
          tableF(pn);
          prefW = Mathf.clamp(pn.prefWidth, 320.0, 840.0);
          prefH = Mathf.clamp(pn.prefHeight, 40.0, 420.0);
        }).width(prefW).height(prefH);

        prefWCont = tb.prefWidth;

      }).growX().row();
      root.add(cont);

      root.table(Styles.none, tb => {}).width(2.0).height(2.0);

      root.row();

      root.table(Styles.none, tb => {}).width(2.0).height(2.0);
      root.table(Styles.none, tb => {}).width(2.0).height(2.0);
      root.table(Styles.none, tb => {}).width(2.0).height(2.0);

      winDial.top().add(root).growX();

    };
    rebuild();

    return winDial;
  }
  .setProp({
    "funStyleArr": [
      extend(TextButton.TextButtonStyle, {
        font: Fonts.outline,
        fontColor: Pal.remove,
        downFontColor: Pal.remove,
        overFontColor: Color.white,
      }),
      extend(TextButton.TextButtonStyle, {
        font: Fonts.outline,
        fontColor: Pal.heal,
        downFontColor: Pal.heal,
        overFontColor: Color.white,
      }),
      extend(TextButton.TextButtonStyle, {
        font: Fonts.outline,
        fontColor: Pal.accent,
        downFontColor: Pal.accent,
        overFontColor: Color.white,
      }),
      extend(TextButton.TextButtonStyle, {
        font: Fonts.outline,
        fontColor: Pal.techBlue,
        downFontColor: Pal.techBlue,
        overFontColor: Color.white,
      }),
    ],
  });
  exports._winDial = _winDial;


/*
  ========================================
  Section: Application
  ========================================
*/


  MDL_event._c_onDrag((dx, dy, x_f, y_f) => {
    mouseMoveX = dx;
    mouseMoveY = dy;
    mouseMoveStartX = x_f;
    mouseMoveStartY = y_f;
  }, 44851112);
