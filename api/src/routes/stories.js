const express = require("express");
const { getStories, addStory, deleteStory } = require("../controllers/stories");
const { authMiddleware } = require("../utils/middleware");

const router = express.Router();

router.get("/", authMiddleware, getStories);
router.post("/", authMiddleware, addStory);
router.delete("/:id", authMiddleware, deleteStory);

module.exports = router;
