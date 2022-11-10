import express from 'express';
import { getLikes, addLike, deleteLike } from '../controllers/likes.js';

const router = express.Router();

router.get('/', getLikes);
router.post('/', addLike);
router.delete('/', deleteLike);

export default router;
