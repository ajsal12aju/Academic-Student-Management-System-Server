const Batch = require("../schemas/batchSchema");
const Class = require("../schemas/classSchema");
const Student = require("../schemas/studentSchema");
const sendWelcomeEmail = require("../utils/welcomeMailer");
// const nodemailer = require("nodemailer");

const getAdmissionNumber = async (req, res) => {
  try {
    const { batchCode, batchYM, batchType, division, course, classCode } =
      req.body;
    // Validate required fields
    if (
      !batchCode ||
      !batchYM ||
      !division ||
      !course ||
      !batchType ||
      !classCode
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: batchCode,batchYM, division, course, and batchType are required.",
      });
    }

    // Validate batchType
    const validBatchTypes = ["Regular", "Morning", "Evening"];
    if (!validBatchTypes.includes(batchType)) {
      return res.status(400).json({
        error:
          "Invalid batchType. Allowed values are: Regular, Morning, Evening.",
      });
    }

    const branch_id = req.branchObjID;

    const query = {
      branch: branch_id,
      classCode: classCode,
      division: division,
    };

    // Find the student with the highest roll number
    const studentWithHighestRollNo = await Student.findOne(query)
      .sort({ rollNo: -1 })
      .lean();
    let rollNo;

    if (!studentWithHighestRollNo) {
      rollNo = 1;
    } else {
      rollNo = studentWithHighestRollNo.rollNo;
      if (typeof rollNo === "string") {
        rollNo = Number(rollNo);
      }
      rollNo += 1;
    }

    const formattedRollNo = String(rollNo).padStart(3, "0");

    let admissionNo;
    if (batchType === "Regular") {
      admissionNo = `${batchYM}/${course}/${division}/${formattedRollNo}`;
    } else {
      const batchTypeInitial = batchType.slice(0, 1);
      admissionNo = `${batchYM}/${course}/${division}${batchTypeInitial}/${formattedRollNo}`;
    }

    return res.status(200).json({
      message: "Admission number generated successfully",
      data: {
        rollNo: rollNo,
        admissionNo: admissionNo,
        classCode: classCode,
      },
    });
  } catch (error) {
    console.error("Error during fetching students:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
      // first_name,
      // last_name,
      admissionNo,
      rollNo,
      division,
      classCode,
      batchType,
      batchYear,
      batchMonth,
      academicYear,
      course,
      courseId,
      courseName,
      courseFee,
      totalPaidFee,
      pendingFeeAmount,
      name,
      email,
      mobile,
      student_id,
      dob,
      gender,
      uid,
      qualification,
      state,
      district,
      pinCode,
      address,
      guardianName,
      guardianMobile,
      placement,
      discount,
      classStartAt,
      bloodGroup,
      identificationMarks,
      healthCondition,
    } = req.body;

    const branch = req.branchObjID;
    const user_id = req.user.user_id;
    const user_name = req.user.user_name;

    if (!branch) {
      return res
        .status(400)
        .json({ error: "Invalid or incomplete Authorization" });
    }
    // const existingStudent = await Student.findOne({
    //   student_id,
    //   branch: branch,
    // });
    // if (existingStudent) {
    //   return res
    //     .status(400)
    //     .json({ error: "Student ID must be unique within the same branch" });
    // }
    let classId;
    const existingClass = await Class.findOne({
      classCode,
      branch,
    });

    if (existingClass) {
      classId = existingClass._id;
    } else {
      const newClass = new Class({
        branch,
        course: courseId,
        academicYear,
        division,
        classCode,
        batchType: batchType,
        batchYear: batchYear,
        batchMonth: batchMonth,
        classHead: null,
        createdBy: user_id,
        createdByName: user_name,
      });
      const createdNewClass = await newClass.save();
      classId = createdNewClass._id;
    }

    const photoURL = req.file ? req.file.path : null;
    const newStudent = new Student({
      // first_name,
      // last_name,
      admissionNo,
      rollNo,
      division,
      classCode,
      classId,
      batchType,
      batchYear,
      batchMonth,
      academicYear,
      courseName,
      course,
      courseId,
      courseFee,
      totalPaidFee,
      pendingFeeAmount,
      name,
      email,
      mobile,
      dob,
      gender,
      uid,
      photoURL,
      qualification,
      state,
      district,
      pinCode,
      address,
      guardianName,
      guardianMobile,
      placement,
      discount,
      classStartAt,
      bloodGroup,
      identificationMarks,
      healthCondition,
      branch,
      student_id,
      createdBy: user_id,
      createdByName: user_name,
    });

    await newStudent.save();

    const populatedStudent = await Student.findById(newStudent._id)
      .populate("branch")
      .populate("course");

    let emailSentSuccessfully = true;
    let emailErrorMessage = "";

    if (newStudent._id && email) {
      try {
        sendWelcomeEmail({
          name,
          // email,
          admissionNo,
          course,
          batch: `${batchYear} - ${batchMonth.toUpperCase()} (${batchType})`,
        });
      } catch (err) {
        console.error("Error sending welcome email:", err.message);
        emailSentSuccessfully = false;
        emailErrorMessage = err.message;
      }
    }

    // Respond with success, and inform if the email failed to send
    return res.status(201).json({
      message: emailSentSuccessfully
        ? "Student created successfully, and welcome email sent."
        : `Student created successfully, but there was an issue sending the welcome email: ${emailErrorMessage}`,
      student: populatedStudent,
      emailSent: emailSentSuccessfully, // Optional: send flag indicating email status
    });
  } catch (error) {
    console.error("Unexpected error during student creation:", error.message);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0]; // Get the field causing the duplicate error
      return res.status(400).json({
        error: "duplicateKey",
        message: `The ${duplicateField} already exists`,
      });
    }

    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = "createdAt",
      filters = "{}",
    } = req.query;

    const branch_id = req.branchObjID;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    let query = { branch: branch_id };
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

    const students = await Student.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ [sort]: -1 })
      .populate("branch")
      .populate("course");

    const totalCount = await Student.countDocuments(query);

    return res.status(200).json({
      message: "Students retrieved successfully",
      data: students,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error during fetching students:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    const student = await Student.findById(id).populate("branch");

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.status(200).json({
      message: "Student retrieved successfully",
      student,
    });
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAdmissionNumber,
  createStudent,
  getAllStudents,
  getStudentById,
};
