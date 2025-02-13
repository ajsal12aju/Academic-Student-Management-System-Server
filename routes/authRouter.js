const express = require("express");
const { 
  registerAdmin, 
  login, 
  refreshToken, 
  registerTantAdmin, 
  loginTantAdmin 
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/register-tantadmin", registerTantAdmin);
router.post("/login-tantadmin", loginTantAdmin);

module.exports = router;
