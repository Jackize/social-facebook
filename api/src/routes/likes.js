import express from "express";
import { getLikes, addLike, deleteLike } from "../controllers/likes.js";
import { authMiddleware } from "../utils/middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getLikes);
router.post("/", authMiddleware, addLike);
router.delete("/", authMiddleware, deleteLike);

export default router;
