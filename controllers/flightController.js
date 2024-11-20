const Flight = require("../models/Flight");

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString(); // Customize this format if needed
  };
  
  const getFlights = async (req, res) => {
    try {
      const flights = await Flight.find();
      
      // Format the departure and arrival times using formatDate
      const formattedFlights = flights.map(flight => {
        return {
          ...flight.toObject(),
          departureTime: formatDate(flight.departureTime),
          arrivalTime: formatDate(flight.arrivalTime),
        };
      });
      
      res.status(200).json(formattedFlights);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
// Search flights
const searchFlights = async (req, res) => {
    const { departure, arrival, departureDate, bookingClass } = req.query;
  
    try {
      let flights = await Flight.find({
        departure: new RegExp(departure, "i"),
        arrival: new RegExp(arrival, "i"),
      });
  
      if (departureDate) {
        flights = flights.filter(
          (flight) => flight.departureDate === departureDate
        );
      }
  
      if (bookingClass) {
        flights = flights.filter(
          (flight) => flight.bookingClass.toLowerCase() === bookingClass.toLowerCase()
        );
      }
  
      res.status(200).json(flights);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }
        res.status(200).json(flight);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFlights, searchFlights, getFlightById };
