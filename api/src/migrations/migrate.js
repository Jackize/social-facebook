const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('users', {
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
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
            googleId: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
            facebookId: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
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
        })
        await queryInterface.createTable('posts', {
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
        })
        await queryInterface.createTable('stories', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
        })
        await queryInterface.createTable('likes', {
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
        })
        await queryInterface.createTable('comments', {
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
        })
        await queryInterface.createTable('conversations', {
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
        })
        await queryInterface.createTable('messages', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            conversationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'conversations', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            senderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
        })
        await queryInterface.createTable('relationships', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            followerUserId: {
                type: DataTypes.INTEGER,
                references: { model: 'users', key: 'id' }
            },
            followedUserId: {
                type: DataTypes.INTEGER,
                references: { model: 'users', key: 'id' }
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('relationships')
        await queryInterface.dropTable('messages')
        await queryInterface.dropTable('conversations')
        await queryInterface.dropTable('comments')
        await queryInterface.dropTable('likes')
        await queryInterface.dropTable('stories')
        await queryInterface.dropTable('posts')
        await queryInterface.dropTable('users')
    },
}