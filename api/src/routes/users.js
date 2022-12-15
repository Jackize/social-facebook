import express from 'express';
import {
    getUserById,
    updateUser,
    getUsersNotFollow,
    getAllUsers,
} from '../controllers/users.js';
const { tokenExtractor } = require('../utils/middleware');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/find/:userId', getUserById);
router.get('/people', getUsersNotFollow);
router.put('/', updateUser);

export default router;
