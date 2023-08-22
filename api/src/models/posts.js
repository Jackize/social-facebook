const { Model, DataTypes, Op } = require('sequelize');

const { sequelize } = require('../utils/db');

class Post extends Model {}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.STRING,
        },
        img: {
            type: DataTypes.STRING,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: { model: 'users', key: 'id' },
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
        modelName: 'posts',
    }
);

module.exports = Post;
