const paypal = require('@paypal/checkout-server-sdk');
const Booking = require('../models/Booking'); 


let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);

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
            value: totalPrice.toFixed(2), 
          },
        },
      ],
    });

    const order = await client.execute(paymentRequest);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = 'Pending';
    booking.paypalOrderId = order.result.id; 
    await booking.save();

    const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;

    res.json({ approvalUrl });
  } catch (error) {
    console.error('Error creating PayPal payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};

const capturePayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    const captureResponse = await client.execute(captureRequest);

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
