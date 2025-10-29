/* ----------------------------------------
 * NOTE:
 *
 * A collection of all annotations defined in Lovec.
 * Annotations should always be set first, e.g. before setting properties.
 *
 * In case you don't know, 2nt argument for regular arguments, 3rd argument for loading arguments, 4th argument for argument caller arguments.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_objectBox = require("lovec/cls/struct/CLS_objectBox");
const CLS_annotation = require("lovec/cls/struct/CLS_annotation");


const MDL_event = require("lovec/mdl/MDL_event");


/* <---------- meta ----------> */


let isDebug = Core.settings.getString("lovec-misc-secret-code", "").includes("<anuke-mode>");


const BOX_annotation = new CLS_objectBox({


  /* <---------- meta ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Prints the original function (better not an arrow function).
   * ---------------------------------------- */
  "__TEST__": new CLS_annotation("test", function() {

    print(this);

  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Marks an outdated method.
   * ---------------------------------------- */
  "__DEPRECATED__": new CLS_annotation("deprecated", function(verInfo) {

    Log.warn(
      "[LOVEC] An used method is " + "deprecated".color(Pal.remove) + " after " + verInfo + ", better avoid using it!"
    );

  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Runs something before the final function is generated, called only once.
   * Won't be called when the function is called later.
   * {this} in {scr} is the original funtion.
   * ----------------------------------------
   * IMPORTANT:
   *
   * Don't use arrow function, or {this} will be the global object.
   * Don't use {MDL_event}, the function is exported before it's called.
   * ---------------------------------------- */
  "__INIT__": new CLS_annotation("init", null, function(scr) {

    scr.call(this);

  }),



  /* ----------------------------------------
   * NOTE:
   *
   * The method is called in update.
   * Set up id to avoid duplicates. Use {intv} and {boolF} to set how frequently and when the method is called.
   * By default the method itself is run on each update. Set {scr} for customized behavior.
   *
   * If {boolF} is costy, set {checkTimerFirst} to {true}.
   * ---------------------------------------- */
  "__UPDATE__": new CLS_annotation("update", null, function(id, intv, scr, boolF, checkTimerFirst) {

    if(intv == null) intv = 1.0;
    if(scr == null) scr = fun => fun();
    if(boolF == null) boolF = Function.airTrue;

    let timer = new Interval(1);
    let tmp = this;
    MDL_event._c_onUpdate(() => {
      if(checkTimerFirst ?
          (!timer.get(intv) || !boolF()) :
          (!boolF() || !timer.get(intv))
      ) return;
      scr(tmp);
    }, id);

  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Marks an unfinished method.
   * ---------------------------------------- */
  "__TODO__": new CLS_annotation("todo", null, function(todoInfo) {

    if(Core.settings.getBool("lovec-test-todo", false)) {
      Time.run(60.0, () => {
        Log.info("[LOVEC] " + ("TODO: " + todoInfo).color(Pal.accent) + "\n" + this);
      });
    };

  }),


  /* <---------- condition ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Method won't be called if not debug mode.
   * ---------------------------------------- */
  "__DEBUG__": new CLS_annotation("debug", function() {

    return !isDebug;

  }),


  /* ----------------------------------------
   * NOTE:
   *
   * If argument is not {null} and not instance of the given class, throw type error.
   * {argument} here can be several class lists.
   * If any one of them matches the input, no error is thrown.
   * ---------------------------------------- */
  "__ARGTYPE__": new CLS_annotation("arg-type", null, null, function() {

    if(Array.from(arguments).some(tps => checkArgType(this, tps))) {
      return false;
    } else {
      throw new Error("Mismatched argument types for a type-restricted method!");
    };

  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Method won't be called on headless end.
   * ---------------------------------------- */
  "__NONHEADLESS__": new CLS_annotation("non-headless", function() {

    return Vars.headless;

  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Method won't be called on mobile end.
   * ---------------------------------------- */
  "__NONMOBILE__": new CLS_annotation("non-mobile", function() {

    return Core.app.isMobile();

  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Method is only called on server side or single player.
   * ---------------------------------------- */
  "__SERVER__": new CLS_annotation("server", function() {

    if(Vars.net.server()) return false;
    if(!Vars.net.server() && !Vars.net.client()) return false;

    return true;

  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Method is only called on client side.
   * ---------------------------------------- */
  "__CLIENT__": new CLS_annotation("client", function() {

    if(!Vars.net.server() && Vars.net.client()) return false;

    return true;

  }),


  /* ----------------------------------------
  * NOTE:
  *
  * Method won't be called in console if not privileged.
  * ---------------------------------------- */
  "__NONCONSOLE__": new CLS_annotation("non-console", function() {

    var cond = Vars.ui != null && Vars.ui.consolefrag != null && Vars.ui.consolefrag.shown() && OS.username.toHash() !== -1106355917.0;
    if(cond) Log.warn("[LOVEC] Method is not available in " + "console".color(Pal.remove) + "!");

    return cond;

  }),


});


module.exports = BOX_annotation;
