const express = require('express');
const { createPayment, getPayments } = require('../controller/paymentController');

const router = express.Router();

router.post('/', createPayment);   // Make a payment
router.get('/', getPayments);      // Get all payments

module.exports = router;
