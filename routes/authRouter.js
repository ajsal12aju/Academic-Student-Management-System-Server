const express = require("express");
const {
  registerAdmin,
  login,
  refreshToken,
  registerTantAdmin,
  loginTantAdmin,
  registerAcademicAdmin,
  loginAcademicAdmin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/register-tantadmin", registerTantAdmin);
router.post("/login-tantadmin", loginTantAdmin);
router.post("/register-academic-admin", registerAcademicAdmin);
router.post("/login-academic-admin", loginAcademicAdmin);

module.exports = router;
