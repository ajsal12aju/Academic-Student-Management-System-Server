const express = require("express");
const { getDashBoardCounts } = require("../controllers/dashBoardController");
const verifyTokenAndGetBranch = require("../middlewares/verifyTokenAndGetBranch");

const router = express.Router();

router.get("/counts", verifyTokenAndGetBranch, getDashBoardCounts);

module.exports = router;
