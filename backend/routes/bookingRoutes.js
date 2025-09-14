const express = require('express');
const router = express.Router();
const controller = require('../controller/bookingController');

// Create & list
router.post('/', controller.createBooking);
router.get('/', controller.getAllBookings);

// Get single
router.get('/:id', controller.getBooking);

// Update / Delete
router.put('/:id', controller.updateBooking);
router.delete('/:id', controller.deleteBooking);

// Admin accept / reject
router.patch('/:id/accept', controller.acceptBooking);
router.delete('/:id/reject', controller.deleteBooking); // same as delete
router.patch('/:id/reject', controller.rejectBooking);


router.get('/with-driver/all', controller.getAllBookingsWithDriver);
router.put('/:id/assign-driver', controller.assignDriver);

module.exports = router;
