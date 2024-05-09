const express = require("express");
const { getComments, addComment } = require("../controllers/comments");
const { authMiddleware } = require("../middlewares/middleware");

const router = express.Router();

router.get("/", getComments);
router.post("/", authMiddleware, addComment);

module.exports = router;
