'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },
            googleId: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },
            facebookId: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },
            password: {
                type: Sequelize.STRING,
            },
            avatarPic: {
                type: Sequelize.STRING,
            },
            coverPic: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
        await queryInterface.createTable('posts', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            content: {
                type: Sequelize.STRING,
            },
            img: {
                type: Sequelize.STRING,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
        await queryInterface.createTable('stories', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            img: {
                type: Sequelize.STRING,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
        await queryInterface.createTable('likes', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' },
            },
            postId: {
                type: Sequelize.INTEGER,
                references: { model: 'posts', key: 'id' },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
        await queryInterface.createTable('comments', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            content: {
                type: Sequelize.TEXT,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' },
            },
            postId: {
                type: Sequelize.INTEGER,
                references: { model: 'posts', key: 'id' },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
        await queryInterface.createTable('conversations', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user1Id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            user2Id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
        await queryInterface.createTable('messages', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            conversationId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'conversations', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            senderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
        })
        await queryInterface.createTable('relationships', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            followerUserId: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' }
            },
            followedUserId: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    down: async (queryInterface) => {
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