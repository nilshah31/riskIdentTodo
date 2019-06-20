const errorCodes = require('../helpers/error-codes');
const testData = require('../db/test-data.json');
const _ = require('lodash');
module.exports = {
  getTransactions: function (req, res) {
    let transactions;
    let node;
    if (!req.query.transactionId || !req.query.confidenceLevel) return res.status(400).send(errorCodes.MISSING_PARAMETER);
    node = findTransaction(req.query.transactionId, testData[0], req.query.confidenceLevel)
    console.log(node)
    if(node) transactions = popTransactions(node) 
    res.status(200).send(transactions);
  }
}

function popTransactions(currentNode){
  var i,
  currentChild,
  allTranscations = [];  
  let shallow = _.clone(currentNode)
  shallow.children ? shallow.children=undefined : '';
  allTranscations.push(shallow)
  for (i = 0; i < (currentNode.children && currentNode.children.length) || 0; i += 1) {
    currentChild = currentNode.children[i];
    if(!currentChild.children) allTranscations.push(currentChild)
    popTransactions(currentChild);
  }
  return allTranscations;
}

function findTransaction(id, currentNode, confidenceLevel) {
  var i,
    currentChild,
    result;
  if (id == currentNode.id) { //should add confidenceLevel condition
    currentNode['connectionInfo'] = undefined;
    return currentNode;
  } else {
    for (i = 0; i < (currentNode.children && currentNode.children.length) || 0; i += 1) {
      currentChild = currentNode.children[i];
      result = findTransaction(id, currentChild, confidenceLevel);
      // Return the result if the node has been found
      if (result !== false) {
        return result;
      }
    }
    return errorCodes.NOT_FOUND;
  }
}