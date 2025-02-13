const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../modals/platformAdmin");
const TantAdmin = require("../modals/tantAdmin");
const Institution = require("../modals/institution");


const registerAdmin = async (req, res) => {
  try {
    const { name, user_name, password } = req.body;

    if (!name || !user_name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await Admin.findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({ name, user_name, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    const user = await Admin.findOne({ user_name });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: user._id, user_name: user.user_name },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const registerTantAdmin = async (req, res) => {
  try {
    const { name, user_name, email, password, institution_name, address, contact_email, contact_number } = req.body;

    if (!name || !user_name || !email || !password || !institution_name || !address || !contact_email || !contact_number) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if TantAdmin already exists
    const existingUser = await TantAdmin.findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create Institution
    const newInstitution = new Institution({
      name: institution_name,
      address,
      contact_email,
      contact_number,
    });

    await newInstitution.save();

    // Create TantAdmin
    const newTantAdmin = new TantAdmin({
      name,
      user_name,
      email,
      password: hashedPassword,
      institution: newInstitution._id,
    });

    await newTantAdmin.save();

    // Link Institution to TantAdmin
    newInstitution.tantAdmin = newTantAdmin._id;
    await newInstitution.save();

    return res.status(201).json({
      message: "TantAdmin registered successfully",
      tantAdmin: newTantAdmin,
      institution: newInstitution,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 📌 TantAdmin Login
const loginTantAdmin = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
      return res.status(400).json({ error: "User name and password are required" });
    }

    const user = await TantAdmin.findOne({ user_name }).populate("institution");

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user._id, role: "tantAdmin", institution: user.institution._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, role: user.role, institution: user.institution.name },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

    // Verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      // Issue new access token
      const newAccessToken = jwt.sign(
        { user_id: user.user_id }, 
        process.env.JWT_SECRET, 
        { expiresIn: "2h" } // Shorter expiration
      );

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { registerAdmin, login, refreshToken , registerTantAdmin, loginTantAdmin };
