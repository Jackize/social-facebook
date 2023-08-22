const express = require("express");
const { authMiddleware } = require("../utils/middleware");
const { createImage } = require("../controllers/image");

const router = express.Router();

router.post("/createImage", authMiddleware, createImage);

module.exports = router;
