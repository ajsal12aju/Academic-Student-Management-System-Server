const StudentPayment = require("../schemas/StudentPayment");
const Student = require("../schemas/studentSchema");
const generateInvoiceNo = require("../utils/generateInvoiceNo");
const sendPaymentEmail = require("../utils/paymentMailer");

const createPayment = async (req, res) => {
  try {
    const { studentId, amount, paymentType, paymentMode, reference, remark } =
      req.body;

    const branch = req.user.branch;
    const user_id = req.user.user_id;
    const user_name = req.user.user_name;

    if (!branch || !user_name || !user_id) {
      return res
        .status(400)
        .json({ error: "Invalid or incomplete Authorization" });
    }

    if (!studentId || !amount || !paymentType || !paymentMode) {
      return res.status(400).json({
        error: "Incomplete payment request, all fields are required",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const pendingFeeAmount = student.pendingFeeAmount - amount;
    const totalPaidFee = student.totalPaidFee + amount;

    if (pendingFeeAmount <= 0) {
      return res.status(422).json({
        error: "This Payment is not alllowed , not matching the accounts",
      });
    }
    const invoiceNo = await generateInvoiceNo();

    const newPayment = new StudentPayment({
      studentId,
      branch,
      course: student.course,
      batch: `${student.batchYear} - ${student.batchMonth.toUpperCase()} (${
        student.batchType
      })`,
      admissionNo: student.admissionNo,
      studentName: student.name,
      amount,
      currentPending: pendingFeeAmount,
      currentTotalPaid: totalPaidFee,
      paymentType,
      paymentMode,
      reference,
      remark,
      createdBy: user_id,
      createdByName: user_name,
      invoiceNo,
    });

    const completedPayment = await newPayment.save();

    await Student.updateOne(
      { _id: studentId },
      {
        $set: {
          pendingFeeAmount: pendingFeeAmount,
          totalPaidFee: totalPaidFee,
          lastPaymentDate: Date.now(),
        },
      }
    );

    let emailSentSuccessfully = true;
    let emailErrorMessage = "";

    if (student.email) {
      try {
        sendPaymentEmail({
          name: student.name,
          // email: student.email,
          admissionNo: student.admissionNo,
          course: student.course,
          batch: `${student.batchYear} - ${student.batchMonth.toUpperCase()} (${
            student.batchType
          })`,

          invoiceNo: completedPayment.invoiceNo,
          amount: amount,
          paymentType: paymentType,
          date: Date.now(),
        }).catch((err) => {
          console.error("Error sending payment email:", err.message);
          emailSentSuccessfully = false;
          emailErrorMessage = err.message;
        });
      } catch (err) {
        console.error("Unexpected error sending payment email:", err.message);
        emailSentSuccessfully = false;
        emailErrorMessage = err.message;
      }
    }

    return res.status(201).json({
      emailSent: emailSentSuccessfully,
      message: emailSentSuccessfully
        ? "Payment entry created successfully, and email sent."
        : `Payment entry created successfully, but there was an issue sending the email: ${emailErrorMessage}`,
      completedPayment,
    });
  } catch (error) {
    console.error("Unexpected error during payment creation:", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = "createdAt",
      filters = "{}",
    } = req.query;

    const branch = req.user.branch;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    let query = { branch };

    let parsedFilters = {};
    try {
      parsedFilters = JSON.parse(filters);
    } catch (error) {
      return res.status(400).json({ error: "Invalid filters format" });
    }

    for (const [field, value] of Object.entries(parsedFilters)) {
      if (!Array.isArray(value) || value.length !== 2) {
        return res
          .status(400)
          .json({ error: `Invalid filter format for ${field}` });
      }

      const [operator, searchValue] = value;

      switch (operator) {
        case "eq":
          query[field] = searchValue;
          break;
        case "ne":
          query[field] = { $ne: searchValue };
          break;
        case "gt":
          query[field] = { $gt: searchValue };
          break;
        case "lt":
          query[field] = { $lt: searchValue };
          break;
        case "regex":
          query[field] = { $regex: searchValue, $options: "i" };
          break;
        default:
          return res
            .status(400)
            .json({ error: `Invalid search operator: ${operator}` });
      }
    }

    const payments = await StudentPayment.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ [sort]: -1 });

    const totalCount = await StudentPayment.countDocuments(query);

    return res.status(200).json({
      message: "Payments retrieved successfully",
      data: payments,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error during fetching payments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getPayments,
  createPayment,
};
