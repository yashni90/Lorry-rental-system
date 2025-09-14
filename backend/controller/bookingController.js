const bookingService = require('../service/bookingService');

const Booking = require('../models/Booking');
const Driver = require('../models/Driver');


async function createBooking(req, res) {
  try {
    const created = await bookingService.createBooking(req.body);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getAllBookings(req, res) {
  try {
    const bookings = await bookingService.getBookings();
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getBooking(req, res) {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.json(booking);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateBooking(req, res) {
  try {
    const updated = await bookingService.updateBooking(req.params.id, req.body);
    if (!updated) return res.status(400).json({ error: 'Only pending bookings can be updated' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deleteBooking(req, res) {
  try {
    const booking = await bookingService.deleteBooking(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.json({ message: 'Booking deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function acceptBooking(req, res) {
  try {
    const accepted = await bookingService.acceptBooking(req.params.id);
    if (!accepted) return res.status(400).json({ error: 'Only pending bookings can be accepted' });
    return res.json(accepted);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function rejectBooking(req, res) {
  try {
    const rejected = await bookingService.rejectBooking(req.params.id);
    if (!rejected) return res.status(400).json({ error: 'Only pending bookings can be rejected' });
    return res.json(rejected);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function assignDriver(req, res) {
  try {
    const { driverId } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    //Only allow assignment if booking is accepted
    if (booking.status !== 'accepted') {
      return res.status(400).json({ error: 'Driver can only be assigned to accepted bookings' });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    booking.assignedDriver = driverId;
    await booking.save();

    const updatedBooking = await Booking.findById(req.params.id).populate(
      'assignedDriver',
      'name email phone availableDays'
    );

    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function getAllBookingsWithDriver(req, res) {
  try {
    const bookings = await Booking.find().populate(
      'assignedDriver',
      'name email phone availableDays'
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  acceptBooking,
  rejectBooking,
  assignDriver,
  getAllBookingsWithDriver,
};
