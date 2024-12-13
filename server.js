const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");  
const connectDB = require("./config/db");
const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require('./routes/paymentRoutes');


dotenv.config();


// Initialize the app object here
const app = express();

// Use middleware
app.use(cors());  
app.use(express.json());

// Routes
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api/paypal', paymentRoutes);

// Error handling
app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

const PORT = process.env.PORT || 5555;

app.listen(PORT, async() =>{
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
