const express = require("express");
const testRoutes = require("./testRoutes");
const authRouter = require("./authRouter");
const adminRoutes = require("./adminRoutes");
const dashBoardRoutes = require("./dashBoardRoutes");

const router = express.Router();

router.use("/test", testRoutes);
router.use("/auth", authRouter);
router.use("/admin", adminRoutes);
router.use("/dashboard", dashBoardRoutes);

module.exports = router;
