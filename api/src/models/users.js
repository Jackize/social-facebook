const { Model, DataTypes, Op } = require('sequelize');

const { sequelize } = require('../utils/db');

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
        },
        avatarPic: {
            type: DataTypes.STRING,
        },
        coverPic: {
            type: DataTypes.STRING,
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
        modelName: 'users',
    }
);

module.exports = User;
