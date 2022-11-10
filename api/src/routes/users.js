import express from 'express';
import {
    getUser,
    updateUser,
    getUsersNotFollow,
} from '../controllers/users.js';

const router = express.Router();

router.get('/find/:userId', getUser);
router.get('/', getUsersNotFollow);
router.put('/', updateUser);

export default router;
