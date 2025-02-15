const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact_number: { type: String, required: true },
  tantAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},{ timestamps: true });

const Institution = mongoose.model("Institution", institutionSchema);
module.exports = Institution;
