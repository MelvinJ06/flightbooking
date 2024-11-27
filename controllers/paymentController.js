const paypal = require('@paypal/checkout-server-sdk');
const Booking = require('../models/Booking'); // Assuming the booking model is already created.

// Setup PayPal environment
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
    paymentRequest.prefer("return=representation");
    paymentRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalPrice.toFixed(2), // Ensure the value is a string formatted as 'xx.xx'
          },
        },
      ],
    });

    // Create the order
    const order = await client.execute(paymentRequest);

    // Save the booking with the PayPal order ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = 'Pending';
    booking.paypalOrderId = order.result.id; // Store PayPal order ID
    await booking.save();

    // Find the approval link
    const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;

    res.json({ approvalUrl });
  } catch (error) {
    console.error('Error creating PayPal payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};

// Capture PayPal payment after approval
const capturePayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    const captureResponse = await client.execute(captureRequest);

    // Update booking status
    const booking = await Booking.findOne({ paypalOrderId: orderId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = 'Completed';
    await booking.save();

    res.json({
      message: 'Payment successfully captured',
      booking,
      captureDetails: captureResponse.result,
    });
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    res.status(500).json({ message: 'Payment capture failed' });
  }
};

module.exports = { createPayment, capturePayment };
