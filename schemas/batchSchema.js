const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch id is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course id is required"],
    },
    academicYear: {
      type: String,
      required: [true, "Academic Year  is required"],
    },
    batchCode: {
      type: String,
      required: [true, "batch Code is required"],
      unique: true,
    },
    batchType: {
      type: String,
      required: [true, "batch Code is required"],
    },
    batch: {
      type: String,
      required: [true, "Batch Name is required"],
      trim: true,
    },
    batchHead: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;
