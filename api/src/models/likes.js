const { Model, DataTypes, Op } = require('sequelize');

const { sequelize } = require('../utils/db');

class Like extends Model {}

Like.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: { model: 'users', key: 'id' },
        },
        postId: {
            type: DataTypes.INTEGER,
            references: { model: 'posts', key: 'id' },
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
        underscored: false,
        modelName: 'likes',
    }
);

module.exports = Like;
