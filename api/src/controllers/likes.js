import jwt from "jsonwebtoken";

import { Like } from "../models/index.js";

export const getLikes = async (req, res) => {
    try {
        const likes = await Like.findAll({
            where: {
                postId: req.query.postId,
            },
            attributes: ["userId"],
        });
        return res.status(200).json(likes.map((e) => e.userId));
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const addLike = async (req, res) => {
    try {
        await Like.create({
            postId: req.body.postId,
            userId: req.userId,
        });
        return res.status(200).json("Post has been liked!");
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const deleteLike = async (req, res) => {
    try {
        await Like.destroy({
            where: {
                userId: req.userId,
                postId: req.query.postId,
            },
        });
        return res.status(200).json("Post has been disliked");
    } catch (error) {
        return res.status(500).json(error);
    }
};
