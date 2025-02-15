const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../modals/platformAdmin");
const User = require("../modals/user");
const Institution = require("../modals/institution");
const AcademicAdmin = require("../modals/accadamicAdmin");


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
    res.status(500).json({ error: err , message:"Field" });
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

    res.cookie("jwt", token, {
      httpOnly: true,  
      secure: true,    
      sameSite: "Strict",
      maxAge: 2 * 60 * 60 * 1000, 
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const registerTantAdmin = async (req, res) => {
  try {
    const { name, user_name, email, password, institution_name, address, contact_number } = req.body;

    if (!name || !user_name || !email || !password || !institution_name || !address || !contact_number) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newInstitution = new Institution({
      name: institution_name,
      address,
      email,
      contact_number,
    });
    

    await newInstitution.save();

    const newTantAdmin = new User({
      name,
      user_name,
      email,
      password: hashedPassword,
      institution_name: newInstitution._id,
      role: "tantAdmin",
    });
    

    await newTantAdmin.save();

    newInstitution.tantAdmin = newTantAdmin._id;
    await newInstitution.save();

    return res.status(201).json({
      message: "User registered successfully",
      tantAdmin: newTantAdmin,
      institution: newInstitution,
    });
  } catch (error) { 
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// User Login
const loginTantAdmin = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
      return res.status(400).json({ error: "User name and password are required" });
    }

    const user = await User.findOne({ user_name }).populate("institution");
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: user._id, role: "tantAdmin", institution: user.institution._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 2 * 60 * 60 * 1000, 
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const newAccessToken = jwt.sign(
        { user_id: user.user_id }, 
        process.env.JWT_SECRET, 
        { expiresIn: "2h" }
      );

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// aacasdamic admin

const registerAcademicAdmin = async (req, res) => {
  try {
    const { name, user_name, email, password, institution_name, address, contact_number } = req.body;

    if (!name || !user_name || !email || !password || !institution_name || !address || !contact_number) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await AcademicAdmin.findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const institution = await Institution.findOneAndUpdate(
      { name: institution_name },
      { name: institution_name, address, contact_number },
      { upsert: true, new: true }
    );

    const newAdmin = new AcademicAdmin({
      name,
      user_name,
      email,
      password: hashedPassword,
      institution: institution._id,
    });

    await newAdmin.save();

    return res.status(201).json({ message: "Academic Admin registered successfully", admin: newAdmin });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



const loginAcademicAdmin = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
      return res.status(400).json({ error: "User name and password are required" });
    }

    const user = await AcademicAdmin.findOne({ user_name }).populate("institution");
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: user._id, role: "academicAdmin", institution: user.institution._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Set token in httpOnly cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 2 * 60 * 60 * 1000, 
    });

    return res.status(200).json({ message: "Login successful" }); 
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { registerAdmin, login, refreshToken , registerTantAdmin, loginTantAdmin,registerAcademicAdmin,loginAcademicAdmin };
