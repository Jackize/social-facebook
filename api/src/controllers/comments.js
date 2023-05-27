
import { Comment, User } from "../models/index.js";

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
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const addComment = async (req, res) => {
    try {
        await Comment.create({
            content: req.body.content,
            postId: req.body.postId,
            userId: req.userId,
        });
        return res.status(200).json("Comment has been created!");
    } catch (error) {
        return res.status(500).json(error);
    }
};
