const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/admin", require("./routes/admin"));
app.use("/coupons", require("./routes/coupons"));

// Connect to DB & Start Server
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
