const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch is required"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
    },
    courseId: {
      type: String,
      required: [true, "courseId is required"],
    },
    courseName: {
      type: String,
      required: [true, "Course Name is required"],
    },
    courseFee: {
      type: Number,
      required: [true, "Course fee is required"],
    },
    totalPaidFee: {
      type: Number,
      required: [true, "total Paid Amount is required"],
    },
    lastPaymentDate: {
      type: Date,
    },
    pendingFeeAmount: {
      type: Number,
      required: [true, "Pending Amount is required"],
    },
    admissionDate: {
      type: Date,
      default: Date.now,
      required: [true, "Admission date is required"],
    },
    academicYear: {
      type: String,
      required: [true, "Academic Year  is required"],
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "class id is required"],
      ref: "Class",
    },
    classCode: {
      type: String,
      required: [true, "class code is required"],
    },
    batchType: {
      type: String,
      required: [true, "batch code is required"],
    },
    batchYear: {
      type: String,
      required: [true, "batch Year is required"],
    },
    batchMonth: {
      type: String,
      required: [true, "batch Month is required"],
    },
    division: {
      type: String,
      required: [true, "Division is required"],
    },
    rollNo: {
      type: Number,
      required: [true, "rollNo is required"],
    },
    admissionNo: {
      type: String,
      unique: true,
      required: [true, "Admission No  is required"],
    },

    name: {
      type: String,
      required: [true, "name name is required"],
      trim: true,
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[0-9]{10}$/, "Mobile number must be 10 digits"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
      max: [Date.now, "Date of Birth cannot be in the future"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender is required"],
    },
    uid: {
      type: String,
      required: [true, "UID number is required"],
      match: [/^\d{12}$/, "UID number must be exactly 12 digits"],
    },
    photoURL: {
      type: String,
    },
    qualification: {
      type: String,
      required: [true, "Qualification is required"],
    },
    state: {
      type: String,
      default: "Kerala",
    },
    district: {
      type: String,
      required: [true, "District is required"],
    },
    pinCode: {
      type: String,
      required: [true, "Post Office is required"],
    },
    address: {
      type: String,
      required: [true, "Place is required"],
    },
    guardianName: {
      type: String,
      required: [true, "Guardian Name is required"],
    },
    guardianMobile: {
      type: String,
      required: [true, "Guardian Mobile is required"],
      match: [/^[0-9]{10}$/, "Guardian mobile number must be 10 digits"],
    },
    placement: {
      type: Boolean,
      required: [true, "Placement is required"],
    },
    discount: {
      type: String, // Optional, if needed, you can add validations
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood Group is required"],
    },
    identificationMarks: {
      type: String, // Optional field for identification marks
    },
    healthCondition: {
      type: String, // Optional field for health condition
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

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
