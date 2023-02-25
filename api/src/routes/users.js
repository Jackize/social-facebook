import express from 'express';
import {
    getUserById,
    updateUser,
    getUsersNotFollow,
    getAllUsers,
    getUserFollowed,
} from '../controllers/users.js';
const { tokenExtractor } = require('../utils/middleware');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/find/:userId', getUserById);
router.get('/not-friend', getUsersNotFollow);
router.get('/friends', getUserFollowed);
router.put('/', updateUser);

export default router;
