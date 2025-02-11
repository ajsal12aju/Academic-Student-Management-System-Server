const Branch = require("../schemas/branchSchema");

const getAllBranches = async (_, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json({ success: true, data: branches });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch branches",
      error: error.message,
    });
  }
};

const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }
    res.status(200).json({ success: true, data: branch });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch branch",
      error: error.message,
    });
  }
};

const createBranch = async (req, res) => {
  const {
    branch_id,
    branch_name,
    state,
    district,
    place,
    branch_head,
    email,
    phone,
  } = req.body;

  try {
    if (!branch_id || !branch_name || !state || !district) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newBranch = new Branch({
      branch_id,
      branch_name,
      state,
      district,
      place,
      branch_head,
      email,
      phone,
    });

    await newBranch.save();
    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: newBranch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create branch",
      error: error.message,
    });
  }
};

const editBranch = async (req, res) => {
  const { branch_name, state, district, place, branch_head } = req.body;

  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    }

    if (branch_name) branch.branch_name = branch_name;
    if (state) branch.state = state;
    if (district) branch.district = district;
    if (place) branch.place = place;
    if (branch_head) branch.branch_head = branch_head;

    await branch.save();
    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update branch",
      error: error.message,
    });
  }
};

module.exports = { getAllBranches, getBranchById, createBranch, editBranch };
