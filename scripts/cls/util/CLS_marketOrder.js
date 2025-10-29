/* ----------------------------------------
 * NOTE:
 *
 * Orders, used for market system.
 * TODO: Very unfinished!
 *
 * @FIELD: b.ex_accMkOrds
 * ---------------------------------------- */


/* <---------- import ----------> */


const ANNO = require("lovec/glb/BOX_anno");
const COMP = require("lovec/glb/BOX_comp");
const SAVE = require("lovec/glb/GLB_save");
const TIMER = require("lovec/glb/GLB_timer");
const VAR = require("lovec/glb/GLB_var");


const MDL_content = require("lovec/mdl/MDL_content");
const MDL_market = require("lovec/mdl/MDL_market");
const MDL_net = require("lovec/mdl/MDL_net");


/* <---------- meta ----------> */


const CLS_marketOrder = function() {
  this.init.apply(this, arguments);
}.implement(COMP.timedComp).initClass();


CLS_marketOrder.prototype.init = function(b, isSell, ct_gn, amt, price, lifetime) {
  this.id = (tmpId++).next();

  if(b == null) throw new Error("No building is assigned to the market order???");
  if(b.ex_accMkOrds == null) ERROR_HANDLER.noMethod(b.block, "ex_accMkOrds");
  this.owner = b;

  this.isSell = tryVal(isSell, false);
  this.ct = tryVal(MDL_content._ct(ct_gn, null, true), Items.copper);
  this.amt = tryVal(amt, 1);
  this.price = tryVal(price, 1000.0);
  this.lifetime = tryVal(lifetime, 28800.0);

  this.time = 0.0;
};


/* <---------- static method ----------> */


let tmpId = 0;


/* ----------------------------------------
 * NOTE:
 *
 * Updates all active orders, mostly lifetime.
 * Should be called in the building's {update}, NOT {updateTile}.
 * ---------------------------------------- */
CLS_marketOrder.update = function(b) {
  if(!TIMER.timerState_paramGlobal) return;

  b.ex_accMkOrds("read", false).forEachFast(mkOrd => mkOrd.update(VAR.time_paramGlobalIntv));
};


CLS_marketOrder.write = function(b, wr) {
  processRevision(wr);
  let mkOrds = b.ex_accMkOrds("read", false);
  wr.i(mkOrd.length);

  mkOrds.forEachFast(mkOrd => {
    wr.bool(mkOrd.isSell);
    wr.str(mkOrd.ct.name);
    wr.f(mkOrd.amt);
    wr.f(mkOrd.price);
    wr.f(mkOrd.lifetime);
    wr.f(mkOrd.time);
  });
};


CLS_marketOrder.read = function(b, rd, revi) {
  processRevision(rd);
  let i = 0;
  let iCap = rd.i();
  while(i < iCap) {
    let mkOrd = new CLS_marketOrder(
      b,
      rd.bool(),
      MDL_content._ct(rd.str(), null, true),
      rd.f(),
      rd.f(),
      rd.f(),
    );
    mkOrd.time = rd.f();
    b.ex_accMkOrds(mkOrd, true);
    i++;
  };
};


/* <---------- instance method ----------> */


var ptp = CLS_marketOrder.prototype;


/* util */


// @IMPLEMENTED
ptp.onTimedDeath = function() {
  this.trigger(this.owner, false, 1.0);
  this.remove();
};


/* ----------------------------------------
 * NOTE:
 *
 * Adds the order to its owner building.
 * ---------------------------------------- */
ptp.create = function() {
  this.owner.ex_accMkOrds(this, true);
};


/* ----------------------------------------
 * NOTE:
 *
 * Removes the order from its owner building.
 * ---------------------------------------- */
ptp.remove = function() {
  this.owner.ex_accMkOrds(this, false);
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether you can purchase or sell now.
 * ---------------------------------------- */
ptp.canFinish = function() {
  if(this.ct instanceof Item) {
    if(b.items == null) return false;
    return this.isSell ?
      b.items.get(this.ct) >= this.amt :
      MDL_market._bitAmt(b.team) >= this.price && b.acceptStack(this.ct, this.amt, b) >= this.amt;
  } else if(this.ct instanceof UnitType) {

    // TODO

  } else return false;
};


/* ----------------------------------------
 * NOTE:
 *
 * Something triggered when you click that purchase/sell button.
 * ---------------------------------------- */
ptp.finish = function() {
  if(this.ct instanceof Item) {
    if(b.items == null) return;
    if(this.isSell) {
      b.items.remove(this.ct, this.amt);
      MDL_market.addBit(b.team, this.price);
    } else {
      b.items.add(this.ct, this.amt);
      MDL_market.addBit(b.team, this.price * -1.0);
    };
  } else if(this.ct instanceof UnitType) {

    // TODO

  } else return;

  this.trigger(this.owner, true, this.fin());
  this.remove();
};


/* ----------------------------------------
 * NOTE:
 *
 * A variant of {finish} that syncs.
 * ---------------------------------------- */
ptp.finish_global = function() {
  let payload = packPayload([
    this.owner.pos(),
    this.owner.ex_accMkOrds("read", false).indexOf(this),
  ]);

  this.finish();

  MDL_net.sendPacket("both", "lovec-both-market-order-finish", payload, true, true);
}
.setAnno(ANNO.__INIT__, function() {
  MDL_net.__packetHandler("both", "lovec-both-market-order-finish", payload => {
    let args = unpackPayload(payload);
    let b = Vars.world.build(args[0]);
    if(b == null || b.ex_accMkOrds == null) return;
    let mkOrd = b.ex_accMkOrds("read", false)[args[1]];
    if(mkOrd == null) return;

    mkOrd.finish();
  });
});


/* ----------------------------------------
 * NOTE:
 *
 * @LATER
 * Called when the order is removed.
 * Most orders just do nothing.
 * ---------------------------------------- */
ptp.trigger = function(b, isFinished, timeFrac) {

};


ptp.update = function(mtp) {
  this.updateLife(mtp);
};


ptp.display = function(tb, dial) {
  const thisOrd = this;

  tb.table(Styles.none, tb1 => {
    // @TABLE: title
    tb1.table(Tex.whiteui, tb2 => {
      tb2.center().setColor(Color.darkGray);
      MDL_table.__rcCt(tb2, thisOrd.ct, thisOrd.amt);
      tb2.add(thisOrd.ct.localizedName);
    }).growX().row();
    // @TABLE: container
    tb1.table(Tex.whiteui, tb2 => {
      tb2.setColor(Pal.darkestGray);
      // @TABLE: stats
      tb2.table(Styles.none, tb3 => {
        tb2.add(MDL_text._statText(
          MDL_bundle._term("lovec", "price"),
          thisOrd.price.ui(),
        )).left().row();
      }).left().growX();
      // @TABLE: buttons
      tb2.table(Styles.none, tb3 => {
        MDL_table.__btnBase(
          tb3,
          thisOrd.isSell ? MDL_bundle._term("lovec", "sell") : MDL_bundle._term("lovec", "buy"),
          () => {
            if(!thisOrd.canFinish()) return;

            thisOrd.finish_global();
            dial.hide();
          },
          100.0,
          50.0,
        ).right();
      }).left().growX();
    }).growX().row();
  }).left().width(400.0).height(250.0);
};


module.exports = CLS_marketOrder;
