import { db } from '../../connect.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const getUser = async (req, res) => {
    const userId = req.params.userId;
    const q = 'SELECT * FROM users WHERE id=?';

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        const { password, ...info } = data[0];
        // console.log(info);
        return res.status(200).json(info);
    });
};

export const getUsersNotFollow = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in');

    jwt.verify(token, 'secretkey', (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid');

        const q = `SELECT u.id AS userId, name, profilePic FROM users AS u WHERE  u.id NOT IN (SELECT r.followedUserId FROM relationships AS r WHERE r.followerUserId = ?) AND u.id NOT IN (SELECT r.followerUserId FROM relationships AS r WHERE r.followerUserId = ?) AND u.id <> ?`;

        db.query(q, [userInfo.id, userInfo.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

export const updateUser = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not authenticated!');

    jwt.verify(token, 'secretkey', (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        if (req.body.password !== '') {
            const q =
                'UPDATE users SET `name`=?,`email`=?,`password`=?,`profilePic`=?,`coverPic`=? WHERE id=? ';

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            db.query(
                q,
                [
                    req.body.name,
                    req.body.email,
                    hashedPassword,
                    req.body.profilePic,
                    req.body.coverPic,
                    userInfo.id,
                ],
                (err, data) => {
                    if (err) res.status(500).json(err);
                    if (data.affectedRows > 0)
                        return res.status(200).json('Updated!');
                    return res
                        .status(403)
                        .json('You can update only your post!');
                }
            );
        } else {
            const q =
                'UPDATE users SET `name`=?,`email`=?,`profilePic`=?,`coverPic`=? WHERE id=? ';

            db.query(
                q,
                [
                    req.body.name,
                    req.body.email,
                    req.body.profilePic,
                    req.body.coverPic,
                    userInfo.id,
                ],
                (err, data) => {
                    if (err) res.status(500).json(err);
                    if (data.affectedRows > 0)
                        return res.status(200).json('Updated!');
                    return res
                        .status(403)
                        .json('You can update only your post!');
                }
            );
        }
    });
};
