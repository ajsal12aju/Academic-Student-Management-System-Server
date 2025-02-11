const express = require("express");
const testGet = require("../controllers/testController");
const testPost = require("../controllers/testController");

const router = express.Router();

router.get("/", testGet);
router.post("/", testPost);

module.exports = router;
