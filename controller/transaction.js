const errorCodes = require('../helpers/error-codes');
const testData = require('../db/test-data.json');
const _ = require('lodash');
module.exports = {
  getTransactions: function (req, res) {
    let transactions;
    let node;
    let allTranscations = [];
    if (!req.query.transactionId || !req.query.confidenceLevel) return res.status(400).send(errorCodes.MISSING_PARAMETER);
    node = findTransaction(testData,req.query.transactionId)
    node['connectionInfo'] = undefined;
    let shallow = _.cloneDeep(node)
    shallow.children ? shallow.children=undefined : '';
    allTranscations.push(shallow);
    if(node) transactions = popTransactions(node, allTranscations) 
    if(node) transactions = addCombinedConnectionInfo(allTranscations) 
    res.status(200).send(allTranscations);
  }
}

function popTransactions(currentNode, allTranscations){
  var i,
  currentChild;
  for (i = 0; i < (currentNode.children && currentNode.children.length) || 0; i += 1) {
    currentChild = currentNode.children[i];
    let shallow = _.cloneDeep(currentChild)
    shallow.children ? shallow.children=undefined : '';
    allTranscations.push(shallow)
    popTransactions(currentChild, allTranscations);
  }
  return allTranscations;
}

function findTransaction(tree, nodeId) {
  for (let node of tree) {
    if (node.id === nodeId) return node

    if (node.children) {
      let desiredNode = findTransaction(node.children, nodeId)
      if (desiredNode) return desiredNode
    }
  }
  return errorCodes.NOT_FOUND;
}

function addCombinedConnectionInfo(allTranscations){
  for (i = 1;i<allTranscations.length;i++){
    let types = i===1? allTranscations[i].connectionInfo.type : allTranscations[i-1].combinedConnectionInfo.type.join(',')+','+allTranscations[i].connectionInfo.type
    let confidence = i===1? allTranscations[i].connectionInfo.confidence * 1 :  allTranscations[i-1].connectionInfo.confidence
    allTranscations[i].combinedConnectionInfo = {
      type : types.split(','), 
      confidence : confidence
    }
  }
}
