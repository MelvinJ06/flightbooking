const express = require('express');
const router = express.Router();
const { getFlights, searchFlights , getFlightById} = require('../controllers/flightController');

// Disable caching for all flight-related routes
router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Get all flights
router.get('/', getFlights);

// Search flights
router.get('/search', searchFlights);

router.get('/:id', getFlightById);


module.exports = router;
