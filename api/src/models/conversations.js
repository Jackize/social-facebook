const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Conversation extends Model {}

Conversation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user1Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user1_id',
            references: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        user2Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user2_id',
            references: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
        modelName: 'conversations',
    }
);

module.exports = Conversation;
