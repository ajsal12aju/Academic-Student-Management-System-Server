const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
});

const Admin = mongoose.model("Admin", adminUserSchema);
module.exports = Admin;
