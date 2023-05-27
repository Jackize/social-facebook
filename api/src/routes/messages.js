import express from "express";
import { createMessage, getMessageByConversationId, sendMessageGPT } from "../controllers/messages.js";
import { authMiddleware } from "../utils/middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createMessage);
router.get("/:conversation_id", authMiddleware, getMessageByConversationId);
router.post("/gpt", sendMessageGPT);

export default router;
