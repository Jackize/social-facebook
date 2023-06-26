import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/index.js';
import { SECRET } from '../utils/config.js';
import { error } from '../utils/logger.js';

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
    const { username, password, name } = req.body;

    //Validate field
    if (!username || !password || !name) {
        return res.status(400).json({ error: 'Username, password, and name are required' });
    }

    let checkIsUserNameExist = await checkUserName(username);
    if (checkIsUserNameExist) {
        res.status(409).json('User already exists');
    } else {
        try {
            const hashedPassword = bcrypt.hashSync(password, salt);
            await User.create({
                username,
                password: hashedPassword,
                name
            });
            res.status(200).json('User created');
        } catch (err) {
            error(err)
            res.status(500).json(err);
        }
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    //Validate field
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    try {
        let user = await User.findOne({
            where: { username },
            raw: true,
        });
        if (user) {
            let checkPassword = bcrypt.compareSync(req.body.password, user.password);
            if (!checkPassword) return res.status(400).json("Wrong username or password");
            const token = jwt.sign({ id: user.id }, SECRET, {
                expiresIn: "1h",
            });
            const { password, ...other } = user;
            return res
                .cookie("access_token", token, { httpOnly: true, secure: true })
                .status(200)
                .json({ ...other });
        } else {
            return res.status(404).json('User not found');
        }
    } catch (err) {
        error(err)
        res.status(500).json(err);
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
