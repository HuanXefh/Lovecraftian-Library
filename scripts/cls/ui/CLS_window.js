/* ----------------------------------------
 * NOTE:
 *
 * Container of a special table that can be dragged, closed and minimized.
 * ---------------------------------------- */


/* <---------- import ----------> */


const PARAM = require("lovec/glb/GLB_param");


const MDL_bundle = require("lovec/mdl/MDL_bundle");
const MDL_event = require("lovec/mdl/MDL_event");
const MDL_table = require("lovec/mdl/MDL_table");
const MDL_ui = require("lovec/mdl/MDL_ui");


/* <---------- meta ----------> */


const CLS_window = function() {
  this.init.apply(this, arguments);
}.initClass();


CLS_window.prototype.init = function(title, tableF) {
  this.title = tryVal(title, "").plain();
  this.tableF = tryVal(tableF, Function.air);

  this.initParams();

  this.root = CLS_window.getRootTable(this);
  this.base = CLS_window.getBaseTable(this);
};


let mouseMoveX = 0.0, mouseMoveY = 0.0, mouseMoveStartX = 0.0, mouseMoveStartY = 0.0;
MDL_event._c_onDrag((dx, dy, x_f, y_f) => {
  mouseMoveX = dx;
  mouseMoveY = dy;
  mouseMoveStartX = x_f;
  mouseMoveStartY = y_f;
}, 19552700);


let selectedWins = [];


/* <---------- static method ----------> */


/* ----------------------------------------
 * NOTE:
 *
 * Modified button styles used for window.
 * ---------------------------------------- */
CLS_window.btnStyles = {
  close: extend(TextButton.TextButtonStyle, {
    font: Fonts.outline,
    fontColor: Pal.remove,
    downFontColor: Pal.remove,
    overFontColor: Color.white,
  }),
  minimize: extend(TextButton.TextButtonStyle, {
    font: Fonts.outline,
    fontColor: Pal.heal,
    downFontColor: Pal.heal,
    overFontColor: Color.white,
  }),
  restore: extend(TextButton.TextButtonStyle, {
    font: Fonts.outline,
    fontColor: Pal.accent,
    downFontColor: Pal.accent,
    overFontColor: Color.white,
  }),
  top: extend(TextButton.TextButtonStyle, {
    font: Fonts.outline,
    fontColor: Pal.techBlue,
    downFontColor: Pal.techBlue,
    overFontColor: Color.white,
  }),
};


CLS_window.getRootTable = function(win) {
  const tb = new Table();
  tb.tapped(() => {
    if(!Core.input.keyDown(KeyCode.controlLeft) && !Core.input.keyDown(KeyCode.controlRight)) selectedWins.clear();
    selectedWins.pushUnique(win);
  });
  tb.setPosition(MDL_ui._centerX(), MDL_ui._centerY(), Align.center);
  tb.visibility = () => Vars.ui.hudfrag.shown && PARAM.showWindow;
  return tb;
};


CLS_window.getBaseTable = function(win) {
  const tb = new Table(Tex.whiteui);
  win.root.top().add(tb).growX();
  return tb;
};


/* <---------- instance method ----------> */


var ptp = CLS_window.prototype;


/* modification */


ptp.initParams = function() {
  this.isAdded = false;
  this.isHidden = false;
  this.prefW = 0.0;
  this.prefH = 0.0;
  this.prefWCont = 0.0;

  this.minW = 320.0, this.maxW = 840.0;
  this.minH = 40.0, this.maxH = 420.0;
  this.titleColor = Color.darkGray;
  this.contColor = Pal.darkestGray;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Sets the colors used for the window.
 * ---------------------------------------- */
ptp.setColor = function(titleColor, contColor) {
  if(titleColor != null) this.titleColor = titleColor;
  if(contColor != null) this.contColor = contColor;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Sets the range for width and height.
 * ---------------------------------------- */
ptp.setSizeRange = function(minW, maxW, minH, maxH) {
  if(minW != null) this.minW = minW;
  if(maxW != null) this.maxW = maxW;
  if(minH != null) this.minH = minH;
  if(maxH != null) this.maxH = maxH;

  return this;
};


/* util */


/* ----------------------------------------
 * NOTE:
 *
 * Rebuild {base} table of the window.
 * ---------------------------------------- */
ptp.rebuild = function() {
  const thisIns = this;
  const base = this.base;

  base.clearChildren();
  base.update(() => {
    base.setColor(selectedWins.includes(thisIns) ? Pal.accent : Color.white);
  });

  let addPlaceholder = () => base.table(Styles.none, tb => {}).width(2.0).height(2.0);
  // Row 1
  (3)._it(1, addPlaceholder);
  base.row();
  // Row 2 (contents)
  addPlaceholder();
  base.table(Styles.none, tb => {
    // @TABLE: title
    let titleCell = tb.table(Tex.whiteui, tb1 => {
      tb1.left().setColor(thisIns.titleColor);
      tb1.dragged((dx, dy) => {
        selectedWins.forEachFast(win => {
          win.root.translation.x += mouseMoveX;
          win.root.translation.y += mouseMoveY;
        });
      });
      // @TABLE: title base
      tb1.table(Styles.none, tb2 => {
        tb2.left();
        MDL_table.__margin(tb2, 0.25);
        // Close
        tb2.table(Styles.none, tb3 => {}).width(8.0);
        tb2.button("X", CLS_window.btnStyles.close, () => selectedWins.forEachFast(win => win.close())).size(8.0).padRight(4.0).tooltip(MDL_bundle._term("lovec", "win-close"), true);
        // Minimize & restore
        tb2.table(Styles.none, tb3 => {}).width(8.0);
        tb2.button(thisIns.isHidden ? "L" : "S", CLS_window.btnStyles[thisIns.isHidden ? "restore" : "minimize"], () => selectedWins.forEachFast(win => win.minimize())).size(8.0).padRight(4.0).tooltip(MDL_bundle._term("lovec", thisIns.isHidden ? "win-restore" : "win-minimize"), true);
        // Top
        tb2.table(Styles.none, tb3 => {}).width(8.0);
        tb2.button("T", CLS_window.btnStyles.top, () => selectedWins.forEachFast(win => win.top())).size(8.0).padRight(4.0).tooltip(MDL_bundle._term("lovec", "win-top"), true);
        // Text
        tb2.table(Styles.none, tb3 => {}).width(16.0);
        tb2.table(Styles.none, tb3 => tb3.add(thisIns.title));
        tb2.table(Styles.none, tb3 => {}).width(16.0);
      });
    }).growX();
    tb.row();
    // @TABLE: contents
    if(!this.isHidden) tb.table(Tex.whiteui, tb1 => {
      tb1.left().setColor(thisIns.contColor);
      MDL_table.__margin(tb1);
      tb1.pane(pn => {
        thisIns.tableF(pn);
        thisIns.prefW = Mathf.clamp(pn.prefWidth, thisIns.minW, thisIns.maxW);
        thisIns.prefH = Mathf.clamp(pn.prefHeight, thisIns.minH, thisIns.maxH);
      }).width(thisIns.prefW).height(thisIns.prefH);
      thisIns.prefWCont = tb1.prefWidth;
    }).grow().row();
    titleCell.width(thisIns.prefWCont);
  });
  addPlaceholder();
  base.row();
  // Row 3
  (3)._it(1, addPlaceholder);
};


/* ----------------------------------------
 * NOTE:
 *
 * Adds the window to scene.
 * ---------------------------------------- */
ptp.add = function() {
  if(Core.scene == null || this.isAdded) return;

  this.rebuild();
  Core.scene.add(this.root);
  this.isAdded = true;
};


/* ----------------------------------------
 * NOTE:
 *
 * Removes the window from scene.
 * ---------------------------------------- */
ptp.close = function() {
  if(!this.isAdded) return;

  this.root.actions(Actions.remove());
  this.isAdded = false;
};


/* ----------------------------------------
 * NOTE:
 *
 * Minimizes the window, or restores it if already hidden.
 * Currently disabled for mobile ends, due to some weird bugs.
 * ---------------------------------------- */
ptp.minimize = function() {
  if(!this.isAdded || Core.app.isMobile()) return;

  this.isHidden = !this.isHidden;
  this.rebuild();
};


/* ----------------------------------------
 * NOTE:
 *
 * Puts the window on top of others.
 * This technically creates a new table.
 * ---------------------------------------- */
ptp.top = function() {
  if(!this.isAdded) return;

  let tmpX = this.root.translation.x, tmpY = this.root.translation.y;
  this.close();
  this.initParams();
  this.root = CLS_window.getRootTable(this);
  this.base = CLS_window.getBaseTable(this);
  this.add();
  Time.run(1.0, () => this.root.translation.set(tmpX, tmpY));
};


module.exports = CLS_window;
