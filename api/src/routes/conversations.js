const express = require("express");
const { createConversation, getConversationByCookie, getConversationByUserId } = require("../controllers/conversations");
const { authMiddleware } = require("../utils/middleware");

const router = express.Router();

router.post("/", authMiddleware, createConversation);
router.get("/", authMiddleware, getConversationByCookie);
router.get("/:conversationId", authMiddleware, getConversationByUserId);

module.exports = router;
