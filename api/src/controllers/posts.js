import jwt from "jsonwebtoken";
const { Op } = require("sequelize");

import { SECRET, CLOUD_API_KEY, CLOUD_NAME, CLOUD_API_SECRET } from "../utils/config";
import { Post, Relationship, User } from "../models";
import { handleDeleteImage } from "../utils/handleCloudinary";

export const getPosts = async (req, res) => {
    const userId = req.query.userId;
    try {
        if (userId) {
            const posts = await Post.findAll({
                where: {
                    userId,
                },
                include: {
                    model: User,
                    attributes: ["id", "name", "avatarPic"],
                },
                order: [["createdAt", "DESC"]],
            });
            return res.status(200).json(posts);
        } else {
            const relationships = await Relationship.findAll({
                where: {
                    followerUserId: req.userId,
                },
                attributes: ["followedUserId"],
                raw: true,
                nested: true,
            });
            const postsShouldFind = relationships.map((e) => e.followedUserId);
            if (relationships.length === 0) {
                const result = await Post.findAll({
                    where: {
                        userId: req.userId,
                    },
                    include: {
                        model: User,
                        attributes: ["id", "name", "avatarPic"],
                    },
                    order: [["createdAt", "DESC"]],
                    raw: true,
                    nest: true,
                });
                return res.status(200).json(result);
            }
            const result = await Post.findAll({
                where: {
                    userId: {
                        [Op.or]: [...postsShouldFind, req.userId],
                    },
                },
                include: {
                    model: User,
                    attributes: ["id", "name", "avatarPic"],
                },
                order: [["createdAt", "DESC"]],
                raw: true,
                nest: true,
            });
            return res.status(200).json(result);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const addPost = async (req, res) => {
    try {
        await Post.create({
            content: req.body.content,
            img: req.body.img,
            userId: req.userId,
        });
        return res.status(200).json("Post created successfully");
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });
        if (post) {
            if (post.img) {
                await handleDeleteImage(post.img);
            }
            await Post.destroy({
                where: { id: req.params.id, userId: req.userId },
            });
            return res.status(200).json("Post was deleted successfully");
        } else {
            return res.status(404).json("Post was not found");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const updatePost = async (req, res) => {
    try {
        let post = await Post.findOne({
            where: { id: req.params.id },
            raw: true,
        });

        if (post) {
            await Post.update({ ...req.body }, { where: { id: post.id, userId: req.userId } });
            post = { ...post, ...req.body };
            return res.status(200).json(post);
        } else {
            return res.status(403).json("Post is not found");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};
