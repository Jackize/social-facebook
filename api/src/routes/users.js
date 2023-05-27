import express from "express";
import { getUserById, updateUser, getUsersNotFollow, getAllUsers, getUserFollowed, changePassword } from "../controllers/users.js";
import { authMiddleware } from "../utils/middleware.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/find/:userId", getUserById);
router.get("/not-friend", authMiddleware, getUsersNotFollow);
router.get("/friends", authMiddleware, getUserFollowed);
router.put("/", authMiddleware, updateUser);
router.put("/changePass", authMiddleware, changePassword);

export default router;
