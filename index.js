const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRouter");

dotenv.config();

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}); 
app.use(limiter);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));