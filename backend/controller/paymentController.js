const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Create Payment
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, method, amount, cardNumber, cardHolder, expiry, cvv } = req.body;

    // Validation
    if (!bookingId || !method || !amount) {
      return res.status(400).json({ error: "Booking ID, method, and amount are required" });
    }

    if (!["online", "cash"].includes(method)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    if (method === "online" && (!cardNumber || !cardHolder || !expiry || !cvv)) {
      return res.status(400).json({ error: "All card details are required for online payment" });
    }

    // Save payment
    const payment = new Payment({ bookingId, method, amount, cardNumber, cardHolder, expiry, cvv });
    await payment.save();

    // Mark booking as paid
    await Booking.findByIdAndUpdate(bookingId, { paid: true });

    res.status(201).json({ message: "Payment successful", payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("bookingId");
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
