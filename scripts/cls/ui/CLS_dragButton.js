/* ----------------------------------------
 * NOTE:
 *
 * A draggable group of buttons.
 * You can register new buttons in {DB_misc.db["mod"]["dragButton"]}.
 * ---------------------------------------- */


/* <---------- import ----------> */


const PARAM = require("lovec/glb/GLB_param");


const MDL_event = require("lovec/mdl/MDL_event");
const MDL_table = require("lovec/mdl/MDL_table");
const MDL_ui = require("lovec/mdl/MDL_ui");


const DB_misc = require("lovec/db/DB_misc");


/* <---------- meta ----------> */


const CLS_dragButton = function() {
  this.init.apply(this, arguments);
}.initClass();


CLS_dragButton.prototype.init = function() {
  this.isHidden = false;
  this.isLoaded = false;
  this.prefW = 0.0;
  this.btnData = [
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

  this.timeScl = 1.0;
  this.mapCur = "";

  this.root = (function() {
    let tb = new Table();
    tb.visibility = () => Vars.ui.hudfrag.shown;
    return tb;
  })();

  this.load();
};


let mouseMoveX = 0.0, mouseMoveY = 0.0, mouseMoveStartX = 0.0, mouseMoveStartY = 0.0;
MDL_event._c_onDrag((dx, dy, x_f, y_f) => {
  mouseMoveX = dx;
  mouseMoveY = dy;
  mouseMoveStartX = x_f;
  mouseMoveStartY = y_f;
}, 24998751);
MDL_event._c_onUpdate(() => {
  addedGrps.forEachFast(grp => grp.update());
}, 64221902);


let btnSize = 42.0;
let addedGrps = [];


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_dragButton.prototype;


/* util */


/* ----------------------------------------
 * NOTE:
 *
 * Tries loading defined buttons.
 * ---------------------------------------- */
ptp.load = function() {
  const thisIns = this;

  if(Vars.headless || this.isLoaded) return;

  (function() {
    let obj = DB_misc.db["mod"]["dragButton"];
    return !PARAM.modded ?
      obj["base"] :
      obj["base"].concat(obj["modded"]);
  })()
  .forEachRow(2, (nm, tup) => {
    thisIns.btnData[tup[0]].push([
      !Core.bundle.has("drag." + nm) ? null : Core.bundle.get("drag." + nm),
      (function() {let icon; try {icon = Icon[tup[1]]} catch(err) {icon = new TextureRegionDrawable(Core.atlas.find(tup[1]))}; return icon})(),
      tup[2],
      tup[3],
      tup[4],
    ]);
  });
  this.isLoaded = true;
};


/* ----------------------------------------
 * NOTE:
 *
 * Rebuilds the table of all buttons.
 * ---------------------------------------- */
ptp.rebuild = function() {
  const thisIns = this;

  this.root.clearChildren();
  const btns = this.root.table(Styles.none, tb => tb.left()).left().get();
  this.root.left().top().row();

  // Drag button
  btns.button(Icon.move, Styles.cleari, () => {}).size(btnSize).get().dragged((dx, dy) => {
    this.root.translation.x += mouseMoveX;
    this.root.translation.y += mouseMoveY;
  });
  // Collapser button
  btns.button(thisIns.isHidden ? Icon.downOpen : Icon.upOpen, Styles.cleari, () => {
    thisIns.isHidden = !thisIns.isHidden;
    thisIns.rebuild();
  }).size(btnSize);

  btns.row();
  // Loaded buttons
  if(!this.isHidden) {
    let i = 0, iCap = thisIns.btnData.iCap(), btnCell;
    while(i < iCap) {
      thisIns.btnData[i].forEachFast(tup => {
        btnCell = btns.button(tup[1], tup[2] ? Styles.clearTogglei : Styles.cleari, tup[3]).size(btnSize);
        if(tup[0] != null) btnCell.tooltip(tup[0], true);
        if(tup[4] != null) {
          let btn = btnCell.get();
          btnCell.update(() => tup[4].call(btn));
        };
      });
      btns.row();
      i++;
    };

    thisIns.prefW = btns.prefWidth;

    // Time control
    this.root.table(Tex.whiteui, tb => {
      tb.left().setColor(Pal.darkestGray);
      tb.add("").get().setText(prov(() => Strings.fixed(thisIns.timeScl, 2) + "x"));
      tb.row();
      MDL_table.__slider(tb, val => {
        if(Groups.player.size() < 2) Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0 * val);
        thisIns.timeScl = val;
        thisIns.mapCur = PARAM.mapCur;
      }, 0.25, 3.0, 0.25, thisIns.timeScl, thisIns.prefW);
    }).left().row();
  };


};


/* ----------------------------------------
 * NOTE:
 *
 * Updates some parameters.
 * ---------------------------------------- */
ptp.update = function() {
  // Reset time control if map changed
  if(this.mapCur !== PARAM.mapCur) {
    this.timeScl = 1.0;
    this.mapCur = PARAM.mapCur;
    Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0);
    this.rebuild();
  };
  // Forced to 1.0x when multi-player
  if(Groups.player.size() > 1) {
    Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0);
  };
};


/* ----------------------------------------
 * NOTE:
 *
 * Adds the group to scene.
 * ---------------------------------------- */
ptp.add = function(x, y) {
  if(Core.scene == null) return;
  if(x == null) x = MDL_ui._centerX() * 1.4;
  if(y == null) y = MDL_ui._centerY() * 0.4;

  this.rebuild();
  this.root.setPosition(x, y, Align.center);
  Core.scene.add(this.root);
  addedGrps.pushUnique(this);
};


module.exports = CLS_dragButton;
