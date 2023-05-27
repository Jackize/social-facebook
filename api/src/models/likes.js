import { Model, DataTypes, Op } from 'sequelize';

import { sequelize } from '../utils/db.js';

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
        underscored: true,
        modelName: 'likes',
    }
);

export default Like;
