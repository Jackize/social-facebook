import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import { SECRET } from '../utils/config';

const salt = bcrypt.genSaltSync(10);

let checkUserName = (userName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({ where: { username: userName } });
            user ? resolve(true) : resolve(false);
        } catch (error) {
            reject(error);
        }
    });
};
export const register = async (req, res) => {
    let checkIsUserNameExist = await checkUserName(req.body.username);
    if (checkIsUserNameExist) {
        res.status(409).json('User already exists');
    } else {
        try {
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);
            await User.create({
                username: req.body.username,
                password: hashedPassword,
                name: req.body.name,
            });
            res.status(200).json('User created');
        } catch (err) {
            res.status(500).json(err);
        }
    }
};

export const login = async (req, res) => {
    try {
        let user = await User.findOne({
            where: { username: req.body.username },
            raw: true,
        });
        if (user) {
            let checkPassword = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!checkPassword)
                return res.status(400).json('Wrong username or password');

            const token = jwt.sign({ id: user.id }, SECRET);
            const { password, ...other } = user;
            return res
                // .cookie('accessToken', token, { httpOnly: true, secure: true })
                .status(200)
                .json({...other, token});
        } else {
            return res.status(404).json('User not found');
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

export const logout = (req, res) => {
    res.clearCookie('accessToken', {
        secure: true,
        sameSite: 'none',
    })
        .status(200)
        .json('User has been logged out.');
};
