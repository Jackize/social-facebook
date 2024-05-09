const express = require("express");
const { getUserById, updateUser, getUsersNotFollow, getAllUsers, getUserFollowed, changePassword } = require("../controllers/users");
const { authMiddleware } = require("../middlewares/middleware");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/find/:userId", getUserById);
router.get("/not-friend", authMiddleware, getUsersNotFollow);
router.get("/friends", authMiddleware, getUserFollowed);
router.put("/", authMiddleware, updateUser);
router.put("/changePass", authMiddleware, changePassword);

module.exports = router;
