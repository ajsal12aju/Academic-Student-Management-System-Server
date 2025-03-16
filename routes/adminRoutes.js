const express = require("express");
const { verifyToken, verifyRole } = require("../middlewares/verifyToken");
const { createBranchWithAdmin } = require("../controllers/adminController");

const router = express.Router();

router.post("/create-branch", verifyToken, verifyRole("tenantAdmin"), createBranchWithAdmin);

module.exports = router;
