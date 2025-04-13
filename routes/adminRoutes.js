const express = require("express");
const { authenticate, verifyRole } = require("../middlewares/verifyToken");
const { createBranchWithAdmin } = require("../controllers/adminController");

const router = express.Router();

router.post("/create-branch", authenticate, verifyRole("tantAdmin"), createBranchWithAdmin);

module.exports = router;
