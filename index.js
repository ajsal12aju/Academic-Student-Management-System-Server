const express = require("express");
const cors = require("cors");
const router = require("./routes");
const Connection = require("./configs/dbConnection");
require("dotenv").config();
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();

const blockedIPs = new Map(); 
const BLOCK_DURATION = 5 * 60 * 1000;

const apiLimiter = rateLimit({
  windowMs: 30 * 1000, 
  max: 50, 
  handler: (req, res) => {
    const ip = req.ip;
    blockedIPs.set(ip, Date.now() + BLOCK_DURATION); 
    return res
      .status(429)
      .json({ error: "Too many requests. Try again later." });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use((req, res, next) => {
  const ip = req.ip;
  if (blockedIPs.has(ip)) {
    const unblockTime = blockedIPs.get(ip);
    if (Date.now() < unblockTime) {
      return res
        .status(403)
        .json({ error: "Your IP is temporarily blocked. Try again later." });
    }
    blockedIPs.delete(ip); 
  }
  next();
});

app.use(apiLimiter);

app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({ origin: "*" }));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

Connection();

app.use("/", router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("\x1b[32m%s\x1b[0m", `Server is running on port ${port}`);
});
