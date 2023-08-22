const express = require("express");
const { getLikes, addLike, deleteLike } = require("../controllers/likes");
const { authMiddleware } = require("../utils/middleware");

const router = express.Router();

router.get("/", authMiddleware, getLikes);
router.post("/", authMiddleware, addLike);
router.delete("/", authMiddleware, deleteLike);

module.exports = router;
