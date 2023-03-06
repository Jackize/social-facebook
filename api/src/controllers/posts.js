import jwt from 'jsonwebtoken';
const { Op } = require("sequelize");
const cloudinary = require('cloudinary').v2;

import { SECRET, CLOUD_API_KEY, CLOUD_NAME, CLOUD_API_SECRET } from '../utils/config';
import { Post,Relationship, User } from '../models';

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
});

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
                if(post.img) {
                    let imgURL = post.img
                    let arrayURL = imgURL.split('/')
                    let imgID = arrayURL[arrayURL.length - 1].split('.')[0];
                    await cloudinary.api.delete_resources([imgID], function(error, result) {
                        console.log(result);
                    });
                }
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
