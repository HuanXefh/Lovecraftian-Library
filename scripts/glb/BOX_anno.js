/* ----------------------------------------
 * NOTE:
 *
 * A collection of all annotations defined in Lovec.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_objectBox = require("lovec/cls/struct/CLS_objectBox");
const CLS_annotation = require("lovec/cls/struct/CLS_annotation");


const MDL_event = require("lovec/mdl/MDL_event");


/* <---------- meta ----------> */


const BOX_annotation = new CLS_objectBox({


  /* <---------- meta ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Prints the original function (better not an arrow function).
   * ---------------------------------------- */
  $TEST$: new CLS_annotation("test", function() {
    print(this);
  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Marks an outdated method.
   * ---------------------------------------- */
  $DEPRECATED$: new CLS_annotation("deprecated", function(nmFun) {
    Log.warn(
      "[LOVEC] A method called ([$1]) has been [$2] and will be removed in future updates!".format(nmFun.color(Pal.accent), "deprecated".color(Pal.remove())),
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
  $INIT$: new CLS_annotation("init", null, function(scr) {
    scr.call(this);
  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Marks an unfinished method.
   * ---------------------------------------- */
  $TODO$: new CLS_annotation("todo", null, function(todoInfo) {
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
  $DEBUG$: new CLS_annotation("debug", function() {
    return !global.lovecUtil.prop.debug;
  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Method won't be called on headless end.
   * ---------------------------------------- */
  $NON_HEADLESS$: new CLS_annotation("non-headless", function() {
    return Vars.headless;
  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Method won't be called on mobile end.
   * ---------------------------------------- */
  $NON_MOBILE$: new CLS_annotation("non-mobile", function() {
    return Core.app.isMobile();
  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Method is only called on server side or single player.
   * ---------------------------------------- */
  $SERVER$: new CLS_annotation("server", function() {
    if(Vars.net.server()) return false;
    if(!Vars.net.server() && !Vars.net.client()) return false;

    return true;
  }),


  /* ----------------------------------------
   * NOTE:
   *
   * Method is only called on client side.
   * ---------------------------------------- */
  $CLIENT$: new CLS_annotation("client", function() {
    if(!Vars.net.server() && Vars.net.client()) return false;

    return true;
  }),


  /* ----------------------------------------
  * NOTE:
  *
  * Method won't be called in console if not privileged.
  * ---------------------------------------- */
  $NON_CONSOLE$: new CLS_annotation("non-console", function() {
    let cond = Vars.ui != null && Vars.ui.consolefrag != null && Vars.ui.consolefrag.shown() && OS.username.toHash() !== -1106355917.0;
    if(cond) {
      Log.warn("[LOVEC] Method is not available in [$1]!".format("console".color(Pal.remove)))
    };

    return cond;
  }),


});


module.exports = BOX_annotation;
