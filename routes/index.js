const express = require("express");
const testRoutes = require("./testRoutes");
const branchRoutes = require("./branchRoutes");
const courseRoutes = require("./courseRoutes");
const authRouter = require("./authRouter");
const studentRoutes = require("./studentRoutes");
const staffRoutes = require("./staffRoutes");
const dashBoardRoutes = require("./dashBoardRoutes");
const paymentRoutes = require("./paymentRoutes");

const router = express.Router();

router.use("/test", testRoutes);

router.use("/auth", authRouter);
router.use("/dashboard", dashBoardRoutes);
router.use("/branch", branchRoutes);

router.use("/course", courseRoutes);

router.use("/student", studentRoutes);
router.use("/staff", staffRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
