const express = require("express");
const { createNewAdmin, signin } = require("../controllers/authController");

const router = express.Router();

router.post("/create", createNewAdmin);
router.post("/login", signin);

module.exports = router;
