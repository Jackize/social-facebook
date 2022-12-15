import jwt from 'jsonwebtoken';

import { SECRET } from '../utils/config';
import { Relationship } from '../models';

export const getRelationships = async (req, res) => {
    try {
        const relationships = await Relationship.findAll({
            where: {
                followedUserId: req.query.followedUserId,
            },
            attributes: ['followerUserId'],
        });
        return res.status(200).json(relationships);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const addRelationship = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            await Relationship.create({
                followerUserId: userInfo.id,
                followedUserId: req.body.userId,
            });
            return res.status(200).json('Following');
        } catch (error) {
            return res.status(500).json(error);
        }
    });
};

export const deleteRelationship = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            await Relationship.destroy({
                where: {
                    followerUserId: userInfo.id,
                    followedUserId: req.query.userId,
                },
            });
            return res.status(200).json('Unfollow!');
        } catch (error) {
            return res.status(500).json(error);
        }
    });
};
