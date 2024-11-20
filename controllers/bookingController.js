// controllers/bookingController.js
const Booking = require("../models/Booking");
const Flight = require("../models/Flight");

// Create a booking
const createBooking = async (req, res) => {
  const { flightId, passengerName, passengerEmail, seatsBooked, bookingClass } = req.body;

  try {
    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (flight.availableSeats < seatsBooked) {
      return res.status(400).json({ message: "Not enough available seats" });
    }

    const totalPrice = seatsBooked * flight.price;

    const booking = new Booking({
      flightId,
      passengerName,
      passengerEmail,
      seatsBooked,
      bookingClass,
      totalPrice,
    });

    await booking.save();

    // Update the flight's available seats
    flight.availableSeats -= seatsBooked;
    await flight.save();

    res.status(201).json(booking); // Return the booking details as a response
  } catch (error) {
    console.error('Error in createBooking controller:', error); // Log the error
    res.status(500).json({ message: error.message });
  }
};


const getBookingsByEmail = async (req, res) => {
  try {
      const bookings = await Booking.find({ passengerEmail: req.params.email }).populate('flightId');
      res.status(200).json(bookings);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookingsByEmail };

