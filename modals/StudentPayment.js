const mongoose = require("mongoose");

const studentPaymentSchema = new mongoose.Schema(
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
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    admissionNo: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currentTotalPaid: {
      type: Number,
      required: true,
    },
    currentPending: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["Tuition Fee", "Admission Fee", "Exam", "Other"],
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Cheque", "Other"],
      required: true,
    },
    reference: {
      type: String,
      default: "",
    },
    remark: {
      type: String,
      default: "",
    },
    invoiceNo: {
      type: String,
      unique: true, 
      required: true,
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
  { timestamps: true } // Automatically manages createdAt & updatedAt
);

const StudentPayment = mongoose.model("StudentPayment", studentPaymentSchema);

module.exports = StudentPayment;
