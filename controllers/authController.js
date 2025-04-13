// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Admin = require("../modals/platformAdmin");
// const User = require("../modals/user");
// const Institution = require("../modals/institution");
// const AcademicAdmin = require("../modals/accadamicAdmin");


// const registerAdmin = async (req, res) => {
//   try {
//     const { name, user_name, password } = req.body;

//     if (!name || !user_name || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const existingUser = await Admin.findOne({ user_name });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const newAdmin = new Admin({ name, user_name, password: hashedPassword });
//     await newAdmin.save();

//     res.status(201).json({ message: "Admin registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err , message:"Field" });
//   }
// };
// const login = async (req, res) => {
//   try {
//     const { user_name, password } = req.body;

//     if (!user_name || !password) {
//       return res.status(400).json({ error: "User name and password are required" });
//     }

//     // Find user in one query
//     const user = await User.findOne({ user_name }).populate("institution_name");

//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Check password
//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Create token with dynamic role
//     const token = jwt.sign(
//       { user_id: user._id, role: user.role, institution: user.institution_name?._id || null },
//       process.env.JWT_SECRET,
//       { expiresIn: "2h" }
//     );

//     res.cookie("jwt", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "Strict",
//       maxAge: 2 * 60 * 60 * 1000, 
//     });

//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         user_name: user.user_name,
//         email: user.email,
//         role: user.role,
//         institution: user.institution_name
//           ? {
//               _id: user.institution_name._id,
//               name: user.institution_name.name,
//               address: user.institution_name.address,
//               contact_number: user.institution_name.contact_number,
//             }
//           : null,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt,
//       }
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const logout = async (req, res) => {
//   try {
//     res.cookie("jwt", "", {
//       httpOnly: true,
//       secure: true,
//       sameSite: "Strict",
//       expires: new Date(0), // Expire the cookie immediately
//     });

//     return res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     console.error("Logout Error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };


// // const login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     // Fix: Use email instead of user_name
// //     const user = await Admin.findOne({ email });
// //     if (!user) return res.status(401).json({ error: "Invalid credentials" });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

// //     const token = jwt.sign(
// //       { user_id: user._id, email: user.email },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "2h" }
// //     );

// //     res.cookie("jwt", token, {
// //       httpOnly: true,  
// //       secure: true,    
// //       sameSite: "Strict",
// //       maxAge: 2 * 60 * 60 * 1000, 
// //     });

// //     res.status(200).json({ message: "Login successful", token, user });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // };


// const registerTantAdmin = async (req, res) => {
//   try {
//     const { name, user_name, email, password, institution_name, address, contact_number } = req.body;

//     if (!name || !user_name || !email || !password || !institution_name || !address || !contact_number) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ user_name });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const newInstitution = new Institution({
//       name: institution_name,
//       address,
//       email,
//       contact_number,
//     });
    

//     await newInstitution.save();

//     const newTantAdmin = new User({
//       name,
//       user_name,
//       email,
//       password: hashedPassword,
//       institution_name: newInstitution._id,
//       role: "tantAdmin",
//     });
    

//     await newTantAdmin.save();

//     newInstitution.tantAdmin = newTantAdmin._id;
//     await newInstitution.save();

//     return res.status(201).json({
//       message: "User registered successfully",
//       tantAdmin: newTantAdmin,
//       institution: newInstitution,
//     });
//   } catch (error) { 
//     console.error("Registration Error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// // User Login
// const loginTantAdmin = async (req, res) => {
//   try {
//     const { user_name, password } = req.body;

//     if (!user_name || !password) {
//       return res.status(400).json({ error: "User name and password are required" });
//     }

//     const user = await User.findOne({ user_name }).populate("institution_name");
//     if (!user) return res.status(401).json({ error: "Invalid credentials" });
// console.log(user)
//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) return res.status(401).json({ error: "Invalid credentials" });

//     const token = jwt.sign(
//       { user_id: user._id, role: "tantAdmin", institution: user.institution_name._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "2h" }
//     );

//     res.cookie("jwt", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "Strict",
//       maxAge: 2 * 60 * 60 * 1000, 
//     });

//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         user_name: user.user_name,
//         email: user.email,
//         role: user.role,
//         institution: user.institution_name
//           ? {
//               _id: user.institution_name._id,
//               name: user.institution_name.name,
//               address: user.institution_name.address,
//               contact_number: user.institution_name.contact_number,
//             }
//           : null, // Handle cases where institution might not exist
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt,
//       }})
//   } catch (error) {
//     console.error("Login Error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const refreshToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//       if (err) return res.status(403).json({ error: "Invalid refresh token" });

//       const newAccessToken = jwt.sign(
//         { user_id: user.user_id }, 
//         process.env.JWT_SECRET, 
//         { expiresIn: "2h" }
//       );

//       res.status(200).json({ accessToken: newAccessToken });
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // aacasdamic admin

// const registerAcademicAdmin = async (req, res) => {
//   try {
//     const { name, user_name, email, password, institution_name, address, contact_number } = req.body;

//     if (!name || !user_name || !email || !password || !institution_name || !address || !contact_number) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const existingUser = await AcademicAdmin.findOne({ user_name });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const institution = await Institution.findOneAndUpdate(
//       { name: institution_name },
//       { name: institution_name, address, contact_number },
//       { upsert: true, new: true }
//     );

//     const newAdmin = new AcademicAdmin({
//       name,
//       user_name,
//       email,
//       password: hashedPassword,
//       institution: institution._id,
//     });

//     await newAdmin.save();

//     return res.status(201).json({ message: "Academic Admin registered successfully", admin: newAdmin });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };



// const loginAcademicAdmin = async (req, res) => {
//   try {
//     const { user_name, password } = req.body;

//     if (!user_name || !password) {
//       return res.status(400).json({ error: "User name and password are required" });
//     }

//     const user = await AcademicAdmin.findOne({ user_name }).populate("institution");
//     if (!user) return res.status(401).json({ error: "Invalid credentials" });

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) return res.status(401).json({ error: "Invalid credentials" });

//     const token = jwt.sign(
//       { user_id: user._id, role: "academicAdmin", institution: user.institution._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "2h" }
//     );

//     res.cookie("jwt", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "Strict",
//       maxAge: 2 * 60 * 60 * 1000, 
//     });

//     return res.status(200).json({ message: "Login successful" }); 
//   } catch (error) {
//     console.error("Login Error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };


// module.exports = { registerAdmin, login,logout, refreshToken , registerTantAdmin, loginTantAdmin,registerAcademicAdmin,loginAcademicAdmin };
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../modals/user");
const Institution = require("../modals/institution");

const registerUser = async (req, res) => {
  try {
    const { name, user_name, email, password, role, institution_name, address, contact_number } = req.body;

    if (!name || !user_name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    let institution = null;
    if (role !== "admin" && institution_name) {
      institution = new Institution({ name: institution_name, address, contact_number });
      await institution.save();
    }

    const newUser = new User({
      name,
      user_name,
      email,
      password: hashedPassword,
      role,
      institution_name: institution ? institution._id : null,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
      return res.status(400).json({ error: "User name and password are required" });
    }

    const user = await User.findOne({ user_name }).populate("institution_name");
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: user._id, role: user.role, institution: user.institution_name?._id || null },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
        institution: user.institution_name ? {
          _id: user.institution_name._id,
          name: user.institution_name.name,
          address: user.institution_name.address,
          contact_number: user.institution_name.contact_number,
        } : null,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful" });
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const newAccessToken = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerUser, login, logout, refreshToken };
