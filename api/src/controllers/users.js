import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

import { SECRET } from '../utils/config';
import { User, Relationship } from '../models';

export const getAllUsers = async (req, res) => {
    try {
	const where = {};
	
	    if (req.query.username) {
	        where.username = {
	            [Op.substring]: req.query.username,
	        };
	    }
	    const users = await User.findAll({
	        attributes: { exclude: ['password'] },
	        where,
	    });
	    res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
};

export const getUserById = async (req, res) => {
    try {
	    const { userId } = req.params;
	    const user = await User.findOne({
	        where: { id: userId },
	        attributes: { exclude: ['password'] },
	    });
	    if (user) {
	        return res.status(200).json(user);
	    } else {
	        return res.status(404).json('User not found');
	    }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

export const getUsersNotFollow = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in');

    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid');

        try {
	        const followedUser = await Relationship.findAll({
	            where: {
	                followerUserId: userInfo.id
	            },
	            attributes: ['followedUserId']
	        })
	        const userIdShouldNotFind = followedUser.map(e=>e.followedUserId).concat(userInfo.id);
            //Lấy ra những người mà mình chưa follow 
            const users = await User.findAll({
                where:{
                        id: {
                        [Op.notIn]: userIdShouldNotFind
                        }
                },
                attributes: ['id', 'name', 'avatarPic']
            })   
            return res.status(200).json(users)
        } catch (error) {
            console.log(error); 
            return res.status(500).json(error);
        }
    });
};

export const updateUser = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not authenticated!');
    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
	        if (req.body.username) {
	            return res.status(403).json('Username is not changed!');
	        } else {
	            const { password } = req.body;
	            let user = await User.findByPk(userInfo.id, {
	                raw: true,
	            });
	            const saltRounds = 10;
	            let passwordHash;
	            if (password) {
	                //hash new password
	                passwordHash = await bcrypt.hash(password, saltRounds);
	            }
	            delete req.body.password;
				if (req.body.name.trim().length === 0) delete req.body.name;
	            await User.update(
	                { ...req.body, password: passwordHash },
	                { where: { id: userInfo.id } }
	            );
	            user = { ...user, ...req.body, passwordHash };
	            return res.status(200).json(user);
	        }
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    });
};

export const getUserFollowed = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, SECRET, async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');
        try {
            const idUserFollowed = await Relationship.findAll({
                where: {
                    followerUserId: userInfo.id,
                },
                attributes: ['followedUserId'],
            });
			const userIdShouldFind = idUserFollowed.map(e=>e.followedUserId);
            //Lấy ra những người mà mình followed
            const infoUsers = await User.findAll({
                where:{
                        id: {
                        	[Op.in]: userIdShouldFind
                        }
                },
                attributes: ['id', 'name', 'avatarPic']
            })
            return res.status(200).json(infoUsers);
        } catch (error) {
            return res.status(500).json(error);
        }
    })
};