// routes/booking.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  requestBooking,
  getMyBookings
} = require('../controllers/bookingController');

// Sinh viên đặt lịch
router.post('/request', protect, requestBooking);

// Xem lịch cá nhân (cả student & tutor đều dùng được)
router.get('/my/bookings', protect, getMyBookings);

module.exports = router;