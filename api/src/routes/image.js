import express from "express";
import { authMiddleware } from "../utils/middleware.js";
import { createImage } from "../controllers/image.js";

const router = express.Router();

router.post("/createImage", authMiddleware, createImage);

export default router;
