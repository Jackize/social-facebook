const express = require("express");
const { createMessage, getMessageByConversationId } = require("../controllers/messages");
const { authMiddleware } = require("../utils/middleware");

const router = express.Router();

router.post("/", authMiddleware, createMessage);
router.get("/:conversation_id", authMiddleware, getMessageByConversationId);

module.exports = router;
