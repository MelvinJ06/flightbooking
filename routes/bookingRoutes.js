const express = require("express");
const router = express.Router();  // Initialize router here
const { createBooking, getBookingsByEmail } = require("../controllers/bookingController");

// Define routes after router initialization
router.get('/:email', getBookingsByEmail);

router.post("/", createBooking);

module.exports = router;
