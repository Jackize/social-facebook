import { Op } from 'sequelize';

import {Conversation, User, Message} from "../models/index.js";


export const createConversation = async (req, res) => {
    try {
        const { userId} = req.body
        const [conversation, created] = await Conversation.findOrCreate({
            where: {
                [Op.or]: [
                    { user1_id: req.userId, user2_id: userId},
                    { user2_id: req.userId, user1_id: userId},
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
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const getConversationByCookie = async (req, res) => {
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
        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json(error)        
    }
}

export const getConversationByUserId = async (req, res) => {
    try {
        const { conversationId } = req.params
        const conversation = await Conversation.findOne({
            where: {
                id : conversationId,
            },
            include: [
                { model: User, as: 'user1', attributes: ['username', 'avatarPic'] },
                { model: User, as: 'user2', attributes: ['username', 'avatarPic'] },
            ],
        })
        if (!conversation) return res.status(404).json('Conversation not found')
        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json(error)        
    }
}