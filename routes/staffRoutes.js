const express = require("express");
const verifyTokenAndGetBranch = require("../middlewares/verifyTokenAndGetBranch");
const { createStaff, getAllStaffs } = require("../controllers/staffController");
const upload = require("../configs/multer");

const router = express.Router();

router.post(
  "/new",
  verifyTokenAndGetBranch,
  upload.single("photo"),
  createStaff
);
router.get("/all", verifyTokenAndGetBranch, getAllStaffs);

module.exports = router;
