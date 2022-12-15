import jwt from 'jsonwebtoken';

import { SECRET } from '../utils/config';
import { Like } from '../models';

export const getLikes = async (req, res) => {
    try {
        const likes = await Like.findAll({
            where: {
                postId: req.query.postId,
            },
            attributes: ['userId'],
        });
        return res.status(200).json(likes);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const addLike = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            await Like.create({
                postId: req.body.postId,
                userId: userInfo.id,
            });
            return res.status(200).json('Post has been liked!');
        } catch (error) {
            return res.status(500).json(error);
        }
    });
};

export const deleteLike = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            await Like.destroy({
                where: {
                    userId: userInfo.id,
                    postId: req.query.postId,
                },
            });
            return res.status(200).json('Post has been disliked');
        } catch (error) {
            return res.status(500).json(error);
        }
    });
};
