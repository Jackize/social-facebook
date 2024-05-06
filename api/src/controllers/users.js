const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { User, Relationship } = require("../models");
const { handleDeleteImage } = require("../utils/handleCloudinary");
const { error } = require('../utils/logger');
const { client } = require("../utils/redis");


const getAllUsers = async (req, res) => {
    try {
        const where = {};
        // Get all users from redis
        const cachedUsers = await client.get("allUsers")
        if (cachedUsers) {
            const users = JSON.parse(cachedUsers);
            if (req.query) {
                const searchField = Object.keys(req.query)[0];
                const filteredUsers = users.filter(user => {
                    const userValue = user[searchField];
                    return userValue && userValue.includes(req.query[searchField]);
                });
                return res.status(200).json(filteredUsers);
            }
            return res.status(200).json(JSON.parse(cachedUsers));
        }

        // Get all users from database
        // Get all columns of the User model
        const userColumns = Object.keys(User.getAttributes());

        if (req.query) {
            for (const key in req.query) {
                // Check if query key exists in column table
                if(!userColumns.includes(key)) {
                    return res.status(400).json(`Invalid query key: ${key}`);
                } else {
                    where[key] = {
                        [Op.substring]: req.query[key],
                    };
                }
            }
        }
        
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            where,
        });
        // Cache the data in Redis
        await client.set('allUsers', JSON.stringify(users));
        res.status(200).json(users);
    } catch (err) {
        error(`getAllUsers error`, err);
        res.status(500).json(err);
    }
};

const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        // Check if user information is cached 
        const cachedUser = await client.get(`user:${userId}`)
        if (cachedUser) {
            return res.status(200).json(JSON.parse(cachedUser));
        }
        const user = await User.findOne({
            where: { id: userId },
            attributes: { exclude: ["password"] },
        });
        if (user) {
            // Cache the user information in Redis
            await client.set(`user:${userId}`, JSON.stringify(user));
            return res.status(200).json(user);
        } else {
            return res.status(404).json("User not found");
        }
    } catch (err) {
        error(`getUserById ${userId} error`, err);
        res.status(500).json(err);
    }
};

const getUsersNotFollow = async (req, res) => {
    try {
        //Lấy ra id những người mà mình đã follow
        const followedUser = await Relationship.findAll({
            where: {
                followerUserId: req.userId,
            },
            attributes: ["followedUserId"],
        });
        const userIdShouldNotFind = followedUser.map((e) => e.followedUserId).concat(req.userId);
        //Lọc id những người mà mình đã follow
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
        error(`getUsersNotFollow userId ${req.userId} error`, err);
        res.status(500).json(err);
    }
};

const updateUser = async (req, res) => {
    try {
        if (req.body.username) {
            return res.status(403).json("Username is not changed!");
        }
        const cachedUser = await client.get(`user:${req.userId}`)
        if (cachedUser) {
            await client.del(`user:${req.userId}`)
        }
        const { name, avatarPic, coverPic } = req.body;
        let user = await User.findByPk(req.userId, {
            raw: true,
            attributes: { exclude: ["password"] },
        });
        if (!user) {
            return res.status(404).json("User not found!");
        } 
        // Delete old images if new images are provided
        if (user.avatarPic && avatarPic) {
            await handleDeleteImage(user.avatarPic);
        }
        if (user.coverPic && coverPic) {
            await handleDeleteImage(user.coverPic);
        }
        // Remove empty fields
        if (name && name.trim().length === 0) delete req.body.name;
        if (avatarPic && avatarPic.trim().length === 0) delete req.body.avatarPic;
        if (coverPic && coverPic.trim().length === 0) delete req.body.coverPic;
        await User.update({ ...req.body }, { where: { id: req.userId } });
        user = { ...user, ...req.body };
        await client.set(`user:${req.userId}`, JSON.stringify(user))
        res.status(200).json(user);
    } catch (err) {
        error(`updateUser userId ${req.userId} error`, err);
        res.status(500).json(err);
    }
};

const getUserFollowed = async (req, res) => {
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
        error(`getUserFollowed userId ${req.userId} error`, err)
        res.status(500).json(err);
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { userId } = req;
        if (!oldPassword || !newPassword) {
            return res.status(400).json("Old password and new password is required!");
        } 
        if (oldPassword === newPassword) {
            return res.status(400).json("Old password and new password is the same!");
        }
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
    } catch (err) {
        error(`changePassword userId ${userId} error`, err)
        res.status(500).json(err);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getUsersNotFollow,
    updateUser,
    getUserFollowed,
    changePassword
}