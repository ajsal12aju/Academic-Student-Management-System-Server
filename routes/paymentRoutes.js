const express = require("express");
const verifyTokenAndGetBranch = require("../middlewares/verifyTokenAndGetBranch");
const { createPayment, getPayments } = require("../controllers/StudentPaymentController");

const router = express.Router();
router.post("/", verifyTokenAndGetBranch, createPayment);
router.get("/", verifyTokenAndGetBranch, getPayments);
// router.get("/all", verifyTokenAndGetBranch, getAllPayments);

module.exports = router;
