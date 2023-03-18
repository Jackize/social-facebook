import express from "express";
import { createMessage, getMessageByConversationId, sendMessageGPT } from "../controllers/messages";
import { authMiddleware } from "../utils/middleware";

const router = express.Router();

router.post("/", authMiddleware, createMessage);
router.get("/:conversation_id", authMiddleware, getMessageByConversationId);
router.post("/gpt", sendMessageGPT);

export default router;
