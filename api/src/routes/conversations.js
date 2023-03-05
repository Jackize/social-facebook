import express from 'express';
import { createConversation, getConversation, getConversationByUserId } from '../controllers/conversations';
import { authMiddleware } from '../utils/middleware';

const router = express.Router();

router.post('/', authMiddleware ,createConversation);
// router.get('/:conversationId', authMiddleware, getConversation);
router.get('/', authMiddleware, getConversationByUserId);

export default router;
