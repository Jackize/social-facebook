import jwt from 'jsonwebtoken';
const { Op } = require("sequelize");

import { SECRET } from '../utils/config';
import { Story, User,Relationship } from '../models';

export const getStories = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            const relationships = await Relationship.findAll({
                where: {
                    followerUserId: userInfo.id
                },
                raw: true,
                nested: true
            })
            const stories = await Promise.all(relationships.map(async e => {
                        const result = await Story.findAll({
                            where:{
                                [Op.or]: [{userId: e.followedUserId}, {userId: userInfo.id}]
                            },
                            include: {
                                model: User,
                                attributes: ['name']
                            },
                            order:[
                                ['createdAt', 'DESC']
                            ],
                            raw: true,
                            nest: true
                        })
                        return result
            }))
            return res.status(200).json(stories[0])
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    });
};

export const addStory = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            await Story.create({
                img: req.body.img,
                userId: userInfo.id,
            });
            return res.status(200).json('Story created successfully!');
        } catch (error) {
            return res.status(500).json(error);
        }
    });
};

export const deleteStory = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            const result = await Story.destroy({
                where: { id: req.params.id, userId: userInfo.id },
            });
            if (result===1) {
                return res.status(200).json('Story was deleted successfully!');
            } else {
                return res.status(403).json('You can delete only your story!');
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    });
};
