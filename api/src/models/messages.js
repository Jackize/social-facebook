const { Model, DataTypes, Op } = require('sequelize');

const { sequelize } = require('../utils/db');

class Message extends Model {}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        conversation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'conversations', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        content: {
          type: DataTypes.TEXT,  
          allowNull: false,
        },
        timestamp: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    },
    {
        sequelize,
        underscored: false,
        modelName: 'messages',
    }
);

module.exports = Message;
