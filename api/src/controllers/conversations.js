const { Op } = require('sequelize');
const { error } = require('../utils/logger');

const { Conversation, User } = require("../models");
const { client } = require('../utils/redis');


const createConversation = async (req, res) => {
    try {
        const { userId } = req.body
        const [conversation, created] = await Conversation.findOrCreate({
            where: {
                [Op.or]: [
                    { user1Id: req.userId, user2Id: userId },
                    { user2Id: req.userId, user1Id: userId },
                ]
            },
            defaults: {
                user1Id: req.userId,
                user2Id: userId,
            },
        })
        // if conversation is cached, remove it
        const cachedConversation = await client.get(`conversationCookie:${req.userId}`)
        if (cachedConversation) {
            await client.del(`conversationCookie:${req.userId}`)
        }
        created ? res.status(201).json(conversation) : res.status(200).json(conversation)
    } catch (err) {
        error('createConversation error', err)
        res.status(500).json(err)
    }
}

const getConversationByCookie = async (req, res) => {
    try {
        // check if conversation is in cache
        const cachedConversation = await client.get(`conversationCookie:${req.userId}`)
        if (cachedConversation) {
            return res.status(200).json(JSON.parse(cachedConversation))
        }
        const conversation = await Conversation.findAll({
            where: {
                [Op.or]: [
                    { user1Id: req.userId },
                    { user2Id: req.userId },
                ]
            },
            include: [
                { model: User, as: 'user1', attributes: ['username', 'avatarPic'] },
                { model: User, as: 'user2', attributes: ['username', 'avatarPic'] },
            ],
        })
        if (!conversation) return res.status(404).json('Conversation not found')
        // add conversation to cache
        await client.set(`conversationCookie:${req.userId}`, JSON.stringify(conversation))
        res.status(200).json(conversation)
    } catch (err) {
        error(`getConversationByCookie userId ${req.userId} error`, err)
        res.status(500).json(err)
    }
}

const getConversationByUserId = async (req, res) => {
    const { conversationId } = req.params
    try {
        // check if conversationId is in cache
        const cachedConversationId = await client.get(`conversation:${conversationId}`)
        if(cachedConversationId) {
            return res.status(200).json(JSON.parse(cachedConversationId))
        }
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
        // add conversationId to cache
        await client.set(`conversation:${conversationId}`, JSON.stringify(conversation))
        res.status(200).json(conversation)
    } catch (err) {
        error(`getConversationByUserId userId ${conversationId} error`, err)
        res.status(500).json(err)
    }
}

module.exports = {
    createConversation,
    getConversationByCookie,
    getConversationByUserId
}