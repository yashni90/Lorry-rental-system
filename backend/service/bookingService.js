const Booking = require('../models/Booking');

async function createBooking(data) {
  const booking = new Booking(data);
  return await booking.save();
}

async function getBookings() {
  return await Booking.find().sort({ createdAt: -1 }).exec();
}

async function getBookingById(id) {
  return await Booking.findById(id).exec();
}

async function updateBooking(id, updateData) {
  const booking = await getBookingById(id);
  if (!booking) return null;

  if (booking.status !== 'pending') return null;

  const allowed = ['pickupLocation', 'dropLocation', 'date'];
  allowed.forEach(field => {
    if (updateData[field] !== undefined) booking[field] = updateData[field];
  });

  return await booking.save();
}

async function deleteBooking(id) {
  const booking = await getBookingById(id);
  if (!booking) return null;
  await Booking.deleteOne({ _id: booking._id });
  return booking;
}

async function acceptBooking(id) {
  const booking = await getBookingById(id);
  if (!booking) return null;
  booking.status = 'accepted';
  return await booking.save();
}

async function rejectBooking(id) {
  const booking = await getBookingById(id);
  if (!booking) return null;

  // Only pending bookings can be rejected
  if (booking.status !== 'pending') return null;

  booking.status = 'rejected';
  return await booking.save();
}

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  acceptBooking,
  rejectBooking,
};
