const express = require("express");
const authRouter = require("./auth");
const userRouter = require("./users");
const postRouter = require("./posts");
const likeRouter = require("./likes");
const storyRouter = require("./stories");
const relationshipRouter = require("./relationships");
const commentRouter = require("./comments");
const ConversationRouter = require("./conversations");
const MessageRouter = require("./messages");
const ImageRouter = require("./image");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);
router.use("/likes", likeRouter);
router.use("/stories", storyRouter);
router.use("/relationships", relationshipRouter);
router.use("/conversations", ConversationRouter);
router.use("/messages", MessageRouter);
router.use("/images", ImageRouter);

module.exports = router;
