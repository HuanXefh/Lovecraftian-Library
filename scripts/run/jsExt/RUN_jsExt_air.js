/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /* <---------- object ----------> */


  Object.air = {};


  /* <---------- function ----------> */


  Function.air = function() {};
  Function.airSelf = function(val) {return val};
  Function.airZero = function() {return 0.0};
  Function.airOne = function() {return 1.0};
  Function.airOneMinus = function() {return -1.0};
  Function.airInfinity = function() {return Infinity};
  Function.airFalse = function() {return false};
  Function.airTrue = function() {return true};
  Function.airBoolInv = function(bool) {return !bool};
  Function.airStrEmpty = function() {return ""};
  Function.airArr = function() {return Array.air};
  Function.airObj = function() {return Object.air};
  Function.airNull = function() {return null};
  Function.airWhite = function() {return Color.white};
  Function.airBlack = function() {return Color.black};


  /* <---------- array ----------> */


  Array.air = [];
  Array.airZero = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
