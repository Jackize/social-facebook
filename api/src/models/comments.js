const { Model, DataTypes, Op } = require('sequelize');

const { sequelize } = require('../utils/db');

class Comment extends Model { }

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
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
        modelName: 'comments',
    }
);

module.exports = Comment;
