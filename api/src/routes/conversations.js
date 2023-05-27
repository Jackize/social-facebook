import express from "express";
import { createConversation, getConversationByCookie, getConversationByUserId } from "../controllers/conversations.js";
import { authMiddleware } from "../utils/middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createConversation);
router.get("/", authMiddleware, getConversationByCookie);
router.get("/:conversationId", authMiddleware, getConversationByUserId);

export default router;
