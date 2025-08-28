/* ----------------------------------------
 * NOTE:
 *
 * Matrix as a mathematical concept.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_matrix = function() {
  this.init.apply(this, arguments);
}.initClass();


CLS_matrix.prototype.init = function(matArr) {
  if(matArr == null) matArr = [[0]];

  this.matArr = matArr;
  this.rowAmt = matArr.length;
  this.colAmt = matArr[0].length;
};


/* <---------- static method ----------> */


/* ----------------------------------------
 * NOTE:
 *
 * Returns an empty m,n-matrix, by default filled with 0.
 * ---------------------------------------- */
CLS_matrix.getEmptyMat = function(m, n, def) {
  return new CLS_matrix([].setVal(def == null ? 0 : def, m * n).chunk(n));
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns an n-unit matrix, by default using 1.
 * ---------------------------------------- */
CLS_matrix.getUnitMat = function(n, def) {
  const mat = CLS_matrix.getEmptyMat(n, n);
  let i = 1;
  while(i <= n) {
    mat.set(i, i, def == null ? 1 : def);
    i++;
  };
  return mat;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns a vector from {arr}.
 * Result is a column vector by default.
 * ---------------------------------------- */
CLS_matrix.getVec = function(arr, isRowVec) {
  let i = 0;
  let iCap = arr.iCap();

  const matArr = [];
  if(isRowVec) {
    matArr.push(arr.slice());
  } else {
    arr.forEach(num => matArr.push([num]));
  };

  return new CLS_matrix(matArr);
};


/* ----------------------------------------
 * NOTE:
 *
 * Converts a matrix into a regular array for storage.
 * ---------------------------------------- */
CLS_matrix.pack = function(mat) {
  if(!(mat instanceof CLS_matrix)) return null;

  var colAmt = mat.getColAmt();
  const mat0 = mat.toArray().flatten();
  mat0.unshift(colAmt);

  return mat0;
};


/* ----------------------------------------
 * NOTE:
 *
 * Converts a packed matrix array back into matrix.
 * ---------------------------------------- */
CLS_matrix.unpack = function(matArrPack) {
  if(!(matArrPack instanceof Array)) return null;

  const mat = matArrPack.slice();
  var colAmt = mat.shift();

  return new CLS_matrix(mat.chunk(colAmt, 0));
};


/* ----------------------------------------
 * NOTE:
 *
 * Converts an arc vector to matrix vector.
 * ---------------------------------------- */
CLS_matrix.fromArcVec = function(arcVec, isRowVec) {
  if(arcVec == null) return null;

  if(arcVec instanceof Vec2) {return CLS_matrix.getVec([arcVec.x, arcVec.y], isRowVec)}
  else if(arcVec instanceof Vec3) {return CLS_matrix.getVec([arcVec.x, arcVec.y, arcVec.z], isRowVec)}
  else return null;
};


/* <---------- instance method ----------> */


var ptp = CLS_matrix.prototype;


/* test */


/* ----------------------------------------
 * NOTE:
 *
 * Prints the elements in a line.
 * ---------------------------------------- */
ptp.print = function() {
  this.matArr.print();
};


/* ----------------------------------------
 * NOTE:
 *
 * Prints the elements in multiple lines.
 * ---------------------------------------- */
ptp.printEach = function() {
  this.matArr.printEach();
};


/* meta */


/* ----------------------------------------
 * NOTE:
 *
 * Gets the element at (row, col).
 * ---------------------------------------- */
ptp.get = function(row, col) {
  return this.matArr[row - 1][col - 1];
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns m of the matrix.
 * ---------------------------------------- */
ptp.getRowAmt = function() {
  return this.rowAmt;
},


/* ----------------------------------------
 * NOTE:
 *
 * Returns n of the matrix.
 * ---------------------------------------- */
ptp.getColAmt = function() {
  return this.colAmt;
},


/* ----------------------------------------
 * NOTE:
 *
 * Returns a copy of the internal array.
 * ---------------------------------------- */
ptp.toArray = function() {
  return this.matArr.slice();
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns a copy of the matrix.
 * ---------------------------------------- */
ptp.cpy = function() {
  return new CLS_matrix(this.matArr);
};


/* ----------------------------------------
 * NOTE:
 *
 * Iterates through every element in the matrix.
 * ---------------------------------------- */
ptp.forEach = function(scr) {
  var iCap = this.getRowAmt();
  var jCap = this.getColAmt();
  for(let i = 0; i < iCap; i++) {
    for(let j = 0; j < jCap; j++) {
      scr(this.matArr[i][j]);
    };
  };
};


/* ----------------------------------------
 * NOTE:
 *
 * Iterates through every row array in the matrix.
 * ---------------------------------------- */
ptp.forEachRow = function(scr) {
  var iCap = this.getRowAmt();
  for(let i = 0; i < iCap; i++) {
    scr(this.matArr[i]);
  };
};


/* ----------------------------------------
 * NOTE:
 *
 * Iterates through every column array in the matrix.
 * ---------------------------------------- */
ptp.forEachCol = function(scr) {
  var iCap = this.getColAmt();
  var jCap = this.getRowAmt();
  for(let i = 0; i < iCap; i++) {
    let tmpArr = [];
    for(let j = 0; j < jCap; j++) {
      tmpArr.push(this.matArr[j][i]);
    };
    scr(tmpArr);
  };
};


/* modification */


/* ----------------------------------------
 * NOTE:
 *
 * Sets the element at (row, col).
 * ---------------------------------------- */
ptp.set = function(row, col, ele) {
  this.matArr[row - 1][col - 1] = ele;
  return this;
};


/* vector modification */


/* ----------------------------------------
 * NOTE:
 *
 * Normalizes the vector.
 * {def} is the target length.
 * ---------------------------------------- */
ptp.normalize = function(def) {
  if(!this.isVec()) return null;

  if(def == null) def = 1.0;

  let len = this.len();
  if(def.fEqual(0.0)) return this;                // Does nothing for zero vector
  let i = 0;
  let iCap = this.dimension();
  while(i < iCap) {
    (this.isRowVec() ? this.matArr[0][i] /= len * def : this.matArr[i][0] /= len * def);
    i++;
  };

  return this;
};


/* condition */


/* ----------------------------------------
 * NOTE:
 *
 * Whether it is a square matrix.
 * ---------------------------------------- */
ptp.isSquare = function() {
  return this.getRowAmt() === this.getColAmt();
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether two matrices are of the same size.
 * ---------------------------------------- */
ptp.sameSize = function(mat) {
  if(mat == null || !(mat instanceof CLS_matrix)) return false;

  return this.getRowAmt() === mat.getRowAmt() && this.getColAmt() === mat.getColAmt();
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether this matrix can multiply {mat}.
 * ---------------------------------------- */
ptp.canMul = function(mat) {
  if(mat == null || !(mat instanceof CLS_matrix)) return false;

  return this.getColAmt() === mat.getRowAmt();
};


/* vector condition */


/* ----------------------------------------
 * NOTE:
 *
 * Whether this is a scalar (1-dimensional matrix).
 * ---------------------------------------- */
ptp.isScl = function() {
  return this.isColVec() && this.isRowVec();
},


/* ----------------------------------------
 * NOTE:
 *
 * Whether this is a vector regardless of type.
 * ---------------------------------------- */
ptp.isVec = function() {
  return this.isColVec() || this.isRowVec();
},


/* ----------------------------------------
 * NOTE:
 *
 * Whether this is a column vector.
 * ---------------------------------------- */
ptp.isColVec = function() {
  return this.colAmt === 1;
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether this is a row vector.
 * ---------------------------------------- */
ptp.isRowVec = function() {
  return this.rowAmt === 1;
};


/* calculation */


/* ----------------------------------------
 * NOTE:
 *
 * Returns dimension of the matrix.
 * ---------------------------------------- */
ptp.dimension = function() {
  return Math.max(this.getRowAmt(), this.getColAmt());
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns the transposed result as a new matrix.
 * ---------------------------------------- */
ptp.transpose = function() {
  var iCap = this.getRowAmt();
  var jCap = this.getColAmt();
  const mat = CLS_matrix.getEmptyMat(jCap, iCap);
  for(let i = 0; i < iCap; i++) {
    for(let j = 0; j < jCap; j++) {
      mat.set(j + 1, i + 1, this.matArr[i][j]);
    };
  };

  return mat;
};


/* ----------------------------------------
 * NOTE:
 *
 * Lets a matrix adds another one, returns the result as a new matrix.
 * ---------------------------------------- */
ptp.add = function(mat) {
  if(!this.sameSize(mat)) return null;
  if(this.getRowAmt() != mat.getRowAmt() || this.getColAmt() != mat.getColAmt()) return;

  var iCap = this.getRowAmt();
  var jCap = this.getColAmt();
  const mat0 = CLS_matrix.getEmptyMat(iCap, jCap);
  for(let i = 0; i < iCap; i++) {
    for(let j = 0; j < jCap; j++) {
      mat0.set(i + 1, j + 1, this.matArr[i][j] + mat.matArr[i][j]);
    };
  };

  return mat0;
};


/* ----------------------------------------
 * NOTE:
 *
 * Lets a matrix substracts another one, returns the result as a new matrix.
 * ---------------------------------------- */
ptp.minus = function(mat) {
  if(!this.sameSize(mat)) return null;

  return this.add(mat.scl(-1.0));
};


/* ----------------------------------------
 * NOTE:
 *
 * Lets a matrix multiplies a scalar, returns the result as a new matrix.
 * ---------------------------------------- */
ptp.scl = function(scl) {
  var num = 0.0;

  if(scl instanceof CLS_matrix && scl.isScl()) {num = scl.get(1, 1)}
  else {num = scl};

  var iCap = this.getRowAmt();
  var jCap = this.getColAmt();
  const mat = CLS_matrix.getEmptyMat(iCap, jCap);
  for(let i = 0; i < iCap; i++) {
    for(let j = 0; j < jCap; j++) {
      mat.set(i + 1, j + 1, this.matArr[i][j] * num);
    };
  };

  return mat;
};


/* ----------------------------------------
 * NOTE:
 *
 * Lets a matrix multiplies another one, returns the result as a new matrix.
 * ---------------------------------------- */
ptp.mul = function(mat) {
  if(!this.canMul(mat)) return null;

  var iCap = this.getRowAmt();
  var jCap = mat.getColAmt();
  var kCap = this.getColAmt();
  const mat0 = CLS_matrix.getEmptyMat(iCap, jCap);
  for(let i = 0; i < iCap; i++) {
    for(let j = 0; j < jCap; j++) {
      let sum = 0.0;
      for(let k = 0; k < kCap; k++) {
        sum += this.matArr[i][k] * mat.matArr[k][j];
      };
      mat0.set(i + 1, j + 1, sum);
    };
  };

  return mat0;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns the submatrix at (row, col).
 * ---------------------------------------- */
ptp.subMat = function(row, col) {
  var iCap = this.getRowAmt() - 1;
  var jCap = this.getColAmt() - 1;
  const mat = CLS_matrix.getEmptyMat(iCap, jCap);
  for(let i = 0; i < iCap; i++) {
    for(let j = 0; j < jCap; j++) {
      mat.set(i + 1, j + 1, this.matArr[i + 1 >= row ? i + 1 : i][j + 1 >= col ? j + 1 : j]);
    };
  };

  return mat;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns determinant of the matrix.
 * ----------------------------------------
 * REFERENCE:
 *
 * <Bareiss algorithm>
 * ---------------------------------------- */
ptp.det = function() {
  if(!this.isSquare()) return null;

  const mat = this.cpy();
  var iCap = mat.getRowAmt();
  for(let k = 0; k < iCap - 1; k++) {
    for(let i = k + 1; i < iCap; i++) {
      for(let j = k + 1; j < iCap; j++) {
        mat.set(i + 1, j + 1, (mat.matArr[i][j] * mat.matArr[k][k] - mat.matArr[i][k] * mat.matArr[k][j]) / (k === 0 ? 1.0 : mat.matArr[k - 1][k - 1]));
      };
    };
  };

  return mat.matArr[iCap - 1][iCap - 1];
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns minor of the matrix at (row, col).
 * ---------------------------------------- */
ptp.minor = function(row, col) {
  if(!this.isSquare()) return null;

  return this.subMat(row, col).det();
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns cofactor of the matrix at (row, col).
 * ---------------------------------------- */
ptp.cofactor = function(row, col) {
  if(!this.isSquare()) return null;

  return Math.pow(-1, row + col) * this.minor(row, col);
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns adjugate of the matrix.
 * ---------------------------------------- */
ptp.adjugate = function() {
  if(!this.isSquare()) return;

  var iCap = this.getRowAmt();
  const mat = CLS_matrix.getEmptyMat(iCap, iCap);
  for(let i = 0; i < iCap; i++) {
    for(let j = 0; j < iCap; j++) {
      mat.set(i + 1, j + 1, this.cofactor(i + 1, j + 1));
    };
  };

  return mat.transpose();
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns inverse of the matrix by using adjugate.
 * ---------------------------------------- */
ptp.inverse = function() {
  if(!this.isSquare()) return null;
  var det = this.det();
  if(Math.abs(det) < 0.000001) return null;

  return this.adjugate().scl(1.0 / det);
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns trace of the matrix.
 * ---------------------------------------- */
ptp.trace = function() {
  if(!this.isSquare()) return null;

  var sum = 0.0;
  var iCap = this.getRowAmt();
  for(let i = 0; i < iCap; i++) {
    sum += this.matArr[i][i];
  };

  return sum;
};


/* vector calculation */


/* ----------------------------------------
 * NOTE:
 *
 * Returns length of the vector.
 * ---------------------------------------- */
ptp.len = function() {
  var val = 0.0;
  if(!this.isVec()) return val;

  this.forEach(num => val += Math.pow(num, 2));
  val = Math.sqrt(val);

  return val;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns dot product of two vectors.
 * Result is always a MATRIX, not number!
 * Sometimes can be called on matrices...
 * ---------------------------------------- */
ptp.dotMul = function(vec) {
  if(!vec.isColVec()) return null;
  let hvec = this.transpose();
  if(!hvec.canMul(vec)) return null;

  return hvec.mul(vec);
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns cross product of two vectors.
 * ---------------------------------------- */
ptp.crossMul = function(vec) {
  if(vec == null || !(vec instanceof CLS_matrix)) return null;
  if(!this.isColVec() || !vec.isColVec()) return null;
  if(this.dimension() !== 3 || vec.dimension() !== 3) return null;

  return new CLS_matrix([
    [0, -this[2][0], this[1][0]],
    [this[2][0], 0, -this[0][0]],
    [-this[1][0], this[0][0], 0],
  ]).mul(vec);
};


/* arc */


/* ----------------------------------------
 * NOTE:
 *
 * Converts the vector to an arc vector.
 * ---------------------------------------- */
ptp.toArcVec = function(vec) {
  if(!this.isColVec() && !this.isRowVec()) return null;

  const arr = this.toArray().flatten();
  if(arr.length === 2) {return new Vec2(arr[0], arr[1])}
  else if(arr.length === 3) {return new Vec3(arr[0], arr[1], arr[2])}
  else return null;
};


module.exports = CLS_matrix;
