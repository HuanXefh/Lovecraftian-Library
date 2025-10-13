/* ----------------------------------------
 * NOTE:
 *
 * Tree data structure.
 * Except the root, every element should be attached to a parent element in the tree.
 * One element should only be used once in the tree!
 * And obviously, only one root.
 *
 * Internal properties, don't modify these in {propSetter}:
 * parent
 * children
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_tree = function() {
  this.init.apply(this, arguments);
}.initClass();


CLS_tree.prototype.init = function(ele, propSetter) {

  this.root = ele;

  this.nodeMap = new ObjectMap();
  this.nodeMap.put(ele, CLS_tree.newNodeObj(null, propSetter));

};


/* <---------- static method ----------> */


/* ----------------------------------------
 * NOTE:
 *
 * Gets an empty node object.
 * Use {propSetter} to set customized properties.
 * ---------------------------------------- */
CLS_tree.newNodeObj = function(parent, propSetter) {
  let obj = {
    parent: Object.val(parent, null),
    children: [],
  };
  if(propSetter != null) propSetter(obj);

  return obj;
};


/* <---------- instance method ----------> */


var ptp = CLS_tree.prototype;


/* meta */


/* ----------------------------------------
 * NOTE:
 *
 * Gets size of the tree, or some branch.
 * ---------------------------------------- */
ptp.getSize = function(ele) {
  return ele == null ? this.nodeMap.size : this.getBranch(ele).iCap();
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets some property a node in the tree.
 * ---------------------------------------- */
ptp.getProp = function(ele, key) {
  let nodeObj = this.nodeMap.get(ele);
  if(nodeObj == null) return undefined;

  return nodeObj[key];
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets parent of the given element.
 * If not in the tree, returns {null}.
 * ---------------------------------------- */
ptp.getParent = function(ele) {
  let nodeObj = this.nodeMap.get(ele);
  if(nodeObj == null) return null;

  return nodeObj.parent;
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets the children array of some element.
 * DON'T MODIFY THIS ARRAY!
 * ---------------------------------------- */
ptp.getChildren = function(ele) {
  let nodeObj = this.nodeMap.get(ele);
  if(nodeObj == null) return Array.air;

  return nodeObj.children;
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets an array of the element and its all children.
 * Not another tree!
 * ---------------------------------------- */
ptp.getBranch = function(ele) {
  const arr = [];

  CLS_tree.prototype.getBranch.pushAndNext(ele, arr, this);

  return arr;
}
.setProp({
  pushAndNext: (ele, arr, thisTree) => {
    let nodeObj = thisTree.nodeMap.get(ele);
    if(nodeObj == null) return;

    arr.push(ele);
    nodeObj.children.forEachFast(oele => {
      CLS_tree.prototype.getBranch.pushAndNext(oele, arr, thisTree);
    });
  },
});


/* ----------------------------------------
 * NOTE:
 *
 * Gets layer of the element, 0 for root, 1 for 1st layer.
 * If not found, this returns -1.
 * ---------------------------------------- */
ptp.getNodeLayer = function(ele) {
  return this.getRootPath(ele).reverse().indexOf(ele);
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets an array of elements, from this element to the root.
 * ---------------------------------------- */
ptp.getRootPath = function(ele) {
  const arr = [];

  let tmpEle = ele;
  let tmpNodeObj = this.nodeMap.get(ele);
  while(tmpNodeObj != null) {
    arr.push(tmpEle);
    if(tmpNodeObj.parent == null) break;

    tmpEle = tmpNodeObj.parent;
    tmpNodeObj = this.nodeMap.get(tmpEle);
  };

  return arr;
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets an array of other elements with the same parent.
 * ---------------------------------------- */
ptp.getSiblings = function(ele) {
  const arr = [];

  let parent = this.getParent(ele);
  if(parent == null) return arr;

  let nodeObj = this.nodeMap.get(parent);
  nodeObj.children.forEachFast(oele => {
    if(oele !== ele) arr.push(oele);
  });

  return arr;
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets the nearest common parent of two elements in the tree.
 * ---------------------------------------- */
ptp.getCommonParent = function(ele1, ele2) {
  let arr1 = this.getRootPath(ele1);
  let arr2 = this.getRootPath(ele2);
  if(arr1.length === 0 || arr2.length === 0) return null;

  let parent = null;
  arr1.forEachFast(oele => {
    if(arr2.includes(oele) && parent == null) parent = oele;
  });

  arr1.clear();
  arr2.clear();

  return parent;
};


/* ----------------------------------------
 * NOTE:
 *
 * Iterates through the tree or some branch.
 * Will go down to the end before switching to another branch.
 * ---------------------------------------- */
ptp.forEach = function(ele, scr) {
  if(ele == null) ele = this.root;
  if(!this.nodeMap.hasKey(ele)) return;

  CLS_tree.forEach.callAndNext(ele, scr, this);
}
.setProp({
  callAndNext: (ele, scr, thisTree) => {
    let nodeObj = thisTree.nodeMap.get(ele);
    if(nodeObj == null) return;

    scr(ele);
    nodeObj.children.forEachFast(oele => CLS_tree.forEach.callAndNext(oele, scr, thisTree));
  },
});


/* modification */


/* ----------------------------------------
 * NOTE:
 *
 * Adds a node to the tree.
 * ---------------------------------------- */
ptp.addNode = function(ele, parent, propSetter) {
  let nodeObj = this.nodeMap.get(parent);
  if(nodeObj == null) throw new Error("Cannot find the parent node!");
  if(ele === parent || this.getRootPath(parent).length === 0) throw new Error("The given node breaks tree structure!");

  this.nodeMap.put(ele, CLS_tree.newNodeObj(parent, propSetter));
  nodeObj.children.push(ele);

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Removes a node from the tree.
 * This will remove all children too, technically {removeBranch}.
 * ---------------------------------------- */
ptp.removeNode = function(ele) {
  let nodeObj = this.nodeMap.get(ele);
  if(nodeObj == null) return this;

  let thisTree = this;
  nodeObj.children.forEachFast(oele => thisTree.removeNode(oele));

  this.nodeMap.get(nodeObj.parent).children.pull(ele);
  this.nodeMap.remove(ele);

  return this;
};


module.exports = CLS_tree;
