/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- base ----------> */


  let mouseMoveX = 0.0;
  let mouseMoveY = 0.0;
  let mouseMoveStartX = 0.0;
  let mouseMoveStartY = 0.0;


  /* <---------- actor ----------> */


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


  const _winDial = function(title, tableF, alreadyHidden, dx, dy) {
    if(title == null) title = "";

    const winDial = new Table();
    winDial.dragged((dx, dy) => {
      winDial.translation.x += mouseMoveX;
      winDial.translation.y += mouseMoveY;
    });
    winDial.setPosition(MDL_ui._centerX(), MDL_ui._centerY(), Align.center);

    if(dx != null && dy != null) Time.run(1.0, () => {
      winDial.translation.x = dx;
      winDial.translation.y = dy;
    });

    const root = new Table(Tex.whiteui);

    let hidden = Boolean(alreadyHidden);
    const rebuild = () => {

      winDial.clearChildren();
      root.clearChildren();

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
          tb1.table(Styles.none, tb2 => tb2.add("X".color(Pal.remove))).get().clicked(() => {
            winDial.actions(Actions.remove());
            winDial.act(0.1);
          });

          tb1.table(Styles.none, tb2 => {}).width(8.0);
          tb1.table(Styles.none, tb2 => tb2.add(hidden ? "L".color(Pal.accent) : "S".color(Pal.heal))).get().clicked(() => {
            hidden = !hidden;
            rebuild();
          });

          tb1.table(Styles.none, tb2 => {}).width(8.0);
          tb1.table(Styles.none, tb2 => tb2.add("T".color(Pal.techBlue))).get().clicked(() => {
            Core.scene.add(_winDial(title, tableF, hidden, winDial.translation.x, winDial.translation.y));
            winDial.actions(Actions.remove());
            winDial.act(0.1);
          });

          tb1.table(Styles.none, tb2 => {}).width(16.0);
          tb1.table(Styles.none, tb2 => tb2.add(Strings.stripColors(title)));

          tb1.table(Styles.none, tb2 => {}).width(16.0);

        });

      }).growX().row();

      if(!hidden) cont.table(Tex.whiteui, tb => {

        tb.left().setColor(Pal.darkestGray);
        MDL_table.__margin(tb);

        tableF(tb);

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
  };
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
