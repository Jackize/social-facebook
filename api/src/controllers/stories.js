import jwt from "jsonwebtoken";
const { Op } = require("sequelize");

import { SECRET } from "../utils/config";
import { Story, User, Relationship } from "../models";

export const getStories = async (req, res) => {
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
        return res.status(200).json(stories[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

export const addStory = async (req, res) => {
    try {
        await Story.create({
            img: req.body.img,
            userId: req.userId,
        });
        return res.status(200).json("Story created successfully!");
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const deleteStory = async (req, res) => {
    try {
        const result = await Story.destroy({
            where: { id: req.params.id, userId: req.userId },
        });
        if (result === 1) {
            return res.status(200).json("Story was deleted successfully!");
        } else {
            return res.status(403).json("You can delete only your story!");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};
