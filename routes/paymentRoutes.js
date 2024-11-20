const express = require('express');
const { createPayment, capturePayment } = require('../controllers/paymentController');

const router = express.Router();

// Route to create PayPal payment
router.post('/create', createPayment);

// Route to capture PayPal payment after user approval
router.get('/capture/:orderId', capturePayment);

module.exports = router;
