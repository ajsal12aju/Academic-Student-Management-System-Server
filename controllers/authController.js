const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const { Types } = mongoose;
const jwt = require("jsonwebtoken");
const Branch = require("../schemas/branchSchema");
const Admin = require("../schemas/adminUserSchema");

const createNewAdmin = async (req, res) => {
  try {
    const { name, user_name, password, branch } = req.body;

    if (!name || !user_name || !password || !branch) {
      return res.status(400).json({ error: "required fields  are missing " });
    }
    if (!Types.ObjectId.isValid(branch)) {
      return res.status(400).json({ error: "Invalid branch" });
    }
    const branchExists = await Branch.findById(branch);
    if (!branchExists) {
      return res.status(400).json({ error: "Branch does not exist" });
    }
    const existingUser = await Admin.findOne({ user_name });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: `user with '${user_name}' is already exist` });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = new Admin({
      name,
      user_name,
      password: hashedPassword,
      branch: branch,
    });

    await newAdmin.save();
    return res
      .status(201)
      .json({ message: "admin user created", user: newAdmin });
  } catch (error) {
    console.error("======X========X=======X========X========X=========", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const signin = async (req, res) => {
  const secretKey = process.env.JWT_SECRET;

  try {
    const user_name = req.body.email;
    const password = req.body.password;
    if (!user_name || !password) {
      return res
        .status(400)
        .json({ error: "User name and password are required" });
    }

    const user = await Admin.findOne({ user_name }).populate("branch");

    if (!user) {
      return res.status(401).json({ error: "Invalid user name or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid user name or password" });
    }
    const token = jwt.sign(
      {
        branch: user.branch._id,
        user_id: user._id,
        user_name: user.user_name,
        name: user.name,
      },
      secretKey,
      {
        expiresIn: "2hr",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: user.name,
      branch: {
        branch_name: user.branch.branch_name,
        branch_id: user.branch.branch_id,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createNewAdmin, signin };
