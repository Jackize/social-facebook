import express from "express";
import { getComments, addComment } from "../controllers/comments.js";
import { authMiddleware } from "../utils/middleware.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", authMiddleware, addComment);

export default router;
