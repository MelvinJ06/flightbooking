const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");  
const connectDB = require("./config/db");
const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express(); // Initialize 'app' here before using it

const corsOptions = {
  origin: ["http://localhost:3000", "https://flightbooking-2.onrender.com"],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization, Origin, X-Requested-With, Accept, Access-Control-Allow-Headers",
  credentials: true, 
};

app.use(cors(corsOptions));  
app.options('*', cors(corsOptions));
app.use(express.json());

app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api/paypal', paymentRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

const PORT = process.env.PORT || 5555;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
