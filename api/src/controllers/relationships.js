
const { Relationship } = require("../models/index");
const { error } = require('../utils/logger');

const getRelationships = async (req, res) => {
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

const addRelationship = async (req, res) => {
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

const deleteRelationship = async (req, res) => {
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

module.exports = {
    getRelationships,
    addRelationship,
    deleteRelationship,
}