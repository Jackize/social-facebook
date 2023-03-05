import express from 'express';
import { createMessage, getMessageByConversationId } from '../controllers/messages';
import { authMiddleware } from '../utils/middleware';

const router = express.Router();

router.post('/', authMiddleware ,createMessage);
router.get('/:conversation_id', authMiddleware, getMessageByConversationId);

export default router;
