import express from "express";
import authRouter from "./auth.js";
import userRouter from "./users.js";
import postRouter from "./posts.js";
import likeRouter from "./likes.js";
import storyRouter from "./stories.js";
import relationshipRouter from "./relationships.js";
import commentRouter from "./comments.js";
import ConversationRouter from "./conversations.js";
import MessageRouter from "./messages.js";
import ImageRouter from "./image.js";

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

export default router;
