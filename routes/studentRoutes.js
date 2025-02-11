const express = require("express");
const {
  createStudent,
  getAllStudents,
  getAdmissionNumber,
  getStudentById,
} = require("../controllers/studentController");
const verifyTokenAndGetBranch = require("../middlewares/verifyTokenAndGetBranch");
const upload = require("../configs/multer");

const router = express.Router();
router.post("/admissionNo", verifyTokenAndGetBranch, getAdmissionNumber);
router.post(
  "/new",
  verifyTokenAndGetBranch,
  upload.single("photo"),
  createStudent
);
router.get("/all", verifyTokenAndGetBranch, getAllStudents);
router.get("/:id",  getStudentById); 

module.exports = router;
