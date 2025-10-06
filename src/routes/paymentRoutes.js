const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

// 
router.post('/pay', PaymentController.pay);

// callback 
router.post('/callback', PaymentController.callback);

module.exports = router;
