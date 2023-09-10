
const { Comment, User } = require("../models");
const { error } = require('../utils/logger');

const getComments = async (req, res) => {
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

const addComment = async (req, res) => {
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

module.exports = {
    getComments,
    addComment
}