const Staff = require("../schemas/staffSchema");
const Student = require("../schemas/studentSchema");

const getDashBoardCounts = async (req, res) => {
  try {
    const branch_id = req.branchObjID;

    const studentsCount = await Student.countDocuments({ branch: branch_id });
    const staffsCount = await Staff.countDocuments({ branch: branch_id });

    return res.status(200).json({
      message: "Dash board Counts retrieved successfully",
      data: {
        students: studentsCount,
        staffs: staffsCount,
        contacts: [],
      },
    });
  } catch (error) {
    console.error("Error during fetching Dash board Counts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getDashBoardCounts };
