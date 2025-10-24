/* ----------------------------------------
 * NOTE:
 *
 * Simply 2D-Perlin noise.
 * Recommended ratio of {w} to {gridW}: 5:1.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_whiteNoise = require("lovec/cls/math/noise/CLS_whiteNoise");


const MATH_interp = require("lovec/math/MATH_interp");


/* <---------- meta ----------> */


const CLS_perlinNoise = function() {
  this.init.apply(this, arguments);
}.extendClass(CLS_whiteNoise).initClass();


CLS_perlinNoise.prototype.init = function(w, h, gridW, gridH) {
  this.super("init", w, h, gridW, gridH);
};


const tmpCenterVec = new Vec2();
const tmpGridVecs = [
  new Vec2(),
  new Vec2(),
  new Vec2(),
  new Vec2(),
];
const tmpDstVecs = [
  new Vec2(),
  new Vec2(),
  new Vec2(),
  new Vec2(),
];


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_perlinNoise.prototype;


/* meta */


// @INHERITED
ptp.setVecData = function(seed) {
  const thisIns = this;

  if(seed == null) seed = -1.0;

  this.forEachVert((i, j) => {
    this.vecData[j][i].set(
      seed < 0.0 ? Mathf.random(-1.0, 1.0) : Mathf.randomSeed(seed + i + j * 10000000, -1.0, 1.0),
      seed < 0.0 ? Mathf.random(-1.0, 1.0) : Mathf.randomSeed(seed + i + j * 10000000, -1.0, 1.0),
    );
  });
};


// @INHERITED
ptp.buildNoise = function(seed) {
  const thisIns = this;

  if(seed == null) seed = -1.0;

  this.setVecData(seed);
  this.forEachPon((i, j) => {
    tmpCenterVec.set(
      thisIns.getOffsetCoord(i, seed < 0.0 ? Mathf.random(0.0, 1.0) : Mathf.randomSeed(seed + i, 0.0, 1.0), false),
      thisIns.getOffsetCoord(j, seed < 0.0 ? Mathf.random(0.0, 1.0) : Mathf.randomSeed(seed + j * 10000000, 0.0, 1.0), true),
    );
    tmpDstVecs[0].set(tmpCenterVec).sub(tmpGridVecs[0].set(
      thisIns.toPonCoord(thisIns.toGridCoord(i, false), false),
      thisIns.toPonCoord(thisIns.toGridCoord(j, true), true),
    ));
    tmpDstVecs[1].set(tmpCenterVec).sub(tmpGridVecs[1].set(
      thisIns.toPonCoord(thisIns.toGridCoord(i, false) + 1, false),
      thisIns.toPonCoord(thisIns.toGridCoord(j, true), true),
    ));
    tmpDstVecs[2].set(tmpCenterVec).sub(tmpGridVecs[2].set(
      thisIns.toPonCoord(thisIns.toGridCoord(i, false), false),
      thisIns.toPonCoord(thisIns.toGridCoord(j, true) + 1, true),
    ));
    tmpDstVecs[3].set(tmpCenterVec).sub(tmpGridVecs[3].set(
      thisIns.toPonCoord(thisIns.toGridCoord(i, false) + 1, false),
      thisIns.toPonCoord(thisIns.toGridCoord(j, true) + 1, true),
    ));

    thisIns.noiseData[j][i] = MATH_interp.biLerp(
      (thisIns.vecData[thisIns.getOffsetCoord(thisIns.toGridCoord(j, true), 0, true, true)][thisIns.getOffsetCoord(thisIns.toGridCoord(i, false), 0, false, true)]).dot(tmpDstVecs[0]),
      (thisIns.vecData[thisIns.getOffsetCoord(thisIns.toGridCoord(j, true), 0, true, true)][thisIns.getOffsetCoord(thisIns.toGridCoord(i, false), 1, false, true)]).dot(tmpDstVecs[1]),
      (thisIns.vecData[thisIns.getOffsetCoord(thisIns.toGridCoord(j, true), 1, true, true)][thisIns.getOffsetCoord(thisIns.toGridCoord(i, false), 0, false, true)]).dot(tmpDstVecs[2]),
      (thisIns.vecData[thisIns.getOffsetCoord(thisIns.toGridCoord(j, true), 1, true, true)][thisIns.getOffsetCoord(thisIns.toGridCoord(i, false), 1, false, true)]).dot(tmpDstVecs[3]),
      thisIns.hermiteInterp((i - thisIns.toPonCoord(thisIns.toGridCoord(i, false), false)) / this.tileWidth),
      thisIns.hermiteInterp((i - thisIns.toPonCoord(thisIns.toGridCoord(i, false), false)) / this.tileWidth),
      thisIns.hermiteInterp((j - thisIns.toPonCoord(thisIns.toGridCoord(j, true), true)) / this.tileHeight),
    );
  });

  let tmpArr = this.noiseData.flatten();
  let max = Math.max.apply(null, tmpArr), min = Math.min.apply(null, tmpArr);
  this.forEachPon((i, j) => {
    thisIns.noiseData[j][i] = max === min ? 0.0 : ((thisIns.noiseData[j][i] - min) / (max - min));
  });

  return this.noiseData;
};


/* util */


ptp.hermiteInterp = function(frac) {
  return (((6.0 * frac) - 15.0) * frac + 10.0) * Math.pow(frac, 3);
};


module.exports = CLS_perlinNoise;
