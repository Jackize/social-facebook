import express from "express";
import { createConversation, getConversation, getConversationByCookie, getConversationByUserId } from "../controllers/conversations";
import { authMiddleware } from "../utils/middleware";

const router = express.Router();

router.post("/", authMiddleware, createConversation);
router.get("/", authMiddleware, getConversationByCookie);
router.get("/:conversationId", authMiddleware, getConversationByUserId);

export default router;
