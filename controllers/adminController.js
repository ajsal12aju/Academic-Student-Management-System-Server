const Branch = require("../modals/Branch");
const User = require("../modals/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createBranchWithAdmin = async (req, res) => {
  try {
    const { name, location, adminName, adminEmail, adminPassword } = req.body;

    if (!name || !location || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const academicAdmin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "academicAdmin"
    });

    const branch = await Branch.create({
      name,
      location,
      academicAdmin: academicAdmin._id
    });

    res.status(201).json({ message: "Branch and admin created successfully", branch, academicAdmin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
