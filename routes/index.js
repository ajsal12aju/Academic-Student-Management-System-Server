const express = require("express");
const authRouter = require("./authRouter");
const adminRoutes = require("./adminRoutes");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/admin", adminRoutes);

module.exports = router;
