
import { Relationship } from "../models/index.js";

export const getRelationships = async (req, res) => {
    try {
        const relationships = await Relationship.findAll({
            where: {
                followedUserId: req.query.followedUserId,
            },
            attributes: ["followerUserId"],
        });
        return res.status(200).json(relationships);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const addRelationship = async (req, res) => {
    try {
        await Relationship.create({
            followerUserId: req.userId,
            followedUserId: req.body.userId,
        });
        return res.status(200).json("Following");
    } catch (error) {
        return res.status(500).json(error);
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
        return res.status(200).json("Unfollow success!");
    } catch (error) {
        return res.status(500).json(error);
    }
};
