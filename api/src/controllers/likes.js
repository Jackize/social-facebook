const jwt = require("jsonwebtoken");
const { error } = require('../utils/logger');
const { Like } = require("../models");

const getLikes = async (req, res) => {
    try {
        const likes = await Like.findAll({
            where: {
                postId: req.query.postId,
            },
            attributes: ["userId"],
        });
        res.status(200).json(likes.map((e) => e.userId));
    } catch (err) {
        error(`getLikes postId ${req.query.postId} error`, err)
        res.status(500).json(err);
    }
};

const addLike = async (req, res) => {
    try {
        await Like.create({
            postId: req.body.postId,
            userId: req.userId,
        });
        res.status(200).json("Post has been liked!");
    } catch (err) {
        error(`addLike postId ${req.body.postId} error`, err)
        res.status(500).json(err);
    }
};

const deleteLike = async (req, res) => {
    try {
        await Like.destroy({
            where: {
                userId: req.userId,
                postId: req.query.postId,
            },
        });
        return res.status(200).json("Post has been disliked");
    } catch (err) {
        error(`deleteLike postId ${req.userId} error`, err)
        return res.status(500).json(err);
    }
};

module.exports = {
    getLikes,
    addLike,
    deleteLike,
}