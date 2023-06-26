
import { Comment, User } from "../models/index.js";
import { error } from '../utils/logger.js';

export const getComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: {
                postId: req.query.postId,
            },
            include: [
                {
                    model: User,
                    attributes: ["name", "avatarPic", "id"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json(comments);
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};

export const addComment = async (req, res) => {
    try {
        await Comment.create({
            content: req.body.content,
            postId: req.body.postId,
            userId: req.userId,
        });
        res.status(200).json("Comment has been created!");
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};
