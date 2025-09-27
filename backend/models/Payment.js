const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Booking", 
    required: true 
  },
  method: { 
    type: String, 
    enum: ["online", "cash"], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  cardNumber: { 
    type: String,
    required: function () {
      return this.method === "online"; // only online payments
    },
  },
  cardHolder: { 
    type: String,
    required: function () {
      return this.method === "online"; // only online payments
    },
  },
   expiry: { type: String },
   cvv: { type: String }, 
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
