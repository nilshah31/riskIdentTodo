const errorCodes = require('../helpers/error-codes');
const testData = require('../db/test-data.json');

module.exports = {
  getTransactions: function (req, res) {
    let transactions = []
    let node;
    if (!req.query.transactionId || !req.query.confidenceLevel) return res.status(400).send(errorCodes.MISSING_PARAMETER);
    node = findTransaction(req.query.transactionId, testData[0], req.query.confidenceLevel)
    if(node) transactions = getManipulatedTransaction() 
    res.status(200).send();
  }
}

function getManipulatedTransaction(id, currentNode){

}

function findTransaction(id, currentNode, confidenceLevel) {
  var i,
    currentChild,
    result;

  if (id == currentNode.id) { //should add confidenceLevel condition
    currentNode['connectionInfo'] = undefined;
    return currentNode;
  } else {
    // Use a for loop instead of forEach to avoid nested functions
    // Otherwise "return" will not work properly
    for (i = 0; i < (currentNode.children && currentNode.children.length) || 0; i += 1) {
      currentChild = currentNode.children[i];

      // Search in the current child
      result = findTransaction(id, currentChild, confidenceLevel);
      // Return the result if the node has been found
      if (result !== false) {
        return result;
      }
    }
    // The node has not been found and we have no more options
    return errorCodes.NOT_FOUND;
  }
}