const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
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
    classCode: {
      type: String,
      required: [true, "class Code is required"],
      unique: true,
    },
    division: {
      type: String,
      required: [true, "division is required"],
    },
    batchType: {
      type: String,
      required: [true, "class Type is required"],
    },
    batchYear: {
      type: String,
      required: [true, "batch Year is required"],
    },
    batchMonth: {
      type: String,
      required: [true, "batch Month is required"],
    },
    classHead: {
      type: String,
      trim: true,
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

const Class = mongoose.model("Class", classSchema);
module.exports = Class;
