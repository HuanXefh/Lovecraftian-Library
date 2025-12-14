/* ----------------------------------------
 * NOTE:
 *
 * Utility class to generate data for dialog flow in {TP_dialFlow}.
 * ---------------------------------------- */


/* <---------- import ----------> */


const MDL_color = require("lovec/mdl/MDL_color");


/* <---------- meta ----------> */


const CLS_dialogFlowBuilder = newClass().initClass();


CLS_dialogFlowBuilder.prototype.init = function() {
  this.dialFlowArr = [];
  this.offInd = 0;
  this.hasMusic = false;
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_dialogFlowBuilder.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Completes a row.
 * ---------------------------------------- */
ptp.fixArrFormat = function() {
  let remainder = this.dialFlowArr.length % 4;
  if(remainder === 0) return this;
  if(remainder <= 3) {
    this.dialFlowArr.push(null);
  };
  if(remainder <= 2) {
    this.dialFlowArr.push(null);
  };
  if(remainder <= 1) {
    this.dialFlowArr.push(null);
  };
  this.offInd = 0;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes a color transition row, by default black fade.
 * ---------------------------------------- */
ptp.setColorTransition = function(color_gn, inTimeS, outTimeS, susTimeS) {
  if(inTimeS == null) inTimeS = 1.0;
  if(outTimeS == null) outTimeS = inTimeS;
  if(susTimeS == null) susTimeS = 0.5;
  let color = MDL_color._color(tryVal(color_gn, Color.black));

  this.fixArrFormat();

  this.dialFlowArr.push(
    null, null,
    {
      haltTimeS: inTimeS + outTimeS + susTimeS,
      scr: () => global.lovec.mdl_ui._d_fade(0.0, color, inTimeS, outTimeS, susTimeS),
    },
  );
  this.offInd = 3;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes a BGM change row.
 * ---------------------------------------- */
ptp.setBgmStart = function(mus) {
  this.fixArrFormat();

  this.dialFlowArr.push(
    null, null,
    {
      haltTimeS: 0.0,
      scr: () => {
        TRIGGER_MUSIC = true;
        global.lovec.mdl_ui._d_bgm(0.0, mus, () => !TRIGGER_MUSIC);
      },
    },
  );
  this.offInd = 3;
  this.hasMusic = true;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes a BGM end row.
 * This is required if BGM has been changed.
 * ---------------------------------------- */
ptp.setBgmEnd = function() {
  this.fixArrFormat();

  this.dialFlowArr.push(
    null, null,
    {
      scr: () => TRIGGER_MUSIC = false,
    },
  );
  this.offInd = 3;
  this.hasMusic = false;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes dialog text data.
 * ---------------------------------------- */
ptp.setText = function(nmMod, nmDial, ind) {
  this.fixArrFormat();

  this.dialFlowArr.push([nmMod, nmDial, ind]);
  this.offInd = 1;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes dialog speaker data.
 * Just after {setText}.
 * ---------------------------------------- */
ptp.setSpeaker = function(nmMod, nmChara) {
  if(this.offInd !== 1) ERROR_HANDLER.throw("dialogFlowGenerateFail");

  this.dialFlowArr.push([nmMod, nmChara]);
  this.offInd = 2;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes parameter object data.
 * Should be called before pushing characters.
 * ---------------------------------------- */
ptp.setParamObj = function(obj) {
  if(this.offInd === 0) {
    this.dialFlowArr.push(null, null);
  } else if(this.offInd === 1) {
    this.dialFlowArr.push(null);
  } else if(this.offInd !== 2) {
    ERROR_HANDLER.throw("dialogFlowGenerateFail");
  };

  this.dialFlowArr.push(obj);
  this.offInd = 3;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Pushes character data.
 * This always ends the row.
 * ---------------------------------------- */
ptp.setChara = function(charaObjs_p) {
  const arr = [];

  if(this.offInd === 0) {
    this.dialFlowArr.push(null, null, null);
  } else if(this.offInd === 1) {
    this.dialFlowArr.push(null, null);
  } else if(this.offInd === 2) {
    this.dialFlowArr.push(null);
  };

  let charaObjs = charaObjs_p instanceof Array ? charaObjs_p : [charaObjs_p];
  charaObjs.forEachFast(charaObj => {
    arr.push([
      0.0,
      readParam(charaObj, "nmMod"),
      readParam(charaObj, "nmChara"),
      readParam(charaObj, "fracX"),
      readParam(charaObj, "isDark", readParam(charaObj, "color")),
      readParam(charaObj, "anim"),
      readParam(charaObj, "animParam"),
      readParam(charaObj, "customActs"),
    ]);
  });

  this.dialFlowArr.push(arr);
  this.offInd = 0;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Builds the dialog flow data array.
 * ---------------------------------------- */
ptp.build = function() {
  if(this.hasMusic) ERROR_HANDLER.throw("dialogFlowGenerateFail");

  // Set up the final line
  this.dialFlowArr[this.dialFlowArr.length - 2] = tryVal(this.dialFlowArr[this.dialFlowArr.length - 2], {});
  this.dialFlowArr[this.dialFlowArr.length - 2].isTail = true;

  return this.dialFlowArr.slice();
};


module.exports = CLS_dialogFlowBuilder;
