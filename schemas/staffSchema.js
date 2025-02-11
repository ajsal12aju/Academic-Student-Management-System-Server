const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
      unique: true,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
      required: [true, "Joining date is required"],
    },
    photoURL: {
      type: String,
    },
    qualification: {
      type: String,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
