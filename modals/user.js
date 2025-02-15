const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user_name: { type: String, required: true, unique: true },
  email: { type: String, required: true, },
  contact_number: { type: String },
  password: { type: String, required: true },
  address: { type: String },
  role: { type: String, enum: ["academicAdmin", "tantAdmin"], required: true },
  institution_name: { type: mongoose.Schema.Types.ObjectId, ref: "Institution", required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
