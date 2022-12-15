const { Model, DataTypes, Op } = require('sequelize');

const { sequelize } = require('../utils/db');

class Relationship extends Model {}

Relationship.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        followerUserId: {
            type: DataTypes.INTEGER,
        },
        followedUserId: {
            type: DataTypes.INTEGER,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        underscored: true,
        modelName: 'relationship',
    }
);

module.exports = Relationship;
