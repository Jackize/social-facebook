const { Op } = require('sequelize');
const { error } = require('../utils/logger');

const { Conversation, User, Message } = require("../models");


const createConversation = async (req, res) => {
    try {
        const { userId } = req.body
        const [conversation, created] = await Conversation.findOrCreate({
            where: {
                [Op.or]: [
                    { user1_id: req.userId, user2_id: userId },
                    { user2_id: req.userId, user1_id: userId },
                ]
            },
            defaults: {
                user1_id: req.userId,
                user2_id: userId,
            },
        })
        if (created) {
            res.status(201).json(conversation)
        } else {
            res.status(200).json(conversation)
        }
    } catch (err) {
        error(err)
        res.status(500).json(err)
    }
}

const getConversationByCookie = async (req, res) => {
    try {
        const conversation = await Conversation.findAll({
            where: {
                [Op.or]: [
                    { user1_id: req.userId },
                    { user2_id: req.userId },
                ]
            },
            include: [
                { model: User, as: 'user1', attributes: ['username', 'avatarPic'] },
                { model: User, as: 'user2', attributes: ['username', 'avatarPic'] },
            ],
        })
        if (!conversation) return res.status(404).json('Conversation not found')
        res.status(200).json(conversation)
    } catch (err) {
        error(err)
        res.status(500).json(err)
    }
}

const getConversationByUserId = async (req, res) => {
    try {
        const { conversationId } = req.params
        const conversation = await Conversation.findOne({
            where: {
                id: conversationId,
            },
            include: [
                { model: User, as: 'user1', attributes: ['username', 'avatarPic'] },
                { model: User, as: 'user2', attributes: ['username', 'avatarPic'] },
            ],
        })
        if (!conversation) return res.status(404).json('Conversation not found')
        res.status(200).json(conversation)
    } catch (err) {
        error(err)
        res.status(500).json(err)
    }
}

module.exports = {
    createConversation,
    getConversationByCookie,
    getConversationByUserId
}