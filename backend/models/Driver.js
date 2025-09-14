const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    availableDays: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
