const { Message } = require("../models");
const { error } = require('../utils/logger');

const createMessage = async (req, res) => {
    try {
        const message = await Message.create({
            conversationId: req.body.conversation_id,
            senderId: req.userId,
            content: req.body.content,
        });
        res.status(200).json(message);
    } catch (err) {
        error(`createMessage senderId ${req.userId} error`, err)
        res.status(500).json(err);
    }
};

const getMessageByConversationId = async (req, res) => {
    try {
        let messages = await Message.findAll({
            where: {
                conversationId: req.params.conversation_id,
            },
            order: [["createdAt", "DESC"]],
            limit: 10,
        });
        messages = messages.reverse();
        res.status(200).json(messages);
    } catch (err) {
        error(`getMessageByConversationId ${req.params.conversation_id} error`, err)
        res.status(500).json(err);
    }
};


module.exports = {
    createMessage,
    getMessageByConversationId,
}