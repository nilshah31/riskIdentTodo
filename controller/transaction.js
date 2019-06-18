const errorCodes = require('../helpers/error-codes')
module.exports = {
  getTransactions : function(req,res){
    if(!req.query.transactionId || !req.query.confidenceLevel) res.status(400).send(errorCodes.MISSING_PARAMETER)
  } 
}