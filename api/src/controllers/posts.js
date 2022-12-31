import jwt from 'jsonwebtoken';
const { Op } = require("sequelize");

import { SECRET } from '../utils/config';
import { Post,Relationship, User } from '../models';

export const getPosts = async (req, res) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in');

    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid');

        try {
            if (userId) {
                const posts = await Post.findAll({
                    where: {
                        userId
                    },
                    include: {
                        model: User,
                        attributes: ['id', 'name', 'avatarPic']
                    },
                    order:[
                        ['createdAt', 'DESC']
                    ],
                })
                return res.status(200).json(posts);
            } else {
                const relationships = await Relationship.findAll({
                    where: {
                        followerUserId: userInfo.id
                    },
                    attributes: ['followedUserId'],
                    raw: true,
                    nested: true,
                });
                const postsShouldFind = relationships.map(e => e.followedUserId)
                if (relationships.length === 0) {
                    const result = await Post.findAll({
                        where: {
                            userId: userInfo.id,
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
                        [Op.or]: [...postsShouldFind, userInfo.id],
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
        //     const q = userId
        //         ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        //         : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        // LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
        // ORDER BY p.createdAt DESC`;

        //     const values = userId ? [userId] : [userInfo.id, userInfo.id];

        //     db.query(q, values, (err, data) => {
        //         if (err) return res.status(500).json(err);
        //         return res.status(200).json(data);
        //     });
    });
};

export const addPost = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in');
    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid');

        try {
            await Post.create({
                content: req.body.content,
                img: req.body.img,
                userId: userInfo.id,
            });
            return res.status(200).json('Post created successfully');
        } catch (error) {
            return res.status(500).json(error);
        }
    });
};

export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in');
    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid');

        try {
            const post = await Post.findOne({ where: { id: req.params.id } });
            if (post) {
                await Post.destroy({
                    where: { id: req.params.id, userId: userInfo.id },
                });
                return res.status(200).json('Post was deleted successfully');
            } else {
                return res.status(404).json('Post was not found');
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    });
};

export const updatePost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in');
    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid');

        try {
            let post = await Post.findOne({
                where: { id: req.params.id },
                raw: true,
            });

            if (post) {
                await Post.update(
                    { ...req.body },
                    { where: { id: post.id, userId: userInfo.id } }
                );
                post = { ...post, ...req.body };
                return res.status(200).json(post);
            } else {
                return res.status(403).json('Post is not found');
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    });
};
