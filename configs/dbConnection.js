const mongoose = require("mongoose");

const Connection = async () => {
  const mongourl = process.env.MONGO_URL;
  
  try {
    await mongoose.connect(mongourl);
    console.log("\x1b[32m%s\x1b[0m", "Database connected successfully ",mongourl);
  } catch (error) {
    console.error(`Failed to connect MongoDB, error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on("connected", () => {
    console.log("\x1b[32m%s\x1b[0m", "Mongoose connected to the database");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`Mongoose connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from the database");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to application termination");
    process.exit(0);
  });
};

module.exports = Connection;
