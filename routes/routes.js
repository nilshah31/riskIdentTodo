const express         = require('express');
const router          = express.Router();
const transactionCtrl = require('../controller/transaction'); 

router.get('/transactions',transactionCtrl.getTransactions);
router.all('/*',(req,res) => {
  res.status(404).send({
    error_code :"404",
    message    :"Api Not found"
  });  
});

module.exports = router;