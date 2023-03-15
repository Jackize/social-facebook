import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/stories.js";
import { authMiddleware } from "../utils/middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getStories);
router.post("/", authMiddleware, addStory);
router.delete("/:id", authMiddleware, deleteStory);

export default router;
