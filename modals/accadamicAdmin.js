const mongoose = require("mongoose");

const academicAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user_name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution", required: true }
}, { timestamps: true });

module.exports = mongoose.model("AcademicAdmin", academicAdminSchema);
