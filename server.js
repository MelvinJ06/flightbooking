const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");  
const connectDB = require("./config/db");
const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express(); 

const corsOptions = {
  origin: ["https://flightbooking-2.onrender.com","https://flight12.netlify.app" ],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true, 
};


app.use(cors(corsOptions));  
app.use(express.json());

app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api/paypal', paymentRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

const PORT = process.env.PORT || 5557;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
