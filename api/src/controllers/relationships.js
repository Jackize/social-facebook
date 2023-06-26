
import { Relationship } from "../models/index.js";
import { error } from '../utils/logger.js';

export const getRelationships = async (req, res) => {
    try {
        const relationships = await Relationship.findAll({
            where: {
                followedUserId: req.query.followedUserId,
            },
            attributes: ["followerUserId"],
        });

        res.status(200).json(relationships);
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};

export const addRelationship = async (req, res) => {
    try {
        await Relationship.create({
            followerUserId: req.userId,
            followedUserId: req.body.userId,
        });
        res.status(200).json("Following");
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};

export const deleteRelationship = async (req, res) => {
    try {
        await Relationship.destroy({
            where: {
                followerUserId: req.userId,
                followedUserId: req.query.userId,
            },
        });
        res.status(200).json("Unfollow success!");
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};
