const paypal = require('@paypal/paypal-server-sdk');
const Booking = require('../models/Booking');  // Assuming the booking model is already created.

let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);

// Create PayPal Order
const createPayment = async (req, res) => {
  const { bookingId, totalPrice } = req.body;

  try {
    const paymentRequest = new paypal.orders.OrdersCreateRequest();
    paymentRequest.preferredPaymentsMethod("PAYPAL");
    paymentRequest.purchase_units([{
      amount: {
        currency_code: 'USD',
        value: totalPrice
      },
    }]);

    const order = await client.execute(paymentRequest);

    // Save the booking with the PayPal order ID
    const booking = await Booking.findById(bookingId);
    booking.paymentStatus = 'Pending';
    await booking.save();

    res.json({ approvalUrl: order.result.links.find(link => link.rel === 'approve').href });
  } catch (error) {
    console.error('Error creating PayPal payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};

// Capture PayPal payment after approval
const capturePayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const captureResponse = await client.execute(request);
    
    // Update booking status
    const booking = await Booking.findOne({ paypalOrderId: orderId });
    booking.paymentStatus = 'Completed';
    await booking.save();

    res.json({ message: 'Payment successfully captured', booking });
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    res.status(500).json({ message: 'Payment capture failed' });
  }
};

module.exports = { createPayment, capturePayment };
