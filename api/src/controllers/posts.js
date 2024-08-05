const { Op } = require('sequelize');
const { error } = require('../utils/logger');
const { Post, Relationship, User } = require("../models");
const { handleDeleteImage } = require("../utils/handleCloudinary");

/**
 * Get posts based on the provided userId or the userId of the authenticated user.
 * If userId is provided, it returns the posts of the specified user.
 * If userId is not provided, it returns the posts of the users that the authenticated user follows, as well as their own posts.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object containing the posts.
 */
const getPosts = async (req, res) => {
    const userId = req.query.userId;
    try {
        // get post in profile page
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
            // get posts of user we followed
            const relationships = await Relationship.findAll({
                where: {
                    followerUserId: req.userId,
                },
                attributes: ["followedUserId"],
                raw: true,
                nested: true,
            });
            const postsShouldFind = relationships.map((e) => e.followedUserId);
            // get All post when user don't have relationship
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
    } catch (err) {
        error(`getPosts userId ${userId || req.userId} error`, err)
        return res.status(500).json(err);
    }
};

/**
 * Add a new post.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.content - The content of the post.
 * @param {string} req.body.img - The image URL of the post.
 * @param {string} req.userId - The ID of the user creating the post.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the post is added.
 */
const addPost = async (req, res) => {
    try {
        const newPost = await Post.create({
            content: req.body.content,
            img: req.body.img,
            userId: req.userId,
        });
        res.status(200).json(newPost);
    } catch (err) {
        error(`addPost ${req.userId} error`, err)
        res.status(500).json(err);
    }
};

/**
 * Deletes a post.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
const deletePost = async (req, res) => {
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
            res.status(404).json("Post is not found");
        }
    } catch (err) {
        error(`deletePost ${req.params.id} error`, err)
        res.status(500).json(err);
    }
};

/**
 * Updates a post by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the post is updated.
 */
const updatePost = async (req, res) => {
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
            res.status(404).json("Post is not found");
        }
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};

module.exports = {
    getPosts,
    addPost,
    deletePost,
    updatePost,
}