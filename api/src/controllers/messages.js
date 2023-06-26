import { Message, User } from "../models/index.js";
import { OPENAI_API_KEY } from "../utils/config.js";
import { Configuration, OpenAIApi } from "openai";
import { error } from '../utils/logger.js';
import { v4 as uuidv4 } from "uuid";

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
export const createMessage = async (req, res) => {
    try {
        const message = await Message.create({
            conversation_id: req.body.conversation_id,
            sender_id: req.userId,
            content: req.body.content,
        });
        res.status(200).json(message);
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};

export const getMessageByConversationId = async (req, res) => {
    try {
        let messages = await Message.findAll({
            where: {
                conversation_id: req.params.conversation_id,
            },
            order: [["createdAt", "DESC"]],
            limit: 10,
        });
        messages = messages.reverse();
        res.status(200).json(messages);
    } catch (err) {
        error(err)
        res.status(500).json(err);
    }
};

export const sendMessageGPT = async (req, res) => {
    try {
        const content = req.body.content;
        const openai = new OpenAIApi(configuration);
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content,
                },
            ],
        });
        const botMsg = response.data.choices[0].message.content;
        res.status(200).send({ bot: botMsg, id: uuidv4() });
    } catch (err) {
        if (err.response) {
            error(err.response.status, err.response.data);
            res.status(err.response.status).json(err.response.data);
        } else {
            error(`Error with OpenAI API request: ${err.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                },
            });
        }
    }
};
