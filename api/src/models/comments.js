import { Model, DataTypes, Op } from 'sequelize';

import { sequelize } from '../utils/db.js';

class Comment extends Model {}

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
        underscored: true,
        modelName: 'comments',
    }
);

export default Comment;
