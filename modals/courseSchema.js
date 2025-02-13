const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    course_code: {
      type: String,
      required: [true, "course Code is required"],
    },
    course_id: {
      type: String,
      required: [true, "course Code id required"],
      unique: true,
    },
    course_name: {
      type: String,
      required: [true, "course Name is required"],
      trim: true,
    },
    course_duration: {
      type: String,
      required: [true, "course Duaration is required"],
      trim: true,
    },
    course_fee: {
      type: Number,
      required: [true, "course Fee is required"],
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "course Name is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
