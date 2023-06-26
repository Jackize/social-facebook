import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { User, Relationship } from "../models/index.js";
import { handleDeleteImage } from "../utils/handleCloudinary.js";
import { error } from '../utils/logger.js';


export const getAllUsers = async (req, res) => {
    try {
        const where = {};

        if (req.query.username) {
            where.username = {
                [Op.substring]: req.query.username,
            };
        }
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            where,
        });
        res.status(200).json(users);
    } catch (err) {
        error(err);
        res.status(500).json(err);
    }
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({
            where: { id: userId },
            attributes: { exclude: ["password"] },
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json("User not found");
        }
    } catch (err) {
        error(err);
        res.status(500).json(err);
    }
};

export const getUsersNotFollow = async (req, res) => {
    try {
        const followedUser = await Relationship.findAll({
            where: {
                followerUserId: req.userId,
            },
            attributes: ["followedUserId"],
        });
        const userIdShouldNotFind = followedUser.map((e) => e.followedUserId).concat(req.userId);
        //Lấy ra những người mà mình chưa follow
        const users = await User.findAll({
            where: {
                id: {
                    [Op.notIn]: userIdShouldNotFind,
                },
            },
            attributes: ["id", "name", "avatarPic"],
        });
        res.status(200).json(users);
    } catch (err) {
        error(err);
        res.status(500).json(err);
    }
};

export const updateUser = async (req, res) => {
    try {
        if (req.body.username) {
            res.status(403).json("Username is not changed!");
        } else {
            const { name, avatarPic, coverPic } = req.body;
            let user = await User.findByPk(req.userId, {
                raw: true,
            });
            if (!user) {
                res.status(404).json("User not found!");
            } else {
                if (user.avatarPic && avatarPic) {
                    await handleDeleteImage(user.avatarPic);
                }
                if (user.coverPic && coverPic) {
                    await handleDeleteImage(user.coverPic);
                }
                if (name.trim().length === 0) delete req.body.name;
                if (avatarPic.trim().length === 0) delete req.body.avatarPic;
                if (coverPic.trim().length === 0) delete req.body.coverPic;
                await User.update({ ...req.body }, { where: { id: req.userId } });
                user = { ...user, ...req.body };
                res.status(200).json(user);
            }
        }
    } catch (err) {
        error(err);
        res.status(500).json(err);
    }
};

export const getUserFollowed = async (req, res) => {
    try {
        const idUserFollowed = await Relationship.findAll({
            where: {
                followerUserId: req.userId,
            },
            attributes: ["followedUserId"],
        });
        const userIdShouldFind = idUserFollowed.map((e) => e.followedUserId);
        //Lấy ra những người mà mình followed
        const infoUsers = await User.findAll({
            where: {
                id: {
                    [Op.in]: userIdShouldFind,
                },
            },
            attributes: ["id", "name", "avatarPic"],
        });
        res.status(200).json(infoUsers);
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { userId } = req;
        if (!oldPassword || !newPassword) {
            res.status(400).json("Old password and new password is required!");
        } else if (oldPassword === newPassword) {
            res.status(400).json("Old password and new password is the same!");
        } else {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(400).json("User not found!");
            }
            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json("Old password is incorrect!");
            }
            const passwordHash = bcrypt.hashSync(newPassword, 10);
            await User.update({ password: passwordHash }, { where: { id: userId } });
            res.status(200).json("Change password successfully!");
        }
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};
