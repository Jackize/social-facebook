import db from '../models/index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const salt = bcrypt.genSaltSync(10);

let checkUserName = (userName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.user.findOne({ where: { username: userName } });
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
            await db.user.create({
                username: req.body.username,
                email: req.body.email,
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
    let checkIsUserNameExist = await checkUserName(req.body.username);
    if (checkIsUserNameExist) {
        let user = await db.user.findOne({
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
            const token = jwt.sign({ id: user.id }, 'secretkey');
            const { password, ...others } = user;
            res.cookie('accessToken', token, { httpOnly: true })
                .status(200)
                .json(others);
        }
    } else {
        return res.status(404).json('User not found');
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
