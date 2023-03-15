import express from "express";
import { getPosts, addPost, deletePost, updatePost } from "../controllers/posts.js";
import { authMiddleware } from "../utils/middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPosts);
router.post("/", authMiddleware, addPost);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, updatePost);

export default router;
