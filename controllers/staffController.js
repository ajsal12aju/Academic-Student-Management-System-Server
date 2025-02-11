const Staff = require("../schemas/staffSchema");
const sendWelcomeEmailStaff = require("../utils/staffWelcomeMailer");

const createStaff = async (req, res) => {
  try {
    const { name, email, phone, address, qualification } = req.body;

    const branch = req.branchObjID;
    const user_id = req.user.user_id;
    const user_name = req.user.user_name;
    if (!branch) {
      return res
        .status(400)
        .json({ error: "Invalid or incomplete Authorization" });
    }

    if (!name || !email) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields: ["name", "email"].filter((field) => !req.body[field]),
      });
    }

    const photoURL = req.file ? req.file.path : null;

    // Create the new Staff document
    const newStaff = new Staff({
      name,
      email,
      phone,
      address,
      branch,
      qualification,
      photoURL: photoURL,
      createdBy: user_id,
      createdByName: user_name,
    });

    await newStaff.save();
    if (newStaff._id && email) {
      try {
        sendWelcomeEmailStaff({
          name,
          // email,
          // admissionNo,
        });
      } catch (err) {
        console.error("Error sending welcome email:", err.message);
        emailErrorMessage = err.message;
      }
    }

    const populatedStaff = await Staff.findById(newStaff._id);

    return res.status(201).json({
      message: "Staff created successfully",
      staff: populatedStaff,
    });
  } catch (error) {
    console.error("Error during staff creation:", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

const getAllStaffs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      ...searchParams
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const branch_id = req.branchObjID;

    let query = { branch: branch_id };

    for (const [field, value] of Object.entries(searchParams)) {
      const [operator, searchValue] = value.split(":");

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
          return res.status(400).json({ error: "Invalid search operator" });
      }
    }

    const staffs = await Staff.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ [sort]: -1 })
      .populate("branch");
    // .populate("course");

    const totalCount = await Staff.countDocuments(query);

    return res.status(200).json({
      message: "Staffs retrieved successfully",
      data: staffs,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error during fetching students:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createStaff, getAllStaffs };
