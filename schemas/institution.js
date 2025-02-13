const mongoose = require("mongoose");

const tantAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user_name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["tantAdmin"], default: "tantAdmin" },
  institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
});

const TantAdmin = mongoose.model("TantAdmin", tantAdminSchema);
module.exports = TantAdmin;
