import jwt from 'jsonwebtoken';

import { SECRET } from '../utils/config';
import { Comment, User } from '../models';

export const getComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: {
                postId: req.query.postId,
            },
            include: [
                {
                    model: User,
                    attributes: ['name', 'avatarPic', 'id'],
                },
            ],
            order:[
                ['createdAt', 'DESC']
            ],
        });
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const addComment = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            await Comment.create({
                content: req.body.content,
                postId: req.body.postId,
                userId: userInfo.id,
            });
            return res.status(200).json('Comment has been created!');
        } catch (error) {
            return res.status(500).json(error);
        }
    });
};
