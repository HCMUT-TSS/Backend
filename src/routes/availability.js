// routes/availability.js
const express = require('express');
const router = express.Router();
const { getAvailableSlots } = require('../controllers/availabilityController');

router.get('/', getAvailableSlots); // GET /api/availabilities

module.exports = router;