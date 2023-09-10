const { Op } = require('sequelize');
const { error } = require('../utils/logger');
const { Story, User, Relationship } = require("../models");

const getStories = async (req, res) => {
    try {
        const relationships = await Relationship.findAll({
            where: {
                followerUserId: req.userId,
            },
            raw: true,
            nested: true,
        });
        const stories = await Promise.all(
            relationships.map(async (e) => {
                const result = await Story.findAll({
                    where: {
                        [Op.or]: [{ userId: e.followedUserId }, { userId: req.userId }],
                    },
                    include: {
                        model: User,
                        attributes: ["name"],
                    },
                    order: [["createdAt", "DESC"]],
                    raw: true,
                    nest: true,
                });
                return result;
            })
        );
        res.status(200).json(stories[0]);
    } catch (err) {
        error(err);
        res.status(500).json(err);
    }
};

const addStory = async (req, res) => {
    try {
        await Story.create({
            img: req.body.img,
            userId: req.userId,
        });
        res.status(200).json("Story created successfully!");
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};

const deleteStory = async (req, res) => {
    try {
        const result = await Story.destroy({
            where: { id: req.params.id, userId: req.userId },
        });
        if (result === 1) {
            return res.status(200).json("Story was deleted successfully!");
        } else {
            res.status(403).json("You can delete only your story!");
        }
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};

module.exports = {
    getStories,
    addStory,
    deleteStory,
}