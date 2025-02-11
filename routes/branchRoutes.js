const express = require("express");
const { getAllBranches, getBranchById, createBranch, editBranch } = require("../controllers/branchController");

const router = express.Router();

router.get("/", getAllBranches);  
router.get("/:id", getBranchById);  
router.post("/", createBranch);   
router.patch("/", editBranch);  

module.exports = router;
