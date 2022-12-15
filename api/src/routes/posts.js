import express from 'express';
import {
    getPosts,
    addPost,
    deletePost,
    updatePost,
} from '../controllers/posts.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', addPost);
router.delete('/:id', deletePost);
router.put('/:id', updatePost);

export default router;
