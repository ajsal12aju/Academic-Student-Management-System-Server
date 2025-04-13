const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    academicAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tenantAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", BranchSchema);
