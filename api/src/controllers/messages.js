import { Message, User } from "../models"

export const createMessage = async (req, res) => {
    try {
        const message =await Message.create({
            conversation_id: req.body.conversation_id,
            sender_id: req.userId,
            content: req.body.content,
        })
        res.status(200).json(message)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getMessageByConversationId = async (req, res) => {
    try {
        let messages = await Message.findAll({
            where: {
                conversation_id: req.params.conversation_id,
            },
            order: [
                ["createdAt", "DESC"],
            ],
            limit: 10,
        })
        messages = messages.reverse()
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json(error)
    }
}