const express = require("express");
// const { getAllBranches, getBranchById, createBranch, editBranch } = require("../controllers/branchController");
const { createCourse, getAllcourses, getCourseById } = require("../controllers/courseController");
const verifyTokenAndGetBranch = require("../middlewares/verifyTokenAndGetBranch");

const router = express.Router();

router.get("/",verifyTokenAndGetBranch, getAllcourses);  
router.get("/:id", getCourseById);  
router.post("/", createCourse);   
// router.patch("/", editBranch);  

module.exports = router;
