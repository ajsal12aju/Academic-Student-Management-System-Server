const express = require("express");
const cors = require("cors");
const router = require("./routes");
const Connection = require("./configs/dbConnection");
require("dotenv").config();
const path = require("path");

const app = express();

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

const port = process.env.PORT;
app.listen(port, () => {
  console.log("\x1b[32m%s\x1b[0m", `Server is running on port ${port}`);
});
